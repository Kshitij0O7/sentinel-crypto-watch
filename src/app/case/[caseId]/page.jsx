import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Wallet, DollarSign, Activity, AlertTriangle, Eye } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";

const CaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);

  // Mock data - in a real app, this would come from an API
  const mockCases = [
    {
      id: "1",
      name: "Crypto Fraud Investigation Alpha",
      caseId: "CPIB-2024-001",
      description: "Investigation into suspected cryptocurrency fraud involving multiple wallets and exchanges.",
      createdDate: "2024-01-15",
      dateAdded: "2024-01-15",
      status: "active",
      investigator: "Detective Lim Wei Ming",
      totalValue: "45.2341",
      currency: "ETH",
      addresses: [
        {
          id: "1",
          address: "0xcf1DC766Fc2c62bef0b67A8De666c8e67aCf35f6",
          blockchain: "Ethereum",
          privateLabel: "Suspect Primary Wallet",
          dateSeized: "2024-01-15",
          dateAdded: "2024-01-15",
          balance: "25.1234",
          lastActivity: "2024-01-20"
        },
        {
          id: "2", 
          address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
          blockchain: "Bitcoin",
          privateLabel: "Secondary Wallet",
          dateSeized: "2024-01-16",
          dateAdded: "2024-01-16",
          balance: "0.5842",
          lastActivity: "2024-01-19"
        }
      ],
      recentTransactions: [
        {
          id: "1",
          hash: "0xabc123def456...",
          from: "0xcf1DC766Fc2c62bef0b67A8De666c8e67aCf35f6",
          to: "0x742d35Cc6634C0532925a3b8D5e7891db9F0f8c",
          amount: "5.0000",
          currency: "ETH",
          timestamp: "2024-01-20 14:23:15",
          status: "confirmed"
        },
        {
          id: "2",
          hash: "0xdef456ghi789...",
          from: "0x742d35Cc6634C0532925a3b8D5e7891db9F0f8c",
          to: "0xcf1DC766Fc2c62bef0b67A8De666c8e67aCf35f6",
          amount: "15.2341",
          currency: "ETH",
          timestamp: "2024-01-19 09:15:42",
          status: "confirmed"
        }
      ],
      alerts: [
        {
          id: "1",
          type: "large_transaction",
          message: "Large outgoing transaction detected",
          amount: "5.0000 ETH",
          timestamp: "2024-01-20 14:23:15",
          status: "new"
        },
        {
          id: "2",
          type: "new_address",
          message: "Transaction to previously unseen address",
          timestamp: "2024-01-19 16:45:30",
          status: "acknowledged"
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
      status: "under_review",
      investigator: "Detective Sarah Chen",
      totalValue: "128.7562",
      currency: "ETH",
      addresses: [
        {
          id: "3",
          address: "0x8C8D7C46219D9205f056f28fee5950aD564d7465",
          blockchain: "Ethereum",
          privateLabel: "Exchange Deposit Wallet",
          dateSeized: "2024-01-18",
          dateAdded: "2024-01-18",
          balance: "128.7562",
          lastActivity: "2024-01-21"
        }
      ],
      recentTransactions: [
        {
          id: "3",
          hash: "0xghi789jkl012...",
          from: "0x8C8D7C46219D9205f056f28fee5950aD564d7465",
          to: "0x1234567890abcdef...",
          amount: "50.0000",
          currency: "ETH",
          timestamp: "2024-01-21 10:30:45",
          status: "confirmed"
        }
      ],
      alerts: [
        {
          id: "3",
          type: "defi_interaction",
          message: "DeFi protocol interaction detected",
          timestamp: "2024-01-21 10:30:45",
          status: "new"
        }
      ]
    }
  ];

  useEffect(() => {
    const foundCase = mockCases.find(c => c.caseId === caseId);
    setCaseData(foundCase);
  }, [caseId]);

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
                <Badge variant={getStatusColor(caseData.status)}>
                  {caseData.status.replace('_', ' ').toUpperCase()}
                </Badge>
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