import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Eye, Plus, Activity, DollarSign, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletAddress {
  id: string;
  address: string;
  blockchain: string;
  caseId: string;
  dateSeized: string;
  dateAdded: string;
  status: 'active' | 'inactive';
  lastActivity?: string;
  balance: string;
}

interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  currency: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
}

const MonitoringDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newAddress, setNewAddress] = useState("");
  const [selectedCase, setSelectedCase] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState("bitcoin");
  
  // Mock existing cases data
  const existingCases = [
    { id: "1", name: "Silk Road Investigation" },
    { id: "2", name: "Ransomware Group Alpha" },
    { id: "3", name: "Money Laundering Operation" },
    { id: "4", name: "Crypto Exchange Fraud" }
  ];

  // Mock data for demonstration
  const [walletAddresses] = useState<WalletAddress[]>([
    {
      id: "1",
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      blockchain: "Bitcoin",
      caseId: "CPIB-2024-001",
      dateSeized: "2024-01-15",
      dateAdded: "2024-01-15",
      status: "active",
      lastActivity: "2024-01-20",
      balance: "0.5842 BTC"
    },
    {
      id: "2", 
      address: "0x742d35Cc6634C0532925a3b8D5e7891db9F0f8c",
      blockchain: "Ethereum",
      caseId: "CPIB-2024-002",
      dateSeized: "2024-01-18",
      dateAdded: "2024-01-18",
      status: "active",
      balance: "15.2341 ETH"
    }
  ]);

  const [recentTransactions] = useState<Transaction[]>([
    {
      id: "1",
      hash: "abc123...def789",
      from: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      to: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
      amount: "0.0001",
      currency: "BTC",
      timestamp: "2024-01-20 14:23:15",
      status: "confirmed"
    },
    {
      id: "2",
      hash: "def456...ghi012",
      from: "0x742d35Cc6634C0532925a3b8D5e7891db9F0f8c",
      to: "0x8ba1f109551bD432803012645Hac136c6a",
      amount: "0.5",
      currency: "ETH", 
      timestamp: "2024-01-19 09:15:42",
      status: "confirmed"
    }
  ]);

  const handleCaseChange = (value: string) => {
    if (value === "new-case") {
      navigate("/cases");
      return;
    }
    setSelectedCase(value);
  };

  const handleAddWallet = () => {
    if (!newAddress || !selectedCase) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const caseName = existingCases.find(c => c.id === selectedCase)?.name || selectedCase;
    
    toast({
      title: "Wallet Added",
      description: `Wallet address added to monitoring system for case: ${caseName}`,
    });

    setNewAddress("");
    setSelectedCase("");
  };


  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/wallets")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitored Wallets</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletAddresses.length}</div>
            <p className="text-xs text-muted-foreground">
              Click to view all wallets
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/activity")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">2</div>
            <p className="text-xs text-muted-foreground">
              Click to view all activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Under investigation
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/assets")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.5842 BTC</div>
            <p className="text-xs text-muted-foreground">
              Click to view all assets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Wallet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Wallet for Monitoring
          </CardTitle>
          <CardDescription>
            Add a new seized crypto wallet address to the monitoring system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Wallet Address</Label>
              <Input
                id="address"
                placeholder="Enter wallet address..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caseSelect">Case Name</Label>
              <select
                id="caseSelect"
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground z-50"
                value={selectedCase}
                onChange={(e) => handleCaseChange(e.target.value)}
              >
                <option value="">Select a case...</option>
                <option value="new-case" className="font-medium">+ New Case</option>
                {existingCases.map((case_) => (
                  <option key={case_.id} value={case_.id}>
                    {case_.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blockchain">Blockchain</Label>
              <select
                id="blockchain"
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground z-50"
                value={selectedBlockchain}
                onChange={(e) => setSelectedBlockchain(e.target.value)}
              >
                <option value="bitcoin">Bitcoin Mainnet</option>
                <option value="ethereum">Ethereum Mainnet</option>
                <option value="bsc">Binance Smart Chain</option>
                <option value="polygon">Polygon</option>
                <option value="arbitrum">Arbitrum Mainnet</option>
                <option value="avalanche">Avalanche</option>
                <option value="solana">Solana Mainnet</option>
                <option value="cardano">Cardano</option>
                <option value="litecoin">Litecoin</option>
                <option value="dogecoin">Dogecoin</option>
                <option value="dash">Dash</option>
                <option value="ethereum-classic">Ethereum Classic</option>
                <option value="ethereum-pow">Ethereum PoW</option>
                <option value="zcash">ZCash</option>
                <option value="bitcoin-cash">Bitcoin Cash</option>
                <option value="bitcoin-sv">Bitcoin SV</option>
                <option value="algorand">Algorand Mainnet</option>
                <option value="binance-dex">Binance DEX</option>
                <option value="celo">Celo Mainnet</option>
                <option value="conflux">Conflux Hydra</option>
                <option value="hedera">Hedera Hashgraph</option>
                <option value="eos">EOS Mainnet</option>
                <option value="tron">TRON Mainnet</option>
                <option value="beacon-chain">Beacon Chain Ethereum 2.0</option>
                <option value="optimism">Optimism</option>
                <option value="fantom">Fantom</option>
                <option value="cronos">Cronos</option>
                <option value="near">NEAR Protocol</option>
                <option value="harmony">Harmony</option>
                <option value="moonbeam">Moonbeam</option>
                <option value="moonriver">Moonriver</option>
                <option value="kusama">Kusama</option>
                <option value="polkadot">Polkadot</option>
                <option value="cosmos">Cosmos Hub</option>
                <option value="osmosis">Osmosis</option>
                <option value="terra">Terra</option>
                <option value="thorchain">THORChain</option>
                <option value="klaytn">Klaytn</option>
                <option value="zilliqa">Zilliqa</option>
                <option value="waves">Waves</option>
                <option value="stellar">Stellar</option>
              </select>
            </div>
          </div>
          <Button onClick={handleAddWallet} className="w-full md:w-auto">
            Add to Monitoring System
          </Button>
        </CardContent>
      </Card>

      {/* Monitored Wallets */}
      <Card>
        <CardHeader>
          <CardTitle>Monitored Wallet Addresses</CardTitle>
          <CardDescription>
            Currently monitored seized crypto wallet addresses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {walletAddresses.map((wallet) => (
              <div
                key={wallet.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-accent/50"
              >
                <div className="space-y-2 md:space-y-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{wallet.blockchain}</Badge>
                    <Badge variant={wallet.status === 'active' ? 'default' : 'secondary'}>
                      {wallet.status}
                    </Badge>
                  </div>
                  <p className="font-mono text-sm">{wallet.address}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>Case: {wallet.caseId}</span>
                    <span>Seized: {wallet.dateSeized}</span>
                    <span>Added to System: {wallet.dateAdded}</span>
                    <span>Balance: {wallet.balance}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/wallet/${wallet.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Transaction Activity
          </CardTitle>
          <CardDescription>
            Latest detected transactions from monitored addresses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{tx.currency}</Badge>
                    <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                      {tx.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-sm">Hash: {tx.hash}</p>
                    <p className="text-sm">
                      <span className="font-medium">Amount:</span> {tx.amount} {tx.currency}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tx.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <Button variant="outline" size="sm">
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringDashboard;