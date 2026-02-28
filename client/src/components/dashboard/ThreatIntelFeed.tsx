import React, { useState, useEffect } from 'react';

const ThreatIntelFeed = () => {
  const [threats, setThreats] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLive, setIsLive] = useState(true);

  const generateThreat = () => {
    const types = ['Malware', 'Phishing', 'Ransomware', 'DDoS', 'Data Breach', 'APT'];
    const sources = ['Dark Web', 'Honeypot', 'OSINT', 'Threat Feed', 'Internal'];
    const severities = ['low', 'medium', 'high', 'critical'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    return {
      id: Date.now() + Math.random(),
      type,
      source,
      severity,
      timestamp: new Date(),
      ioc: `${Math.random().toString(36).substring(7)}.threat.com`,
      confidence: Math.floor(Math.random() * 30) + 70
    };
  };

  useEffect(() => {
    const initialThreats = Array.from({ length: 6 }, generateThreat);
    setThreats(initialThreats);

    const interval = setInterval(() => {
      if (isLive) {
        const newThreat = generateThreat();
        setThreats(prev => [newThreat, ...prev].slice(0, 10));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredThreats = filter === 'all' 
    ? threats 
    : threats.filter(t => t.severity === filter);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-500 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className="soc-card">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>🎯</span>
              Threat Intelligence Feed
            </h3>
            <p className="text-sm text-muted-foreground">Real-time threat indicators</p>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              isLive 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}
          >
            {isLive ? '🟢 Live' : '⏸️ Paused'}
          </button>
        </div>
        
        <div className="p-2 bg-muted/20 rounded border border-border">
          <div className="flex gap-2 text-xs">
            {['all', 'critical', 'high', 'medium', 'low'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 rounded transition-colors ${
                  filter === f 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-muted/10 rounded border border-border mb-3" style={{ minHeight: '320px' }}>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {filteredThreats.length > 0 ? (
            filteredThreats.map(threat => (
              <div 
                key={threat.id}
                className={`p-2.5 rounded border ${getSeverityColor(threat.severity)}`}
              >
                <div className="grid grid-cols-2 gap-2 mb-1.5">
                  <div>
                    <div className="font-semibold text-sm">{threat.type}</div>
                    <div className="text-xs text-muted-foreground">{threat.source}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{threat.confidence}%</div>
                    <div className="text-xs text-muted-foreground">
                      {threat.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono text-muted-foreground bg-black/20 px-2 py-1 rounded">{threat.ioc}</div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
              No threats matching filter
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3 bg-muted/20 rounded border border-border">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-2 bg-red-500/10 rounded border border-red-500/20">
            <span className="text-sm font-medium">Critical</span>
            <span className="text-xl font-bold text-red-500">{threats.filter(t => t.severity === 'critical').length}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-orange-500/10 rounded border border-orange-500/20">
            <span className="text-sm font-medium">High</span>
            <span className="text-xl font-bold text-orange-500">{threats.filter(t => t.severity === 'high').length}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
            <span className="text-sm font-medium">Medium</span>
            <span className="text-xl font-bold text-yellow-500">{threats.filter(t => t.severity === 'medium').length}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/20">
            <span className="text-sm font-medium">Low</span>
            <span className="text-xl font-bold text-green-500">{threats.filter(t => t.severity === 'low').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatIntelFeed;