import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import ThreatMap from '@/components/dashboard/ThreatMap';
import AlertFeed from '@/components/dashboard/AlertFeed';
import AttackChart from '@/components/dashboard/AttackChart';
import AttackTypePie from '@/components/dashboard/AttackTypePie';
import TopSourcesTable from '@/components/dashboard/TopSourcesTable';
import SystemHealth from '@/components/dashboard/SystemHealth';
import RealTimeMetrics from '@/components/dashboard/RealTimeMetrics';
import NetworkTopology from '@/components/dashboard/NetworkTopology';
import SecurityTimeline from '@/components/dashboard/SecurityTimeline';
import ThreatRadar from '@/components/dashboard/ThreatRadar';
import AttackHeatmap from '@/components/dashboard/AttackHeatmap';
import VulnerabilityScanner from '@/components/dashboard/VulnerabilityScanner';
import DigitalForensics from '@/components/dashboard/DigitalForensics';
import ZeroTrustMonitor from '@/components/dashboard/ZeroTrustMonitor';
import CloudSecurity from '@/components/dashboard/CloudSecurity';
import SIEMAnalytics from '@/components/dashboard/SIEMAnalytics';
import ThreatIntelFeed from '@/components/dashboard/ThreatIntelFeed';
import SecurityMetricsDashboard from '@/components/dashboard/SecurityMetricsDashboard';
import {
  Shield,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Target,
  Zap,
} from 'lucide-react';
import { io } from 'socket.io-client';
import {
  generateThreats,
  generateAlerts,
  dashboardStats,
  Threat,
  Alert,
  getCountryCoordinates,
  threatTrendData,
} from '@/data/mockData';

const Dashboard = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState(dashboardStats);
  const [typeDistribution, setTypeDistribution] = useState<{ name: string; value: number; color?: string }[]>([]);
  const [topSources, setTopSources] = useState<{ country: string; attacks: number }[]>([]);
  const [trendData, setTrendData] = useState<any[]>(threatTrendData);

  useEffect(() => {
    // Initial load
    setThreats(generateThreats(50));
    setAlerts(generateAlerts(20));

    // Connect to WebSocket
    const socket = io('/', {
      path: '/socket.io',
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to CyberShield Live Feed');
    });

    socket.on('dashboard_stats', (data: any) => {
      setStats(prev => ({
        ...prev,
        totalThreats: data.totalThreats,
        activeThreats: data.activeThreats,
        blockedAttacks: data.blockedAttacks,
        criticalAlerts: data.criticalAlerts,
        systemHealth: data.systemHealth
      }));

      // Transform distribution for Pie Chart
      const distArray = Object.keys(data.typeDistribution).map((key, index) => ({
        name: key,
        value: data.typeDistribution[key],
        color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'][index % 6]
      }));
      setTypeDistribution(distArray);

      // Transform Top Sources for Table
      if (data.topSources) {
        const sourcesArray = Object.keys(data.topSources)
          .map(country => ({ country, attacks: data.topSources[country] }))
          .sort((a, b) => b.attacks - a.attacks)
          .slice(0, 5); // Top 5
        setTopSources(sourcesArray);
      }
    });

    socket.on('attack_event', (attack: any) => {
      const sourceCoords = getCountryCoordinates(attack.sourceCountry);
      const targetCoords = getCountryCoordinates(attack.destinationCountry);

      const newThreat: Threat = {
        id: attack.id,
        sourceCountry: attack.sourceCountry,
        targetCountry: attack.destinationCountry,
        type: attack.attackType,
        timestamp: new Date(attack.timestamp),
        status: 'active',
        sourceLat: sourceCoords[0],
        sourceLng: sourceCoords[1],
        targetLat: targetCoords[0],
        targetLng: targetCoords[1],
        severity: attack.severity,
        source: {
          ip: attack.ipFrom,
          country: attack.sourceCountry,
          lat: sourceCoords[0],
          lng: sourceCoords[1]
        },
        target: {
          ip: attack.ipTo,
          country: attack.destinationCountry,
          lat: targetCoords[0],
          lng: targetCoords[1]
        },
        mitreTactic: 'Initial Access',
        mitreId: 'T1078'
      };

      setThreats((prev) => [newThreat, ...prev].slice(0, 50));

      // Update Trend Data (Simulate real-time by adding to the last hour)
      setTrendData(prev => {
        const newData = [...prev];
        const lastIdx = newData.length - 1;
        const severityKey = attack.severity >= 9 ? 'critical' : attack.severity >= 7 ? 'high' : attack.severity >= 4 ? 'medium' : 'low';

        if (!newData[lastIdx][severityKey]) newData[lastIdx][severityKey] = 0;
        newData[lastIdx][severityKey]++;

        // Also fluctuate 'threats' count for visual effect if used
        if (!newData[lastIdx].threats) newData[lastIdx].threats = 0;
        newData[lastIdx].threats++;

        return newData;
      });

      // Also add an alert occasionally
      if (attack.severity > 7) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          title: `${attack.attackType} from ${attack.sourceCountry}`,
          severity: 'critical',
          timestamp: new Date(),
          description: `High severity attack detected targeting ${attack.destinationCountry}`
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 20));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Security Operations Center</h1>
            <p className="text-muted-foreground mt-1">
              Real-time threat monitoring and analysis
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent font-medium">All Systems Operational</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Threats"
            value={stats.totalThreats}
            icon={Shield}
            trend={{ value: 12, isPositive: false }}
            variant="primary"
          />
          <StatCard
            title="Active Threats"
            value={stats.activeThreats}
            icon={Target}
            trend={{ value: 5, isPositive: false }}
            variant="destructive"
          />
          <StatCard
            title="Blocked Attacks"
            value={stats.blockedAttacks}
            icon={ShieldCheck}
            trend={{ value: 18, isPositive: true }}
            variant="accent"
          />
          <StatCard
            title="System Health"
            value={`${stats.systemHealth}%`}
            icon={Activity}
            variant="primary"
          />
          <StatCard
            title="Critical Alerts"
            value={stats.criticalAlerts}
            icon={AlertTriangle}
            variant="destructive"
          />
          <StatCard
            title="Events/min"
            value={Math.floor(Math.random() * 500) + 200}
            icon={Zap}
            variant="warning"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Threat Map - Takes 2 columns */}
          <div className="xl:col-span-2">
            <ThreatMap threats={threats} />
          </div>

          {/* Alert Feed */}
          <div className="xl:col-span-1">
            <AlertFeed alerts={alerts} />
          </div>
        </div>

        {/* Network Topology - Full Width */}
        <div className="col-span-full">
          <NetworkTopology />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <AttackChart data={trendData} />
          </div>
          <AttackTypePie data={typeDistribution} />
        </div>

        {/* Advanced Features Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SecurityTimeline />
          <div className="soc-card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>🔎</span>
                Threat Hunting
              </h3>
              <p className="text-sm text-muted-foreground">Proactive threat detection</p>
            </div>
            <div className="space-y-3">
              <div className="p-3 border border-border rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Suspicious Processes</span>
                  <span className="text-red-500 text-xs font-bold">7 Active</span>
                </div>
                <div className="text-xs text-muted-foreground">powershell.exe, cmd.exe detected</div>
              </div>
              
              <div className="p-3 border border-border rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Network Anomalies</span>
                  <span className="text-yellow-500 text-xs font-bold">12 Detected</span>
                </div>
                <div className="text-xs text-muted-foreground">Unusual traffic patterns identified</div>
              </div>
              
              <div className="p-3 border border-border rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">File Integrity</span>
                  <span className="text-green-500 text-xs font-bold">All Clear</span>
                </div>
                <div className="text-xs text-muted-foreground">System files monitored and secure</div>
              </div>
              
              <div className="p-3 border border-border rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">User Behavior</span>
                  <span className="text-yellow-500 text-xs font-bold">3 Alerts</span>
                </div>
                <div className="text-xs text-muted-foreground">Unusual login patterns detected</div>
              </div>
              
              <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                <div className="text-xs text-green-500 font-medium">✅ Ready to hunt for threats</div>
              </div>
              
              <button className="w-full p-3 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors">
                🎯 Start Hunt Session
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RealTimeMetrics />
          <div className="soc-card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>📊</span>
                Advanced Analytics
              </h3>
              <p className="text-sm text-muted-foreground">AI-powered security insights</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 rounded border border-blue-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Threat Prediction</span>
                  <span className="text-blue-500 text-xs">ML Model</span>
                </div>
                <div className="text-2xl font-bold text-blue-500">High Risk</div>
                <div className="text-xs text-muted-foreground">Next 24h forecast</div>
              </div>
              
              <div className="p-4 bg-purple-500/10 rounded border border-purple-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Anomaly Detection</span>
                  <span className="text-purple-500 text-xs">AI Active</span>
                </div>
                <div className="text-2xl font-bold text-purple-500">3</div>
                <div className="text-xs text-muted-foreground">Anomalies detected</div>
              </div>
              
              <div className="p-4 bg-green-500/10 rounded border border-green-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Auto Response</span>
                  <span className="text-green-500 text-xs">Active</span>
                </div>
                <div className="text-2xl font-bold text-green-500">156</div>
                <div className="text-xs text-muted-foreground">Threats mitigated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Analysis Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThreatRadar />
          <AttackHeatmap />
        </div>

        {/* Forensics and Investigation Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DigitalForensics />
          <ZeroTrustMonitor />
        </div>

        {/* Cloud Security and SIEM Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CloudSecurity />
          <SIEMAnalytics />
        </div>

        {/* Security Tools Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VulnerabilityScanner />
          <div className="soc-card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Security Operations</h3>
              <p className="text-sm text-muted-foreground">Advanced security monitoring and controls</p>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 text-left border border-border rounded-lg hover:bg-accent/10 transition-colors">
                  <div className="font-medium text-sm">🔍 Deep Scan</div>
                  <div className="text-xs text-muted-foreground">Advanced threat hunting</div>
                </button>
                <button className="p-3 text-left border border-border rounded-lg hover:bg-accent/10 transition-colors">
                  <div className="font-medium text-sm">🚫 Auto Block</div>
                  <div className="text-xs text-muted-foreground">AI-powered blocking</div>
                </button>
                <button className="p-3 text-left border border-border rounded-lg hover:bg-accent/10 transition-colors">
                  <div className="font-medium text-sm">📊 AI Report</div>
                  <div className="text-xs text-muted-foreground">ML-generated insights</div>
                </button>
                <button className="p-3 text-left border border-border rounded-lg hover:bg-accent/10 transition-colors">
                  <div className="font-medium text-sm">⚡ Response</div>
                  <div className="text-xs text-muted-foreground">Automated response</div>
                </button>
              </div>
              
              <div className="p-3 bg-muted/20 rounded border border-border">
                <h4 className="font-medium text-sm mb-2">Threat Intelligence</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>🎯 Active IOCs:</span>
                    <span className="text-red-500 font-medium">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🌐 Dark Web Mentions:</span>
                    <span className="text-yellow-500 font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🤖 AI Confidence:</span>
                    <span className="text-green-500 font-medium">94%</span>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-muted/20 rounded border border-border">
                <h4 className="font-medium text-sm mb-2">Security Score</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '87%'}}></div>
                  </div>
                  <span className="text-green-500 font-bold text-sm">87/100</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Excellent security posture</div>
              </div>
            </div>
          </div>
        </div>

        {/* New Data Visualization Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThreatIntelFeed />
          <SecurityMetricsDashboard />
        </div>

        {/* Bottom Row - Enhanced */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopSourcesTable data={topSources} />
          <div className="grid grid-cols-1 gap-6">
            <SystemHealth />
            <div className="soc-card">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>🔒</span>
                  Security Posture
                </h3>
                <p className="text-sm text-muted-foreground">Overall security status</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-500/10 rounded border border-green-500/20 text-center">
                  <div className="text-xl font-bold text-green-500">94%</div>
                  <div className="text-xs text-muted-foreground">Compliance</div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20 text-center">
                  <div className="text-xl font-bold text-blue-500">87</div>
                  <div className="text-xs text-muted-foreground">Security Score</div>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded border border-yellow-500/20 text-center">
                  <div className="text-xl font-bold text-yellow-500">23</div>
                  <div className="text-xs text-muted-foreground">Open Issues</div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/20 text-center">
                  <div className="text-xl font-bold text-purple-500">156</div>
                  <div className="text-xs text-muted-foreground">Mitigated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
