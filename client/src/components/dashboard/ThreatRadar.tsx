import React, { useState, useEffect } from 'react';

const ThreatRadar = () => {
  const [data, setData] = useState([
    { category: 'Malware', current: 65, baseline: 45 },
    { category: 'Phishing', current: 78, baseline: 60 },
    { category: 'DDoS', current: 45, baseline: 30 },
    { category: 'SQL Injection', current: 32, baseline: 25 },
    { category: 'XSS', current: 28, baseline: 20 },
    { category: 'Brute Force', current: 55, baseline: 40 },
    { category: 'Ransomware', current: 42, baseline: 35 },
    { category: 'APT', current: 25, baseline: 15 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(item => ({
        ...item,
        current: Math.max(0, Math.min(100, item.current + (Math.random() - 0.5) * 10))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const createRadarChart = () => {
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 120;
    const levels = 5;
    
    const angleStep = (2 * Math.PI) / data.length;
    
    return (
      <svg width="300" height="300" className="mx-auto">
        {/* Grid circles */}
        {Array.from({ length: levels }, (_, i) => (
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={(maxRadius / levels) * (i + 1)}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
        
        {/* Grid lines */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = centerX + Math.cos(angle) * maxRadius;
          const y = centerY + Math.sin(angle) * maxRadius;
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}
        
        {/* Baseline polygon */}
        <polygon
          points={data.map((item, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const radius = (item.baseline / 100) * maxRadius;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            return `${x},${y}`;
          }).join(' ')}
          fill="hsl(var(--muted))"
          fillOpacity="0.2"
          stroke="hsl(var(--muted))"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Current threat polygon */}
        <polygon
          points={data.map((item, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const radius = (item.current / 100) * maxRadius;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            return `${x},${y}`;
          }).join(' ')}
          fill="hsl(var(--destructive))"
          fillOpacity="0.3"
          stroke="hsl(var(--destructive))"
          strokeWidth="3"
        />
        
        {/* Labels */}
        {data.map((item, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = maxRadius + 20;
          const x = centerX + Math.cos(angle) * labelRadius;
          const y = centerY + Math.sin(angle) * labelRadius;
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-muted-foreground"
            >
              {item.category}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="soc-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Threat Intelligence Radar</h3>
        <p className="text-sm text-muted-foreground">Multi-dimensional threat analysis</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex items-center justify-center">
          {createRadarChart()}
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-muted/20 rounded border border-border">
            <h4 className="font-semibold text-sm mb-2">High Risk Categories</h4>
            {data
              .filter(item => item.current > 60)
              .sort((a, b) => b.current - a.current)
              .slice(0, 3)
              .map(item => (
                <div key={item.category} className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{item.category}</span>
                  <span className="text-destructive font-medium">{Math.round(item.current)}%</span>
                </div>
              ))}
          </div>
          
          <div className="p-3 bg-muted/20 rounded border border-border">
            <h4 className="font-semibold text-sm mb-2">Trending Up</h4>
            {data
              .filter(item => item.current > item.baseline + 10)
              .sort((a, b) => (b.current - b.baseline) - (a.current - a.baseline))
              .slice(0, 3)
              .map(item => (
                <div key={item.category} className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{item.category}</span>
                  <span className="text-warning font-medium">
                    +{Math.round(item.current - item.baseline)}%
                  </span>
                </div>
              ))}
          </div>
          
          <div className="p-3 bg-muted/20 rounded border border-border">
            <h4 className="font-semibold text-sm mb-2">Legend</h4>
            <div className="flex items-center gap-2 text-xs mb-1">
              <div className="w-3 h-1 bg-destructive"></div>
              <span>Current Level</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-1 bg-muted border border-muted-foreground" style={{borderStyle: 'dashed'}}></div>
              <span>Baseline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatRadar;