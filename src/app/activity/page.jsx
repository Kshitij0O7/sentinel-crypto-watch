import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Search, ExternalLink, Activity, AlertCircle, CheckCircle, Loader } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";

const RecentActivity = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for recent transactions
  const [transactions] = useState([
    {
      id: "1",
      hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f",
      from: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      to: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
      amount: "0.0001",
      currency: "BTC",
      timestamp: "2024-01-20 14:23:15",
      status: "confirmed",
      blockHeight: 825643,
      transactionFee: "0.00001234 BTC",
      caseId: "CPIB-2024-001"
    },
    {
      id: "2",
      hash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g",
      from: "0x742d35Cc6634C0532925a3b8D5e7891db9F0f8c",
      to: "0x8ba1f109551bD432803012645Hac136c6a",
      amount: "0.5",
      currency: "ETH", 
      timestamp: "2024-01-19 09:15:42",
      status: "confirmed",
      blockHeight: 18954321,
      gasUsed: "21000",
      transactionFee: "0.002 ETH",
      caseId: "CPIB-2024-002"
    },
    {
      id: "3",
      hash: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h",
      from: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
      to: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      amount: "1.2534",
      currency: "BTC",
      timestamp: "2024-01-18 16:45:23",
      status: "pending",
      transactionFee: "0.00002156 BTC",
      caseId: "CPIB-2024-003"
    },
    {
      id: "4",
      hash: "0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i",
      from: "0x8ba1f109551bD432803012645Hac136c6a",
      to: "0x742d35Cc6634C0532925a3b8D5e7891db9F0f8c",
      amount: "10.0",
      currency: "ETH",
      timestamp: "2024-01-17 11:32:18",
      status: "failed",
      gasUsed: "21000",
      transactionFee: "0.001 ETH",
      caseId: "CPIB-2024-004"
    },
    {
      id: "5",
      hash: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j",
      from: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      to: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      amount: "0.0852",
      currency: "BTC",
      timestamp: "2024-01-16 08:15:33",
      status: "confirmed",
      blockHeight: 825621,
      transactionFee: "0.00001845 BTC",
      caseId: "CPIB-2024-005"
    }
  ]);

  const filteredTransactions = transactions.filter(tx => 
    tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Loader className="h-4 w-4 text-yellow-600 animate-spin" />;
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
      case 'pending':
        return 'secondary';
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {transactions.filter(tx => tx.status === 'confirmed').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Successful transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Loader className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {transactions.filter(tx => tx.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
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
                {transactions.filter(tx => tx.status === 'failed').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Failed transactions
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