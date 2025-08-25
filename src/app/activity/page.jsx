import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Search, ExternalLink, Activity, AlertCircle, CheckCircle, Loader } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";
import {getRecentTransactions} from "@/api/bitquery-api";
import {getWallets} from "@/api/wallets";

const RecentActivity = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setRecentTransactions] = useState([]);

  const filteredTransactions = transactions.filter(tx => 
    tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(()=>{
    const fetchTransactions = async () => {
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
      } catch (error){
        console.error('Error getting Recent Transactions:', error);
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

  const truncateHash = (hash) => {
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <CryptoMonitoringHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Activity className="h-8 w-8" />
            Recent Activity
          </h1>
          <p className="text-muted-foreground">All recent transactions from monitored wallet addresses</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Transactions</CardTitle>
            <CardDescription>Filter transactions by hash, address, case ID, or currency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History ({filteredTransactions.length})</CardTitle>
            <CardDescription>
              Detailed view of all recent transaction activity from monitored addresses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction Hash</TableHead>
                    <TableHead>From Address</TableHead>
                    <TableHead>To Address</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(tx.status)}
                          <Badge variant={getStatusVariant(tx.status)}>
                            {tx.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{truncateHash(tx.hash)}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{truncateAddress(tx.from)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{truncateAddress(tx.to)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{tx.currency}</Badge>
                          <span className="font-medium">{tx.amount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {tx.transactionFee || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {tx.caseId && (
                          <Badge variant="secondary" className="text-xs">
                            {tx.caseId}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{tx.timestamp.split(' ')[0]}</div>
                          <div className="text-muted-foreground text-xs">
                            {tx.timestamp.split(' ')[1]}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Investigate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions found matching your search criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecentActivity;