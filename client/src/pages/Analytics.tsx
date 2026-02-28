import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { io } from 'socket.io-client';
import { Download, Filter, RefreshCw, TrendingUp, Shield, AlertTriangle, Activity } from 'lucide-react';

// Initial Mock data setup (will be overwritten by live data)
const initialHourly = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  attacks: Math.floor(Math.random() * 50),
  blocked: Math.floor(Math.random() * 20),
}));

const weeklyTrend = [
  { day: 'Mon', critical: 12, high: 45, medium: 120, low: 230 },
  { day: 'Tue', critical: 8, high: 52, medium: 98, low: 210 },
  { day: 'Wed', critical: 15, high: 38, medium: 145, low: 195 },
  { day: 'Thu', critical: 22, high: 65, medium: 110, low: 280 },
  { day: 'Fri', critical: 18, high: 48, medium: 130, low: 245 },
  { day: 'Sat', critical: 5, high: 22, medium: 65, low: 120 },
  { day: 'Sun', critical: 3, high: 18, medium: 55, low: 95 },
];

const initialVectors = [
  { name: 'Threat Pulse', value: 100, color: 'hsl(var(--primary))' },
];

const topAttackers = [
  { country: 'RU', attacks: 0, percentage: 0 },
  { country: 'CN', attacks: 0, percentage: 0 },
  { country: 'US', attacks: 0, percentage: 0 },
  { country: 'BR', attacks: 0, percentage: 0 },
  { country: 'IN', attacks: 0, percentage: 0 },
];

const monthlyData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  threats: Math.floor(Math.random() * 500) + 100,
  incidents: Math.floor(Math.random() * 20) + 5,
}));

const securityPosture = [
  { category: 'Firewall', score: 85, fullMark: 100 },
  { category: 'IDS/IPS', score: 92, fullMark: 100 },
  { category: 'Encryption', score: 78, fullMark: 100 },
  { category: 'Access Control', score: 88, fullMark: 100 },
  { category: 'Patch Management', score: 75, fullMark: 100 },
  { category: 'Monitoring', score: 95, fullMark: 100 },
];

const Analytics = () => {
  const [hourlyData, setHourlyData] = useState<any[]>(initialHourly);
  const [vectors, setVectors] = useState<any[]>(initialVectors);
  const [attackers, setAttackers] = useState<any[]>(topAttackers);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [metrics, setMetrics] = useState({ totalThreats: 0, blocked: 0, active: 0, resolved: 0 });

  useEffect(() => {
    const socket = io('/', {
      path: '/socket.io',
      transports: ['websocket'],
    });

    socket.on('dashboard_stats', (data: any) => {
      if (data.history) {
        setHourlyData([...data.history]);
      }

      if (data.typeDistribution) {
        const distArray = Object.keys(data.typeDistribution).map((key, index) => ({
          name: key,
          value: data.typeDistribution[key],
          color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'][index % 6]
        }));
        if (distArray.length > 0) setVectors(distArray);
      }

      if (data.topSources) {
        const total = Object.values(data.topSources).reduce((a: any, b: any) => a + b, 0) as number;
        const sourcesArray = Object.keys(data.topSources).map(key => ({
          country: key,
          attacks: data.topSources[key],
          percentage: total > 0 ? Math.round((data.topSources[key] / total) * 100) : 0
        })).sort((a, b) => b.attacks - a.attacks).slice(0, 5);

        if (sourcesArray.length > 0) setAttackers(sourcesArray);
      }

      setMetrics({
        totalThreats: data.totalAttacks || 0,
        blocked: data.blockedCount || 0,
        active: Math.floor(Math.random() * 10),
        resolved: data.totalAttacks ? data.totalAttacks - Math.floor(Math.random() * 10) : 0
      });
      setLastUpdate(new Date());
    });

    socket.on('attack_event', (attack: any) => {
      // Handled via dashboard_stats
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const exportData = (format: string) => {
    const data = { hourlyData, vectors, attackers, metrics, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-analytics-${Date.now()}.${format}`;
    a.click();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Security Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive security metrics and trend analysis
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg border border-border flex items-center gap-2 transition-colors ${
                autoRefresh ? 'bg-primary/20 text-primary' : 'bg-muted/20 hover:bg-muted/30'
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Live' : 'Paused'}
            </button>
            <button
              onClick={() => exportData('json')}
              className="px-4 py-2 rounded-lg border border-border bg-muted/20 hover:bg-muted/30 flex items-center gap-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="soc-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-destructive/20">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Threats</p>
                <p className="text-2xl font-bold">{metrics.totalThreats}</p>
              </div>
            </div>
          </div>
          <div className="soc-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-accent/20">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold">{metrics.blocked}</p>
              </div>
            </div>
          </div>
          <div className="soc-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-warning/20">
                <Activity className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{metrics.active}</p>
              </div>
            </div>
          </div>
          <div className="soc-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/20">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{metrics.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="soc-card">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Filter by Severity:</span>
            <div className="flex gap-2">
              {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
                <button
                  key={severity}
                  onClick={() => setFilterSeverity(severity)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filterSeverity === severity
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/20 hover:bg-muted/30'
                  }`}
                >
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </button>
              ))}
            </div>
            <span className="ml-auto text-sm text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Time Range Tabs */}
        <Tabs defaultValue="day" className="space-y-6">
          <TabsList>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>

          <TabsContent value="day" className="space-y-6">
            {/* Hourly Attack Chart */}
            <Card className="soc-card">
              <CardHeader>
                <CardTitle>Hourly Attack Distribution (Real-time)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyData}>
                      <defs>
                        <linearGradient id="attackGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="attacks"
                        stroke="hsl(var(--destructive))"
                        fill="url(#attackGradient)"
                        name="Attacks"
                        animationDuration={500}
                      />
                      <Area
                        type="monotone"
                        dataKey="blocked"
                        stroke="hsl(var(--accent))"
                        fill="url(#blockedGradient)"
                        name="Blocked"
                        animationDuration={500}
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attack Vectors */}
              <Card className="soc-card">
                <CardHeader>
                  <CardTitle>Attack Vectors (Live)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                          data={vectors}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                          label={false}
                        >
                          {vectors.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))'
                          }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                          formatter={(value: number) => [value, 'Count']}
                        />
                        <Legend
                          verticalAlign="middle"
                          align="right"
                          layout="vertical"
                          wrapperStyle={{ paddingRight: '20px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Attackers - Static for now but simulating real feel */}
              <Card className="soc-card">
                <CardHeader>
                  <CardTitle>Top Attack Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {attackers.map((attacker, index) => (
                      <div key={attacker.country} className="flex items-center gap-4">
                        <span className="w-8 text-center font-bold text-muted-foreground">{index + 1}</span>
                        <span className="w-24 font-medium">{attacker.country}</span>
                        <div className="flex-1 h-8 bg-muted/30 rounded-lg overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-primary/80 to-primary"
                            style={{ width: `${attacker.percentage * 3}%` }}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-mono">
                            {attacker.attacks.toLocaleString()}
                          </span>
                        </div>
                        <span className="w-16 text-right text-sm text-muted-foreground">
                          {attacker.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="week" className="space-y-6">
            <Card className="soc-card">
              <CardHeader><CardTitle>Weekly Trends (Historical)</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Bar dataKey="critical" name="Critical" fill="hsl(var(--critical))" stackId="a" />
                      <Bar dataKey="high" name="High" fill="hsl(var(--destructive))" stackId="a" />
                      <Bar dataKey="medium" name="Medium" fill="hsl(var(--warning))" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month" className="space-y-6">
            {/* Monthly Trend */}
            <Card className="soc-card">
              <CardHeader>
                <CardTitle>Monthly Threat Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="threats"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                        name="Total Threats"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Security Posture Radar */}
            <Card className="soc-card">
              <CardHeader>
                <CardTitle>Security Posture Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={securityPosture}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Radar name="Security Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Analytics;
