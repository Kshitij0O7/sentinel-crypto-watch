import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Search, ExternalLink, Activity, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";
import {getRecentTransactions} from "@/api/bitquery-api";
import {getWallets} from "@/api/wallets";

const RecentActivity = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setRecentTransactions] = useState([]);
  const [transactionsLoaded, setTransactionsLoaded] = useState(false);

  const filteredTransactions = transactions.filter(tx => 
    tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(()=>{
    const fetchTransactions = async () => {
      setTransactionsLoaded(false);
      try{
        const wallets = getWallets();
        const addresses = wallets.map(wallet => wallet.address);
        const result = await getRecentTransactions(JSON.stringify(addresses));
        const formattedTransactions = result.map((tx, index) => ({
          id: (index + 1).toString(), // or use tx.Transaction.Hash if you want a unique id
          hash: tx.Transaction.Hash,
          from: tx.Transfer.Sender,
          to: tx.Transfer.Receiver,
          amount: parseFloat(tx.Transfer.Amount).toFixed(6), // adjust decimals if needed
          currency: 'ETH', // or determine dynamically if you have multiple currencies
          timestamp: tx.Block.Time,
          status: tx.Transfer.Success ? 'confirmed' : 'failed',
          blockHeight: tx.Block.Number,
          transactionFee: `${tx.Transaction.GasPrice} ETH`,
          caseId: "CPIB-2024-001"
        }));
        
        setRecentTransactions(formattedTransactions);
        setTransactionsLoaded(true);
      } catch (error){
        console.error('Error getting Recent Transactions:', error);
        setTransactionsLoaded(true);
      }
    };

    fetchTransactions();

    const intervalId = setInterval(fetchTransactions, 10000); // 10000ms = 10s

    // cleanup on unmount
    return () => clearInterval(intervalId);
  },[]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <CryptoMonitoringHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <p className="text-muted-foreground">Monitor recent cryptocurrency transactions from seized wallets</p>
          </div>
          <Button onClick={() => navigate("/")} className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by hash, address, or case ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {!transactionsLoaded ? (
                  "Loading..."
                ) : (
                  filteredTransactions.length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Detected transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {!transactionsLoaded ? (
                  "Loading..."
                ) : (
                  filteredTransactions.filter(tx => tx.status === 'confirmed').length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Successful transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {!transactionsLoaded ? (
                  "Loading..."
                ) : (
                  filteredTransactions.filter(tx => tx.status === 'failed').length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Failed transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {!transactionsLoaded ? (
                  "Loading..."
                ) : (
                  `${filteredTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0).toFixed(6)} ETH`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Transaction volume
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              {!transactionsLoaded ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                `Showing ${filteredTransactions.length} transaction${filteredTransactions.length !== 1 ? 's' : ''}`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!transactionsLoaded ? (
              // Show loading text while loading
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-3">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {getStatusIcon(tx.status)}
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium">Hash: {truncateAddress(tx.hash)}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{tx.currency}</Badge>
                          <Badge variant={getStatusVariant(tx.status)}>
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{tx.amount} {tx.currency}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.timestamp} • Block #{tx.blockHeight}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Explorer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                {searchTerm ? (
                  <div>
                    <p className="text-muted-foreground">No transactions found matching "{searchTerm}"</p>
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
                    <p className="text-muted-foreground">No transactions found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Transactions will appear here as they are detected from monitored wallets
                    </p>
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

export default RecentActivity;