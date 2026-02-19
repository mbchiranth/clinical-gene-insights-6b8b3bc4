import { currentPatient } from "@/lib/mockData";

const PatientBanner = () => {
  return (
    <div className="bg-clinical-blue-light border-b px-4 py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-sm font-semibold text-foreground">{currentPatient.name}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {currentPatient.age}y {currentPatient.sex}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">MRN:</span> {currentPatient.mrn}
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">ID:</span> {currentPatient.id}
          </div>
          <div className="text-xs text-muted-foreground max-w-xs truncate">
            <span className="font-medium text-foreground">Dx:</span> {currentPatient.diagnosis}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-0.5">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mr-1">Meds:</span>
        {currentPatient.medications.map((med) => (
          <span
            key={med}
            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-card border text-foreground whitespace-nowrap"
          >
            {med}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PatientBanner;
