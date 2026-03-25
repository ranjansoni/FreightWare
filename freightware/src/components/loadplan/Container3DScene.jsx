'use client';

import { useRef, useMemo, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import CargoBlock from './CargoBlock';
import HelpIcon from '@/components/shared/HelpIcon';
import { containerTypes } from '@/utils/containerSpecs';
import { getShipmentById } from '@/data/mockShipments';

function ContainerWireframe({ type }) {
  const spec = containerTypes[type];
  if (!spec) return null;
  const { length: l, width: w, height: h } = spec.internal;

  return (
    <group>
      <lineSegments position={[w / 2, h / 2, l / 2]}>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, l)]} />
        <lineBasicMaterial color="#06B6D4" transparent opacity={0.4} />
      </lineSegments>
      <Grid
        args={[w, l]}
        position={[w / 2, 0.001, l / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#2A3450"
        sectionSize={1}
        sectionThickness={0.8}
        sectionColor="#2A3450"
        fadeDistance={25}
        infiniteGrid={false}
      />
      {/* Dimension labels */}
      <Html position={[w / 2, -0.3, l + 0.2]} center>
        <span className="text-[10px] font-mono text-fw-cyan/60">{w.toFixed(1)}m</span>
      </Html>
      <Html position={[-0.3, h / 2, l / 2]} center>
        <span className="text-[10px] font-mono text-fw-cyan/60">{h.toFixed(1)}m</span>
      </Html>
      <Html position={[w + 0.3, -0.3, l / 2]} center>
        <span className="text-[10px] font-mono text-fw-cyan/60">{l.toFixed(1)}m</span>
      </Html>
    </group>
  );
}

const CAMERA_PRESETS = {
  iso: { position: [8, 6, 10], target: [2, 1, 4] },
  front: { position: [1.2, 1.5, 16], target: [1.2, 1, 3] },
  top: { position: [2, 12, 5], target: [2, 0, 5] },
  side: { position: [10, 2, 5], target: [1, 1, 5] },
};

const Scene = forwardRef(function Scene(
  { containerType, loadSequence, highlightedShipment, selectedShipment, onSelectShipment, amberPulseIds },
  ref
) {
  const controlsRef = useRef();
  const [visibleCount, setVisibleCount] = useState(loadSequence.length);

  useImperativeHandle(ref, () => ({
    setCameraPreset(preset) {
      const cam = CAMERA_PRESETS[preset];
      if (cam && controlsRef.current) {
        controlsRef.current.target.set(...cam.target);
        controlsRef.current.object.position.set(...cam.position);
        controlsRef.current.update();
      }
    },
    animateLoadSequence() {
      setVisibleCount(0);
      loadSequence.forEach((_, i) => {
        setTimeout(() => setVisibleCount(i + 1), i * 300);
      });
    },
    setVisibleCount(n) {
      setVisibleCount(n);
    },
  }));

  const blocks = useMemo(() => {
    return loadSequence.map((item, i) => {
      const shipment = getShipmentById(item.shipmentId);
      return {
        ...item,
        clientId: shipment?.clientId,
        clientName: shipment?.clientName || '',
        description: shipment?.description || '',
        weight: shipment?.weight || 0,
      };
    });
  }, [loadSequence]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[8, 6, 10]} fov={45} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[8, 12, 8]} intensity={0.8} />
      <OrbitControls
        ref={controlsRef}
        dampingFactor={0.1}
        enableDamping
        minDistance={3}
        maxDistance={25}
        target={[2, 1, 4]}
      />

      <ContainerWireframe type={containerType} />

      {blocks.map((block, i) => (
        <CargoBlock
          key={`${block.shipmentId}-${i}`}
          shipmentId={block.shipmentId}
          clientId={block.clientId}
          clientName={block.clientName}
          description={block.description}
          position={block.position}
          dimensions={block.dimensions}
          weight={block.weight}
          loadOrder={block.loadOrder}
          isHighlighted={highlightedShipment === block.shipmentId}
          isSelected={selectedShipment === block.shipmentId}
          onClick={onSelectShipment}
          visible={i < visibleCount}
          animationDelay={i * 0.2}
          showAmberPulse={amberPulseIds?.includes(block.shipmentId)}
        />
      ))}
    </>
  );
});

export default function Container3DScene({
  containerType,
  loadSequence = [],
  highlightedShipment,
  selectedShipment,
  onSelectShipment,
  sceneRef,
  amberPulseIds,
  className = '',
}) {
  return (
    <div className={`w-full h-full bg-fw-bg rounded-lg overflow-hidden relative ${className}`}>
      <Canvas gl={{ antialias: true, alpha: false }} style={{ background: '#0B0F1A' }}>
        <Scene
          ref={sceneRef}
          containerType={containerType}
          loadSequence={loadSequence}
          highlightedShipment={highlightedShipment}
          selectedShipment={selectedShipment}
          onSelectShipment={onSelectShipment}
          amberPulseIds={amberPulseIds}
        />
      </Canvas>
      <div className="absolute top-3 right-3 z-10">
        <HelpIcon
          text="Drag to rotate, scroll to zoom, right-click drag to pan. Click any cargo block to see details. Colors represent different clients. Use the camera presets (Iso/Front/Top/Side) for quick views."
          position="bottom-left"
        />
      </div>
    </div>
  );
}
