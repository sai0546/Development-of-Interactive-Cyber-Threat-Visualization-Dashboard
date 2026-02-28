import React, { useState, useEffect } from 'react';

const SecurityMetricsDashboard = () => {
  const [metrics, setMetrics] = useState({
    firewall: 87,
    ids: 92,
    antivirus: 78,
    encryption: 95,
    authentication: 88,
    patching: 73
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshMetrics = () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      setMetrics({
        firewall: Math.floor(Math.random() * 30) + 70,
        ids: Math.floor(Math.random() * 30) + 70,
        antivirus: Math.floor(Math.random() * 30) + 70,
        encryption: Math.floor(Math.random() * 30) + 70,
        authentication: Math.floor(Math.random() * 30) + 70,
        patching: Math.floor(Math.random() * 30) + 70
      });
      setIsRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        firewall: Math.min(100, Math.max(60, prev.firewall + (Math.random() - 0.5) * 5)),
        ids: Math.min(100, Math.max(60, prev.ids + (Math.random() - 0.5) * 5)),
        antivirus: Math.min(100, Math.max(60, prev.antivirus + (Math.random() - 0.5) * 5)),
        encryption: Math.min(100, Math.max(60, prev.encryption + (Math.random() - 0.5) * 5)),
        authentication: Math.min(100, Math.max(60, prev.authentication + (Math.random() - 0.5) * 5)),
        patching: Math.min(100, Math.max(60, prev.patching + (Math.random() - 0.5) * 5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getColor = (value) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 75) return 'bg-yellow-500';
    if (value >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTextColor = (value) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 75) return 'text-yellow-500';
    if (value >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const metricsList = [
    { key: 'firewall', label: 'Firewall Protection', icon: '🛡️' },
    { key: 'ids', label: 'Intrusion Detection', icon: '🔍' },
    { key: 'antivirus', label: 'Antivirus Coverage', icon: '🦠' },
    { key: 'encryption', label: 'Data Encryption', icon: '🔐' },
    { key: 'authentication', label: 'Authentication', icon: '🔑' },
    { key: 'patching', label: 'Patch Management', icon: '🔧' }
  ];

  const overallScore = Math.round(
    Object.values(metrics).reduce((a, b) => a + b, 0) / Object.values(metrics).length
  );

  return (
    <div className="soc-card">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>📊</span>
              Security Metrics
            </h3>
            <p className="text-sm text-muted-foreground">Live security posture monitoring</p>
          </div>
          <button
            onClick={refreshMetrics}
            disabled={isRefreshing}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              isRefreshing 
                ? 'bg-gray-500 text-white cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      <div className="mb-4 p-4 bg-muted/20 rounded-lg border border-border text-center">
        <div className={`text-4xl font-bold ${getTextColor(overallScore)}`}>
          {overallScore}%
        </div>
        <div className="text-sm text-muted-foreground mt-1">Overall Security Score</div>
        <div className="w-full bg-border rounded-full h-2 mt-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${getColor(overallScore)}`}
            style={{ width: `${overallScore}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        {metricsList.map(({ key, label, icon }) => (
          <div key={key} className="p-3 bg-muted/10 rounded border border-border">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span>{icon}</span>
                <span className="text-sm font-medium">{label}</span>
              </div>
              <span className={`text-sm font-bold ${getTextColor(Math.round(metrics[key]))}`}>
                {Math.round(metrics[key])}%
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${getColor(metrics[key])}`}
                style={{ width: `${metrics[key]}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border grid grid-cols-3 gap-2 text-xs text-center">
        <div>
          <div className="font-bold text-green-500">
            {Object.values(metrics).filter(v => v >= 90).length}
          </div>
          <div className="text-muted-foreground">Excellent</div>
        </div>
        <div>
          <div className="font-bold text-yellow-500">
            {Object.values(metrics).filter(v => v >= 75 && v < 90).length}
          </div>
          <div className="text-muted-foreground">Good</div>
        </div>
        <div>
          <div className="font-bold text-red-500">
            {Object.values(metrics).filter(v => v < 75).length}
          </div>
          <div className="text-muted-foreground">Needs Attention</div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMetricsDashboard;