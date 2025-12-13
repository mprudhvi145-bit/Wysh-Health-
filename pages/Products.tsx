import React, { useEffect, useState } from 'react';
import { GlassCard, Badge, Loader } from '../components/UI';
import { Database, Pill, TestTube, Stethoscope } from 'lucide-react';
import { clinicalService } from '../features/doctor/services/clinicalService';

export const Products: React.FC = () => {
  const [catalogs, setCatalogs] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        try {
            const data = await clinicalService.getCatalogs();
            setCatalogs(data);
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    load();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Loading clinical definitions..." /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge color="purple">System Master Data</Badge>
        <h1 className="text-4xl font-display font-bold text-white mt-4 mb-4">
          Clinical Service Catalogs
        </h1>
        <p className="text-text-secondary">
          Centralized definitions for Medications, Procedures, and Lab Tests utilized across the Wysh Care EMR ecosystem.
        </p>
      </div>

      {/* Medications */}
      <section>
          <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal/10 rounded-lg text-teal"><Pill size={24} /></div>
              <h2 className="text-2xl font-bold text-white">Medication Formulary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogs?.medications.map((med: any) => (
                  <GlassCard key={med.id} className="hover:border-teal/30">
                      <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-white">{med.name}</h3>
                          {med.isGeneric && <Badge color="teal">Generic</Badge>}
                      </div>
                      <div className="mt-2 text-sm text-text-secondary flex justify-between">
                          <span>{med.strength}</span>
                          <span>{med.form}</span>
                      </div>
                  </GlassCard>
              ))}
          </div>
      </section>

      {/* Labs */}
      <section>
          <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple/10 rounded-lg text-purple"><TestTube size={24} /></div>
              <h2 className="text-2xl font-bold text-white">Laboratory Test Directory</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogs?.labTests.map((lab: any) => (
                  <GlassCard key={lab.id} className="hover:border-purple/30">
                      <div className="flex justify-between items-start">
                          <div>
                              <h3 className="text-lg font-bold text-white">{lab.name}</h3>
                              <p className="text-xs text-purple font-mono mt-1">{lab.code}</p>
                          </div>
                      </div>
                      <div className="mt-2 text-sm text-text-secondary">
                          Units: <span className="text-white">{lab.units}</span>
                      </div>
                  </GlassCard>
              ))}
          </div>
      </section>

      {/* Services */}
      <section>
          <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Stethoscope size={24} /></div>
              <h2 className="text-2xl font-bold text-white">Clinical Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogs?.services.map((srv: any) => (
                  <GlassCard key={srv.id} className="hover:border-blue-500/30">
                      <h3 className="text-lg font-bold text-white">{srv.name}</h3>
                      <div className="flex gap-2 mt-3">
                          <span className="text-xs bg-white/5 px-2 py-1 rounded border border-white/10 text-text-secondary">
                              CPT: {srv.code}
                          </span>
                          <span className="text-xs bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 text-blue-300">
                              {srv.category}
                          </span>
                      </div>
                  </GlassCard>
              ))}
          </div>
      </section>
    </div>
  );
};