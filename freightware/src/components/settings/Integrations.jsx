'use client';

import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import HelpIcon from '@/components/shared/HelpIcon';
import { useToast } from '@/components/shared/ToastProvider';
import { integrations } from '@/data/mockSettings';
import { Truck, Database, ScanLine, Mail, RefreshCw } from 'lucide-react';

const ICONS = {
  'int-tms': Truck,
  'int-erp': Database,
  'int-iot': ScanLine,
  'int-email': Mail,
};

export default function Integrations() {
  const { addToast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-base font-display font-semibold text-fw-text">
          Integrations
        </h3>
        <HelpIcon
          text="Connect FreightWare with your existing systems. Connected integrations sync data automatically. Click Configure to update credentials or sync settings."
          position="bottom-right"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((int) => {
          const Icon = ICONS[int.id] || Database;
          const isConnected = int.status === 'connected';

          return (
            <Card key={int.id} className={isConnected ? 'border-fw-green/20' : ''}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isConnected ? 'bg-fw-green/10' : 'bg-fw-surface-2'
                }`}>
                  <Icon size={22} className={isConnected ? 'text-fw-green' : 'text-fw-text-muted'} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-display font-semibold text-fw-text">
                      {int.name}
                    </h4>
                    <Badge color={isConnected ? 'green' : 'gray'}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <p className="text-xs text-fw-text-muted mb-1">{int.category}</p>
                  <p className="text-xs text-fw-text-dim leading-relaxed">{int.description}</p>

                  {int.lastSync && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-fw-text-muted">
                      <RefreshCw size={10} />
                      Last sync: {int.lastSync}
                    </div>
                  )}

                  <div className="mt-3">
                    {isConnected ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addToast(`${int.name} configuration opened`, 'info')}
                      >
                        Configure
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => addToast(`${int.name} connection wizard coming in v1.0`, 'info')}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
