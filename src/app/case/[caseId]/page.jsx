import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, MapPin, Wallet, DollarSign, Activity, AlertTriangle, Eye, Users } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";
import {getTotalAssets, getStats, getRecentTransactions} from "@/api/bitquery-api";
import { getCases, getCase } from "@/api/case-api";
import { updateCase } from "../../../api/case-api";

const CaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [caseData, setCaseData] = useState(null);
  const [selectedAlertGroupId, setSelectedAlertGroupId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data for alert groups
  const alertGroups = [
    {
      id: "1",
      name: "Primary Investigation Team",
      emails: ["detective.lim@cpib.gov.sg", "analyst.tan@cpib.gov.sg"],
      createdDate: "2024-01-10"
    },
    {
      id: "2", 
      name: "Senior Management",
      emails: ["director@cpib.gov.sg", "supervisor.wong@cpib.gov.sg"],
      createdDate: "2024-01-12"
    },
    {
      id: "3",
      name: "Financial Crimes Unit",
      emails: ["fcu.lead@cpib.gov.sg", "fcu.analyst@cpib.gov.sg"],
      createdDate: "2024-01-08"
    }
  ];

  const foundCase = getCase(caseId);

  useEffect(() => {
    const getInfo = async () => {
      // Find the case by caseId
      setLoading(true)
      if (!foundCase) {
        setLoading(false);
        return
      };
  
      // Update wallet info with stats
      const updatedAddresses = await Promise.all(
        foundCase.addresses.map(async (wallet) => {
          try {
            const stats = await getStats(wallet.address); // await if getStats is async
            return {
              ...wallet,
              balance: stats ? parseFloat(stats?.balance).toFixed(2) : '0',
              lastActivity: stats?.lastTransaction || '',
            };
          } catch (error) {
            console.error(`Failed to fetch balance for ${wallet.address}`, error);
            return {
              ...wallet,
              balance: '0',
              lastActivity: '',
            };
          }
        })
      );
  
      try {
        const addresses = updatedAddresses.map(wallet => wallet.address);
        const updatedValue = await getTotalAssets(JSON.stringify(addresses));
  
        const transactions = await getRecentTransactions(JSON.stringify(addresses));
        const formattedTransactions = transactions.map((tx, index) => ({
          id: (index + 1).toString(), // or use tx.Transaction.Hash if you want a unique id
          hash: tx.Transaction.Hash,
          from: tx.Transfer.Sender,
          to: tx.Transfer.Receiver,
          amount: parseFloat(tx.Transfer.Amount).toFixed(6), // adjust decimals if needed
          currency: 'ETH', // or determine dynamically if you have multiple currencies
          timestamp: tx.Block.Time,
          status: tx.Transfer.Success ? 'confirmed' : 'failed',
        }));
        const updatedCase = {
          ...foundCase,
          totalValue: parseFloat(updatedValue).toFixed(2),
          addresses: updatedAddresses,
          recentTransactions: formattedTransactions,
        };
    
        updateCase(updatedCase);
        setCaseData(updatedCase);
        if (updatedCase.alertGroupId) {
          setSelectedAlertGroupId(updatedCase.alertGroupId);
        }
      } catch (error) {
        console.error(`Failed to fetch case info:`, error);
      } finally{
        setLoading(false);
      };
      }
  
    getInfo();
  }, [caseId]);  

  const handleAssociateAlertGroup = () => {
    if (!selectedAlertGroupId) {
      toast({
        title: "Error",
        description: "Please select an alert group",
        variant: "destructive",
      });
      return;
    }

    // Update case data with new alert group
    setCaseData(prev => ({
      ...prev,
      alertGroupId: selectedAlertGroupId
    }));

    const selectedGroup = alertGroups.find(g => g.id === selectedAlertGroupId);
    
    toast({
      title: "Alert Group Associated",
      description: `Case has been associated with "${selectedGroup?.name}"`,
    });

    setIsDialogOpen(false);
  };

  const getCurrentAlertGroup = () => {
    if (!caseData?.alertGroupId) return null;
    return alertGroups.find(g => g.id === caseData.alertGroupId);
  };

  if (loading) {
    return <div className="w-full mx-auto text-center">Loading case data...</div>; // or a spinner
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <CryptoMonitoringHeader />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Case Not Found</h1>
            <p className="text-muted-foreground mt-2">The requested case could not be found.</p>
            <Button onClick={() => navigate("/cases")} className="mt-4">
              Back to Cases
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'under_review':
        return 'secondary';
      case 'closed':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getAlertStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'destructive';
      case 'acknowledged':
        return 'default';
      case 'resolved':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <CryptoMonitoringHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/cases")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Cases
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{caseData.name}</h1>
            <p className="text-muted-foreground">Case ID: {caseData.caseId}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Case Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Case Overview</span>
                <div className="flex items-center gap-2">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {getCurrentAlertGroup() ? 'Change Alert Group' : 'Associate Alert Group'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Associate Alert Group</DialogTitle>
                        <DialogDescription>
                          Select an alert group to associate with this case. Members of the selected group will receive notifications for this case.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Select value={selectedAlertGroupId} onValueChange={setSelectedAlertGroupId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an alert group" />
                          </SelectTrigger>
                          <SelectContent>
                            {alertGroups.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{group.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {group.emails.length} member{group.emails.length > 1 ? 's' : ''}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAssociateAlertGroup}>
                            Associate Group
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Badge variant={getStatusColor(caseData.status)}>
                    {caseData.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
                    <p className="text-sm">{caseData.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {caseData.createdDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Investigator: {caseData.investigator}</span>
                    </div>
                    {getCurrentAlertGroup() && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Alert Group: {getCurrentAlertGroup().name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-accent/30 p-3 rounded-lg">
                      <div className="text-2xl font-bold">{caseData.addresses.length}</div>
                      <div className="text-xs text-muted-foreground">Addresses</div>
                    </div>
                    <div className="bg-accent/30 p-3 rounded-lg">
                      <div className="text-2xl font-bold">{caseData.totalValue}</div>
                      <div className="text-xs text-muted-foreground">{caseData.currency}</div>
                    </div>
                    <div className="bg-accent/30 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{caseData.alerts.filter(a => a.status === 'new').length}</div>
                      <div className="text-xs text-muted-foreground">New Alerts</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Associated Wallets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Associated Wallets ({caseData.addresses.length})
              </CardTitle>
              <CardDescription>
                All wallet addresses associated with this case
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseData.addresses.map((address) => (
                  <div key={address.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{address.blockchain}</Badge>
                          {address.privateLabel && (
                            <Badge variant="secondary">{address.privateLabel}</Badge>
                          )}
                          <span className="text-lg font-semibold text-primary">
                            {address.balance} {address.blockchain === 'Ethereum' ? 'ETH' : 'BTC'}
                          </span>
                        </div>
                        <code className="text-sm bg-accent/50 px-2 py-1 rounded break-all">
                          {address.address}
                        </code>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Seized: {address.dateSeized}</span>
                          <span>Last Activity: {address.lastActivity}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/wallet/${address.address}`)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>
                  Latest blockchain transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {caseData.recentTransactions.map((tx) => (
                    <div key={tx.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{tx.status}</Badge>
                        <span className="text-sm font-medium">
                          {tx.amount} {tx.currency}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div>From: <code className="bg-accent/50 px-1 rounded">{tx.from.slice(0, 10)}...</code></div>
                        <div>To: <code className="bg-accent/50 px-1 rounded">{tx.to.slice(0, 10)}...</code></div>
                        <div>Hash: <code className="bg-accent/50 px-1 rounded">{tx.hash}</code></div>
                        <div>{tx.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Alerts ({caseData.alerts.length})
                </CardTitle>
                <CardDescription>
                  Monitoring alerts for this case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {caseData.alerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={getAlertStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                      {alert.amount && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Amount: {alert.amount}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;