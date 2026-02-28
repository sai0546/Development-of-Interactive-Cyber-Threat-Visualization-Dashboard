import React, { useState } from 'react';

const SIEMAnalytics = () => {
  const [eventsPerSecond, setEventsPerSecond] = useState(1247);
  const [correlationRules, setCorrelationRules] = useState(156);
  const [dataRetention, setDataRetention] = useState('90 Days');
  const [action, setAction] = useState('');

  const viewDashboard = () => {
    setAction('📊 Opening SIEM Dashboard...');
    
    setTimeout(() => {
      const newEvents = Math.floor(Math.random() * 1000) + 800;
      setEventsPerSecond(newEvents);
      setAction(`✅ Dashboard loaded! Current rate: ${newEvents} events/sec. ${correlationRules} rules active.`);
    }, 1500);
  };

  const queryLogs = () => {
    setAction('🔍 Querying log database...');
    
    setTimeout(() => {
      const results = Math.floor(Math.random() * 5000) + 1000;
      const newRules = Math.floor(Math.random() * 50) + 140;
      setCorrelationRules(newRules);
      setAction(`✅ Query complete! Found ${results} matching events. ${newRules} correlation rules triggered.`);
    }, 1800);
  };

  return (
    <div className="soc-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>📊</span>
          SIEM Analytics
        </h3>
        <p className="text-sm text-muted-foreground">Security information and event management</p>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-cyan-500/10 rounded border border-cyan-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Events/Second</span>
            <span className="text-cyan-500 text-xs font-bold">{eventsPerSecond.toLocaleString()}</span>
          </div>
          <div className="text-xs text-muted-foreground">Real-time log ingestion rate</div>
        </div>
        
        <div className="p-3 bg-indigo-500/10 rounded border border-indigo-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Correlation Rules</span>
            <span className="text-indigo-500 text-xs font-bold">{correlationRules} Active</span>
          </div>
          <div className="text-xs text-muted-foreground">MITRE ATT&CK framework mapping</div>
        </div>
        
        <div className="p-3 bg-pink-500/10 rounded border border-pink-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Data Retention</span>
            <span className="text-pink-500 text-xs font-bold">{dataRetention}</span>
          </div>
          <div className="text-xs text-muted-foreground">Hot storage: 30d, Cold: 60d</div>
        </div>
        
        {action && (
          <div className={`p-3 rounded border ${
            action.includes('...') 
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-500 animate-pulse' 
              : 'bg-green-500/10 border-green-500/20 text-green-500'
          }`}>
            <div className="text-xs font-medium">{action}</div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={viewDashboard}
            disabled={action.includes('...')}
            className={`p-2 rounded text-xs transition-colors ${
              action.includes('...') 
                ? 'bg-gray-500 text-white cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            📈 View Dashboard
          </button>
          <button 
            onClick={queryLogs}
            disabled={action.includes('...')}
            className={`p-2 rounded text-xs transition-colors ${
              action.includes('...') 
                ? 'bg-gray-500 text-white cursor-not-allowed' 
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            🔍 Query Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default SIEMAnalytics;