import React, { useState } from 'react';
import { Compass, Ship, Waves, Radio, ShieldCheck, ArrowRight } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Dropdown } from '../ui/Dropdown';
import { Button } from '../ui/Button';

export interface StartMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (missionData: any) => void;
}

export const StartMissionModal: React.FC<StartMissionModalProps> = ({
  isOpen,
  onClose,
  onLaunch,
}) => {
  const [missionCode, setMissionCode] = useState('MS-0049');
  const [vessel, setVessel] = useState('samudra');
  const [sector, setSector] = useState('Sector 5, Arabian Sea Hydrographic Corridor');
  const [frequency, setFrequency] = useState('900');
  const [swath, setSwath] = useState('250');

  const handleLaunch = () => {
    onLaunch({
      missionCode,
      vessel,
      sector,
      frequency,
      swath,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Initiate Survey Mission"
      subtitle="MoES / NIOT Oceanographic Side-Scan Sonar Telemetry Deployment"
      icon={Compass}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-cyan-300 flex items-center gap-1.5 font-medium">
            <ShieldCheck size={14} /> NIOT Sagar Protocol Compliant
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleLaunch}>
              Deploy Sonar & Start Mission <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="p-3.5 rounded-lg bg-marine-950 border border-marine-800 text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio size={16} className="text-cyan-400 animate-pulse" />
            <div>
              <div className="font-semibold text-white">ORV Telemetry Databus: Online</div>
              <div className="text-slate-400 mt-0.5">Transducer dual-frequency channel ready for ping synchronization</div>
            </div>
          </div>
          <span className="text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40">
            GPS Lock OK
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Mission Identifier"
            value={missionCode}
            onChange={(e) => setMissionCode(e.target.value)}
            helperText="Official NIOT survey mission registry code"
          />

          <Dropdown
            label="Research Survey Vessel"
            options={[
              { value: 'samudra', label: 'RV Samudra Nidhi (NIOT)', badge: 'PRIMARY' },
              { value: 'sagar', label: 'ORV Sagar Kanya (MoES)', badge: 'STANDBY' },
              { value: 'auv', label: 'Autonomous Underwater Vehicle (AUV-X)', badge: 'ROV' },
            ]}
            value={vessel}
            onChange={(val) => setVessel(val)}
          />

          <div className="sm:col-span-2">
            <Input
              label="Survey Sector & Transect Corridor"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              helperText="Target geographic sector bounding coordinates"
            />
          </div>

          <Input
            label="Active Acoustic Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            unit="kHz"
            helperText="EdgeTech 4200 (450 kHz Low / 900 kHz High)"
          />

          <Input
            label="Total Swath Width"
            value={swath}
            onChange={(e) => setSwath(e.target.value)}
            unit="m"
            helperText="125m Port + 125m Starboard acoustic coverage"
          />
        </div>
      </div>
    </Modal>
  );
};
