'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { clientColors } from '@/utils/clientColors';

export default function CargoBlock({
  shipmentId,
  clientId,
  clientName,
  description,
  position,
  dimensions,
  weight,
  loadOrder,
  isHighlighted,
  isSelected,
  onClick,
  onPointerOver,
  onPointerOut,
  animationDelay = 0,
  visible = true,
  showAmberPulse = false,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);

  const color = clientColors[clientId] || '#888888';
  const { width: w, height: h, length: d } = dimensions;

  const finalX = position.x + w / 2;
  const finalY = position.y + h / 2;
  const finalZ = position.z + d / 2;

  useFrame((_, delta) => {
    if (animProgress < 1) {
      setAnimProgress((p) => Math.min(1, p + delta * 2));
    }
    if (meshRef.current) {
      const targetEmissive = hovered || isHighlighted || isSelected ? 0.3 : 0;
      const currentEmissive = meshRef.current.material.emissiveIntensity;
      meshRef.current.material.emissiveIntensity +=
        (targetEmissive - currentEmissive) * 0.1;

      const targetScale = hovered ? 1.02 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  if (!visible) return null;

  const eased = 1 - Math.pow(1 - animProgress, 3);
  const currentY = finalY + (1 - eased) * 2;
  const opacity = eased * 0.85;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[finalX, currentY, finalZ]}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(shipmentId);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onPointerOver?.(shipmentId);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          onPointerOut?.();
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={showAmberPulse ? '#F59E0B' : color}
          transparent
          opacity={opacity}
          emissive={showAmberPulse ? '#F59E0B' : color}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Wireframe edge */}
      <lineSegments position={[finalX, currentY, finalZ]}>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial
          color={isSelected ? '#06B6D4' : '#ffffff'}
          transparent
          opacity={isSelected ? 0.8 : 0.15}
        />
      </lineSegments>

      {/* Hover tooltip */}
      {hovered && (
        <Html
          position={[finalX, currentY + h / 2 + 0.15, finalZ]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-fw-surface-2 border border-fw-border rounded-lg px-3 py-2 text-xs shadow-xl whitespace-nowrap">
            <p className="font-mono text-fw-cyan font-medium">{shipmentId}</p>
            <p className="text-fw-text-dim">{clientName}</p>
            <p className="text-fw-text-muted">
              {w.toFixed(1)}×{d.toFixed(1)}×{h.toFixed(1)}m · {weight}kg
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}
