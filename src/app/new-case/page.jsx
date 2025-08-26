import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Bell, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CryptoMonitoringHeader from "@/components/CryptoMonitoringHeader";
import { getCases, addCase } from "@/api/case-api";

const NewCase = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form states for new case
  const cases = useState(getCases());
  const [newCase, setNewCase] = useState({
    name: "",
    caseId: "",
    description: "",
    address: "",
    blockchain: "Ethereum",
    alertGroupId: ""
  });

  // Form states for new alert group
  const [newAlertGroup, setNewAlertGroup] = useState({
    name: "",
    email: ""
  });

  // Mock data for alert groups (in real app, this would come from a store/context)
  const [alertGroups, setAlertGroups] = useState([
    {
      id: "1",
      name: "Primary Investigation Team",
      emails: ["detective.lim@cpib.gov.sg", "analyst.tan@cpib.gov.sg"],
      createdDate: "2024-01-10"
    },
    {
      id: "2", 
      name: "Senior Management",
      emails: ["director@cpib.gov.sg", "supervisor.wong@cpib.gov.sg"],
      createdDate: "2024-01-12"
    }
  ]);

  const blockchainOptions = ["Ethereum"];

  const handleCreateCase = () => {
    if (!newCase.name || !newCase.caseId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const addresses = newCase.address ? [{
      id: (newCase.address.length + 1).toString(),
      address: newCase.address,
      blockchain: newCase.blockchain,
      balance: "0",
      privateLabel: "Primary Suspect",
      dateSeized: new Date().toISOString().split('T')[0],
      dateAdded: new Date().toISOString().split('T')[0],
      lastActivity: "",
    }] : [];

    // const caseData = {
    //   id: (cases.length + 1).toString(),
    //   name: newCase.name,
    //   caseId: newCase.caseId,
    //   description: newCase.description,
    //   createdDate: new Date().toISOString().split('T')[0],
    //   addresses,
    //   alertGroupId: newCase.alertGroupId || undefined
    // };

    const caseData = {
      id: (cases.length + 1).toString(),
      name: newCase.name,
      caseId: newCase.caseId,
      description: newCase.description,
      createdDate: new Date().toISOString().split('T')[0],
      dateAdded: new Date().toISOString().split('T')[0],
      status: "active",
      investigator: "Detective Lim Wei Ming",
      totalValue: "0",
      currency: "ETH",
      alertGroupId: newCase.alertGroupId || undefined,
      addresses,
      recentTransactions: [],
      alerts: [alertGroups.find(alert => newCase.alertGroupId == alert.id)]
    };

    // In real app, this would save to a store/database
    addCase(caseData);
    setNewCase({ name: "", caseId: "", description: "", address: "", blockchain: "Ethereum", alertGroupId: "" });
    
    toast({
      title: "Case Created",
      description: `Case ${newCase.caseId} has been created successfully${newCase.address ? ' with address' : ''}`,
    });

    // Navigate to manage cases page after creation
    navigate("/cases");
  };

  const handleCreateAlertGroup = () => {
    if (!newAlertGroup.name || !newAlertGroup.email) {
      toast({
        title: "Error",
        description: "Please fill in group name and at least one email",
        variant: "destructive",
      });
      return;
    }

    const alertGroupData = {
      id: Date.now().toString(),
      name: newAlertGroup.name,
      emails: [newAlertGroup.email],
      createdDate: new Date().toISOString().split('T')[0]
    };

    setAlertGroups([...alertGroups, alertGroupData]);
    setNewAlertGroup({ name: "", email: "" });
    
    toast({
      title: "Alert Group Created",
      description: `Alert group "${newAlertGroup.name}" has been created successfully`,
    });
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
            <h1 className="text-3xl font-bold">Create New Case</h1>
            <p className="text-muted-foreground">Create a new investigation case and optional alert group</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create New Case */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Case
              </CardTitle>
              <CardDescription>
                Create a new investigation case with optional initial address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caseName">Case Name *</Label>
                  <Input
                    id="caseName"
                    placeholder="Enter case name..."
                    value={newCase.name}
                    onChange={(e) => setNewCase({ ...newCase, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caseId">Case ID *</Label>
                  <Input
                    id="caseId"
                    placeholder="CPIB-2024-XXX"
                    value={newCase.caseId}
                    onChange={(e) => setNewCase({ ...newCase, caseId: e.target.value })}
                  />
                </div>
              </div>
              
              {/* Address Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caseAddress">Wallet Address</Label>
                  <Input
                    id="caseAddress"
                    placeholder="Enter wallet address..."
                    value={newCase.address}
                    onChange={(e) => setNewCase({ ...newCase, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caseBlockchain">Blockchain</Label>
                  <select
                    id="caseBlockchain"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground z-50"
                    value={newCase.blockchain}
                    onChange={(e) => setNewCase({ ...newCase, blockchain: e.target.value })}
                  >
                    {blockchainOptions.map((blockchain) => (
                      <option key={blockchain} value={blockchain}>
                        {blockchain}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Alert Group Association */}
              <div className="space-y-2">
                <Label htmlFor="alertGroupSelect">Alert Group</Label>
                <select
                  id="alertGroupSelect"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground z-50"
                  value={newCase.alertGroupId}
                  onChange={(e) => setNewCase({ ...newCase, alertGroupId: e.target.value })}
                >
                  <option value="">No alert group</option>
                  {alertGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Case Description - Optional */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="caseDescription">Case Description</Label>
                  <span className="text-sm text-muted-foreground">(Optional)</span>
                </div>
                <Textarea
                  id="caseDescription"
                  placeholder="Enter detailed case description..."
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <Button onClick={handleCreateCase} className="w-full md:w-auto">
                Create Case
              </Button>
            </CardContent>
          </Card>

          {/* Create Alert Group */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Create Alert Group
              </CardTitle>
              <CardDescription>
                Create a notification group to receive alerts for wallet activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alertGroupName">Group Name *</Label>
                  <Input
                    id="alertGroupName"
                    placeholder="Enter alert group name..."
                    value={newAlertGroup.name}
                    onChange={(e) => setNewAlertGroup({ ...newAlertGroup, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alertEmail">Email Address *</Label>
                  <Input
                    id="alertEmail"
                    type="email"
                    placeholder="email@cpib.gov.sg"
                    value={newAlertGroup.email}
                    onChange={(e) => setNewAlertGroup({ ...newAlertGroup, email: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleCreateAlertGroup} className="w-full md:w-auto">
                Create Alert Group
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewCase;