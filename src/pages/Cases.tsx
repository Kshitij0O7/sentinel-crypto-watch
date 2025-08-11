import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, FolderOpen, Calendar, MapPin, ArrowLeft, Bell, Mail, X, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";

interface CaseData {
  id: string;
  name: string;
  caseId: string;
  description: string;
  createdDate: string;
  addresses: AddressData[];
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
  direction: 'in' | 'out';
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

interface AddressData {
  id: string;
  address: string;
  blockchain: string;
  privateLabel?: string;
  dateSeized?: string;
}

const Cases = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form states for new case
  const [newCase, setNewCase] = useState({
    name: "",
    caseId: "",
    description: "",
    address: "",
    blockchain: "Bitcoin"
  });

  // Form states for new alert group
  const [newAlertGroup, setNewAlertGroup] = useState({
    name: "",
    email: ""
  });

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

  const handleCreateCase = () => {
    if (!newCase.name || !newCase.caseId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const addresses = newCase.address ? [{
      id: Date.now().toString(),
      address: newCase.address,
      blockchain: newCase.blockchain,
      dateSeized: new Date().toISOString().split('T')[0]
    }] : [];

    const caseData: CaseData = {
      id: Date.now().toString(),
      name: newCase.name,
      caseId: newCase.caseId,
      description: newCase.description,
      createdDate: new Date().toISOString().split('T')[0],
      addresses
    };

    setCases([...cases, caseData]);
    setNewCase({ name: "", caseId: "", description: "", address: "", blockchain: "Bitcoin" });
    
    toast({
      title: "Case Created",
      description: `Case ${newCase.caseId} has been created successfully${newCase.address ? ' with address' : ''}`,
    });
  };

  const handleCreateAlertGroup = () => {
    if (!newAlertGroup.name || !newAlertGroup.email) {
      toast({
        title: "Error",
        description: "Please fill in group name and at least one email",
        variant: "destructive",
      });
      return;
    }

    const alertGroupData: AlertGroup = {
      id: Date.now().toString(),
      name: newAlertGroup.name,
      emails: [newAlertGroup.email],
      createdDate: new Date().toISOString().split('T')[0]
    };

    setAlertGroups([...alertGroups, alertGroupData]);
    setNewAlertGroup({ name: "", email: "" });
    
    toast({
      title: "Alert Group Created",
      description: `Alert group "${newAlertGroup.name}" has been created successfully`,
    });
  };

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
      description: "Email has been added to the alert group",
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
      description: "Email has been removed from the alert group",
    });
  };

  const getAlertsForGroup = (groupId: string) => {
    return alerts.filter(alert => alert.groupId === groupId);
  };

  const handleAddAddress = () => {
    if (!newAddress.address || !newAddress.blockchain || !selectedCaseId) {
      toast({
        title: "Error",
        description: "Please fill in required fields and select a case",
        variant: "destructive",
      });
      return;
    }

    const addressData: AddressData = {
      id: Date.now().toString(),
      address: newAddress.address,
      blockchain: newAddress.blockchain,
      privateLabel: newAddress.privateLabel || undefined,
      dateSeized: newAddress.dateSeized || undefined
    };

    setCases(cases.map(case_ => 
      case_.id === selectedCaseId 
        ? { ...case_, addresses: [...case_.addresses, addressData] }
        : case_
    ));

    setNewAddress({ address: "", blockchain: "bitcoin", privateLabel: "", dateSeized: "" });
    setShowAddressForm(false);
    setSelectedCaseId("");

    toast({
      title: "Address Added",
      description: "Address has been added to the case successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <CryptoMonitoringHeader />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Case Management</h1>
              <p className="text-muted-foreground">Manage investigation cases and associated wallet addresses</p>
            </div>
          </div>
        </div>

        {/* Create New Case */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Case
            </CardTitle>
            <CardDescription>
              Create a new investigation case to organize wallet addresses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caseName">Case Name *</Label>
                <Input
                  id="caseName"
                  placeholder="Enter case name..."
                  value={newCase.name}
                  onChange={(e) => setNewCase({ ...newCase, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caseId">Case ID *</Label>
                <Input
                  id="caseId"
                  placeholder="CPIB-2024-XXX"
                  value={newCase.caseId}
                  onChange={(e) => setNewCase({ ...newCase, caseId: e.target.value })}
                />
              </div>
            </div>
            
            {/* Address Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caseAddress">Wallet Address</Label>
                <Input
                  id="caseAddress"
                  placeholder="Enter wallet address..."
                  value={newCase.address}
                  onChange={(e) => setNewCase({ ...newCase, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caseBlockchain">Blockchain</Label>
                <select
                  id="caseBlockchain"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground z-50"
                  value={newCase.blockchain}
                  onChange={(e) => setNewCase({ ...newCase, blockchain: e.target.value })}
                >
                  {blockchainOptions.map((blockchain) => (
                    <option key={blockchain} value={blockchain}>
                      {blockchain}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Case Description - Optional */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="caseDescription">Case Description</Label>
                <span className="text-sm text-muted-foreground">(Optional)</span>
              </div>
              <Textarea
                id="caseDescription"
                placeholder="Enter detailed case description..."
                value={newCase.description}
                onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <Button onClick={handleCreateCase} className="w-full md:w-auto">
              Create Case
            </Button>
          </CardContent>
        </Card>

        {/* Create Alert Group */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Create Alert Group
            </CardTitle>
            <CardDescription>
              Create a notification group to receive alerts for wallet activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alertGroupName">Group Name *</Label>
                <Input
                  id="alertGroupName"
                  placeholder="Enter alert group name..."
                  value={newAlertGroup.name}
                  onChange={(e) => setNewAlertGroup({ ...newAlertGroup, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alertEmail">Email Address *</Label>
                <Input
                  id="alertEmail"
                  type="email"
                  placeholder="email@cpib.gov.sg"
                  value={newAlertGroup.email}
                  onChange={(e) => setNewAlertGroup({ ...newAlertGroup, email: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleCreateAlertGroup} className="w-full md:w-auto">
              Create Alert Group
            </Button>
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
                                className="h-4 w-4 p-0"
                                onClick={() => handleRemoveEmailFromGroup(group.id, email)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new email..."
                          type="email"
                          id={`new-email-${group.id}`}
                          className="max-w-xs"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.getElementById(`new-email-${group.id}`) as HTMLInputElement;
                            if (input?.value) {
                              handleAddEmailToGroup(group.id, input.value);
                              input.value = "";
                            }
                          }}
                        >
                          Add Email
                        </Button>
                      </div>
                    </div>

                    {/* Alerts for this group */}
                    {groupAlerts.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Recent Alerts:
                          </h4>
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {groupAlerts.map((alert) => (
                              <div key={alert.id} className="bg-accent/30 p-3 rounded-md space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge variant={alert.status === 'new' ? 'destructive' : 
                                                  alert.status === 'acknowledged' ? 'default' : 'secondary'}>
                                      {alert.status}
                                    </Badge>
                                    <Badge variant="outline">{alert.caseId}</Badge>
                                    <div className="flex items-center gap-1">
                                      {alert.direction === 'in' ? (
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <TrendingDown className="h-4 w-4 text-red-500" />
                                      )}
                                      <span className="text-sm font-medium">
                                        {alert.direction === 'in' ? 'Incoming' : 'Outgoing'}
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <p><span className="font-medium">Address:</span> {alert.address}</p>
                                  <p><span className="font-medium">Transaction:</span> {alert.transactionHash}</p>
                                  <p><span className="font-medium">Amount:</span> {alert.amount} {alert.currency}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Add Address to Case */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Add Address to Case
            </CardTitle>
            <CardDescription>
              Add a wallet address to an existing case
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="selectCase">Select Case *</Label>
              <select
                id="selectCase"
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground"
                value={selectedCaseId}
                onChange={(e) => {
                  setSelectedCaseId(e.target.value);
                  setShowAddressForm(!!e.target.value);
                }}
              >
                <option value="">Select a case...</option>
                {cases.map((case_) => (
                  <option key={case_.id} value={case_.id}>
                    {case_.caseId} - {case_.name}
                  </option>
                ))}
              </select>
            </div>

            {showAddressForm && (
              <>
                <Separator />
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
                    <Label htmlFor="blockchain">Blockchain *</Label>
                    <select
                      id="blockchain"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground"
                      value={newAddress.blockchain}
                      onChange={(e) => setNewAddress({ ...newAddress, blockchain: e.target.value })}
                    >
                      {blockchainOptions.map((blockchain) => (
                        <option key={blockchain} value={blockchain}>
                          {blockchain}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="privateLabel">Private Label</Label>
                    <Input
                      id="privateLabel"
                      placeholder="Optional label for this address..."
                      value={newAddress.privateLabel}
                      onChange={(e) => setNewAddress({ ...newAddress, privateLabel: e.target.value })}
                    />
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
                </div>
                <Button onClick={handleAddAddress} className="w-full md:w-auto">
                  Add Address to Case
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Existing Cases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Existing Cases
            </CardTitle>
            <CardDescription>
              View and manage all investigation cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {cases.map((case_) => (
                <div key={case_.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{case_.caseId}</Badge>
                        <Badge variant="secondary">{case_.addresses.length} addresses</Badge>
                      </div>
                      <h3 className="text-lg font-semibold">{case_.name}</h3>
                      <p className="text-sm text-muted-foreground">{case_.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Created: {case_.createdDate}
                      </div>
                    </div>
                  </div>

                  {case_.addresses.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h4 className="font-medium">Associated Addresses:</h4>
                        {case_.addresses.map((address) => (
                          <div key={address.id} className="bg-accent/50 p-3 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{address.blockchain}</Badge>
                              {address.privateLabel && (
                                <Badge variant="secondary">{address.privateLabel}</Badge>
                              )}
                            </div>
                            <p className="font-mono text-sm mb-1">{address.address}</p>
                            {address.dateSeized && (
                              <p className="text-xs text-muted-foreground">
                                Seized: {address.dateSeized}
                              </p>
                            )}
                          </div>
                        ))
                        }
                      </div>
                    </>
                  )}
                </div>
              ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cases;
