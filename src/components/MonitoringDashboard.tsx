import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Eye, Plus, Activity, DollarSign, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {getTotalAssets, getWalletBalance, getWalletLastActivity, getRecentTransactions} from "@/api/bitquery-api";
import { getWallets, getAssets, addWallet } from "@/api/wallets";
import DashboardSkeleton from "./DashboardSkeleton";
import { usePerformance } from "@/hooks/use-performance";

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
  // Performance monitoring
  usePerformance("MonitoringDashboard");
  
  const [balance, setBalance] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newAddress, setNewAddress] = useState("");
  const [selectedCase, setSelectedCase] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState("ethereum");
  const [loading, setLoading] = useState(true);
  const [metricsLoaded, setMetricsLoaded] = useState(false);
  const [walletsLoaded, setWalletsLoaded] = useState(false);
  const [transactionsLoaded, setTransactionsLoaded] = useState(false);
  const [addingWallet, setAddingWallet] = useState(false);
  const [refreshingTransactions, setRefreshingTransactions] = useState(false);

  
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

  const refreshTransactions = async () => {
    if (refreshingTransactions) return;
    
    setRefreshingTransactions(true);
    
    try {
      const walletAddressesList = walletAddresses.map(wallet => wallet.address);
      
      if (walletAddressesList.length === 0) {
        setRefreshingTransactions(false);
        return;
      }

      const recentTransactionsResult = await getRecentTransactions(JSON.stringify(walletAddressesList));
      
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
      
      toast({
        title: "Transactions Refreshed",
        description: `Found ${formattedTransactions.length} recent transactions`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error refreshing transactions:', error);
      toast({
        title: "Refresh Failed",
        description: "Could not fetch latest transactions",
        variant: "destructive",
      });
    } finally {
      setRefreshingTransactions(false);
    }
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
  
    // Prevent duplicate submissions
    if (addingWallet) return;
    
    setAddingWallet(true);
  
    // Create new wallet object INSTANTLY (no API call blocking)
    const wallets = [...walletAddresses];
    const newWallet: WalletAddress = {
      id: (wallets.length + 1).toString(),
      address: newAddress,
      blockchain: "Ethereum",
      caseId: selectedCase,
      balance: "0", // Will be updated in background
      lastActivity: "",
      dateAdded: new Date().toISOString().split("T")[0],
      status: "active",
      dateSeized: "2024-01-15",
    };
  
    // Clear form immediately for better UX
    setNewAddress("");
    setSelectedCase("");

    // Add wallet immediately to UI
    wallets.push(newWallet);
    setWalletAddresses(wallets);

    // Update localStorage immediately
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
    addWallet(wallets, seizedAssets);

    // Show success toast immediately
    toast({
      title: "Address added!",
      description: `Wallet ${newWallet.address} has been added successfully.`,
      variant: "success",
    });

    // Fetch wallet stats in background (non-blocking)
    Promise.all([
      getWalletBalance(newAddress),
      getWalletLastActivity(newAddress)
    ]).then(([balanceData, lastActivity]) => {
      if (balanceData) {
        const updatedWallets = wallets.map(wallet => 
          wallet.address === newAddress 
            ? { 
                ...wallet, 
                balance: parseFloat(balanceData.balance).toFixed(2),
                lastActivity: lastActivity || ""
              }
            : wallet
        );
        setWalletAddresses(updatedWallets);
        addWallet(updatedWallets, seizedAssets);
      }
    }).catch(error => {
      console.error("Failed to fetch wallet stats in background:", error);
    }).finally(() => {
      setAddingWallet(false);
    });
  };
  
  useEffect(() => {
    let isMounted = true; // to avoid state updates on unmounted component
    const fetchAllData = async () => {
      try {
        let walletAddresses = getWallets();
        const walletAddressesList = walletAddresses.map(wallet => wallet.address);
  
        // Fetch total balance independently
        setMetricsLoaded(false);
        try {
          const totalBalanceResult = await getTotalAssets(JSON.stringify(walletAddressesList));
          if (isMounted) {
            setBalance(parseFloat(totalBalanceResult).toFixed(2));
            setMetricsLoaded(true);
          }
        } catch (error) {
          console.error('Error fetching total balance:', error);
          if (isMounted) setMetricsLoaded(true);
        }
  
        // Fetch individual wallet stats independently
        setWalletsLoaded(false);
        try {
          const walletStatsResult = await Promise.all(
            walletAddresses.map(async (wallet) => {
              try {
                const [balanceData, lastActivity] = await Promise.all([
                  getWalletBalance(wallet.address),
                  getWalletLastActivity(wallet.address)
                ]);
                return {
                  ...wallet,
                  balance: balanceData ? parseFloat(balanceData.balance).toFixed(2) : '0',
                  lastActivity: lastActivity || "",
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
          
          if (isMounted) {
            setWalletAddresses(walletStatsResult);
            setWalletsLoaded(true);
          }
        } catch (error) {
          console.error('Error fetching wallet stats:', error);
          if (isMounted) setWalletsLoaded(true);
        }
  
        // Fetch recent transactions independently
        setTransactionsLoaded(false);
        try {
          const recentTransactionsResult = await getRecentTransactions(JSON.stringify(walletAddressesList));
          
          if (isMounted) {
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
            setTransactionsLoaded(true);
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
          if (isMounted) setTransactionsLoaded(true);
        }
        
      } catch (error) {
        console.error('Error in fetchAllData:', error);
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
    {loading ? <DashboardSkeleton /> : (
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
            <div className="text-2xl font-bold">
              {!walletsLoaded ? "..." : walletAddresses.length}
            </div>
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
            <div className="text-2xl font-bold">
              {!metricsLoaded ? "..." : `${balance} ETH`}
            </div>
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
          <Button 
            onClick={handleAddWallet} 
            disabled={addingWallet}
            className="w-full md:w-auto"
          >
            {addingWallet ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              "Add to Monitoring System"
            )}
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
                    <span>Balance: {wallet.balance === '0' && wallet.lastActivity === '' ? 'Updating...' : wallet.balance ?? 'Loading...'}</span>
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Transaction Activity
              </CardTitle>
              <CardDescription>
                Latest detected transactions from monitored addresses
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refreshTransactions()}
              disabled={refreshingTransactions}
              className="flex items-center gap-2"
            >
              {refreshingTransactions ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!transactionsLoaded ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
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
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    )}
    </>
    
  );
};

export default MonitoringDashboard;