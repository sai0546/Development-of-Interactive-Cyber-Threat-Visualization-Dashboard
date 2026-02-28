import React, { useState } from 'react';

const CloudSecurity = () => {
  const [cloudStatus, setCloudStatus] = useState({
    aws: 'Secure',
    azure: 'Warning',
    gcp: 'Secure'
  });
  const [misconfigurations, setMisconfigurations] = useState(12);
  const [complianceScore, setComplianceScore] = useState(89);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');

  const runCloudScan = () => {
    setIsScanning(true);
    setScanResult('Scanning cloud infrastructure...');
    
    setTimeout(() => {
      const newMisconfigs = Math.floor(Math.random() * 10) + 5;
      const newCompliance = Math.floor(Math.random() * 15) + 85;
      const newAzureStatus = Math.random() > 0.5 ? 'Secure' : 'Warning';
      
      setMisconfigurations(newMisconfigs);
      setComplianceScore(newCompliance);
      setCloudStatus(prev => ({ ...prev, azure: newAzureStatus }));
      setScanResult(`✅ Scan complete! Found ${newMisconfigs} issues. Compliance: ${newCompliance}%`);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="soc-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>☁️</span>
          Cloud Security
        </h3>
        <p className="text-sm text-muted-foreground">Multi-cloud security monitoring</p>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className={`p-2 rounded text-center ${
            cloudStatus.aws === 'Secure' ? 'bg-green-500/10' : 'bg-yellow-500/10'
          }`}>
            <div className="text-sm font-bold text-blue-500">AWS</div>
            <div className={`text-xs ${
              cloudStatus.aws === 'Secure' ? 'text-green-500' : 'text-yellow-500'
            }`}>{cloudStatus.aws}</div>
          </div>
          <div className={`p-2 rounded text-center ${
            cloudStatus.azure === 'Secure' ? 'bg-green-500/10' : 'bg-yellow-500/10'
          }`}>
            <div className="text-sm font-bold text-blue-500">Azure</div>
            <div className={`text-xs ${
              cloudStatus.azure === 'Secure' ? 'text-green-500' : 'text-yellow-500'
            }`}>{cloudStatus.azure}</div>
          </div>
          <div className={`p-2 rounded text-center ${
            cloudStatus.gcp === 'Secure' ? 'bg-green-500/10' : 'bg-yellow-500/10'
          }`}>
            <div className="text-sm font-bold text-blue-500">GCP</div>
            <div className={`text-xs ${
              cloudStatus.gcp === 'Secure' ? 'text-green-500' : 'text-yellow-500'
            }`}>{cloudStatus.gcp}</div>
          </div>
        </div>
        
        <div className="p-3 bg-orange-500/10 rounded border border-orange-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Misconfigurations</span>
            <span className="text-orange-500 text-xs font-bold">{misconfigurations} Found</span>
          </div>
          <div className="text-xs text-muted-foreground">S3 buckets, IAM policies, security groups</div>
        </div>
        
        <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Compliance Score</span>
            <span className="text-green-500 text-xs font-bold">{complianceScore}%</span>
          </div>
          <div className="text-xs text-muted-foreground">CIS, NIST, SOC 2 benchmarks</div>
        </div>
        
        {scanResult && (
          <div className={`p-3 rounded border animate-pulse ${
            isScanning 
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' 
              : 'bg-green-500/10 border-green-500/20 text-green-500'
          }`}>
            <div className="text-xs font-medium">{scanResult}</div>
          </div>
        )}
        
        <button 
          onClick={runCloudScan}
          disabled={isScanning}
          className={`w-full p-3 rounded text-sm transition-colors ${
            isScanning 
              ? 'bg-gray-500 text-white cursor-not-allowed' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isScanning ? '🔄 Scanning...' : '☁️ Run Cloud Scan'}
        </button>
      </div>
    </div>
  );
};

export default CloudSecurity;