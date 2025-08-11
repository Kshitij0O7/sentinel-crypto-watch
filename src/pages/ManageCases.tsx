import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Mail, ArrowLeft, Calendar, AlertTriangle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";

interface CaseData {
  id: string;
  name: string;
  caseId: string;
  description: string;
  createdDate: string;
  addresses: AddressData[];
  alertGroupId?: string;
}

interface AlertGroup {
  id: string;
  name: string;
  emails: string[];
  createdDate: string;
}

interface Alert {
  id: string;
  groupId: string;
  address: string;
  caseId: string;
  transactionHash: string;
  amount: string;
  currency: string;
  direction: "in" | "out";
  timestamp: string;
  status: "new" | "acknowledged" | "resolved";
}

interface AddressData {
  id: string;
  address: string;
  blockchain: string;
  privateLabel?: string;
  dateSeized: string;
}

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

  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAlertGroupId, setSelectedAlertGroupId] = useState<string>("");

  // Mock data for alert groups
  const [alertGroups, setAlertGroups] = useState<AlertGroup[]>([
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
  const [alerts, setAlerts] = useState<Alert[]>([
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
  const [cases, setCases] = useState<CaseData[]>([
    {
      id: "1",
      name: "Crypto Fraud Investigation Alpha",
      caseId: "CPIB-2024-001",
      description: "Investigation into suspected cryptocurrency fraud involving multiple wallets and exchanges.",
      createdDate: "2024-01-15",
      addresses: [
        {
          id: "1",
          address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
          blockchain: "Bitcoin",
          privateLabel: "Suspect Primary Wallet",
          dateSeized: "2024-01-15"
        }
      ]
    },
    {
      id: "2",
      name: "Money Laundering Case Beta",
      caseId: "CPIB-2024-002",
      description: "Complex money laundering scheme involving DeFi protocols and multiple blockchain networks.",
      createdDate: "2024-01-18",
      addresses: [
        {
          id: "2",
          address: "0x742d35Cc6634C0532925a3b8D5e7891db9F0f8c",
          blockchain: "Ethereum",
          dateSeized: "2024-01-18"
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

  const handleAddEmailToGroup = (groupId: string, email: string) => {
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

  const handleRemoveEmailFromGroup = (groupId: string, emailToRemove: string) => {
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

    const addressData: AddressData = {
      id: Date.now().toString(),
      address: newAddress.address,
      blockchain: newAddress.blockchain,
      privateLabel: newAddress.privateLabel || undefined,
      dateSeized: newAddress.dateSeized || new Date().toISOString().split('T')[0]
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

  const getAlertsForGroup = (groupId: string): Alert[] => {
    return alerts.filter(alert => alert.groupId === groupId);
  };

  const getStatusColor = (status: string) => {
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
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{case_.caseId}</Badge>
                          <Badge variant="secondary">{case_.addresses.length} addresses</Badge>
                          {case_.alertGroupId && (
                            <Badge variant="default">
                              {alertGroups.find(g => g.id === case_.alertGroupId)?.name || "Alert Group"}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold">{case_.name}</h3>
                        <p className="text-sm text-muted-foreground">{case_.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Created: {case_.createdDate}
                        </div>
                      </div>
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
                                  <p className="font-mono text-sm">{address.address}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Seized: {address.dateSeized}
                                  </p>
                                </div>
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

          {/* Manage Alert Groups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Alert Groups
              </CardTitle>
              <CardDescription>
                Manage email notification groups and view alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {alertGroups.map((group) => {
                  const groupAlerts = getAlertsForGroup(group.id);
                  return (
                    <div key={group.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{group.name}</h3>
                            <Badge variant="outline">{group.emails.length} emails</Badge>
                            <Badge variant="secondary">{groupAlerts.length} alerts</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Created: {group.createdDate}</p>
                        </div>
                      </div>

                      {/* Email Management */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Email Addresses:</h4>
                        <div className="flex flex-wrap gap-2">
                          {group.emails.map((email, index) => (
                            <div key={index} className="flex items-center gap-2 bg-accent/50 px-3 py-1 rounded-md">
                              <span className="text-sm">{email}</span>
                              {group.emails.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                  onClick={() => handleRemoveEmailFromGroup(group.id, email)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Add new email */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add new email..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement;
                                handleAddEmailToGroup(group.id, input.value);
                                input.value = '';
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                              handleAddEmailToGroup(group.id, input.value);
                              input.value = '';
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      {/* Recent Alerts */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Recent Alerts:</h4>
                        {groupAlerts.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No alerts yet</p>
                        ) : (
                          <div className="space-y-2">
                            {groupAlerts.map((alert) => (
                              <div key={alert.id} className="bg-accent/30 p-3 rounded-md">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Badge variant={getStatusColor(alert.status)}>
                                        {alert.status}
                                      </Badge>
                                      <Badge variant="outline">{alert.currency}</Badge>
                                      <Badge variant={alert.direction === 'in' ? 'default' : 'destructive'}>
                                        {alert.direction.toUpperCase()}
                                      </Badge>
                                    </div>
                                    <p className="text-sm">
                                      <span className="font-medium">Address:</span> {alert.address}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Case:</span> {alert.caseId}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Amount:</span> {alert.amount} {alert.currency}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Hash:</span> {alert.transactionHash}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageCases;
