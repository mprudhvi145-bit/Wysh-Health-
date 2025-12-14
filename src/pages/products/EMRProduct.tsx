
import React, { useEffect, useState } from 'react';
import { GlassCard, Button, Badge, Loader } from '../../components/UI';
import { Database, Pill, TestTube, Stethoscope, ArrowRight, Layout, FileText, Share2 } from 'lucide-react';
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
                    Intelligent <br/><span className="text-teal-glow">Clinical Workspace</span>
                </h1>
                <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                    A longitudinal Electronic Medical Record system that thinks like a doctor. 
                    Automated SOAP notes, smart prescribing, and instant history retrieval.
                </p>
                <div className="flex gap-4">
                    <Button variant="primary" onClick={() => navigate('/doctor/patients')} icon={<Layout size={18} />}>
                        Launch Doctor Console
                    </Button>
                </div>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-teal/20 blur-[100px] rounded-full pointer-events-none" />
                <GlassCard className="relative z-10 !p-0 overflow-hidden border-teal/30">
                    <div className="bg-[#0D0F12] p-4 border-b border-white/10 flex items-center gap-4">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"/>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                            <div className="w-3 h-3 rounded-full bg-green-500"/>
                        </div>
                        <div className="text-xs text-text-secondary bg-white/5 px-3 py-1 rounded-full flex-1 text-center">
                            wysh-care-os/patient-chart/v4
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between">
                            <div className="h-4 w-32 bg-white/20 rounded" />
                            <div className="h-4 w-16 bg-teal/20 rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-white/10 rounded" />
                            <div className="h-2 w-full bg-white/10 rounded" />
                            <div className="h-2 w-3/4 bg-white/10 rounded" />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <div className="h-10 w-1/3 bg-white/5 rounded border border-white/10 flex items-center justify-center text-xs text-text-secondary">Prescribe</div>
                            <div className="h-10 w-1/3 bg-white/5 rounded border border-white/10 flex items-center justify-center text-xs text-text-secondary">Lab Order</div>
                            <div className="h-10 w-1/3 bg-teal/10 rounded border border-teal/30 flex items-center justify-center text-xs text-teal">AI Insight</div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard>
                <FileText className="text-purple mb-4" size={28} />
                <h3 className="text-white font-bold text-lg mb-2">Auto-SOAP Notes</h3>
                <p className="text-text-secondary text-sm">
                    Structured data capture that formats itself. Spend less time typing and more time treating.
                </p>
            </GlassCard>
            <GlassCard>
                <Database className="text-teal mb-4" size={28} />
                <h3 className="text-white font-bold text-lg mb-2">Longitudinal Records</h3>
                <p className="text-text-secondary text-sm">
                    View a patient's entire history in a timeline, aggregated from all previous visits and external ABDM sources.
                </p>
            </GlassCard>
            <GlassCard>
                <Share2 className="text-blue-400 mb-4" size={28} />
                <h3 className="text-white font-bold text-lg mb-2">Interoperable</h3>
                <p className="text-text-secondary text-sm">
                    Built on HL7 FHIR standards. Export data easily or share securely with specialists via ABHA.
                </p>
            </GlassCard>
        </div>

        {/* Master Data Section (The Original Products Content) */}
        <div className="space-y-8 pt-12 border-t border-white/10">
            <div className="text-center">
                <Badge color="purple">System Master Data</Badge>
                <h2 className="text-3xl font-display font-bold text-white mt-4">Standardized Clinical Catalogs</h2>
                <p className="text-text-secondary mt-2 max-w-2xl mx-auto">
                    Wysh EMR comes pre-loaded with global standard formularies (SNOMED-CT, LOINC) to ensure data consistency.
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
