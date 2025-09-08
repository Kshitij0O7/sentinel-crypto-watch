import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, Bitcoin, Shield, TrendingUp, TrendingDown, Calendar, MapPin, Eye } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";
import { getAssets, updateAssets } from "@/api/wallets";
import {getWalletBalance, getWalletTokens} from "@/api/bitquery-api";

const AssetsUnderSeizure = () => {
  const navigate = useNavigate();

  // Mock data for seized assets
  const [seizedAssets, setSeizedAssets] = useState(getAssets());
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    const fetchBalances = async () => {
      setAssetsLoaded(false);
      try {
        const updatedAssets = await Promise.all(
          seizedAssets.map(async (asset) => {
            try {
              const balanceData = await getWalletBalance(asset.address);
              // console.log(balanceData);
              return {
                ...asset,
                amount: balanceData?.balance ? parseFloat(balanceData.balance).toFixed(2) : '0',
                usdValue: balanceData?.usd ? Number(parseFloat(balanceData.usd).toFixed(2)) : 0,
              };
            } catch (error) {
              console.error(`Failed to fetch amount for ${asset.address}`, error);
              return {
                ...asset,
                amount: '0',
                usdValue: 0,
              };
            }
          })
        );
  
        updateAssets(updatedAssets);
        setSeizedAssets(updatedAssets);
        setAssetsLoaded(true);
      } catch (error) {
        console.error('Error fetching asset balances:', error);
        setAssetsLoaded(true);
      }
    };
  
    fetchBalances();

    const intervalId = setInterval(fetchBalances, 600000); // 600000ms = 10 minutes

    // cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'secured':
        return 'default';
      case 'under_review':
        return 'secondary';
      case 'released':
        return 'outline';
      default:
        return 'default';
    }
  };

  const totalUSDValue = seizedAssets.reduce((sum, asset) => sum + asset.usdValue, 0);
  const totalCryptoAmount = seizedAssets.reduce((sum, asset) => sum + parseFloat(asset.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <CryptoMonitoringHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Assets Under Seizure</h2>
            <p className="text-muted-foreground">Track seized cryptocurrency assets and their current values</p>
          </div>
          <Button onClick={() => navigate("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {!assetsLoaded ? (
                  "Loading..."
                ) : (
                  seizedAssets.length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Seized addresses
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
                {!assetsLoaded ? (
                  "Loading..."
                ) : (
                  `$${totalUSDValue.toLocaleString()}`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                USD equivalent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crypto Amount</CardTitle>
              <Bitcoin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {!assetsLoaded ? (
                  "Loading..."
                ) : (
                  `${totalCryptoAmount.toFixed(6)} ETH`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total crypto
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {!assetsLoaded ? (
                  "Loading..."
                ) : (
                  new Set(seizedAssets.map(asset => asset.caseId)).size
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Associated cases
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assets List */}
        <Card>
          <CardHeader>
            <CardTitle>Seized Assets</CardTitle>
            <CardDescription>
              {!assetsLoaded ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading assets...</p>
                </div>
              ) : (
                `Showing ${seizedAssets.length} seized asset${seizedAssets.length !== 1 ? 's' : ''}`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!assetsLoaded ? (
              // Show loading text while loading
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading assets...</p>
              </div>
            ) : seizedAssets.length > 0 ? (
              <div className="space-y-4">
                {seizedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bitcoin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium">{asset.address}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{asset.cryptocurrency}</Badge>
                          <Badge variant={getStatusColor(asset.status)}>
                            {asset.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{asset.amount} {asset.cryptocurrency}</p>
                      <p className="text-sm text-muted-foreground">
                        ${asset.usdValue.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/wallet/${asset.address}`)}
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
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No seized assets found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Assets will appear here once wallets are added to the monitoring system
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="mt-4"
                >
                  Add Your First Wallet
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssetsUnderSeizure;