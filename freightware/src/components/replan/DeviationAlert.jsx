import Card from '@/components/shared/Card';
import HelpIcon from '@/components/shared/HelpIcon';
import { AlertTriangle } from 'lucide-react';
import { replanScenario } from '@/data/mockReplanScenario';

export default function DeviationAlert() {
  const { originalShipment, actualScan, volumeIncrease, volumePercentIncrease } =
    replanScenario;
  const oD = originalShipment.manifestDimensions;
  const aD = actualScan.dimensions;

  return (
    <div className="space-y-4" data-tour="deviation-alert">
      <div className="bg-fw-amber/10 border border-fw-amber/30 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-fw-amber" />
          <span className="font-display font-bold text-fw-amber text-sm uppercase tracking-wider">
            Dock Scanner Alert
          </span>
          <HelpIcon
            text="This alert fires when the dock scanner measures physical dimensions that differ from the booking manifest. The system auto-detects the discrepancy and triggers impact assessment before loading begins."
            position="bottom-right"
          />
        </div>
        <p className="text-sm text-fw-text mt-2">
          SHP-2026-0003 (Cascade Electronics) — actual dimensions differ from
          manifest
        </p>
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-fw-text-muted uppercase tracking-wider mb-2 font-medium">
              Manifest
            </p>
            <p className="font-mono text-lg text-fw-text">
              {oD.length}m × {oD.width}m × {oD.height}m
            </p>
            <p className="text-sm text-fw-text-dim mt-1">
              per piece × {originalShipment.pieces} pieces ={' '}
              <span className="font-mono">{replanScenario.manifestVolume} m³</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-fw-red uppercase tracking-wider mb-2 font-medium">
              Dock Scan (Actual)
            </p>
            <p className="font-mono text-lg text-fw-red">
              {aD.length}m × {aD.width}m × {aD.height}m
            </p>
            <p className="text-sm text-fw-text-dim mt-1">
              per piece × {actualScan.pieces} pieces ={' '}
              <span className="font-mono text-fw-red">{replanScenario.actualVolume.toFixed(2)} m³</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-fw-border">
          <div>
            <span className="text-sm text-fw-text-dim">Volume increase: </span>
            <span className="font-mono font-bold text-fw-red">
              +{volumeIncrease} m³ (+{volumePercentIncrease}%)
            </span>
          </div>
          <div className="ml-auto bg-fw-surface-2 rounded-md px-3 py-1">
            <span className="text-xs text-fw-text-muted">Reason: </span>
            <span className="text-xs text-fw-text-dim">{actualScan.note}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
