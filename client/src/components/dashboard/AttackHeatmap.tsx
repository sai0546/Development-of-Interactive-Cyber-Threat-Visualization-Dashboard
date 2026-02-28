import React from 'react';

const AttackHeatmap = () => {
  const boardSize = 8; // 8x8 chess board
  
  const generateChessData = () => {
    const data = [];
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const isBlack = (row + col) % 2 === 1;
        const attackValue = Math.floor(Math.random() * 100);
        data.push({
          row,
          col,
          isBlack,
          value: attackValue,
          label: `${String.fromCharCode(65 + col)}${8 - row}` // Chess notation (A8, B7, etc.)
        });
      }
    }
    return data;
  };

  const data = generateChessData();
  const maxValue = Math.max(...data.map(d => d.value));

  const getSquareColor = (square) => {
    const intensity = square.value / maxValue;
    
    if (square.isBlack) {
      // Black squares with red intensity for attacks
      if (intensity > 0.8) return '#7f1d1d'; // dark red
      if (intensity > 0.6) return '#991b1b';
      if (intensity > 0.4) return '#b91c1c';
      if (intensity > 0.2) return '#dc2626';
      return '#1f2937'; // dark gray (black square)
    } else {
      // White squares with yellow/orange intensity for attacks
      if (intensity > 0.8) return '#f59e0b'; // amber
      if (intensity > 0.6) return '#fbbf24';
      if (intensity > 0.4) return '#fcd34d';
      if (intensity > 0.2) return '#fde68a';
      return '#f3f4f6'; // light gray (white square)
    }
  };

  return (
    <div className="soc-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Attack Pattern Heatmap</h3>
        <p className="text-sm text-muted-foreground">Network zones attack intensity map</p>
      </div>
      
      <div className="flex flex-col items-center space-y-2">
        {/* Column labels */}
        <div className="flex">
          <div className="w-8"></div>
          <div className="grid grid-cols-8 gap-1 text-xs text-muted-foreground">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="w-12 text-center font-mono">
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Chess board */}
        <div className="border-2 border-border rounded-lg p-2 bg-muted/20">
          {Array.from({ length: boardSize }, (_, row) => (
            <div key={row} className="flex items-center">
              {/* Row label */}
              <div className="w-6 text-xs text-muted-foreground font-mono text-center">
                {8 - row}
              </div>
              
              {/* Board squares */}
              <div className="flex">
                {Array.from({ length: boardSize }, (_, col) => {
                  const square = data.find(d => d.row === row && d.col === col);
                  return (
                    <div
                      key={`${row}-${col}`}
                      className="w-12 h-12 border border-border/30 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all flex items-center justify-center relative group"
                      style={{ backgroundColor: getSquareColor(square) }}
                      title={`${square.label}: ${square.value} attacks`}
                    >
                      {/* Attack count overlay */}
                      {square.value > 20 && (
                        <span className={`text-xs font-bold ${
                          square.isBlack ? 'text-white' : 'text-gray-800'
                        }`}>
                          {square.value}
                        </span>
                      )}
                      
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        Zone {square.label}: {square.value} attacks
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between w-full max-w-md text-xs text-muted-foreground mt-4 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-border"></div>
            <span>Safe Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-300 border border-border"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 border border-border"></div>
            <span>High Risk</span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md text-center text-sm mt-2">
          <div>
            <div className="font-semibold text-accent">{data.filter(d => d.value > 70).length}</div>
            <div className="text-xs text-muted-foreground">Critical Zones</div>
          </div>
          <div>
            <div className="font-semibold text-warning">{data.filter(d => d.value > 30 && d.value <= 70).length}</div>
            <div className="text-xs text-muted-foreground">Warning Zones</div>
          </div>
          <div>
            <div className="font-semibold text-muted-foreground">{data.filter(d => d.value <= 30).length}</div>
            <div className="text-xs text-muted-foreground">Safe Zones</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackHeatmap;