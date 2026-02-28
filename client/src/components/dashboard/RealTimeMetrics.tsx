import React, { useState, useEffect } from 'react';

const RealTimeMetrics = () => {
  const [metrics, setMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 67,
    networkLoad: 23,
    threatLevel: 34,
    responseTime: 125,
    bandwidth: 156
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        networkLoad: Math.max(0, Math.min(100, prev.networkLoad + (Math.random() - 0.5) * 15)),
        threatLevel: Math.max(0, Math.min(100, prev.threatLevel + (Math.random() - 0.5) * 12)),
        responseTime: Math.max(50, Math.min(500, prev.responseTime + (Math.random() - 0.5) * 50)),
        bandwidth: Math.max(0, Math.min(1000, prev.bandwidth + (Math.random() - 0.5) * 100))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const createGauge = (value, max, label, color) => {
    const percentage = (value / max) * 100;
    const strokeDasharray = `${percentage * 2.51} 251`;
    
    return (
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-2">
          <svg width="96" height="96" className="transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="6"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold">{Math.round(value)}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    );
  };

  return (
    <div className="soc-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">System Metrics</h3>
        <p className="text-sm text-muted-foreground">Real-time performance monitoring</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {createGauge(metrics.cpuUsage, 100, 'CPU %', 'hsl(var(--destructive))')}
        {createGauge(metrics.memoryUsage, 100, 'Memory %', 'hsl(var(--warning))')}
        {createGauge(metrics.networkLoad, 100, 'Network %', 'hsl(var(--primary))')}
        {createGauge(metrics.threatLevel, 100, 'Threat Level', 'hsl(var(--destructive))')}
        {createGauge(metrics.responseTime, 500, 'Response ms', 'hsl(var(--accent))')}
        {createGauge(metrics.bandwidth, 1000, 'Bandwidth', 'hsl(var(--info))')}
      </div>
    </div>
  );
};

export default RealTimeMetrics;