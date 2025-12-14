
export type UIRole = 'patient' | 'doctor' | 'hospital' | 'admin';

export const densityConfig = {
  patient: {
    container: "max-w-4xl mx-auto",
    gap: "gap-8",
    padding: "p-8",
    cardPadding: "p-6",
    heading: "text-2xl font-display font-bold",
    subheading: "text-base text-text-secondary leading-relaxed",
    body: "text-sm leading-7 text-text-secondary",
    listGap: "space-y-4",
    buttonSize: "py-3 px-6 text-sm",
    iconSize: 24,
    tableDensity: "py-4 px-4"
  },
  doctor: {
    container: "max-w-[1600px] mx-auto",
    gap: "gap-4",
    padding: "p-4",
    cardPadding: "p-4",
    heading: "text-lg font-bold font-display",
    subheading: "text-xs text-text-secondary font-medium",
    body: "text-xs leading-snug text-text-secondary",
    listGap: "space-y-2",
    buttonSize: "py-2 px-3 text-xs",
    iconSize: 18,
    tableDensity: "py-2 px-2"
  },
  hospital: { // Admin view
    container: "max-w-full mx-auto",
    gap: "gap-2",
    padding: "p-2",
    cardPadding: "p-3",
    heading: "text-sm font-bold uppercase tracking-wider font-display",
    subheading: "text-[10px] text-text-secondary uppercase tracking-widest",
    body: "text-[11px] leading-tight text-text-secondary",
    listGap: "space-y-1",
    buttonSize: "py-1 px-2 text-[10px]",
    iconSize: 16,
    tableDensity: "py-1 px-2"
  },
  admin: { // Mapping admin to hospital density
    container: "max-w-full mx-auto",
    gap: "gap-2",
    padding: "p-2",
    cardPadding: "p-3",
    heading: "text-sm font-bold uppercase tracking-wider font-display",
    subheading: "text-[10px] text-text-secondary uppercase tracking-widest",
    body: "text-[11px] leading-tight text-text-secondary",
    listGap: "space-y-1",
    buttonSize: "py-1 px-2 text-[10px]",
    iconSize: 16,
    tableDensity: "py-1 px-2"
  }
};

export const getDensity = (role: string = 'patient') => {
    const r = role.toLowerCase() as UIRole;
    return densityConfig[r] || densityConfig.patient;
};
