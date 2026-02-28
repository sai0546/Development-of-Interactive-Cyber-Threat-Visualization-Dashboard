import React, { useState, useEffect } from 'react';

const SecurityTimeline = () => {
  const [events, setEvents] = useState([]);

  const generateEvent = () => {
    const eventTypes = ['Attack Blocked', 'Threat Detected', 'System Alert', 'User Login', 'Policy Update'];
    const severities = ['low', 'medium', 'high', 'critical'];
    const sources = ['Russia', 'China', 'USA', 'Germany', 'Brazil'];
    
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    
    return {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      type,
      severity,
      description: `${type} from ${source}`,
      source
    };
  };

  useEffect(() => {
    // Initialize with some events
    const initialEvents = Array.from({ length: 8 }, () => ({
      ...generateEvent(),
      timestamp: new Date(Date.now() - Math.random() * 3600000)
    }));
    setEvents(initialEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));

    // Add new events periodically
    const interval = setInterval(() => {
      const newEvent = generateEvent();
      setEvents(prev => [newEvent, ...prev].slice(0, 20));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#ff4444';
      case 'high': return '#ff8800';
      case 'medium': return '#ffff00';
      case 'low': return '#00ff88';
      default: return '#888';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="soc-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>⏰</span>
          Security Timeline
        </h3>
        <p className="text-sm text-muted-foreground">Real-time security events and incidents</p>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="pl-12">
            {events.map((event, index) => (
              <div key={event.id} className="relative mb-4">
                {/* Timeline dot */}
                <div className={`absolute -left-8 top-1 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center text-xs ${
                  event.severity === 'critical' ? 'bg-destructive' :
                  event.severity === 'high' ? 'bg-warning' :
                  event.severity === 'medium' ? 'bg-info' : 'bg-accent'
                }`}>
                  {getSeverityIcon(event.severity)}
                </div>
                
                {/* Event content */}
                <div className="bg-muted/30 p-3 rounded-lg border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-sm">{event.type}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        event.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                        event.severity === 'high' ? 'bg-warning/20 text-warning' :
                        event.severity === 'medium' ? 'bg-info/20 text-info' : 'bg-accent/20 text-accent'
                      }`}>
                        {event.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(event.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.description}
                  </p>
                  
                  <div className="text-xs text-muted-foreground">
                    Source: <span className="text-accent">{event.source}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTimeline;