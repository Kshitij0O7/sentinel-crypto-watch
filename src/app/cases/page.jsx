import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Mail, ArrowLeft, Calendar, AlertTriangle, X, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";

const ManageCases = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form states for new address
  const [newAddress, setNewAddress] = useState({
    address: "",
    blockchain: "bitcoin",
    privateLabel: "",
    dateSeized: ""
  });

  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAlertGroupId, setSelectedAlertGroupId] = useState("");

  // Mock data for alert groups
  const [alertGroups, setAlertGroups] = useState([
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
    }
  ]);

  // Mock data for alerts
  const [alerts, setAlerts] = useState([
    {
      id: "1",
      groupId: "1",
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      caseId: "CPIB-2024-001",
      transactionHash: "abc123def456ghi789",
      amount: "0.5842",
      currency: "BTC",
      direction: "out",
      timestamp: "2024-01-20 14:23:15",
      status: "new"
    },
    {
      id: "2",
      groupId: "1",
      address: "0x742d35Cc6634C0532925a3b8D5e7891db9F0f8c",
      caseId: "CPIB-2024-002",
      transactionHash: "def456ghi789jkl012",
      amount: "15.2341",
      currency: "ETH",
      direction: "in",
      timestamp: "2024-01-19 09:15:42",
      status: "acknowledged"
    },
    {
      id: "3",
      groupId: "2",
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      caseId: "CPIB-2024-001",
      transactionHash: "ghi789jkl012mno345",
      amount: "2.1000",
      currency: "BTC",
      direction: "out",
      timestamp: "2024-01-18 16:45:30",
      status: "resolved"
    }
  ]);

  // Mock data for cases
  const [cases, setCases] = useState([
    {
      id: "1",
      name: "Crypto Fraud Investigation Alpha",
      caseId: "CPIB-2024-001",
      description: "Investigation into suspected cryptocurrency fraud involving multiple wallets and exchanges.",
      createdDate: "2024-01-15",
      dateAdded: "2024-01-15",
      addresses: [
        {
          id: "1",
          address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
          blockchain: "Bitcoin",
          privateLabel: "Suspect Primary Wallet",
          dateSeized: "2024-01-15",
          dateAdded: "2024-01-15"
        }
      ]
    },
    {
      id: "2",
      name: "Money Laundering Case Beta",
      caseId: "CPIB-2024-002",
      description: "Complex money laundering scheme involving DeFi protocols and multiple blockchain networks.",
      createdDate: "2024-01-18",
      dateAdded: "2024-01-18",
      addresses: [
        {
          id: "2",
          address: "0x742d35Cc6634C0532925a3b8D5e7891db9F0f8c",
          blockchain: "Ethereum",
          dateSeized: "2024-01-18",
          dateAdded: "2024-01-18"
        }
      ]
    }
  ]);

  const blockchainOptions = [
    "Bitcoin", "Ethereum", "Binance Smart Chain", "Polygon", "Arbitrum", 
    "Avalanche", "Solana", "Cardano", "Litecoin", "Dogecoin", "Dash",
    "Ethereum Classic", "Ethereum PoW", "ZCash", "Bitcoin Cash", "Bitcoin SV",
    "Algorand", "Binance DEX", "Celo", "Conflux", "Hedera Hashgraph",
    "EOS", "TRON", "Beacon Chain Ethereum 2.0", "Optimism", "Fantom",
    "Cronos", "NEAR Protocol", "Harmony", "Moonbeam", "Moonriver",
    "Kusama", "Polkadot", "Cosmos Hub", "Osmosis", "Terra", "THORChain",
    "Klaytn", "Zilliqa", "Waves", "Stellar"
  ];

  const handleAddEmailToGroup = (groupId, email) => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setAlertGroups(alertGroups.map(group => 
      group.id === groupId && !group.emails.includes(email)
        ? { ...group, emails: [...group.emails, email] }
        : group
    ));

    toast({
      title: "Email Added",
      description: `Email added to ${alertGroups.find(g => g.id === groupId)?.name}`,
    });
  };

  const handleRemoveEmailFromGroup = (groupId, emailToRemove) => {
    setAlertGroups(alertGroups.map(group => 
      group.id === groupId
        ? { ...group, emails: group.emails.filter(email => email !== emailToRemove) }
        : group
    ));

    toast({
      title: "Email Removed",
      description: "Email removed from alert group",
    });
  };

  const handleAddAddress = () => {
    if (!newAddress.address || !selectedCaseId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const addressData = {
      id: Date.now().toString(),
      address: newAddress.address,
      blockchain: newAddress.blockchain,
      privateLabel: newAddress.privateLabel || undefined,
      dateSeized: newAddress.dateSeized || new Date().toISOString().split('T')[0],
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setCases(cases.map(case_ => 
      case_.id === selectedCaseId
        ? { ...case_, addresses: [...case_.addresses, addressData] }
        : case_
    ));

    setNewAddress({ address: "", blockchain: "bitcoin", privateLabel: "", dateSeized: "" });
    setSelectedCaseId("");
    setShowAddressForm(false);
    
    toast({
      title: "Address Added",
      description: `Address added to case successfully`,
    });
  };

  const handleDeleteCase = (caseId) => {
    const caseToDelete = cases.find(c => c.id === caseId);
    setCases(cases.filter(c => c.id !== caseId));
    
    toast({
      title: "Case Deleted",
      description: `Case "${caseToDelete?.name}" has been deleted successfully`,
    });
  };

  const handleDeleteAddress = (caseId, addressId) => {
    setCases(cases.map(case_ => 
      case_.id === caseId
        ? { ...case_, addresses: case_.addresses.filter(addr => addr.id !== addressId) }
        : case_
    ));
    
    toast({
      title: "Address Deleted",
      description: "Address has been removed from the case",
    });
  };

  const handleDeleteAlertGroup = (groupId) => {
    const groupToDelete = alertGroups.find(g => g.id === groupId);
    setAlertGroups(alertGroups.filter(g => g.id !== groupId));
    
    // Remove alert group association from cases
    setCases(cases.map(case_ => 
      case_.alertGroupId === groupId
        ? { ...case_, alertGroupId: undefined }
        : case_
    ));
    
    toast({
      title: "Alert Group Deleted",
      description: `Alert group "${groupToDelete?.name}" has been deleted successfully`,
    });
  };

  const getAlertsForGroup = (groupId) => {
    return alerts.filter(alert => alert.groupId === groupId);
  };

  const getStatusColor = (status) => {
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
          <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Manage Cases</h1>
            <p className="text-muted-foreground">Manage investigation cases, alert groups, and addresses</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Add Address to Case */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Address to Case
              </CardTitle>
              <CardDescription>
                Add a new wallet address to an existing case for monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showAddressForm ? (
                <Button onClick={() => setShowAddressForm(true)} className="w-full md:w-auto">
                  Add New Address
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="selectCase">Select Case *</Label>
                      <select
                        id="selectCase"
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground z-50"
                        value={selectedCaseId}
                        onChange={(e) => setSelectedCaseId(e.target.value)}
                      >
                        <option value="">Select a case...</option>
                        {cases.map((case_) => (
                          <option key={case_.id} value={case_.id}>
                            {case_.caseId} - {case_.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressBlockchain">Blockchain *</Label>
                      <select
                        id="addressBlockchain"
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground z-50"
                        value={newAddress.blockchain}
                        onChange={(e) => setNewAddress({ ...newAddress, blockchain: e.target.value })}
                      >
                        {blockchainOptions.map((blockchain) => (
                          <option key={blockchain.toLowerCase()} value={blockchain.toLowerCase()}>
                            {blockchain}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="walletAddress">Wallet Address *</Label>
                      <Input
                        id="walletAddress"
                        placeholder="Enter wallet address..."
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="privateLabel">Private Label</Label>
                      <Input
                        id="privateLabel"
                        placeholder="Enter private label (optional)..."
                        value={newAddress.privateLabel}
                        onChange={(e) => setNewAddress({ ...newAddress, privateLabel: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateSeized">Date of Seize</Label>
                    <Input
                      id="dateSeized"
                      type="date"
                      value={newAddress.dateSeized}
                      onChange={(e) => setNewAddress({ ...newAddress, dateSeized: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddAddress}>Add Address</Button>
                    <Button variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Existing Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Existing Cases
              </CardTitle>
              <CardDescription>
                View and manage all investigation cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cases.map((case_) => (
                  <div key={case_.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 cursor-pointer" onClick={() => navigate(`/case/${case_.caseId}`)}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{case_.caseId}</Badge>
                          <Badge variant="secondary">{case_.addresses.length} addresses</Badge>
                          {case_.alertGroupId && (
                            <Badge variant="default">
                              {alertGroups.find(g => g.id === case_.alertGroupId)?.name || "Alert Group"}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold hover:text-primary transition-colors">{case_.name}</h3>
                        <p className="text-sm text-muted-foreground">{case_.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Created: {case_.createdDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Added to System: {case_.dateAdded}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/case/${case_.caseId}`)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="danger" size="sm" className="flex items-center gap-2">
                              <Trash2 className="h-4 w-4" />
                              Delete Case
                            </Button>
                          </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Case</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{case_.name}"? This action cannot be undone and will remove all associated addresses.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                           <AlertDialogFooter>
                             <AlertDialogCancel>Cancel</AlertDialogCancel>
                             <AlertDialogAction onClick={() => handleDeleteCase(case_.id)} className="bg-danger text-danger-foreground hover:bg-danger-hover">
                               Delete
                             </AlertDialogAction>
                           </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {/* Addresses */}
                    {case_.addresses.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Addresses:</h4>
                        <div className="space-y-2">
                          {case_.addresses.map((address) => (
                            <div key={address.id} className="bg-accent/30 p-3 rounded-md">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{address.blockchain}</Badge>
                                    {address.privateLabel && (
                                      <Badge variant="secondary">{address.privateLabel}</Badge>
                                    )}
                                  </div>
                                  <code className="text-xs bg-background/50 px-2 py-1 rounded break-all">
                                    {address.address}
                                  </code>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span>Seized: {address.dateSeized}</span>
                                    <span>Added: {address.dateAdded}</span>
                                  </div>
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Address</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to remove this address from the case? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteAddress(case_.id, address.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alert Groups Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Alert Groups
              </CardTitle>
              <CardDescription>
                Manage notification groups and view alert history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {alertGroups.map((group) => (
                  <div key={group.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{group.name}</h3>
                          <Badge variant="outline">{group.emails.length} emails</Badge>
                          <Badge variant="secondary">{getAlertsForGroup(group.id).length} alerts</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Created: {group.createdDate}
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Alert Group</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{group.name}"? This action cannot be undone and will remove all associated alerts.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAlertGroup(group.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {/* Email List */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Email Recipients:</h4>
                      <div className="flex flex-wrap gap-2">
                        {group.emails.map((email, emailIndex) => (
                          <div key={emailIndex} className="flex items-center gap-1 bg-accent/30 px-2 py-1 rounded">
                            <span className="text-xs">{email}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveEmailFromGroup(group.id, email)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add Email Form */}
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="email"
                          placeholder="Add email address..."
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const target = e.target;
                              handleAddEmailToGroup(group.id, target.value);
                              target.value = '';
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling;
                            handleAddEmailToGroup(group.id, input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Recent Alerts */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Recent Alerts:</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {getAlertsForGroup(group.id).map((alert) => (
                          <div key={alert.id} className="bg-background/50 p-2 rounded text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant={getStatusColor(alert.status)} className="text-xs">
                                  {alert.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">{alert.currency}</Badge>
                                <span className="font-medium">{alert.amount} {alert.currency}</span>
                              </div>
                              <span className="text-muted-foreground">{alert.timestamp}</span>
                            </div>
                            <div className="text-muted-foreground">
                              <div>Case: {alert.caseId}</div>
                              <div>Address: {alert.address.slice(0, 10)}...{alert.address.slice(-6)}</div>
                              <div>Direction: {alert.direction}</div>
                            </div>
                          </div>
                        ))}
                        {getAlertsForGroup(group.id).length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-2">No alerts yet</p>
                        )}
                      </div>
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
};

export default ManageCases;
