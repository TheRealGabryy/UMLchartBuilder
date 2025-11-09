import React, { useState, useCallback } from 'react';
import { UMLClass } from '../types';

interface UMLBlockProps {
  umlClass: UMLClass;
  onPositionChange: (id: string, x: number, y: number) => void;
  onConnectionStart: (classId: string, handle: 'top' | 'right' | 'bottom' | 'left') => void;
  onConnectionEnd: (classId: string, handle: 'top' | 'right' | 'bottom' | 'left') => void;
  isConnecting: boolean;
  zoom: number;
}

const UMLBlock: React.FC<UMLBlockProps> = ({
  umlClass,
  onPositionChange,
  onConnectionStart,
  onConnectionEnd,
  isConnecting,
  zoom
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  const getVisibilitySymbol = (visibility: 'public' | 'private' | 'protected') => {
    switch (visibility) {
      case 'public': return '+';
      case 'private': return '-';
      case 'protected': return '#';
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition({ x: umlClass.x, y: umlClass.y });
  }, [umlClass.x, umlClass.y]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = (e.clientX - dragStart.x) / zoom;
      const deltaY = (e.clientY - dragStart.y) / zoom;
      const newX = initialPosition.x + deltaX;
      const newY = initialPosition.y + deltaY;
      onPositionChange(umlClass.id, newX, newY);
    }
  }, [isDragging, dragStart, initialPosition, zoom, umlClass.id, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  const handleConnectionClick = useCallback((handle: 'top' | 'right' | 'bottom' | 'left', e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting) {
      onConnectionEnd(umlClass.id, handle);
    } else {
      onConnectionStart(umlClass.id, handle);
    }
  }, [isConnecting, umlClass.id, onConnectionStart, onConnectionEnd]);

  return (
    <div
      className="absolute select-none"
      style={{ 
        left: umlClass.x, 
        top: umlClass.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="bg-white border-2 border-gray-800 rounded-lg shadow-lg min-w-48 relative">
        {/* Connection Handles */}
        <div
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-2 border-white shadow-md hover:bg-blue-600 transition-colors"
          onClick={(e) => handleConnectionClick('top', e)}
        />
        <div
          className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-2 border-white shadow-md hover:bg-blue-600 transition-colors"
          onClick={(e) => handleConnectionClick('right', e)}
        />
        <div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-2 border-white shadow-md hover:bg-blue-600 transition-colors"
          onClick={(e) => handleConnectionClick('bottom', e)}
        />
        <div
          className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-2 border-white shadow-md hover:bg-blue-600 transition-colors"
          onClick={(e) => handleConnectionClick('left', e)}
        />

        {/* Class Name */}
        <div
          className={`px-4 py-3 bg-gray-50 font-bold text-center text-gray-800 border-b-2 border-gray-800 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
          onMouseDown={handleMouseDown}
        >
          {umlClass.name}
        </div>

        {/* Variables */}
        {umlClass.variables.length > 0 && (
          <div className="px-4 py-2 border-b-2 border-gray-800">
            {umlClass.variables.map((variable) => (
              <div key={variable.id} className="text-sm font-mono text-gray-700 py-1">
                <span className="text-blue-600 font-bold">
                  {getVisibilitySymbol(variable.visibility)}
                </span>
                <span className="ml-1">{variable.name}</span>
                <span className="text-gray-500">: {variable.type}</span>
              </div>
            ))}
          </div>
        )}

        {/* Methods */}
        {umlClass.methods.length > 0 && (
          <div className="px-4 py-2">
            {umlClass.methods.map((method) => (
              <div key={method.id} className="text-sm font-mono text-gray-700 py-1">
                <span className="text-blue-600 font-bold">
                  {getVisibilitySymbol(method.visibility)}
                </span>
                <span className="ml-1">{method.name}</span>
                <span className="text-gray-500">
                  ({method.parameters}): {method.returnType}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UMLBlock;