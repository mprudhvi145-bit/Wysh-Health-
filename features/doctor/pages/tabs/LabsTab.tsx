import React, { useState } from 'react';
import { useClinical } from '../../hooks/useClinical';
import { clinicalService } from '../../services/clinicalService';
import { GlassCard, Button, Input, Badge, Loader } from '../../../../components/UI';
import { TestTube, Plus, Clock } from 'lucide-react';

const LabsTab: React.FC = () => {
  const { labOrders, patient, refresh, catalogs } = useClinical();
  const [tests, setTests] = useState("");
  const [ordering, setOrdering] = useState(false);

  const order = async () => {
    if (!patient || !tests) return;
    setOrdering(true);
    try {
      await clinicalService.createLabOrder({
        patientId: patient.id,
        tests: tests.split(",").map(t => t.trim()),
      });
      setTests("");
      await refresh();
    } catch (error) {
      console.error("Order failed", error);
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Order */}
      <GlassCard className="border-purple/20 bg-purple/5">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <TestTube size={18} className="text-purple" /> Quick Lab Order
        </h3>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-text-secondary uppercase mb-1 block">Search Catalog</label>
            <Input 
              placeholder="Test Names (e.g. CBC, Lipid Panel)..." 
              value={tests}
              onChange={e => setTests(e.target.value)}
              list="labs-catalog"
            />
            <datalist id="labs-catalog">
                {catalogs.labTests.map(l => (
                    <option key={l.id} value={l.name}>{l.code}</option>
                ))}
            </datalist>
            <p className="text-[10px] text-text-secondary mt-1 pl-1">Separate multiple tests with commas</p>
          </div>
          <Button 
            onClick={order} 
            disabled={ordering || !tests} 
            variant="primary" 
            className="h-[46px]" // Match input height roughly
            icon={ordering ? <Loader text="" /> : <Plus size={16}/>}
          >
            {ordering ? 'Ordering...' : 'Place Order'}
          </Button>
        </div>
      </GlassCard>

      {/* Lab History */}
      <div className="space-y-4">
        <h4 className="text-text-secondary text-sm font-bold uppercase tracking-wider">Lab History</h4>
        {labOrders.length === 0 && (
           <div className="text-center py-8 text-text-secondary border border-dashed border-white/10 rounded-xl">
             No labs found.
           </div>
        )}
        {labOrders.map((lab: any) => (
          <div key={lab.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-purple/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple/10 rounded-lg text-purple">
                <TestTube size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">
                  {Array.isArray(lab.tests) ? lab.tests.join(', ') : (lab.tests || lab.testName || 'Unknown Test')}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                  <Clock size={12} />
                  {lab.createdAt ? new Date(lab.createdAt).toLocaleDateString() : 'Recent'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge color={lab.status === 'COMPLETED' ? 'teal' : 'purple'}>
                {lab.status || 'ORDERED'}
              </Badge>
              {lab.priority && <p className="text-[10px] text-red-300 mt-1 uppercase tracking-wider">{lab.priority}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabsTab;