import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Eye, Plus, Activity, DollarSign, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import walletsData from "../../wallets.json";
import {getTotalAssets, getStats, getRecentTransactions} from "@/api/bitquery-api";
import { getWallets, getAssets, addWallet } from "@/api/wallets";

interface WalletAddress {
  id: string;
  address: string;
  blockchain: string;
  caseId: string;
  dateSeized: string;
  dateAdded: string;
  status: string;
  lastActivity?: string;
  balance?: string;
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
  const [balance, setBalance] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newAddress, setNewAddress] = useState("");
  const [selectedCase, setSelectedCase] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState("ethereum");
  const [loading, setLoading] = useState(true);

  
  // Mock existing cases data -> To be replaced by API call to get all cases
  const existingCases = [
    { id: "CPIB-2024-001", name: "Crypto Exchange Fraud" },
    { id: "CPIB-2024-002", name: "Money Laundering Operation" },
  ];

  // Mock data for demonstration
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>(getWallets());

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  // console.log(walletAddresses);

  const handleCaseChange = (value: string) => {
    if (value === "new-case") {
      navigate("/new-case");
      return;
    }
    setSelectedCase(value);
  };

  const handleAddWallet = async () => {
    if (!newAddress || !selectedCase) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
  
    // Create new wallet object
    const wallets = [...walletAddresses];
    const stats = await getStats(newAddress);
    const newWallet: WalletAddress = {
      id: (wallets.length + 1).toString(),
      address: newAddress,
      blockchain: "Ethereum",
      caseId: selectedCase,
      balance: stats ? parseFloat(stats.balance).toFixed(2) : '0',
      lastActivity: stats?.lastActivity,
      dateAdded: new Date().toISOString().split("T")[0],
      status: "active",
      dateSeized: "2024-01-15",
    };
  
    wallets.push(newWallet);

    const seizedAssets = getAssets();
    const newAsset = {
      id: (seizedAssets.length + 1).toString(),
      cryptocurrency: "Ethereum",
      amount: "0",
      usdValue: 0,
      address: newAddress,
      caseId: selectedCase,
      status: "secured",
      dateSeized: "2024-01-18",
      location: "Singapore",
    };

    seizedAssets.push(newAsset);
  
    // localStorage.setItem("wallets", JSON.stringify(wallets));
    addWallet(wallets, seizedAssets);
    setWalletAddresses(wallets);

    setNewAddress("");
    setSelectedCase("");

    toast({
      title: "Address added!",
      description: `Wallet ${newWallet.address} has been added successfully.`,
      variant: "success",
    });
  };
  
  useEffect(() => {
    let isMounted = true; // to avoid state updates on unmounted component
    const fetchAllData = async () => {
      try {
        const walletAddressesList = walletAddresses.map(wallet => wallet.address);
  
        // Fetch total balance
        const totalBalancePromise = getTotalAssets(JSON.stringify(walletAddressesList));
  
        // Fetch individual wallet stats
        const walletStatsPromise = Promise.all(
          walletAddresses.map(async (wallet) => {
            try {
              const stats = await getStats(wallet.address);
              return {
                ...wallet,
                balance: stats ? parseFloat(stats.balance).toFixed(2) : '0',
                lastActivity: stats?.lastActivity,
              };
            } catch (error) {
              console.error(`Failed to fetch balance for ${wallet.address}`, error);
              return {
                ...wallet,
                balance: '0',
                lastActivity: "",
              };
            }
          })
        );
  
        // Fetch recent transactions
        const recentTransactionsPromise = getRecentTransactions(JSON.stringify(walletAddressesList));
  
        // Wait for all promises
        const [totalBalanceResult, walletStatsResult, recentTransactionsResult] = await Promise.all([
          totalBalancePromise,
          walletStatsPromise,
          recentTransactionsPromise,
        ]);
  
        if (!isMounted) return;
  
        // Update state
        setBalance(parseFloat(totalBalanceResult).toFixed(2));
        setWalletAddresses(walletStatsResult);
        // localStorage.setItem("wallets", JSON.stringify(walletStatsResult));
  
        const formattedTransactions: Transaction[] = recentTransactionsResult.map((tx: any, index: number) => ({
          id: (index + 1).toString(),
          hash: tx.Transaction.Hash,
          from: tx.Transfer.Sender,
          to: tx.Transfer.Receiver,
          amount: parseFloat(tx.Transfer.Amount).toFixed(6),
          currency: 'ETH',
          timestamp: tx.Block.Time,
          status: tx.Transfer.Success ? 'confirmed' : 'failed',
        }));
  
        setRecentTransactions(formattedTransactions);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        if (isMounted) setLoading(false); // stop loading
      }
    };
  
    // Initial fetch
    fetchAllData();
  
    // Polling every 10s
    const intervalId = setInterval(fetchAllData, 10000);
  
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // if (loading) {
  //   return <div className="w-full mx-auto text-center">Loading case data...</div>; // or a spinner
  // }
  

  return (
    <>
    {loading ? (<div className="w-full mx-auto text-center">Loading data...</div>) :(
      <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/cases")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Click to manage cases
            </p>
          </CardContent>
        </Card>

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

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/assets")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balance} ETH</div>
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
                <option value="ethereum">Ethereum Mainnet</option>
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
                    <span>Balance: {wallet.balance ?? 'Loading...'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/wallet/${wallet.address}`)}
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
    )}
    </>
    
  );
};

export default MonitoringDashboard;