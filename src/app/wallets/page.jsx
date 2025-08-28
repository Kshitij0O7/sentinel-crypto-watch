import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search, Eye, Wallet, DollarSign, Activity } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";
import { getWallets } from "@/api/wallets";
import {getWalletBalance, getWalletLastActivity, getTotalAssets} from "@/api/bitquery-api";

const MonitoredWallets = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [walletsLoaded, setWalletsLoaded] = useState(false);

  // Mock data for monitored wallet addresses
  const [walletAddresses, setWalletAddresses] = useState(getWallets());

  useEffect(()=>{
    const fetchStats = async () => {
      setWalletsLoaded(false);
      try {
        const updatedWallets = await Promise.all(
          walletAddresses.map(async (wallet) => {
            const [balanceData, lastActivity] = await Promise.all([
              getWalletBalance(wallet.address),
              getWalletLastActivity(wallet.address)
            ]);
  
            return {
              ...wallet,
              balance: balanceData?.balance ? Number(parseFloat(balanceData.balance).toFixed(2)) : 0,
              lastActivity: lastActivity || wallet.lastActivity,
            };
          })
        );
  
        setWalletAddresses(updatedWallets);
        setWalletsLoaded(true);
      } catch (error) {
        console.error("Error getting wallet stats:", error);
        setWalletsLoaded(true);
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
      wallet.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.blockchain.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "desc") {
        return b.balance - a.balance;
      } else {
        return a.balance - b.balance;
      }
    });

  const totalValue = filteredAndSortedWallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <CryptoMonitoringHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Monitored Wallets</h2>
            <p className="text-muted-foreground">Track seized crypto wallet addresses and their balances</p>
          </div>
          <Button onClick={() => navigate("/")} className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by address, case ID, or blockchain..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                Sort by Balance {sortOrder === "desc" ? "↓" : "↑"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {!walletsLoaded ? (
                  "Loading..."
                ) : (
                  filteredAndSortedWallets.length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Monitored addresses
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
                {!walletsLoaded ? (
                  "Loading..."
                ) : (
                  `${totalValue.toFixed(2)} ETH`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Combined balance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {!walletsLoaded ? (
                  "Loading..."
                ) : (
                  new Set(filteredAndSortedWallets.map(w => w.caseId)).size
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Associated cases
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Wallet List */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet Addresses</CardTitle>
            <CardDescription>
              {!walletsLoaded ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading wallets...</p>
                </div>
              ) : (
                `Showing ${filteredAndSortedWallets.length} wallet${filteredAndSortedWallets.length !== 1 ? 's' : ''}`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!walletsLoaded ? (
              // Show loading text while loading
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading wallets...</p>
              </div>
            ) : filteredAndSortedWallets.length > 0 ? (
              <div className="space-y-4">
                {filteredAndSortedWallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium">{wallet.address}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{wallet.blockchain}</Badge>
                          <Badge variant="secondary">{wallet.caseId}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{wallet.balance} ETH</p>
                      <p className="text-sm text-muted-foreground">
                        Last activity: {wallet.lastActivity || 'No activity'}
                      </p>
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
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                {searchTerm ? (
                  <div>
                    <p className="text-muted-foreground">No wallets found matching "{searchTerm}"</p>
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm("")}
                      className="mt-2"
                    >
                      Clear Search
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground">No wallets found</p>
                    <Button
                      onClick={() => navigate("/")}
                      className="mt-2"
                    >
                      Add Your First Wallet
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonitoredWallets;