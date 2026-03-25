'use client';

import { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { AIBadge } from '@/components/shared/Badge';
import { useToast } from '@/components/shared/ToastProvider';
import HelpIcon from '@/components/shared/HelpIcon';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

const CLEANING_ISSUES = [
  {
    type: 'auto-corrected',
    before: '"Pacifc Timbr Co"',
    after: '"Pacific Timber Co."',
    label: 'Client name typo — auto-corrected',
    delay: 600,
  },
  {
    type: 'auto-corrected',
    before: 'Dimensions: 48" × 40" × 60"',
    after: '1.22m × 1.02m × 1.52m',
    label: 'Imperial → metric unit conversion — auto-corrected',
    delay: 900,
  },
  {
    type: 'auto-corrected',
    before: 'Duplicate booking ref BK-LTX-77302',
    after: 'Flagged SHP-0014 ≈ SHP-0006',
    label: 'Duplicate detected — auto-corrected reference',
    delay: 1200,
  },
  {
    type: 'needs-review',
    before: 'Weight: "" (empty)',
    after: '~680kg (estimated: cedar lumber)',
    label: 'Missing weight — AI estimated from commodity',
    delay: 1500,
  },
  {
    type: 'needs-review',
    before: 'Weight: "" (empty)',
    after: '~650kg (estimated: dried lentils)',
    label: 'Missing weight — AI estimated from commodity',
    delay: 1800,
  },
  {
    type: 'needs-review',
    before: 'SHP-0003: 0.8×0.6×1.0m',
    after: 'Flagged — 30% below typical server rack crates',
    label: 'Dimension mismatch — needs dock verification',
    delay: 2100,
  },
  {
    type: 'needs-review',
    before: 'HAZMAT Class 3 declared',
    after: 'UN number missing — likely UN1090',
    label: 'HAZMAT incomplete — UN code required',
    delay: 2400,
  },
  {
    type: 'needs-review',
    before: 'SHP-0011: 5 rolls at 1.8×0.4×0.4m',
    after: 'Volume inconsistent with piece count',
    label: 'Dimension mismatch — piece count suspect',
    delay: 2700,
  },
];

export default function ImportCSVModal({ isOpen, onClose }) {
  const [stage, setStage] = useState('upload');
  const [visibleIssues, setVisibleIssues] = useState(0);
  const { addToast } = useToast();

  const reset = useCallback(() => {
    setStage('upload');
    setVisibleIssues(0);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(reset, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, reset]);

  const startProcessing = () => {
    setStage('processing');
    setTimeout(() => {
      setStage('cleaning');
      CLEANING_ISSUES.forEach((_, i) => {
        setTimeout(() => setVisibleIssues(i + 1), CLEANING_ISSUES[i].delay);
      });
    }, 1500);
  };

  const handleAcceptAll = () => {
    addToast('All AI corrections accepted — shipment data updated', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Shipment Data" size="xl">
      {stage === 'upload' && (
        <div
          onClick={startProcessing}
          className="border-2 border-dashed border-fw-border rounded-lg p-12 text-center cursor-pointer hover:border-fw-cyan/50 hover:bg-fw-cyan/5 transition-colors"
        >
          <Upload size={40} className="mx-auto text-fw-text-muted mb-4" />
          <p className="text-fw-text font-medium mb-1">
            Drop CSV file here or click to upload
          </p>
          <p className="text-sm text-fw-text-muted">
            Supports .csv and .xlsx formats
          </p>
        </div>
      )}

      {stage === 'processing' && (
        <div className="py-12 text-center">
          <Loader2
            size={40}
            className="mx-auto text-fw-cyan mb-4 animate-spin"
          />
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileText size={16} className="text-fw-text-dim" />
            <p className="text-fw-text font-medium">
              Processing pacific_coast_shipments_raw.csv...
            </p>
          </div>
          <p className="text-sm text-fw-text-muted">
            FreightWare AI is analyzing your data
          </p>
        </div>
      )}

      {stage === 'cleaning' && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-display font-semibold text-fw-text">
                  AI Data Cleaning Complete
                </h3>
                <AIBadge />
                <HelpIcon
                  text="FreightWare AI scans uploaded data for typos, unit mismatches, missing fields, duplicates, and HAZMAT compliance issues. Auto-corrections are applied where confidence is high; flagged items need your review."
                  position="bottom-left"
                />
              </div>
              <p className="text-sm text-fw-text-dim">
                FreightWare AI analyzed <strong>25 records</strong> —{' '}
                <span className="text-fw-amber">8 issues detected</span>, 3
                auto-corrected, 5 need review
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-6 max-h-80 overflow-y-auto pr-2">
            {CLEANING_ISSUES.slice(0, visibleIssues).map((issue, i) => (
              <div
                key={i}
                className="bg-fw-bg border border-fw-border rounded-lg p-3 animate-slide-in"
              >
                <div className="flex items-start gap-3">
                  {issue.type === 'auto-corrected' ? (
                    <CheckCircle2
                      size={16}
                      className="text-fw-green mt-0.5 flex-shrink-0"
                    />
                  ) : (
                    <AlertTriangle
                      size={16}
                      className="text-fw-amber mt-0.5 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-fw-text-dim mb-1">
                      {issue.label}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <code className="bg-fw-red/10 text-fw-red px-1.5 py-0.5 rounded font-mono">
                        {issue.before}
                      </code>
                      <span className="text-fw-text-muted">→</span>
                      <code className="bg-fw-green/10 text-fw-green px-1.5 py-0.5 rounded font-mono">
                        {issue.after}
                      </code>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      issue.type === 'auto-corrected'
                        ? 'bg-fw-green/10 text-fw-green'
                        : 'bg-fw-amber/10 text-fw-amber'
                    }`}
                  >
                    {issue.type === 'auto-corrected' ? 'Auto-fixed' : 'Review'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {visibleIssues >= CLEANING_ISSUES.length && (
            <div className="flex items-center gap-3 pt-4 border-t border-fw-border">
              <Button onClick={handleAcceptAll} className="flex-1">
                <CheckCircle2 size={16} />
                Accept All Corrections
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Review Individually
              </Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
