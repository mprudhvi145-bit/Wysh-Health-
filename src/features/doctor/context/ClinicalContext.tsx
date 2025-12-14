
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { clinicalService } from "../services/clinicalService";

type Chart = {
  patient?: any;
  appointments?: any[];
  prescriptions?: any[];
  labOrders?: any[]; // Matching backend response key
  clinicalNotes?: any[]; // Matching backend response key
  soapNotes?: any[]; // Structured SOAP notes
  documents?: any[];
};

type ClinicalState = {
  patientId?: string;
  chart: Chart;
  catalogs: {
    medications: any[];
    labTests: any[];
    services: any[];
  };
  loading: boolean;
  error?: string;
};

type ClinicalCtx = ClinicalState & {
  loadPatient: (patientId: string) => Promise<void>;
  refresh: () => Promise<void>;
  clear: () => void;
};

const Ctx = createContext<ClinicalCtx | null>(null);

export const ClinicalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ClinicalState>({ 
      chart: {}, 
      catalogs: { medications: [], labTests: [], services: [] },
      loading: false 
  });

  // Fetch Catalogs on Mount
  useEffect(() => {
      const fetchCatalogs = async () => {
          try {
              const data = await clinicalService.getCatalogs();
              setState(s => ({ ...s, catalogs: data }));
          } catch(e) {
              console.error("Failed to load catalogs", e);
          }
      };
      fetchCatalogs();
  }, []);

  const loadPatient = useCallback(async (patientId: string) => {
    setState(s => ({ ...s, loading: true, error: undefined, patientId }));
    try {
      const data = await clinicalService.getPatientChart(patientId);
      setState(s => ({ ...s, patientId, chart: data, loading: false }));
    } catch (e: any) {
      console.error(e);
      setState(s => ({ ...s, loading: false, error: e?.message || "Failed to load chart" }));
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!state.patientId) return;
    try {
        const data = await clinicalService.getPatientChart(state.patientId);
        setState(s => ({ ...s, chart: data }));
    } catch (e) {
        console.error("Refresh failed", e);
    }
  }, [state.patientId]);

  const clear = useCallback(() => {
      setState(s => ({ ...s, chart: {}, loading: false, patientId: undefined }));
  }, []);

  return (
    <Ctx.Provider value={{ ...state, loadPatient, refresh, clear }}>
      {children}
    </Ctx.Provider>
  );
};

export const useClinicalContext = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useClinicalContext must be used within ClinicalProvider");
  return ctx;
};
