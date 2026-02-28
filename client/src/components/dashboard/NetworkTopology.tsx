import React, { useState, useEffect } from 'react';

const NetworkTopology = () => {
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = [
    { id: 'fw1', label: 'Firewall', x: 200, y: 80, status: 'healthy', type: 'firewall', ip: '192.168.1.1' },
    { id: 'router1', label: 'Router', x: 100, y: 150, status: 'healthy', type: 'router', ip: '192.168.1.254' },
    { id: 'server1', label: 'Web Server', x: 300, y: 150, status: 'warning', type: 'server', ip: '192.168.1.10' },
    { id: 'db1', label: 'Database', x: 350, y: 220, status: 'healthy', type: 'server', ip: '192.168.1.20' },
    { id: 'pc1', label: 'PC-001', x: 50, y: 220, status: 'healthy', type: 'endpoint', ip: '192.168.1.101' },
    { id: 'pc2', label: 'PC-002', x: 150, y: 220, status: 'critical', type: 'endpoint', ip: '192.168.1.102' },
    { id: 'threat1', label: 'Threat', x: 250, y: 30, status: 'critical', type: 'threat', ip: 'External' },
  ];

  const connections = [
    ['fw1', 'router1'], ['fw1', 'server1'], ['server1', 'db1'],
    ['router1', 'pc1'], ['router1', 'pc2'], ['threat1', 'fw1']
  ];

  const getNodeColor = (status) => {
    switch (status) {
      case 'healthy': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getNodeIcon = (type) => {
    switch (type) {
      case 'firewall': return '🛡️';
      case 'router': return '📡';
      case 'server': return '🖥️';
      case 'endpoint': return '💻';
      case 'threat': return '⚠️';
      default: return '📱';
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  return (
    <div className="soc-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Network Topology</h3>
        <p className="text-sm text-muted-foreground">Interactive network infrastructure map</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Left side - Network Diagram */}
        <div className="space-y-2">
          <div className="relative border border-border rounded-lg bg-card p-4" style={{ height: '300px' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
              {/* Draw connections */}
              {connections.map(([from, to], index) => {
                const fromNode = nodes.find(n => n.id === from);
                const toNode = nodes.find(n => n.id === to);
                return (
                  <line
                    key={index}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#64748b"
                    strokeWidth="2"
                    strokeDasharray={fromNode.type === 'threat' || toNode.type === 'threat' ? '5,5' : 'none'}
                  />
                );
              })}
              
              {/* Draw nodes */}
              {nodes.map(node => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={getNodeColor(node.status)}
                    stroke="#1f2937"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleNodeClick(node)}
                  />
                  <text
                    x={node.x}
                    y={node.y + 38}
                    textAnchor="middle"
                    className="text-xs fill-current text-foreground font-medium"
                    style={{ fontSize: '11px' }}
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="text-sm"
                  >
                    {getNodeIcon(node.type)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          
          {selectedNode && (
            <div className="p-3 border border-border rounded-lg bg-muted/30">
              <div className="text-center mb-2">
                <div className="text-xl mb-1">{getNodeIcon(selectedNode.type)}</div>
                <h4 className="font-semibold text-sm">{selectedNode.label}</h4>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="capitalize">{selectedNode.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`capitalize font-medium ${
                    selectedNode.status === 'healthy' ? 'text-green-500' :
                    selectedNode.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>IP:</span>
                  <span className="font-mono">{selectedNode.ip}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right side - Network Stats */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/30 p-3 rounded-lg border border-border text-center">
              <div className="text-2xl font-bold text-green-500">7</div>
              <div className="text-xs text-muted-foreground">Active Nodes</div>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg border border-border text-center">
              <div className="text-2xl font-bold text-red-500">2</div>
              <div className="text-xs text-muted-foreground">Threats</div>
            </div>
          </div>
          
          <div className="bg-muted/30 p-3 rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2">Network Health</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Bandwidth Usage</span>
                <span className="text-green-500">67%</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{width: '67%'}}></div>
              </div>
              <div className="flex justify-between text-xs">
                <span>Latency</span>
                <span className="text-yellow-500">45ms</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5">
                <div className="bg-yellow-500 h-1.5 rounded-full" style={{width: '45%'}}></div>
              </div>
              <div className="flex justify-between text-xs">
                <span>Packet Loss</span>
                <span className="text-green-500">0.1%</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{width: '10%'}}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 p-3 rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2">Recent Activity</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>🟢 Router1 Online</span>
                <span className="text-muted-foreground">2m ago</span>
              </div>
              <div className="flex justify-between">
                <span>🟡 Server1 Warning</span>
                <span className="text-muted-foreground">5m ago</span>
              </div>
              <div className="flex justify-between">
                <span>🔴 Threat Detected</span>
                <span className="text-muted-foreground">8m ago</span>
              </div>
              <div className="flex justify-between">
                <span>🟢 PC-001 Connected</span>
                <span className="text-muted-foreground">12m ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Features */}
      <div className="grid grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2 p-2 bg-muted/20 rounded border border-border">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Healthy (5)</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-muted/20 rounded border border-border">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Warning (1)</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-muted/20 rounded border border-border">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Critical (1)</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-muted/20 rounded border border-border">
          <span>📊</span>
          <span>6 Connections</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkTopology;