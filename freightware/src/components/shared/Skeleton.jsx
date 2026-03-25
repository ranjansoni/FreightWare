'use client';

import { useState, useEffect } from 'react';

export function Skeleton({ className = '', children }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {children}
    </div>
  );
}

export function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`bg-fw-surface-2 rounded-lg relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fw-border/20 to-transparent animate-shimmer" />
    </div>
  );
}

export function PageSkeleton({ type = 'default' }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 250);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  if (type === 'dashboard') {
    return (
      <Skeleton>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonBlock key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-5 gap-6 mb-6">
          <SkeletonBlock className="col-span-3 h-64" />
          <SkeletonBlock className="col-span-2 h-64" />
        </div>
        <SkeletonBlock className="h-48" />
      </Skeleton>
    );
  }

  if (type === 'table') {
    return (
      <Skeleton>
        <div className="flex gap-3 mb-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonBlock key={i} className="h-9 w-32" />
          ))}
        </div>
        <SkeletonBlock className="h-8 mb-2" />
        {[...Array(8)].map((_, i) => (
          <SkeletonBlock key={i} className="h-12 mb-1" />
        ))}
      </Skeleton>
    );
  }

  if (type === '3d') {
    return (
      <Skeleton>
        <div className="flex gap-2 mb-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonBlock key={i} className="h-16 flex-1" />
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4">
          <SkeletonBlock className="col-span-3 h-[500px]" />
          <div className="col-span-2 space-y-4">
            <SkeletonBlock className="h-40" />
            <SkeletonBlock className="h-60" />
          </div>
        </div>
      </Skeleton>
    );
  }

  return (
    <Skeleton>
      <SkeletonBlock className="h-8 w-64 mb-4" />
      <SkeletonBlock className="h-64" />
    </Skeleton>
  );
}
