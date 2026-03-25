'use client';

import Modal from '@/components/shared/Modal';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import { clientColors } from '@/utils/clientColors';
import { formatDimensions, formatWeightFull, formatVolume, formatDate } from '@/utils/formatters';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/shared/ToastProvider';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function ShipmentDetailModal({ shipment, isOpen, onClose }) {
  const { updateShipment } = useApp();
  const { addToast } = useToast();

  if (!shipment) return null;

  const handleVerify = () => {
    updateShipment(shipment.id, {
      status: 'confirmed',
      cleaningStatus: 'clean',
      aiFlags: [],
    });
    addToast(`${shipment.id} marked as verified`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Shipment ${shipment.id}`} size="lg">
      {shipment.aiFlags.length > 0 && (
        <div className="bg-fw-amber/10 border border-fw-amber/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-fw-amber" />
            <span className="text-sm font-semibold text-fw-amber">
              AI Flags Detected
            </span>
          </div>
          {shipment.aiSuggestions.map((s, i) => (
            <p key={i} className="text-sm text-fw-text-dim mt-1 leading-relaxed">
              {s}
            </p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
        <Detail label="Client">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: clientColors[shipment.clientId] }}
            />
            {shipment.clientName}
          </div>
        </Detail>
        <Detail label="Booking Ref">
          <span className="font-mono text-sm">{shipment.bookingRef}</span>
        </Detail>
        <Detail label="Description">{shipment.description}</Detail>
        <Detail label="Destination">{shipment.destination}</Detail>
        <Detail label="Pieces">{shipment.pieces}</Detail>
        <Detail label="Sailing Date">{formatDate(shipment.deliveryWindow)}</Detail>
        <Detail label="Manifest Dimensions">
          <span className="font-mono text-sm">
            {formatDimensions(shipment.manifestDimensions)} per piece
          </span>
        </Detail>
        <Detail label="Total Weight">
          <span className="font-mono text-sm">{formatWeightFull(shipment.weight)}</span>
        </Detail>
        <Detail label="Total Volume">
          <span className="font-mono text-sm">{formatVolume(shipment.volume)}</span>
        </Detail>
        <Detail label="Priority">
          <Badge status={shipment.priority}>{shipment.priority}</Badge>
        </Detail>
        <Detail label="Status">
          <Badge status={shipment.status}>{shipment.status}</Badge>
        </Detail>
        <Detail label="Stackable">{shipment.stackable ? 'Yes' : 'No'}</Detail>
        {shipment.hazmat && (
          <Detail label="HAZMAT">
            <Badge color="red">HAZMAT</Badge>
          </Detail>
        )}
        {shipment.fragile && (
          <Detail label="Fragile">
            <Badge color="amber">Fragile</Badge>
          </Detail>
        )}
        {shipment.tempRange && (
          <Detail label="Temp Range">
            <span className="font-mono text-sm">
              {shipment.tempRange.min}°C to {shipment.tempRange.max}°C
            </span>
          </Detail>
        )}
        {shipment.notes && (
          <div className="col-span-2">
            <Detail label="Notes">{shipment.notes}</Detail>
          </div>
        )}
      </div>

      <div className="border-t border-fw-border pt-4 mb-4">
        <p className="text-xs text-fw-text-muted mb-2 font-medium uppercase tracking-wider">
          History
        </p>
        <div className="space-y-2">
          <HistoryItem icon={Clock} text="Imported from CSV" time="14:20" />
          {shipment.cleaningStatus !== 'clean' && (
            <HistoryItem
              icon={AlertTriangle}
              text={`AI flagged: ${shipment.aiFlags.join(', ')}`}
              time="14:20"
              color="text-fw-amber"
            />
          )}
          {shipment.cleaningStatus === 'auto-corrected' && (
            <HistoryItem
              icon={CheckCircle2}
              text="AI auto-corrected"
              time="14:20"
              color="text-fw-green"
            />
          )}
        </div>
      </div>

      {shipment.aiFlags.length > 0 && (
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleVerify}>
            <CheckCircle2 size={16} />
            Mark as Verified
          </Button>
        </div>
      )}
    </Modal>
  );
}

function Detail({ label, children }) {
  return (
    <div>
      <p className="text-xs text-fw-text-muted mb-0.5">{label}</p>
      <div className="text-sm text-fw-text">{children}</div>
    </div>
  );
}

function HistoryItem({ icon: Icon, text, time, color = 'text-fw-text-dim' }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className={color} />
      <span className="text-xs text-fw-text-dim">{text}</span>
      <span className="text-xs text-fw-text-muted ml-auto">{time}</span>
    </div>
  );
}
