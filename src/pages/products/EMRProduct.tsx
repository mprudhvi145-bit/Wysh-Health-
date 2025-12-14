
import React, { useEffect, useState } from 'react';
import { GlassCard, Button, Badge, Loader } from '../../components/UI';
import { Database, Pill, TestTube, Stethoscope, ArrowRight, Layout, FileText, Share2, ClipboardList, CheckCircle, ShieldCheck } from 'lucide-react';
import { clinicalService } from '../../features/doctor/services/clinicalService';
import { useNavigate } from 'react-router-dom';

export const EMRProduct: React.FC = () => {
  const [catalogs, setCatalogs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <Button variant="outline" onClick={() => navigate('/products')} className="mb-6 text-xs !py-1 !px-3">Back to Platform</Button>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                    Wysh EMR<br/>
                    <span className="text-teal-glow">Built for Doctors. Trusted by Patients.</span>
                </h1>
                <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                    Wysh EMR supports the complete clinical workflow — without forcing doctors to adapt to rigid software.
                </p>
                <div className="flex gap-4">
                    <Button variant="primary" onClick={() => navigate('/doctor/patients')} icon={<Layout size={18} />}>
                        Launch Doctor Console
                    </Button>
                </div>
            </div>
            
            <div className="space-y-4">
                <GlassCard className="flex items-center gap-4 border-l-4 border-l-teal">
                    <div className="p-2 bg-white/5 rounded text-white font-bold">01</div>
                    <div>
                        <h4 className="text-white font-bold">Patient Encounter</h4>
                        <p className="text-xs text-text-secondary">Unified timeline & history</p>
                    </div>
                </GlassCard>
                <GlassCard className="flex items-center gap-4 border-l-4 border-l-purple">
                    <div className="p-2 bg-white/5 rounded text-white font-bold">02</div>
                    <div>
                        <h4 className="text-white font-bold">Structured SOAP Notes</h4>
                        <p className="text-xs text-text-secondary">Standardized documentation</p>
                    </div>
                </GlassCard>
                <GlassCard className="flex items-center gap-4 border-l-4 border-l-blue-400">
                    <div className="p-2 bg-white/5 rounded text-white font-bold">03</div>
                    <div>
                        <h4 className="text-white font-bold">Prescriptions & Labs</h4>
                        <p className="text-xs text-text-secondary">Integrated ordering</p>
                    </div>
                </GlassCard>
            </div>
        </div>

        {/* Value Prop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4">Why Doctors Prefer It</h3>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-text-secondary">
                        <CheckCircle size={16} className="text-teal" /> Faster consultations
                    </li>
                    <li className="flex items-center gap-3 text-text-secondary">
                        <CheckCircle size={16} className="text-teal" /> Clear clinical documentation
                    </li>
                    <li className="flex items-center gap-3 text-text-secondary">
                        <CheckCircle size={16} className="text-teal" /> No duplicate data entry
                    </li>
                    <li className="flex items-center gap-3 text-text-secondary">
                        <CheckCircle size={16} className="text-teal" /> Full clinical control
                    </li>
                </ul>
            </GlassCard>
            <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4">Why Hospitals Trust It</h3>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-text-secondary">
                        <ShieldCheck size={16} className="text-purple" /> Audit logs by default
                    </li>
                    <li className="flex items-center gap-3 text-text-secondary">
                        <ShieldCheck size={16} className="text-purple" /> Longitudinal patient records
                    </li>
                    <li className="flex items-center gap-3 text-text-secondary">
                        <ShieldCheck size={16} className="text-purple" /> ABDM-aligned data structures
                    </li>
                    <li className="flex items-center gap-3 text-text-secondary">
                        <ShieldCheck size={16} className="text-purple" /> Scalable architecture
                    </li>
                </ul>
            </GlassCard>
        </div>

        {/* Master Data Section (The Original Products Content) */}
        <div className="space-y-8 pt-12 border-t border-white/10">
            <div className="text-center">
                <Badge color="purple">Live System Data</Badge>
                <h2 className="text-3xl font-display font-bold text-white mt-4">Standardized Clinical Catalogs</h2>
                <p className="text-text-secondary mt-2 max-w-2xl mx-auto">
                    Integrated formulary and procedure codes to ensure data consistency.
                </p>
            </div>

            {loading ? <div className="flex justify-center"><Loader text="Loading formulary..." /></div> : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Medications */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold flex items-center gap-2 border-b border-white/10 pb-2">
                            <Pill size={18} className="text-teal"/> Rx Formulary
                        </h4>
                        <div className="space-y-3">
                            {catalogs?.medications.slice(0,4).map((med: any) => (
                                <div key={med.id} className="p-3 bg-white/5 rounded-lg border border-white/5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white font-medium">{med.name}</span>
                                        {med.isGeneric && <span className="text-[10px] bg-teal/10 text-teal px-1 rounded">GEN</span>}
                                    </div>
                                    <div className="text-text-secondary text-xs mt-1">{med.strength} • {med.form}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Labs */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold flex items-center gap-2 border-b border-white/10 pb-2">
                            <TestTube size={18} className="text-purple"/> Lab Directory
                        </h4>
                        <div className="space-y-3">
                            {catalogs?.labTests.slice(0,4).map((lab: any) => (
                                <div key={lab.id} className="p-3 bg-white/5 rounded-lg border border-white/5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white font-medium">{lab.name}</span>
                                    </div>
                                    <div className="text-text-secondary text-xs mt-1 font-mono">{lab.code} • {lab.units}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold flex items-center gap-2 border-b border-white/10 pb-2">
                            <Stethoscope size={18} className="text-blue-400"/> Procedure Codes
                        </h4>
                        <div className="space-y-3">
                            {catalogs?.services.slice(0,4).map((srv: any) => (
                                <div key={srv.id} className="p-3 bg-white/5 rounded-lg border border-white/5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white font-medium">{srv.name}</span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-text-secondary text-xs">{srv.category}</span>
                                        <span className="text-text-secondary text-xs font-mono">{srv.code}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
