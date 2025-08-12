import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Eye, 
  Search, 
  Activity, 
  Wallet, 
  AlertTriangle,
  BarChart3,
  Globe,
  Users,
  CheckCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

const PresentationSlides = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'title',
      title: 'CPIB Crypto Asset Monitoring System',
      subtitle: 'Advanced Blockchain Investigation Platform',
      component: <TitleSlide />
    },
    {
      id: 'problem',
      title: 'The Challenge',
      subtitle: 'Cryptocurrency Investigation Complexities',
      component: <ProblemSlide />
    },
    {
      id: 'solution',
      title: 'Our Solution',
      subtitle: 'Comprehensive Monitoring & Investigation',
      component: <SolutionSlide />
    },
    {
      id: 'dashboard',
      title: 'Monitoring Dashboard',
      subtitle: 'Real-time Overview & Control Center',
      component: <DashboardSlide />
    },
    {
      id: 'blockchain',
      title: 'Multi-Blockchain Support',
      subtitle: '30+ Networks Monitored',
      component: <BlockchainSlide />
    },
    {
      id: 'cases',
      title: 'Case Management',
      subtitle: 'Organized Investigation Workflow',
      component: <CaseManagementSlide />
    },
    {
      id: 'monitoring',
      title: 'Wallet Address Monitoring',
      subtitle: 'Real-time Transaction Tracking',
      component: <MonitoringSlide />
    },
    {
      id: 'analysis',
      title: 'Detailed Wallet Analysis',
      subtitle: 'Transaction History & Patterns',
      component: <AnalysisSlide />
    },
    {
      id: 'benefits',
      title: 'Key Benefits',
      subtitle: 'Operational Advantages for CPIB',
      component: <BenefitsSlide />
    },
    {
      id: 'next-steps',
      title: 'Next Steps',
      subtitle: 'Implementation & Deployment',
      component: <NextStepsSlide />
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">CPIB Presentation</span>
          </div>
          
          {/* Slide Progress */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentSlide + 1} / {slides.length}
            </span>
            <div className="flex gap-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Slide Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{slides[currentSlide].title}</h1>
          <p className="text-xl text-muted-foreground">{slides[currentSlide].subtitle}</p>
        </div>
        
        <div className="animate-fade-in">
          {slides[currentSlide].component}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <Card className="px-4 py-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={prevSlide} disabled={currentSlide === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm font-medium">
              {slides[currentSlide].title}
            </span>
            <Button variant="ghost" size="sm" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Individual Slide Components
const TitleSlide = () => (
  <div className="text-center space-y-8">
    <div className="bg-gradient-to-r from-primary to-primary-hover rounded-full w-24 h-24 mx-auto flex items-center justify-center">
      <Shield className="h-12 w-12 text-primary-foreground" />
    </div>
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Advanced Blockchain Investigation Platform</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Empowering CPIB with comprehensive cryptocurrency monitoring, 
        investigation tools, and real-time asset tracking capabilities.
      </p>
    </div>
    <div className="flex justify-center gap-6 mt-8">
      <Badge variant="secondary" className="px-4 py-2">Multi-Blockchain</Badge>
      <Badge variant="secondary" className="px-4 py-2">Real-time Monitoring</Badge>
      <Badge variant="secondary" className="px-4 py-2">Investigation Tools</Badge>
    </div>
  </div>
);

const ProblemSlide = () => (
  <div className="grid lg:grid-cols-2 gap-8 items-center">
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Investigation Challenges</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning mt-1" />
          <div>
            <h4 className="font-medium">Multiple Blockchain Networks</h4>
            <p className="text-muted-foreground">Assets spread across 30+ different networks</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-warning mt-1" />
          <div>
            <h4 className="font-medium">Real-time Monitoring</h4>
            <p className="text-muted-foreground">Need for instant transaction alerts</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-warning mt-1" />
          <div>
            <h4 className="font-medium">Complex Case Management</h4>
            <p className="text-muted-foreground">Multiple cases with numerous addresses</p>
          </div>
        </div>
      </div>
    </div>
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Investigation Complexity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span>Bitcoin</span>
          <Badge>₿ 1.2M addresses</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span>Ethereum</span>
          <Badge>⧫ 800K addresses</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span>Other Networks</span>
          <Badge>🔗 28+ chains</Badge>
        </div>
      </CardContent>
    </Card>
  </div>
);

const SolutionSlide = () => (
  <div className="grid lg:grid-cols-3 gap-6">
    <Card className="p-6 text-center">
      <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
      <p className="text-muted-foreground">
        Continuous surveillance of wallet addresses across multiple blockchains
      </p>
    </Card>
    <Card className="p-6 text-center">
      <Search className="h-12 w-12 text-primary mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Advanced Investigation</h3>
      <p className="text-muted-foreground">
        Detailed transaction analysis and pattern recognition tools
      </p>
    </Card>
    <Card className="p-6 text-center">
      <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Secure Case Management</h3>
      <p className="text-muted-foreground">
        Organized workflow for multiple investigations and evidence tracking
      </p>
    </Card>
  </div>
);

const DashboardSlide = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 text-center">
        <Wallet className="h-8 w-8 text-primary mx-auto mb-2" />
        <div className="text-2xl font-bold">247</div>
        <div className="text-sm text-muted-foreground">Monitored Wallets</div>
      </Card>
      <Card className="p-4 text-center">
        <Activity className="h-8 w-8 text-success mx-auto mb-2" />
        <div className="text-2xl font-bold">1,423</div>
        <div className="text-sm text-muted-foreground">Recent Activities</div>
      </Card>
      <Card className="p-4 text-center">
        <Users className="h-8 w-8 text-warning mx-auto mb-2" />
        <div className="text-2xl font-bold">18</div>
        <div className="text-sm text-muted-foreground">Active Cases</div>
      </Card>
      <Card className="p-4 text-center">
        <TrendingUp className="h-8 w-8 text-danger mx-auto mb-2" />
        <div className="text-2xl font-bold">$2.4M</div>
        <div className="text-sm text-muted-foreground">Total Value</div>
      </Card>
    </div>
    
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Key Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <span>Real-time transaction alerts</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <span>Multi-blockchain support</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <span>Case-based organization</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <span>Detailed analytics</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const BlockchainSlide = () => {
  const blockchains = [
    { name: 'Bitcoin', symbol: '₿', color: 'text-orange-500' },
    { name: 'Ethereum', symbol: '⧫', color: 'text-blue-500' },
    { name: 'Litecoin', symbol: 'Ł', color: 'text-gray-500' },
    { name: 'Ripple', symbol: 'XRP', color: 'text-blue-400' },
    { name: 'Cardano', symbol: 'ADA', color: 'text-blue-600' },
    { name: 'Polygon', symbol: 'MATIC', color: 'text-purple-500' },
    { name: 'BSC', symbol: 'BNB', color: 'text-yellow-500' },
    { name: 'Solana', symbol: 'SOL', color: 'text-purple-400' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Globe className="h-16 w-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Multi-Blockchain Coverage</h3>
        <p className="text-muted-foreground">Supporting 30+ blockchain networks for comprehensive monitoring</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {blockchains.map((blockchain, index) => (
          <Card key={index} className="p-4 text-center hover:shadow-lg transition-shadow">
            <div className={`text-3xl font-bold mb-2 ${blockchain.color}`}>
              {blockchain.symbol}
            </div>
            <div className="font-medium">{blockchain.name}</div>
          </Card>
        ))}
      </div>
      
      <Card className="p-6">
        <CardContent>
          <div className="flex items-center justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">30+</div>
              <div className="text-muted-foreground">Blockchain Networks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success">24/7</div>
              <div className="text-muted-foreground">Monitoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-warning">Real-time</div>
              <div className="text-muted-foreground">Updates</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CaseManagementSlide = () => (
  <div className="grid lg:grid-cols-2 gap-8">
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Organized Investigation Workflow</h3>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">1</div>
            <div>
              <h4 className="font-medium">Create New Case</h4>
              <p className="text-sm text-muted-foreground">Initialize investigation with case details</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">2</div>
            <div>
              <h4 className="font-medium">Add Wallet Addresses</h4>
              <p className="text-sm text-muted-foreground">Link relevant addresses to the case</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">3</div>
            <div>
              <h4 className="font-medium">Monitor & Analyze</h4>
              <p className="text-sm text-muted-foreground">Track transactions and gather evidence</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
    
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Active Cases Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Money Laundering Investigation</div>
            <div className="text-sm text-muted-foreground">15 addresses monitored</div>
          </div>
          <Badge variant="destructive">High Priority</Badge>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Crypto Fraud Case #2024-A</div>
            <div className="text-sm text-muted-foreground">8 addresses monitored</div>
          </div>
          <Badge variant="secondary">Medium Priority</Badge>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Asset Recovery Operation</div>
            <div className="text-sm text-muted-foreground">23 addresses monitored</div>
          </div>
          <Badge variant="secondary">Active</Badge>
        </div>
      </CardContent>
    </Card>
  </div>
);

const MonitoringSlide = () => (
  <div className="space-y-6">
    <div className="text-center">
      <Eye className="h-16 w-16 text-primary mx-auto mb-4" />
      <h3 className="text-2xl font-semibold mb-2">Real-time Transaction Monitoring</h3>
      <p className="text-muted-foreground">Instant alerts and comprehensive tracking</p>
    </div>
    
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <div className="font-medium">Incoming Transaction</div>
              <div className="text-sm text-muted-foreground">0x1234...5678</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-success">+1.5 ETH</div>
              <div className="text-xs text-muted-foreground">2 min ago</div>
            </div>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <div className="font-medium">Outgoing Transaction</div>
              <div className="text-sm text-muted-foreground">0x9876...4321</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-danger">-0.8 BTC</div>
              <div className="text-xs text-muted-foreground">15 min ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alert Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Large transactions (>$10K)</span>
            <Badge variant="destructive">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>New address interactions</span>
            <Badge variant="secondary">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Suspicious patterns</span>
            <Badge variant="destructive">Enabled</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const AnalysisSlide = () => (
  <div className="space-y-6">
    <div className="text-center">
      <Search className="h-16 w-16 text-primary mx-auto mb-4" />
      <h3 className="text-2xl font-semibold mb-2">Detailed Wallet Analysis</h3>
      <p className="text-muted-foreground">Comprehensive transaction history and pattern analysis</p>
    </div>
    
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="p-6 text-center">
        <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
        <h4 className="text-lg font-semibold mb-2">Transaction History</h4>
        <p className="text-muted-foreground">Complete chronological record of all transactions</p>
      </Card>
      
      <Card className="p-6 text-center">
        <TrendingUp className="h-12 w-12 text-success mx-auto mb-4" />
        <h4 className="text-lg font-semibold mb-2">Pattern Analysis</h4>
        <p className="text-muted-foreground">Automated detection of suspicious patterns</p>
      </Card>
      
      <Card className="p-6 text-center">
        <Globe className="h-12 w-12 text-warning mx-auto mb-4" />
        <h4 className="text-lg font-semibold mb-2">Network Mapping</h4>
        <p className="text-muted-foreground">Visualization of transaction flows and connections</p>
      </Card>
    </div>
    
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Analysis Capabilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <span>Balance tracking over time</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <span>Transaction frequency analysis</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <span>Connected address discovery</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <span>Risk assessment scoring</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const BenefitsSlide = () => (
  <div className="grid lg:grid-cols-2 gap-8">
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Operational Benefits</h3>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-6 w-6 text-success mt-1" />
            <div>
              <h4 className="font-medium">Enhanced Investigation Efficiency</h4>
              <p className="text-sm text-muted-foreground">Reduce investigation time by 70% with automated monitoring</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h4 className="font-medium">Improved Evidence Quality</h4>
              <p className="text-sm text-muted-foreground">Comprehensive audit trails and detailed transaction records</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Users className="h-6 w-6 text-warning mt-1" />
            <div>
              <h4 className="font-medium">Multi-Case Management</h4>
              <p className="text-sm text-muted-foreground">Handle multiple investigations simultaneously</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
    
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Technical Advantages</h3>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Globe className="h-6 w-6 text-blue-500 mt-1" />
            <div>
              <h4 className="font-medium">Comprehensive Coverage</h4>
              <p className="text-sm text-muted-foreground">Monitor 30+ blockchain networks from single platform</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Activity className="h-6 w-6 text-danger mt-1" />
            <div>
              <h4 className="font-medium">Real-time Alerts</h4>
              <p className="text-sm text-muted-foreground">Instant notifications for suspicious activities</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <BarChart3 className="h-6 w-6 text-purple-500 mt-1" />
            <div>
              <h4 className="font-medium">Advanced Analytics</h4>
              <p className="text-sm text-muted-foreground">Pattern recognition and risk assessment tools</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

const NextStepsSlide = () => (
  <div className="text-center space-y-8">
    <div>
      <h3 className="text-2xl font-semibold mb-4">Ready for Implementation</h3>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        The CPIB Crypto Asset Monitoring System is ready for deployment and can be customized to meet specific operational requirements.
      </p>
    </div>
    
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="p-6 text-center">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-6 w-6 text-primary-foreground" />
        </div>
        <h4 className="text-lg font-semibold mb-2">Phase 1</h4>
        <p className="text-muted-foreground">System deployment and initial configuration</p>
      </Card>
      
      <Card className="p-6 text-center">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-6 w-6 text-primary-foreground" />
        </div>
        <h4 className="text-lg font-semibold mb-2">Phase 2</h4>
        <p className="text-muted-foreground">Team training and workflow integration</p>
      </Card>
      
      <Card className="p-6 text-center">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-6 w-6 text-primary-foreground" />
        </div>
        <h4 className="text-lg font-semibold mb-2">Phase 3</h4>
        <p className="text-muted-foreground">Full operational deployment and optimization</p>
      </Card>
    </div>
    
    <div className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground rounded-lg p-8">
      <h4 className="text-xl font-semibold mb-2">Contact Information</h4>
      <p className="mb-4">Ready to enhance your cryptocurrency investigation capabilities?</p>
      <Button variant="secondary" size="lg">
        Schedule Implementation Discussion
      </Button>
    </div>
  </div>
);

export default PresentationSlides;