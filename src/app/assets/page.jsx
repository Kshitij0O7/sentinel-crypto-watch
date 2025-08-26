import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, Bitcoin, Shield, TrendingUp, TrendingDown, Calendar, MapPin, Eye } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";
import { getAssets, updateAssets } from "@/api/wallets";
import {getStats} from "@/api/bitquery-api";

const AssetsUnderSeizure = () => {
  const navigate = useNavigate();

  // Mock data for seized assets
  const [seizedAssets, setSeizedAssets] = useState(getAssets());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      const updatedAssets = await Promise.all(
        seizedAssets.map(async (asset) => {
          try {
            const stats = await getStats(asset.address);
            // console.log(stats);
            return {
              ...asset,
              amount: stats ? parseFloat(stats.balance).toFixed(2) : '0',
              usdValue: stats ? Number(parseFloat(stats.usd).toFixed(2)) : 0,
            };
          } catch (error) {
            console.error(`Failed to fetch amount for ${asset.address}`, error);
            return {
              ...asset,
              amount: '0',
              usdValue: 0,
            };
          } finally {
            setLoading(false);
          }
        })
      );
  
      updateAssets(updatedAssets);
      setSeizedAssets(updatedAssets);
    };
  
    fetchBalances();

    const intervalId = setInterval(fetchBalances, 10000); // 10000ms = 10s

    // cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'secured':
        return 'default';
      case 'liquidated':
        return 'secondary';
      case 'pending':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTotalValue = () => {
    return seizedAssets
      .filter(asset => asset.status !== 'liquidated')
      .reduce((sum, asset) => sum + asset.usdValue, 0);
  };

  const getTotalETH = () => {
    return seizedAssets
      .filter(asset => asset.cryptocurrency === 'Ethereum' && asset.status !== 'liquidated')
      .reduce((sum, asset) => sum + parseFloat(asset.amount), 0);
  };

  return (
    <>
    {loading ? (<div className="w-full mx-auto text-center">Loading asset data...</div>) : (
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
              <CardTitle className="text-sm font-medium">Total ETH Secured</CardTitle>
              {/* <Bitcoin className="h-4 w-4 text-orange-500" /> */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalETH().toFixed(4)} ETH</div>
              <p className="text-xs text-muted-foreground">
                Excluding liquidated assets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total USD Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${getTotalValue().toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Current market value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(seizedAssets.map(asset => asset.caseId)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Investigation cases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Secured Assets</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {seizedAssets.filter(asset => asset.status === 'secured').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently secured
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assets List */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Asset Overview</CardTitle>
            <CardDescription>
              Complete listing of all cryptocurrency assets currently under seizure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seizedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{asset.cryptocurrency}</Badge>
                      <Badge variant={getStatusColor(asset.status)}>{asset.status}</Badge>
                      <span className="text-xl font-bold text-primary">
                        ${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Amount</label>
                        <p className="font-mono text-lg font-semibold">
                          {asset.amount} {asset.cryptocurrency}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Case ID</label>
                        <p className="font-medium">{asset.caseId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
                        <code className="text-xs bg-accent/50 px-2 py-1 rounded break-all block mt-1">
                          {asset.address}
                        </code>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Date Seized</label>
                          <p>{asset.dateSeized}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Location</label>
                          <p>{asset.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    )}
    </>
  );
};

export default AssetsUnderSeizure;