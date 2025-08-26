import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search, Eye, Wallet, DollarSign, Activity } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";
import { getWallets } from "@/api/wallets";
import {getStats, getTotalAssets} from "@/api/bitquery-api";

const MonitoredWallets = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

  // Mock data for monitored wallet addresses
  const [walletAddresses, setWalletAddresses] = useState(getWallets());

  useEffect(()=>{
    const fetchStats = async () => {
      try {
        const updatedWallets = await Promise.all(
          walletAddresses.map(async (wallet) => {
            const { balance, lastTransaction } = await getStats(wallet.address);
  
            return {
              ...wallet,
              balance: balance ? Number(parseFloat(balance).toFixed(2)) : 0,
              lastActivity: lastTransaction || wallet.lastActivity,
            };
          })
        );
  
        setWalletAddresses(updatedWallets);
      } catch (error) {
        console.error("Error getting wallet stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const intervalId = setInterval(fetchStats, 10000); // 10000ms = 10s

    // cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);


  const filteredAndSortedWallets = walletAddresses
    .filter(wallet => 
      wallet.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.blockchain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.caseId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      return sortOrder === "desc" ? b.balance - a.balance : a.balance - b.balance;
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const totalValue = walletAddresses.reduce((sum, wallet) => sum + wallet.balance, 0);
  const activeWallets = walletAddresses.filter(wallet => wallet.status === "active").length;

  return (
    <>
    {loading ? (<div className="w-full mx-auto text-center">Loading wallet data...</div>) : (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <CryptoMonitoringHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Monitored Wallets</h1>
          <p className="text-muted-foreground">All cryptocurrency wallet addresses under surveillance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{walletAddresses.length}</div>
              <p className="text-xs text-muted-foreground">
                Addresses monitored
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalValue} ETH
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Monitoring</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeWallets}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Sort Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>Find specific wallet addresses or filter by blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by address, blockchain, or case ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={toggleSortOrder} className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort by Value ({sortOrder === "desc" ? "High to Low" : "Low to High"})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wallets List */}
        <div className="space-y-4">
          {filteredAndSortedWallets.map((wallet) => (
            <Card key={wallet.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{wallet.blockchain}</Badge>
                      <Badge variant={wallet.status === 'active' ? 'default' : 'secondary'}>
                        {wallet.status}
                      </Badge>
                      <span className="text-lg font-semibold text-primary">
                        {wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETH
                      </span>
                    </div>
                    <div className="space-y-1">
                      <code className="text-sm bg-accent/50 px-2 py-1 rounded break-all">
                        {wallet.address}
                      </code>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Case: {wallet.caseId}</span>
                        <span>Balance: {wallet.balance}</span>
                        <span>Last Activity: {wallet.lastActivity}</span>
                        <span>Seized: {wallet.dateSeized}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/wallet/${wallet.address}`)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredAndSortedWallets.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No wallets found matching your search criteria.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    )}
    </>
  );
};

export default MonitoredWallets;