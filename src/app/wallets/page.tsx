import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Search, ArrowUpDown, DollarSign, Activity } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";

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
  balanceUSD: number;
}

const MonitoredWallets = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data for monitored wallets - sorted by balance
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
      balance: "0.5842 BTC",
      balanceUSD: 25400
    },
    {
      id: "2", 
      address: "0x742d35Cc6634C0532925a3b8D5e7891db9F0f8c",
      blockchain: "Ethereum",
      caseId: "CPIB-2024-002",
      dateSeized: "2024-01-18",
      dateAdded: "2024-01-18",
      status: "active",
      balance: "15.2341 ETH",
      balanceUSD: 48750
    },
    {
      id: "3",
      address: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
      blockchain: "Bitcoin",
      caseId: "CPIB-2024-003",
      dateSeized: "2024-01-22",
      dateAdded: "2024-01-22",
      status: "active",
      balance: "2.1534 BTC",
      balanceUSD: 93780
    },
    {
      id: "4",
      address: "0x8ba1f109551bD432803012645Hac136c6a",
      blockchain: "Ethereum",
      caseId: "CPIB-2024-004",
      dateSeized: "2024-01-25",
      dateAdded: "2024-01-25",
      status: "inactive",
      balance: "0.0852 ETH",
      balanceUSD: 272
    },
    {
      id: "5",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      blockchain: "Bitcoin",
      caseId: "CPIB-2024-005",
      dateSeized: "2024-01-28",
      dateAdded: "2024-01-28",
      status: "active",
      balance: "0.0123 BTC",
      balanceUSD: 536
    }
  ]);

  // Filter and sort wallets
  const filteredAndSortedWallets = walletAddresses
    .filter(wallet => 
      wallet.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.blockchain.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.balanceUSD - a.balanceUSD;
      } else {
        return a.balanceUSD - b.balanceUSD;
      }
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const totalValue = walletAddresses.reduce((sum, wallet) => sum + wallet.balanceUSD, 0);
  const activeWallets = walletAddresses.filter(w => w.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <CryptoMonitoringHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Monitored Wallets</h1>
          <p className="text-muted-foreground">All seized crypto wallet addresses currently under monitoring</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{walletAddresses.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeWallets} active, {walletAddresses.length - activeWallets} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                USD equivalent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Monitoring</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeWallets}</div>
              <p className="text-xs text-muted-foreground">
                Wallets with live monitoring
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Sort Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter & Sort</CardTitle>
            <CardDescription>Search and organize wallet addresses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                onClick={toggleSortOrder}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                Sort by Balance ({sortOrder === 'desc' ? 'Highest' : 'Lowest'} First)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wallet List */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet Addresses ({filteredAndSortedWallets.length})</CardTitle>
            <CardDescription>
              Showing {filteredAndSortedWallets.length} of {walletAddresses.length} monitored wallet addresses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAndSortedWallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-6 border rounded-lg bg-accent/50 hover:bg-accent/70 transition-colors"
                >
                  <div className="space-y-3 lg:space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{wallet.blockchain}</Badge>
                      <Badge variant={wallet.status === 'active' ? 'default' : 'secondary'}>
                        {wallet.status}
                      </Badge>
                      <Badge variant="outline" className="font-mono">
                        ${wallet.balanceUSD.toLocaleString()}
                      </Badge>
                    </div>
                    <p className="font-mono text-sm break-all">{wallet.address}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">Case: {wallet.caseId}</span>
                      <span>Balance: {wallet.balance}</span>
                      <span>Seized: {wallet.dateSeized}</span>
                      <span>Added: {wallet.dateAdded}</span>
                      {wallet.lastActivity && (
                        <span>Last Activity: {wallet.lastActivity}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 lg:mt-0">
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
              {filteredAndSortedWallets.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No wallets found matching your search criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonitoredWallets;