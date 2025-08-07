import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";
import MonitoringDashboard from "@/components/MonitoringDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <CryptoMonitoringHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <MonitoringDashboard />
      </div>
    </div>
  );
};

export default Index;