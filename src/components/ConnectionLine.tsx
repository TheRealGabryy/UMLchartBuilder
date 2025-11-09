import React from 'react';
import { Connection, UMLClass } from '../types';

interface ConnectionLineProps {
  connection: Connection;
  classes: UMLClass[];
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ connection, classes }) => {
  const fromClass = classes.find(c => c.id === connection.fromClass);
  const toClass = classes.find(c => c.id === connection.toClass);

  if (!fromClass || !toClass) return null;

  const getHandlePosition = (umlClass: UMLClass, handle: 'top' | 'right' | 'bottom' | 'left') => {
    const baseX = umlClass.x;
    const baseY = umlClass.y;
    const width = 192; // min-w-48 = 12rem = 192px
    const height = 100; // approximate height

    switch (handle) {
      case 'top':
        return { x: baseX, y: baseY - height / 2 };
      case 'right':
        return { x: baseX + width / 2, y: baseY };
      case 'bottom':
        return { x: baseX, y: baseY + height / 2 };
      case 'left':
        return { x: baseX - width / 2, y: baseY };
    }
  };

  const start = getHandlePosition(fromClass, connection.fromHandle);
  const end = getHandlePosition(toClass, connection.toHandle);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="#374151"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#374151"
          />
        </marker>
      </defs>
    </svg>
  );
};

export default ConnectionLine;