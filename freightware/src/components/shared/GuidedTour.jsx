'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { tourSteps } from '@/data/tourSteps';

function getTargetRect(selector) {
  if (!selector) return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  return el.getBoundingClientRect();
}

function getCardPosition(rect, placement, cardW, cardH) {
  const gap = 16;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (!rect || placement === 'center') {
    return { top: vh / 2 - cardH / 2, left: vw / 2 - cardW / 2 };
  }

  let top, left;

  switch (placement) {
    case 'bottom':
      top = rect.bottom + gap;
      left = rect.left + rect.width / 2 - cardW / 2;
      break;
    case 'bottom-left':
      top = rect.bottom + gap;
      left = rect.right - cardW;
      break;
    case 'top':
      top = rect.top - cardH - gap;
      left = rect.left + rect.width / 2 - cardW / 2;
      break;
    case 'left':
      top = rect.top + rect.height / 2 - cardH / 2;
      left = rect.left - cardW - gap;
      break;
    case 'right':
      top = rect.top + rect.height / 2 - cardH / 2;
      left = rect.right + gap;
      break;
    default:
      top = rect.bottom + gap;
      left = rect.left;
  }

  left = Math.max(16, Math.min(left, vw - cardW - 16));
  top = Math.max(16, Math.min(top, vh - cardH - 16));

  return { top, left };
}

const CARD_W = 380;
const CARD_H_EST = 200;

export default function GuidedTour({ active, onDismiss }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [cardPos, setCardPos] = useState({ top: 0, left: 0 });
  const pathname = usePathname();
  const router = useRouter();
  const rafRef = useRef(null);

  const step = tourSteps[stepIdx];
  const isCenter = !step?.target || step?.placement === 'center';

  const measureTarget = useCallback(() => {
    if (!step) return;
    const rect = getTargetRect(step.target);
    setTargetRect(rect);
    const pos = getCardPosition(rect, step.placement, CARD_W, CARD_H_EST);
    setCardPos(pos);
  }, [step]);

  useEffect(() => {
    if (!active || !step) return;

    if (step.route && step.route !== pathname) {
      router.push(step.route);
      const t = setTimeout(measureTarget, 600);
      return () => clearTimeout(t);
    }

    const t = setTimeout(measureTarget, 100);
    return () => clearTimeout(t);
  }, [active, stepIdx, step, pathname, router, measureTarget]);

  useEffect(() => {
    if (!active) return;
    const onResize = () => measureTarget();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [active, measureTarget]);

  useEffect(() => {
    if (!active) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onDismiss();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const handleNext = useCallback(() => {
    if (stepIdx >= tourSteps.length - 1) {
      onDismiss();
      return;
    }
    setStepIdx((i) => i + 1);
  }, [stepIdx, onDismiss]);

  const handlePrev = useCallback(() => {
    setStepIdx((i) => Math.max(0, i - 1));
  }, []);

  if (!active || !step) return null;

  const spotlightPad = 8;

  return (
    <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && !isCenter && (
              <rect
                x={targetRect.left - spotlightPad}
                y={targetRect.top - spotlightPad}
                width={targetRect.width + spotlightPad * 2}
                height={targetRect.height + spotlightPad * 2}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(3,7,18,0.70)"
          mask="url(#tour-mask)"
        />
      </svg>

      {targetRect && !isCenter && (
        <div
          className="absolute rounded-lg border-2 border-fw-cyan pointer-events-none"
          style={{
            zIndex: 2,
            top: targetRect.top - spotlightPad,
            left: targetRect.left - spotlightPad,
            width: targetRect.width + spotlightPad * 2,
            height: targetRect.height + spotlightPad * 2,
            boxShadow: '0 0 0 4px rgba(6,182,212,0.15), 0 0 24px rgba(6,182,212,0.2)',
          }}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="absolute bg-fw-surface border border-fw-border rounded-xl shadow-2xl overflow-hidden"
          style={{
            zIndex: 3,
            width: CARD_W,
            top: cardPos.top,
            left: cardPos.left,
          }}
        >
          <div className="px-5 pt-4 pb-1 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-fw-cyan flex-shrink-0" />
              <h4 className="text-sm font-display font-bold text-fw-text">
                {step.title}
              </h4>
            </div>
            <button
              onClick={onDismiss}
              className="p-1 rounded-md hover:bg-fw-surface-2 text-fw-text-muted hover:text-fw-text transition-colors"
              aria-label="Close tour"
            >
              <X size={14} />
            </button>
          </div>

          <p className="px-5 py-2 text-sm text-fw-text-dim leading-relaxed">
            {step.body}
          </p>

          <div className="px-5 py-3 border-t border-fw-border flex items-center justify-between">
            <span className="text-xs text-fw-text-muted font-mono">
              {stepIdx + 1} / {tourSteps.length}
            </span>
            <div className="flex items-center gap-2">
              {stepIdx > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-fw-text-dim hover:text-fw-text hover:bg-fw-surface-2 transition-colors"
                >
                  <ChevronLeft size={14} /> Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-1.5 rounded-md text-xs font-semibold bg-fw-cyan text-white hover:bg-fw-cyan/90 transition-colors"
              >
                {stepIdx >= tourSteps.length - 1 ? 'Finish' : 'Next'}
                {stepIdx < tourSteps.length - 1 && <ChevronRight size={14} />}
              </button>
            </div>
          </div>

          <div className="h-1 bg-fw-bg">
            <div
              className="h-full bg-fw-cyan transition-all duration-300"
              style={{ width: `${((stepIdx + 1) / tourSteps.length) * 100}%` }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
