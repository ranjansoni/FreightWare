'use client';

import { motion } from 'framer-motion';
import HelpIcon from '@/components/shared/HelpIcon';

export default function ReportCard({
  id,
  title,
  subtitle,
  insight,
  insightColor = 'text-fw-cyan',
  helpText,
  footer,
  chartHeight = 'h-80',
  children,
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-fw-surface border border-fw-border rounded-xl overflow-hidden"
    >
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-display font-semibold text-fw-text">
            {title}
          </h3>
          {helpText && <HelpIcon text={helpText} position="bottom-right" />}
        </div>
        {subtitle && (
          <p className="text-sm text-fw-text-dim mt-1">{subtitle}</p>
        )}
        {insight && (
          <p className={`text-sm font-mono font-semibold mt-2 ${insightColor}`}>
            {insight}
          </p>
        )}
      </div>

      <div className={`px-6 ${chartHeight}`}>{children}</div>

      {footer && (
        <div className="px-6 py-4 border-t border-fw-border mt-4">
          <p className="text-xs text-fw-text-muted">{footer}</p>
        </div>
      )}
    </motion.section>
  );
}
