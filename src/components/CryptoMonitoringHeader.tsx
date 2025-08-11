import { Shield, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const CryptoMonitoringHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
              <Shield className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">CPIB Crypto Asset Monitoring</h1>
                <p className="text-primary-foreground/80 text-sm">
                  Seized Crypto Wallet Surveillance System
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-success text-success-foreground">
              System Active
            </Badge>
            <div className="text-right">
              <p className="text-sm font-medium">Singapore Time</p>
              <p className="text-xs text-primary-foreground/80">
                {new Date().toLocaleString('en-SG')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoMonitoringHeader;