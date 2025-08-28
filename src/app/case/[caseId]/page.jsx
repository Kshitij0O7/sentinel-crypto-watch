import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { ArrowLeft, Calendar, MapPin, Wallet, DollarSign, Activity, AlertTriangle, Eye, Users } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";
import {getTotalAssets, getWalletBalance, getWalletLastActivity, getRecentTransactions} from "@/api/bitquery-api";
import { getCases, getCase } from "@/api/case-api";
import { updateCase } from "../../../api/case-api";

const CaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [selectedAlertGroupId, setSelectedAlertGroupId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [transactionsLoaded, setTransactionsLoaded] = useState(false);
  const [totalValueLoaded, setTotalValueLoaded] = useState(false);

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
      if (!foundCase) {
        return;
      }
      
      // Set initial case data immediately with empty arrays for progressive loading
      setCaseData({
        ...foundCase,
        addresses: [],
        recentTransactions: [],
        totalValue: "0"
      });
      if (foundCase.alertGroupId) {
        setSelectedAlertGroupId(foundCase.alertGroupId);
      }

      // Load wallet addresses progressively
      setAddressesLoaded(false);
      try {
        const updatedAddresses = await Promise.all(
          foundCase.addresses.map(async (wallet) => {
            try {
              const [balanceData, lastActivity] = await Promise.all([
                getWalletBalance(wallet.address),
                getWalletLastActivity(wallet.address)
              ]);
              return {
                ...wallet,
                balance: balanceData ? parseFloat(balanceData.balance).toFixed(2) : '0',
                lastActivity: lastActivity || '',
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
        
        setCaseData(prev => ({
          ...prev,
          addresses: updatedAddresses
        }));
        setAddressesLoaded(true);
      } catch (error) {
        console.error(`Failed to fetch wallet addresses:`, error);
        setAddressesLoaded(true);
      }

      // Load total value independently
      setTotalValueLoaded(false);
      try {
        const addresses = foundCase.addresses.map(wallet => wallet.address);
        const updatedValue = await getTotalAssets(JSON.stringify(addresses));
        setCaseData(prev => ({
          ...prev,
          totalValue: parseFloat(updatedValue).toFixed(2)
        }));
        setTotalValueLoaded(true);
      } catch (error) {
        console.error(`Failed to fetch total value:`, error);
        setTotalValueLoaded(true);
      }

      // Load transactions independently
      setTransactionsLoaded(false);
      try {
        const addresses = foundCase.addresses.map(wallet => wallet.address);
        const transactions = await getRecentTransactions(JSON.stringify(addresses));
        const formattedTransactions = transactions.map((tx, index) => ({
          id: (index + 1).toString(),
          hash: tx.Transaction.Hash,
          from: tx.Transfer.Sender,
          to: tx.Transfer.Receiver,
          amount: parseFloat(tx.Transfer.Amount).toFixed(6),
          currency: 'ETH',
          timestamp: tx.Block.Time,
          status: tx.Transfer.Success ? 'confirmed' : 'failed',
        }));
        
        setCaseData(prev => ({
          ...prev,
          recentTransactions: formattedTransactions
        }));
        setTransactionsLoaded(true);
      } catch (error) {
        console.error(`Failed to fetch transactions:`, error);
        setTransactionsLoaded(true);
      }
    };

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

  if (!foundCase) {
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

  // Show skeleton loading if case data is not yet initialized
  if (!caseData) {
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
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Case Overview Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wallet Addresses Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
        return 'outline';
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
                        <Button onClick={handleAssociateAlertGroup} className="w-full">
                          Associate Alert Group
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={getStatusColor(caseData.status)}>{caseData.status}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <div className="text-2xl font-bold">
                    {!totalValueLoaded ? (
                      "Loading..."
                    ) : (
                      `${caseData.totalValue} ETH`
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Wallet Addresses</p>
                  <div className="text-2xl font-bold">
                    {!addressesLoaded ? (
                      "Loading..."
                    ) : (
                      caseData.addresses.length
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Addresses
              </CardTitle>
              <CardDescription>
                Seized crypto wallet addresses associated with this case
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!addressesLoaded ? (
                // Show loading text while loading
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading wallet addresses...</p>
                </div>
              ) : caseData.addresses.length > 0 ? (
                <div className="space-y-3">
                  {caseData.addresses.map((wallet, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-mono text-sm">{wallet.address}</p>
                          <p className="text-xs text-muted-foreground">Added: {wallet.dateAdded}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{wallet.balance} ETH</p>
                        <p className="text-xs text-muted-foreground">
                          Last activity: {wallet.lastActivity || 'No activity'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No wallet addresses found for this case.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Latest detected transactions from monitored addresses in this case
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!transactionsLoaded ? (
                // Show loading text while loading
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading transactions...</p>
                </div>
              ) : caseData.recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {caseData.recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-mono text-sm">Hash: {tx.hash}</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.timestamp} • {tx.amount} {tx.currency}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                          {tx.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {tx.from.slice(0, 6)}...{tx.from.slice(-4)} → {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found for this case.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;