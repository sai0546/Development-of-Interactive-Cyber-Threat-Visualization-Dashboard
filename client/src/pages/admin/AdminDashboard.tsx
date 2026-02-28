import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Shield, Users, Activity, Lock, Database, AlertTriangle, Server, Cpu, HardDrive, Network, RefreshCw, X, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AdminDashboard = () => {
    const { user, isAdmin, token } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 0,
        logs: 0,
        apiKeys: 0
    });
    const [realtimeData, setRealtimeData] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [systemMetrics, setSystemMetrics] = useState({ cpu: 45, memory: 62, disk: 38, network: 71 });
    const [showHealthDialog, setShowHealthDialog] = useState(false);
    const [showLogsDialog, setShowLogsDialog] = useState(false);
    const [showApiDialog, setShowApiDialog] = useState(false);
    const [apiKeys, setApiKeys] = useState([
        { id: 1, name: 'Production API Key', key: 'sk_prod_••••••••••••••••••••1234', created: '2024-01-15', lastUsed: '2 hours ago', status: 'Active' },
        { id: 2, name: 'Development API Key', key: 'sk_dev_••••••••••••••••••••5678', created: '2024-02-01', lastUsed: '5 minutes ago', status: 'Active' }
    ]);
    const [newKeyGenerated, setNewKeyGenerated] = useState(null);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }

        // Fetch System Stats if API available
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/system-health', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    // Mocking some counts as data doesn't return count
                    setStats({
                        users: data.userCount || 0,
                        logs: 450,
                        apiKeys: 2
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();

        // Initialize realtime data
        const initialData = Array.from({ length: 10 }, (_, i) => ({
            time: `${i}m`,
            requests: Math.floor(Math.random() * 100) + 50,
            threats: Math.floor(Math.random() * 20)
        }));
        setRealtimeData(initialData);

        // Initialize activity logs
        const logTypes = ['User Login', 'Config Change', 'Security Alert', 'System Update', 'API Request'];
        const initialLogs = Array.from({ length: 8 }, (_, i) => ({
            id: i,
            type: logTypes[Math.floor(Math.random() * logTypes.length)],
            user: `user${Math.floor(Math.random() * 10)}`,
            timestamp: new Date(Date.now() - Math.random() * 3600000),
            status: Math.random() > 0.2 ? 'success' : 'warning'
        }));
        setActivityLogs(initialLogs.sort((a, b) => b.timestamp - a.timestamp));

        // Update realtime data
        const realtimeInterval = setInterval(() => {
            setRealtimeData(prev => {
                const newData = [...prev.slice(1), {
                    time: 'now',
                    requests: Math.floor(Math.random() * 100) + 50,
                    threats: Math.floor(Math.random() * 20)
                }];
                return newData.map((d, i) => ({ ...d, time: `${i}m` }));
            });

            setSystemMetrics({
                cpu: Math.floor(Math.random() * 30) + 40,
                memory: Math.floor(Math.random() * 20) + 55,
                disk: Math.floor(Math.random() * 15) + 35,
                network: Math.floor(Math.random() * 25) + 60
            });
        }, 3000);

        return () => clearInterval(realtimeInterval);
    }, [isAdmin, navigate, token]);

    const addActivityLog = (type) => {
        const newLog = {
            id: Date.now(),
            type,
            user: user?.email || 'admin',
            timestamp: new Date(),
            status: 'success'
        };
        setActivityLogs(prev => [newLog, ...prev].slice(0, 8));
    };

    const threatDistribution = [
        { name: 'Malware', value: 35, color: '#ff4444' },
        { name: 'Phishing', value: 28, color: '#ff8800' },
        { name: 'DDoS', value: 22, color: '#ffff00' },
        { name: 'Intrusion', value: 15, color: '#00ff88' }
    ];

    const generateApiKey = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const fullKey = 'sk_new_' + Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const maskedKey = 'sk_new_••••••••••••••••••••' + fullKey.slice(-4);
        
        const newKey = {
            id: Date.now(),
            name: `API Key ${apiKeys.length + 1}`,
            key: maskedKey,
            created: new Date().toISOString().split('T')[0],
            lastUsed: 'Never',
            status: 'Active'
        };
        
        setApiKeys(prev => [...prev, newKey]);
        setNewKeyGenerated(fullKey);
        setStats(prev => ({ ...prev, apiKeys: prev.apiKeys + 1 }));
        addActivityLog('Generated New API Key');
        
        setTimeout(() => setNewKeyGenerated(null), 30000);
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            System Administration & Control Panel
                        </p>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium">
                        Admin Access Granted
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Users"
                        value={stats.users}
                        icon={Users}
                        variant="primary"
                    />
                    <StatCard
                        title="System Logs"
                        value={stats.logs}
                        icon={Database}
                        variant="default"
                    />
                    <StatCard
                        title="Active API Keys"
                        value={stats.apiKeys}
                        icon={Lock}
                        variant="accent"
                    />
                    <StatCard
                        title="Security Alerts"
                        value={5}
                        icon={AlertTriangle}
                        variant="destructive"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="soc-card space-y-4">
                        <h3 className="text-xl font-semibold">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => { navigate('/admin/users'); addActivityLog('User Management'); }} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors flex flex-col items-center gap-2">
                                <Users className="h-6 w-6 text-primary" />
                                <span>Manage Users</span>
                            </button>
                            <button onClick={() => { setShowHealthDialog(true); addActivityLog('System Health Check'); }} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors flex flex-col items-center gap-2">
                                <Activity className="h-6 w-6 text-accent" />
                                <span>System Health</span>
                            </button>
                            <button onClick={() => { setShowLogsDialog(true); addActivityLog('View Logs'); }} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors flex flex-col items-center gap-2">
                                <Database className="h-6 w-6 text-warning" />
                                <span>View Logs</span>
                            </button>
                            <button onClick={() => { setShowApiDialog(true); addActivityLog('API Key Access'); }} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors flex flex-col items-center gap-2">
                                <Lock className="h-6 w-6 text-destructive" />
                                <span>API Keys</span>
                            </button>
                        </div>
                    </div>

                    <div className="soc-card">
                        <h3 className="text-xl font-semibold mb-4">System Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span>Server Uptime</span>
                                <span className="font-mono text-primary">99.9%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Database Connection</span>
                                <span className="font-mono text-accent">Connected</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Redis Cache</span>
                                <span className="font-mono text-accent">Connected</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Last Backup</span>
                                <span className="font-mono text-muted-foreground">2 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real-time Monitoring */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="soc-card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Real-time Traffic</h3>
                            <RefreshCw className="h-4 w-4 text-accent animate-spin" />
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={realtimeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="time" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                                <Area type="monotone" dataKey="requests" stroke="#00ff88" fill="#00ff8833" name="Requests" />
                                <Area type="monotone" dataKey="threats" stroke="#ff4444" fill="#ff444433" name="Threats" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="soc-card">
                        <h3 className="text-xl font-semibold mb-4">Threat Distribution</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={threatDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={(entry) => `${entry.name}: ${entry.value}%`}>
                                    {threatDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1a1a1a', 
                                        border: '1px solid #333',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* System Metrics */}
                <div className="soc-card">
                    <h3 className="text-xl font-semibold mb-4">Live System Metrics</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-muted/20 rounded border border-border p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Cpu className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium">CPU Usage</span>
                            </div>
                            <div className="text-3xl font-bold text-primary">{systemMetrics.cpu}%</div>
                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${systemMetrics.cpu}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-muted/20 rounded border border-border p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Database className="h-5 w-5 text-accent" />
                                <span className="text-sm font-medium">Memory</span>
                            </div>
                            <div className="text-3xl font-bold text-accent">{systemMetrics.memory}%</div>
                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${systemMetrics.memory}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-muted/20 rounded border border-border p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <HardDrive className="h-5 w-5 text-warning" />
                                <span className="text-sm font-medium">Disk I/O</span>
                            </div>
                            <div className="text-3xl font-bold text-warning">{systemMetrics.disk}%</div>
                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div className="bg-warning h-2 rounded-full transition-all" style={{ width: `${systemMetrics.disk}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-muted/20 rounded border border-border p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Network className="h-5 w-5 text-info" />
                                <span className="text-sm font-medium">Network</span>
                            </div>
                            <div className="text-3xl font-bold text-info">{systemMetrics.network}%</div>
                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div className="bg-info h-2 rounded-full transition-all" style={{ width: `${systemMetrics.network}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Logs */}
                <div className="soc-card">
                    <h3 className="text-xl font-semibold mb-4">Recent Activity Logs</h3>
                    <div className="space-y-2">
                        {activityLogs.map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-3 bg-muted/20 rounded border border-border hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-accent' : 'bg-warning'}`}></div>
                                    <div>
                                        <div className="font-medium">{log.type}</div>
                                        <div className="text-sm text-muted-foreground">by {log.user}</div>
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {log.timestamp.toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health Dialog */}
                {showHealthDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-background border border-border rounded-lg p-6 w-full max-w-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">System Health Check</h2>
                                <button onClick={() => setShowHealthDialog(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-muted/20 rounded">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-accent" />
                                        <span>Web Server</span>
                                    </div>
                                    <span className="text-accent font-medium">Healthy</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/20 rounded">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-accent" />
                                        <span>Database</span>
                                    </div>
                                    <span className="text-accent font-medium">Connected</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/20 rounded">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-accent" />
                                        <span>Redis Cache</span>
                                    </div>
                                    <span className="text-accent font-medium">Running</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/20 rounded">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-accent" />
                                        <span>API Gateway</span>
                                    </div>
                                    <span className="text-accent font-medium">Operational</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/20 rounded">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-5 w-5 text-warning" />
                                        <span>Backup Service</span>
                                    </div>
                                    <span className="text-warning font-medium">Delayed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Logs Dialog */}
                {showLogsDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-background border border-border rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">System Logs</h2>
                                <button onClick={() => setShowLogsDialog(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {activityLogs.map((log) => (
                                    <div key={log.id} className="p-3 bg-muted/20 rounded border border-border font-mono text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">[{log.timestamp.toLocaleString()}]</span>
                                            <span className={log.status === 'success' ? 'text-accent' : 'text-warning'}>{log.status.toUpperCase()}</span>
                                            <span>{log.type}</span>
                                            <span className="text-muted-foreground">- {log.user}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* API Keys Dialog */}
                {showApiDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-background border border-border rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">API Keys Management</h2>
                                <button onClick={() => setShowApiDialog(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            
                            {newKeyGenerated && (
                                <div className="mb-4 p-4 bg-accent/10 border border-accent/20 rounded">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="h-5 w-5 text-accent" />
                                        <span className="font-medium text-accent">New API Key Generated!</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">Copy this key now. It won't be shown again.</p>
                                    <div className="font-mono text-sm bg-muted/30 p-2 rounded break-all">
                                        {newKeyGenerated}
                                    </div>
                                </div>
                            )}
                            
                            <div className="space-y-3">
                                {apiKeys.map((apiKey) => (
                                    <div key={apiKey.id} className="p-4 bg-muted/20 rounded border border-border">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">{apiKey.name}</span>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                apiKey.status === 'Active' ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
                                            }`}>{apiKey.status}</span>
                                        </div>
                                        <div className="font-mono text-sm bg-muted/30 p-2 rounded">
                                            {apiKey.key}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-2">
                                            Created: {apiKey.created} | Last used: {apiKey.lastUsed}
                                        </div>
                                    </div>
                                ))}
                                <button onClick={generateApiKey} className="w-full p-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                                    + Generate New API Key
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default AdminDashboard;
