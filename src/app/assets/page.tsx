import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Shield, TrendingUp, TrendingDown } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";

interface SeizedAsset {
  id: string;
  cryptocurrency: string;
  amount: string;
  usdValue: string;
  walletAddress: string;
  blockchain: string;
  caseId: string;
  caseName: string;
  dateSeized: string;
  seizureLocation: string;
  status: 'secured' | 'pending' | 'liquidated';
  lastActivity?: string;
  priceChange24h: string;
  priceChangeDirection: 'up' | 'down';
}

const AssetsUnderSeizure = () => {
  const navigate = useNavigate();

  // Mock data for seized assets
  const seizedAssets: SeizedAsset[] = [
    {
      id: "1",
      cryptocurrency: "Bitcoin",
      amount: "0.5842",
      usdValue: "$28,421",
      walletAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      blockchain: "Bitcoin",
      caseId: "CPIB-2024-001",
      caseName: "Crypto Fraud Investigation Alpha",
      dateSeized: "2024-01-15",
      seizureLocation: "Singapore",
      status: "secured",
      lastActivity: "2024-01-20",
      priceChange24h: "+2.5%",
      priceChangeDirection: "up"
    },
    {
      id: "2",
      cryptocurrency: "Ethereum",
      amount: "15.2341",
      usdValue: "$35,892",
      walletAddress: "0x742d35Cc6634C0532925a3b8D5e7891db9F0f8c",
      blockchain: "Ethereum",
      caseId: "CPIB-2024-002",
      caseName: "Money Laundering Case Beta",
      dateSeized: "2024-01-18",
      seizureLocation: "Singapore",
      status: "secured",
      priceChange24h: "-1.2%",
      priceChangeDirection: "down"
    },
    {
      id: "3",
      cryptocurrency: "USDT",
      amount: "25,000",
      usdValue: "$25,000",
      walletAddress: "0x9f8c163cBA728b529c12de0E99a5c6D2c4b8D2e7",
      blockchain: "Ethereum",
      caseId: "CPIB-2024-003",
      caseName: "Ransomware Investigation",
      dateSeized: "2024-01-22",
      seizureLocation: "Singapore",
      status: "pending",
      priceChange24h: "0.0%",
      priceChangeDirection: "up"
    },
    {
      id: "4",
      cryptocurrency: "Bitcoin Cash",
      amount: "12.5",
      usdValue: "$3,750",
      walletAddress: "bitcoincash:qp3wjpa3tj0m7s8w5t9uxm2t9u7hn0rwuv0",
      blockchain: "Bitcoin Cash",
      caseId: "CPIB-2024-001",
      caseName: "Crypto Fraud Investigation Alpha",
      dateSeized: "2024-01-16",
      seizureLocation: "Singapore",
      status: "liquidated",
      priceChange24h: "+0.8%",
      priceChangeDirection: "up"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secured':
        return 'default';
      case 'pending':
        return 'destructive';
      case 'liquidated':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getTotalValue = () => {
    return seizedAssets
      .filter(asset => asset.status !== 'liquidated')
      .reduce((total, asset) => {
        const value = parseFloat(asset.usdValue.replace('$', '').replace(',', ''));
        return total + value;
      }, 0);
  };

  const getTotalBTC = () => {
    return seizedAssets
      .filter(asset => asset.cryptocurrency === 'Bitcoin' && asset.status !== 'liquidated')
      .reduce((total, asset) => total + parseFloat(asset.amount), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <CryptoMonitoringHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Assets Under Seizure</h1>
            <p className="text-muted-foreground">Comprehensive overview of all seized cryptocurrency assets</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total BTC Secured</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalBTC().toFixed(4)} BTC</div>
              <p className="text-xs text-muted-foreground">
                Primary seizure asset
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total USD Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${getTotalValue().toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Current market value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Cases with seized assets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Secured Assets</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{seizedAssets.filter(a => a.status === 'secured').length}</div>
              <p className="text-xs text-muted-foreground">
                Assets in custody
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seized Assets List */}
        <Card>
          <CardHeader>
            <CardTitle>Seized Cryptocurrency Assets</CardTitle>
            <CardDescription>
              Detailed breakdown of all cryptocurrency assets under seizure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seizedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg bg-accent/30"
                >
                  <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-6 flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{asset.blockchain}</Badge>
                        <Badge variant={getStatusColor(asset.status)}>
                          {asset.status}
                        </Badge>
                        <div className={`flex items-center gap-1 text-xs ${
                          asset.priceChangeDirection === 'up' ? 'text-success' : 'text-destructive'
                        }`}>
                          {asset.priceChangeDirection === 'up' ? 
                            <TrendingUp className="h-3 w-3" /> : 
                            <TrendingDown className="h-3 w-3" />
                          }
                          {asset.priceChange24h}
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg">
                        {asset.amount} {asset.cryptocurrency}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {asset.usdValue} USD
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Case: {asset.caseId}</p>
                      <p className="text-sm text-muted-foreground">{asset.caseName}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="font-mono text-xs">{asset.walletAddress}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Seized: {asset.dateSeized}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {asset.seizureLocation}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 lg:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/wallet/${asset.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssetsUnderSeizure;