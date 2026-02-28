import React, { useState } from 'react';

const DigitalForensics = () => {
  const [investigations, setInvestigations] = useState(5);
  const [evidence, setEvidence] = useState(2.4);
  const [casesClosed, setCasesClosed] = useState(23);
  const [lastAction, setLastAction] = useState('');

  const startInvestigation = () => {
    const newInvestigations = investigations + 1;
    const newEvidence = parseFloat((evidence + Math.random() * 0.5).toFixed(1));
    
    setInvestigations(newInvestigations);
    setEvidence(newEvidence);
    setLastAction(`Investigation #${newInvestigations} started - Collecting ${(Math.random() * 0.5).toFixed(1)} TB evidence`);
  };

  return (
    <div className="soc-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>🔬</span>
          Digital Forensics
        </h3>
        <p className="text-sm text-muted-foreground">Evidence collection and analysis</p>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-red-500/10 rounded border border-red-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Active Investigations</span>
            <span className="text-red-500 text-xs font-bold">{investigations} Cases</span>
          </div>
          <div className="text-xs text-muted-foreground">Malware analysis, data breach forensics</div>
        </div>
        
        <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Evidence Collected</span>
            <span className="text-blue-500 text-xs font-bold">{evidence} TB</span>
          </div>
          <div className="text-xs text-muted-foreground">Memory dumps, disk images, network logs</div>
        </div>
        
        <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Cases Closed</span>
            <span className="text-green-500 text-xs font-bold">{casesClosed} This Month</span>
          </div>
          <div className="text-xs text-muted-foreground">Average resolution: 4.2 days</div>
        </div>
        
        {lastAction && (
          <div className="p-3 bg-green-500/10 rounded border border-green-500/20 animate-pulse">
            <div className="text-xs text-green-500 font-medium">✅ {lastAction}</div>
          </div>
        )}
        
        <button 
          onClick={startInvestigation}
          className="w-full p-3 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
        >
          🔍 Start Investigation
        </button>
      </div>
    </div>
  );
};

export default DigitalForensics;