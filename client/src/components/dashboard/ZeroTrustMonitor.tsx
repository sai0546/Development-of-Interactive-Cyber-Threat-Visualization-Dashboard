import React, { useState } from 'react';

const ZeroTrustMonitor = () => {
  const [identityVerifications, setIdentityVerifications] = useState(247);
  const [trustScore, setTrustScore] = useState(92);
  const [violations, setViolations] = useState(7);
  const [accessRequests, setAccessRequests] = useState([
    { id: 1, user: 'john.doe@company.com', resource: 'Database Server', risk: 'Low', status: 'pending' },
    { id: 2, user: 'jane.smith@company.com', resource: 'Admin Panel', risk: 'Medium', status: 'pending' },
    { id: 3, user: 'unknown@external.com', resource: 'API Gateway', risk: 'High', status: 'pending' },
  ]);
  const [message, setMessage] = useState('');

  const handleAccess = (action, requestId) => {
    const request = accessRequests.find(r => r.id === requestId);
    
    if (action === 'grant') {
      setMessage(`✅ Access granted to ${request.user} for ${request.resource}`);
      setIdentityVerifications(prev => prev + 1);
      if (request.risk === 'Low') {
        setTrustScore(prev => Math.min(100, prev + 1));
      }
    } else {
      setMessage(`❌ Access denied to ${request.user} for ${request.resource}`);
      setViolations(prev => prev + 1);
      if (request.risk === 'High') {
        setTrustScore(prev => Math.max(0, prev - 2));
      }
    }
    
    setAccessRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: action === 'grant' ? 'granted' : 'denied', timestamp: new Date() } : r
    ));
    
    setTimeout(() => setMessage(''), 3000);
  };

  const pendingRequests = accessRequests.filter(r => r.status === 'pending');
  const processedRequests = accessRequests.filter(r => r.status !== 'pending');

  return (
    <div className="soc-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>🛡️</span>
          Zero Trust Monitor
        </h3>
        <p className="text-sm text-muted-foreground">Never trust, always verify</p>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Identity Verification</span>
            <span className="text-yellow-500 text-xs">{identityVerifications} Active</span>
          </div>
          <div className="text-xs text-muted-foreground">MFA, biometric, behavioral analysis</div>
        </div>
        
        <div className="p-3 bg-purple-500/10 rounded border border-purple-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Device Trust Score</span>
            <span className="text-purple-500 text-xs">{trustScore}/100</span>
          </div>
          <div className="text-xs text-muted-foreground">Endpoint compliance and health</div>
        </div>
        
        <div className="p-3 bg-red-500/10 rounded border border-red-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Access Violations</span>
            <span className="text-red-500 text-xs">{violations} Blocked</span>
          </div>
          <div className="text-xs text-muted-foreground">Unauthorized access attempts</div>
        </div>
        
        {message && (
          <div className={`p-2 rounded text-xs text-center ${
            message.includes('granted') 
              ? 'bg-green-500/10 border border-green-500/20 text-green-500' 
              : 'bg-red-500/10 border border-red-500/20 text-red-500'
          }`}>
            {message}
          </div>
        )}
        
        {pendingRequests.length > 0 ? (
          <div className="space-y-2">
            <div className="text-xs font-medium">Pending Access Requests:</div>
            {pendingRequests.map(request => (
              <div key={request.id} className="p-2 bg-muted/20 rounded border border-border">
                <div className="text-xs mb-1">
                  <span className="font-medium">{request.user}</span>
                  <span className="text-muted-foreground"> → {request.resource}</span>
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${
                    request.risk === 'High' ? 'bg-red-500/20 text-red-500' :
                    request.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-green-500/20 text-green-500'
                  }`}>
                    {request.risk} Risk
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAccess('grant', request.id)}
                    className="flex-1 p-1.5 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                  >
                    ✅ Grant
                  </button>
                  <button 
                    onClick={() => handleAccess('deny', request.id)}
                    className="flex-1 p-1.5 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                  >
                    ❌ Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-muted/20 rounded text-center text-xs text-muted-foreground">
            No pending access requests
          </div>
        )}

        {processedRequests.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium">Recent Decisions:</div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {processedRequests.map(request => (
                <div key={request.id} className={`p-2 rounded border text-xs ${
                  request.status === 'granted' 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-red-500/10 border-red-500/20'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{request.user}</span>
                      <span className="text-muted-foreground text-[10px]"> → {request.resource}</span>
                    </div>
                    <span className={`font-medium ${
                      request.status === 'granted' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {request.status === 'granted' ? '✅ Granted' : '❌ Denied'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZeroTrustMonitor;