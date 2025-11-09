import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UMLClass, Connection, ContextMenu } from '../types';
import UMLBlock from './UMLBlock';
import ClassModal from './ClassModal';
import ConnectionLine from './ConnectionLine';

interface CanvasProps {}

const Canvas: React.FC<CanvasProps> = () => {
  const [classes, setClasses] = useState<UMLClass[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ x: 0, y: 0, visible: false });
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragState, setDragState] = useState({
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    initialPan: { x: 0, y: 0 }
  });
  const [connecting, setConnecting] = useState<{
    fromClass: string;
    fromHandle: 'top' | 'right' | 'bottom' | 'left';
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    
    const canvasX = (screenX - rect.left - pan.x) / zoom;
    const canvasY = (screenY - rect.top - pan.y) / zoom;
    return { x: canvasX, y: canvasY };
  }, [pan, zoom]);

  // Handle zoom with Ctrl + mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(3, zoom * zoomFactor));
      
      // Zoom towards mouse position
      const zoomRatio = newZoom / zoom;
      const newPanX = mouseX - (mouseX - pan.x) * zoomRatio;
      const newPanY = mouseY - (mouseY - pan.y) * zoomRatio;
      
      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    }
  }, [zoom, pan]);
  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
    setModalPosition(canvasPos);
  }, [screenToCanvas]);

  const handleCanvasClick = useCallback(() => {
    setContextMenu({ x: 0, y: 0, visible: false });
    setConnecting(null);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-background'))) {
      setDragState({
        isDragging: true,
        dragStart: { x: e.clientX, y: e.clientY },
        initialPan: pan
      });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragState.isDragging) {
      const deltaX = e.clientX - dragState.dragStart.x;
      const deltaY = e.clientY - dragState.dragStart.y;
      setPan({
        x: dragState.initialPan.x + deltaX,
        y: dragState.initialPan.y + deltaY
      });
    }
  }, [dragState]);

  const handleMouseUp = useCallback(() => {
    setDragState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const addClass = useCallback(() => {
    setShowModal(true);
    setContextMenu({ x: 0, y: 0, visible: false });
  }, []);

  const createClass = useCallback((classData: Omit<UMLClass, 'id' | 'x' | 'y'>) => {
    const newClass: UMLClass = {
      ...classData,
      id: Date.now().toString(),
      x: modalPosition.x,
      y: modalPosition.y
    };
    setClasses(prev => [...prev, newClass]);
    setShowModal(false);
  }, [modalPosition]);

  const updateClassPosition = useCallback((id: string, x: number, y: number) => {
    setClasses(prev => prev.map(cls => 
      cls.id === id ? { ...cls, x, y } : cls
    ));
  }, []);

  const handleConnectionStart = useCallback((classId: string, handle: 'top' | 'right' | 'bottom' | 'left') => {
    setConnecting({ fromClass: classId, fromHandle: handle });
  }, []);

  const handleConnectionEnd = useCallback((classId: string, handle: 'top' | 'right' | 'bottom' | 'left') => {
    if (connecting && connecting.fromClass !== classId) {
      const newConnection: Connection = {
        id: Date.now().toString(),
        fromClass: connecting.fromClass,
        toClass: classId,
        fromHandle: connecting.fromHandle,
        toHandle: handle
      };
      setConnections(prev => [...prev, newConnection]);
    }
    setConnecting(null);
  }, [connecting]);

  useEffect(() => {
    const handleGlobalClick = () => {
      setContextMenu({ x: 0, y: 0, visible: false });
    };

    if (contextMenu.visible) {
      document.addEventListener('click', handleGlobalClick);
      return () => document.removeEventListener('click', handleGlobalClick);
    }
  }, [contextMenu.visible]);

  // Prevent default zoom behavior on Ctrl+wheel
  useEffect(() => {
    const preventZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', preventZoom, { passive: false });
    return () => document.removeEventListener('wheel', preventZoom);
  }, []);
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      {/* Zoom indicator */}
      <div className="absolute top-4 left-4 z-10 bg-white px-3 py-1 rounded-md shadow-md text-sm font-mono">
        {Math.round(zoom * 100)}%
      </div>
      
      {/* Instructions */}
      <div className="absolute top-4 right-4 z-10 bg-white px-3 py-2 rounded-md shadow-md text-sm text-gray-600">
        <div>Right-click: Add class</div>
        <div>Ctrl + Scroll: Zoom</div>
        <div>Drag: Pan canvas</div>
      </div>

      <div
        ref={canvasRef}
        className={`w-full h-full ${dragState.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onContextMenu={handleRightClick}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Infinite dotted background */}
        <div 
          className="absolute inset-0 opacity-30 canvas-background"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            backgroundImage: `
              radial-gradient(circle, #9ca3af 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            width: '200%',
            height: '200%',
            left: '-50%',
            top: '-50%'
          }}
        />
        
        {/* Canvas content with zoom and pan transform */}
        <div
          className="canvas-background"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Connection lines */}
          {connections.map(connection => (
            <ConnectionLine
              key={connection.id}
              connection={connection}
              classes={classes}
            />
          ))}
          
          {/* UML Class blocks */}
          {classes.map(umlClass => (
            <UMLBlock
              key={umlClass.id}
              umlClass={umlClass}
              onPositionChange={updateClassPosition}
              onConnectionStart={handleConnectionStart}
              onConnectionEnd={handleConnectionEnd}
              isConnecting={connecting !== null}
              zoom={zoom}
            />
          ))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            onClick={addClass}
          >
            Add Class
          </button>
        </div>
      )}

      {/* Class Creation Modal */}
      {showModal && (
        <ClassModal
          onClose={() => setShowModal(false)}
          onCreateClass={createClass}
        />
      )}
    </div>
  );
};

export default Canvas;