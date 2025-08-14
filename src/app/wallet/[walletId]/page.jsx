import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, DollarSign, Clock, AlertTriangle, Copy, ChevronDown, Coins } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {getStats, getTransactionHistory, getHoldings} from '@/api/bitquery-api';
import { symbol } from "zod";

const WalletDetails = () => {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [walletDetails, setWalletDetails] = useState({
    address: walletId,
    blockchain: "Ethereum",
    caseId: "CPIB-2024-001",
    dateSeized: "2024-01-15",
    status: "active",
    lastActivity: "",
    balance: "",
    totalTransactions: 0,
    firstSeen: "2024-01-10",
    lastSeen: "Today",
    tags: ["High Priority", "Investigation Active"]
  });

  useEffect(()=>{
    const fetchStats = async () => {
      try {
        const {balance, token, transactionRecord, lastTransaction} = await getStats(walletId); 
        setWalletDetails({
          ...walletDetails,
          balance: balance ? parseFloat(balance).toFixed(2) + ' ETH' : '0 ETH',
          totalTransactions: transactionRecord,
          lastActivity: lastTransaction
        });
      } catch (error) {
        console.error("Error getting wallet stats:", error);
      }
    };

    fetchStats();
  }, [walletId]);

  const [transactions, setTransactions] = useState([]);

  useEffect(()=>{
    const fetchTransactions = async () => {
      try {
        const result = await getTransactionHistory(walletId);
        const formattedTransactions = result.map((tx, index) => ({
          id: (index + 1).toString(), // or use tx.Transaction.Hash if you want a unique id
          hash: tx.Transaction.Hash,
          from: tx.Transfer.Sender,
          to: tx.Transfer.Receiver,
          amount: parseFloat(tx.Transfer.Amount).toFixed(6), // adjust decimals if needed
          currency: 'ETH', // or determine dynamically if you have multiple currencies
          timestamp: tx.Block.Time,
          status: tx.Transfer.Success ? 'confirmed' : 'failed',
          gasUsed: tx.Transaction.GasPrice,
          blockHeight: tx.Block.Number
        }));
        setTransactions(formattedTransactions);
        console.log(formattedTransactions);
      } catch (error) {
        console.error("Error getting Transactions:", error);
      }
    }

    fetchTransactions();
  }, [walletId]);

  // Mock token holdings data
  // const tokenHoldings = [
  //   {
  //     symbol: "BTC",
  //     name: "Bitcoin",
  //     balance: "0.5842",
  //     value: "$25,423.15",
  //   },
  //   {
  //     symbol: "ETH",
  //     name: "Ethereum",
  //     balance: "2.456",
  //     value: "$5,234.67",
  //     contractAddress: "0xa0b86a33e6ec92d0fb3fb5b5c0c1d8f9c3a6e7d4",
  //     decimals: 18
  //   },
  //   {
  //     symbol: "USDT",
  //     name: "Tether",
  //     balance: "1,250.00",
  //     value: "$1,250.00",
  //     contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  //     decimals: 6
  //   },
  //   {
  //     symbol: "USDC",
  //     name: "USD Coin",
  //     balance: "875.50",
  //     value: "$875.50",
  //     contractAddress: "0xa0b86a33e6ec92d0fb3fb5b5c0c1d8f9c3a6e7d4",
  //     decimals: 6
  //   }
  // ];

  const [tokenHoldings, setTokenHolding] = useState([]);

  useEffect(()=>{
    const fetchTokenHoldings = async () => {
      try {
        const result = await getHoldings(walletId);
        const formattedHoldings = result.map((tx) => ({
          symbol: tx.Currency.Symbol,
          name: tx.Currency.Name,
          contractAddress: tx.Currency.SmartContract,
          decimals: tx.Currency.Decimals,
          balance: parseFloat(tx.balance).toFixed(4),
          value: parseFloat(tx.usd).toFixed(4),
        }));
        setTokenHolding(formattedHoldings);
        console.log(formattedTransactions);
      } catch (error) {
        console.error("Error getting Transactions:", error);
      }
    }

    fetchTokenHoldings();
  }, [walletId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <CryptoMonitoringHeader />
      
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Wallet Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Wallet Details</span>
              <div className="flex items-center gap-2">
                <Badge variant={walletDetails.status === 'active' ? 'default' : 'secondary'}>
                  {walletDetails.status}
                </Badge>
                <Badge variant="outline">{walletDetails.blockchain}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-accent/50 px-2 py-1 rounded text-sm break-all">
                      {walletDetails.address}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(walletDetails.address)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Case ID</label>
                  <p className="mt-1 font-medium">{walletDetails.caseId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date Seized</label>
                  <p className="mt-1">{walletDetails.dateSeized}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="flex gap-2 mt-1">
                    {walletDetails.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Balance</label>
                  <p className="mt-1 text-2xl font-bold text-primary">{walletDetails.balance}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Transactions</label>
                  <p className="mt-1 text-xl font-semibold">{walletDetails.totalTransactions}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Activity</label>
                  <p className="mt-1">{walletDetails.lastActivity || 'No recent activity'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Activity Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{walletDetails.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                Since monitoring started
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Token Holdings</CardTitle>{/* Add tokens here */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Coins className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Token Holdings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {tokenHoldings.map((token, index) => (
                    <DropdownMenuItem key={index} className="flex-col items-start space-y-1 p-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{token.symbol}</Badge>
                          <span className="font-medium">{token.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-primary">{token.value}</span>
                      </div>
                      <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                        <span>Balance: {token.balance} {token.symbol}</span>
                        {token.contractAddress && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(token.contractAddress);
                            }}
                            className="h-6 px-2"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      {token.contractAddress && (
                        <code className="text-xs bg-accent/50 px-2 py-1 rounded break-all w-full block">
                          {token.contractAddress}
                        </code>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tokenHoldings.length}</div>
              <p className="text-xs text-muted-foreground">
                Digital assets held
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">First Seen</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{walletDetails.firstSeen}</div>
              <p className="text-xs text-muted-foreground">
                Initial detection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{walletDetails.status}</div>
              <p className="text-xs text-muted-foreground">
                Monitoring status
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              All detected transactions for this wallet address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{tx.currency}</Badge>
                      <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                        {tx.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{tx.timestamp}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Transaction Hash</label>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-accent/50 px-2 py-1 rounded break-all">
                          {tx.hash}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(tx.hash)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">From</label>
                        <p className="font-mono text-xs break-all">{tx.from}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">To</label>
                        <p className="font-mono text-xs break-all">{tx.to}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Amount</label>
                        <p className="font-semibold">{tx.amount} {tx.currency}</p>
                      </div>
                    </div>
                    
                    {tx.blockHeight && (
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Block: {tx.blockHeight}</span>
                        {tx.gasUsed && <span>Gas: {tx.gasUsed}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WalletDetails;