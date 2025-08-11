import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FolderOpen, Plus, Eye, Activity } from "lucide-react";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";
import MonitoringDashboard from "@/components/MonitoringDashboard";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <CryptoMonitoringHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Monitoring Dashboard</h2>
            <p className="text-muted-foreground">Overview of seized crypto assets and recent activity</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/activity")} variant="outline" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Activity
            </Button>
            <Button onClick={() => navigate("/wallets")} variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View All Wallets
            </Button>
            <Button onClick={() => navigate("/new-case")} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Case
            </Button>
            <Button onClick={() => navigate("/cases")} className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Manage Cases
            </Button>
          </div>
        </div>
        <MonitoringDashboard />
      </div>
    </div>
  );
};

export default Index;