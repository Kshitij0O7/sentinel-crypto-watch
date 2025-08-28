import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Wallet, DollarSign, Activity, AlertTriangle, Eye, Users, Download, Copy } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";
import {getWalletBalance, getWalletTokens, getWalletTransactionCount, getWalletLastActivity, getTransactionHistory, getHoldings} from "@/api/bitquery-api";
import { useNotification } from "@/hooks/use-notification";
import jsPDF from "jspdf";

const WalletDetails = () => {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

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
  const [walletLoaded, setWalletLoaded] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setWalletLoaded(false);
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
        setWalletLoaded(true);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        setWalletLoaded(true); // hide loading even if some API fails
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
      showError("Token holdings are empty, cannot generate report.");
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
    showSuccess("Balance report generated successfully!");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess("Address copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <CryptoMonitoringHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/wallets")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Wallets
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Wallet Details</h1>
            <p className="text-muted-foreground">Detailed analysis of seized crypto wallet</p>
          </div>
        </div>

        {/* Wallet Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Wallet Overview</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(walletDetails.address)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </Button>
                <Button variant="outline" size="sm" onClick={generateBalanceReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Address</h4>
                  <p className="font-mono text-sm break-words">{walletDetails.address}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Seized: {walletDetails.dateSeized}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Case: {walletDetails.caseId}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {walletDetails.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Balance</h4>
                    <p className="text-lg font-semibold">
                      {!walletLoaded ? (
                        "Loading..."
                      ) : (
                        walletDetails.balance
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Total Transactions</h4>
                    <p className="text-lg font-semibold">
                      {!walletLoaded ? (
                        "Loading..."
                      ) : (
                        walletDetails.totalTransactions
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Last Activity</h4>
                  <p className="text-sm">
                    {!walletLoaded ? (
                      "Loading..."
                    ) : (
                      walletDetails.lastActivity || 'No recent activity'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Token Holdings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Token Holdings
              </CardTitle>
              <CardDescription>
                {!walletLoaded ? (
                  "Loading..."
                ) : (
                  `${walletDetails.holdings.length} token${walletDetails.holdings.length !== 1 ? 's' : ''} found`
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!walletLoaded ? (
                // Show loading text while loading
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading wallet details...</p>
                </div>
              ) : walletDetails.holdings.length > 0 ? (
                <div className="space-y-3">
                  {walletDetails.holdings.map((token, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium break-words">{token.name}</p>
                          <p className="text-sm text-muted-foreground break-words">{token.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold break-words">{token.balance}</p>
                        <p className="text-sm text-muted-foreground break-words">${token.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No token holdings found
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                {!walletLoaded ? (
                  "Loading..."
                ) : (
                  `Latest ${walletDetails.transactions.length} transaction${walletDetails.transactions.length !== 1 ? 's' : ''}`
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!walletLoaded ? (
                // Show loading text while loading
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading transactions...</p>
                </div>
              ) : walletDetails.transactions.length > 0 ? (
                <div className="space-y-3">
                  {walletDetails.transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-mono text-sm break-words">Hash: {tx.hash.slice(0, 8)}...</p>
                          <p className="text-xs text-muted-foreground break-words">
                            {tx.timestamp} • {tx.amount} {tx.currency}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                          {tx.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1 break-words">
                          Block #{tx.blockHeight}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalletDetails;