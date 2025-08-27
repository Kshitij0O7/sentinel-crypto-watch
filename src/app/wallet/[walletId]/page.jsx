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
import jsPDF from "jspdf";
import {getWalletBalance, getWalletTokens, getWalletTransactionCount, getWalletLastActivity, getTransactionHistory, getHoldings} from '@/api/bitquery-api';
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
    transactions: [],
    holdings: [],
    lastSeen: "Today",
    tags: ["High Priority", "Investigation Active"]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [balanceData, tokenCount, txCount, lastActivity, txHistory, holdings] = await Promise.all([
          getWalletBalance(walletId),
          getWalletTokens(walletId),
          getWalletTransactionCount(walletId),
          getWalletLastActivity(walletId),
          getTransactionHistory(walletId),
          getHoldings(walletId),
        ]);

        const formattedTransactions = txHistory.map((tx, index) => ({
          id: (index + 1).toString(),
          hash: tx.Transaction.Hash,
          from: tx.Transfer.Sender,
          to: tx.Transfer.Receiver,
          amount: parseFloat(tx.Transfer.Amount).toFixed(6),
          currency: 'ETH',
          timestamp: tx.Block.Time,
          status: tx.Transfer.Success ? 'confirmed' : 'failed',
          gasUsed: tx.Transaction.GasPrice,
          blockHeight: tx.Block.Number,
        }));
  
        // Format and update token holdings
        const formattedHoldings = holdings.map((tx) => ({
          symbol: tx.Currency.Symbol,
          name: tx.Currency.Name,
          contractAddress: tx.Currency.SmartContract,
          decimals: tx.Currency.Decimals,
          balance: parseFloat(tx.balance).toFixed(4),
          value: parseFloat(tx.usd).toFixed(4),
        }));
  
        // Update wallet details
        setWalletDetails({
          ...walletDetails,
          balance: balanceData?.balance ? parseFloat(balanceData.balance).toFixed(2) + ' ETH' : '0 ETH',
          totalTransactions: txCount || 0,
          lastActivity: lastActivity || '',
          transactions: formattedTransactions,
          holdings: formattedHoldings,
        });
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        setLoading(false); // hide loading even if some API fails
      } finally{
        setLoading(false);
      }
    };
  
    // Fetch data immediately
    fetchAllData();
  
    // Setup interval for updates every 10 seconds
    const intervalId = setInterval(fetchAllData, 10000);
  
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [walletId]);

  const generateBalanceReport = () => {
    if (!walletDetails.holdings.length) {
      toast({
        title: "No Data",
        description: "Token holdings are empty, cannot generate report.",
      });
      return;
    }
  
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Balance Report", 14, 20);
  
    doc.setFontSize(12);
    let y = 30;
    walletDetails.holdings.forEach((token, index) => {
      doc.text(`${index + 1}. ${token.name} (${token.symbol})`, 14, y);
      doc.text(`Balance: ${token.balance}`, 100, y);
      doc.text(`Value: $${token.value}`, 140, y);
      y += 10;
    });
  
    doc.save(`balance-report-${walletDetails.address}.pdf`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  return (
    <>
    {loading ? (<div className="w-full mx-auto text-center">Loading Wallet data...</div>) : (
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
                <div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={generateBalanceReport}
                  >
                    Download Balance Report
                </Button>
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
                  {walletDetails.holdings.map((token, index) => (
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
              <div className="text-2xl font-bold">{walletDetails.holdings.length}</div>
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
              {walletDetails.transactions.map((tx) => (
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
    )}
    </>
  );
};

export default WalletDetails;