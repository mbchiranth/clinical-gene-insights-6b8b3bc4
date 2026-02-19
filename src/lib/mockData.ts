export type RiskLevel = "high" | "moderate" | "safe" | "unknown";
export type EvidenceLevel = "A" | "B" | "C";

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: string;
  mrn: string;
  diagnosis: string;
  medications: string[];
}

export interface GeneDrugInteraction {
  id: string;
  gene: string;
  genotype: string;
  phenotype: string;
  drug: string;
  riskLevel: RiskLevel;
  recommendation: string;
  evidenceLevel: EvidenceLevel;
  mechanism: string;
  guidelineSource: string;
  referenceUrl: string;
  lastUpdated: string;
  therapeuticClass: string;
  alternativeDrug?: string;
}

export interface ClinicalAlert {
  id: string;
  type: "hard" | "soft";
  title: string;
  description: string;
  drug: string;
  gene: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface GeneDetail {
  gene: string;
  fullName: string;
  function: string;
  genotype: string;
  phenotype: string;
  clinicalImpact: string;
  chromosome: string;
  associatedDrugs: GeneDrugInteraction[];
}

export const currentPatient: Patient = {
  id: "PT-2024-00847",
  name: "Margaret A. Thompson",
  age: 67,
  sex: "Female",
  mrn: "MRN-4821903",
  diagnosis: "Atrial Fibrillation, Type 2 Diabetes, Major Depressive Disorder",
  medications: [
    "Warfarin 5mg",
    "Metformin 1000mg",
    "Sertraline 100mg",
    "Lisinopril 20mg",
    "Atorvastatin 40mg",
    "Omeprazole 20mg",
    "Amlodipine 5mg",
  ],
};

export const geneDrugInteractions: GeneDrugInteraction[] = [
  {
    id: "gdi-1",
    gene: "CYP2C9",
    genotype: "*1/*3",
    phenotype: "Intermediate Metabolizer",
    drug: "Warfarin",
    riskLevel: "high",
    recommendation: "Reduce initial dose by 25-50%. Monitor INR closely.",
    evidenceLevel: "A",
    mechanism: "Reduced CYP2C9 activity leads to decreased S-warfarin clearance, increasing bleeding risk.",
    guidelineSource: "CPIC Guideline for Pharmacogenetics-Guided Warfarin Dosing (2017)",
    referenceUrl: "https://cpicpgx.org/guidelines/guideline-for-warfarin-and-cyp2c9-and-vkorc1/",
    lastUpdated: "2024-08-15",
    therapeuticClass: "Anticoagulant",
    alternativeDrug: "Apixaban",
  },
  {
    id: "gdi-2",
    gene: "CYP2D6",
    genotype: "*1/*4",
    phenotype: "Intermediate Metabolizer",
    drug: "Sertraline",
    riskLevel: "moderate",
    recommendation: "Consider dose reduction or alternative SSRI. Monitor for adverse effects.",
    evidenceLevel: "B",
    mechanism: "CYP2D6 contributes to sertraline metabolism. Intermediate metabolizers may have elevated drug levels.",
    guidelineSource: "CPIC Guideline for SSRIs and CYP2D6/CYP2C19 (2015)",
    referenceUrl: "https://cpicpgx.org/guidelines/guideline-for-selective-serotonin-reuptake-inhibitors-and-cyp2d6-and-cyp2c19/",
    lastUpdated: "2024-06-20",
    therapeuticClass: "SSRI Antidepressant",
    alternativeDrug: "Escitalopram",
  },
  {
    id: "gdi-3",
    gene: "SLCO1B1",
    genotype: "*1/*5",
    phenotype: "Intermediate Function",
    drug: "Atorvastatin",
    riskLevel: "moderate",
    recommendation: "Use lower dose. Monitor for myopathy symptoms.",
    evidenceLevel: "A",
    mechanism: "Reduced OATP1B1 transport leads to increased statin plasma levels and myopathy risk.",
    guidelineSource: "CPIC Guideline for Statins and SLCO1B1 (2022)",
    referenceUrl: "https://cpicpgx.org/guidelines/guideline-for-statins-and-slco1b1/",
    lastUpdated: "2024-09-01",
    therapeuticClass: "HMG-CoA Reductase Inhibitor",
    alternativeDrug: "Rosuvastatin (lower dose)",
  },
  {
    id: "gdi-4",
    gene: "CYP2C19",
    genotype: "*1/*1",
    phenotype: "Normal Metabolizer",
    drug: "Omeprazole",
    riskLevel: "safe",
    recommendation: "Standard dosing appropriate. No pharmacogenomic adjustment needed.",
    evidenceLevel: "A",
    mechanism: "Normal CYP2C19 activity results in expected omeprazole metabolism and efficacy.",
    guidelineSource: "CPIC Guideline for PPIs and CYP2C19 (2020)",
    referenceUrl: "https://cpicpgx.org/guidelines/",
    lastUpdated: "2024-07-10",
    therapeuticClass: "Proton Pump Inhibitor",
  },
  {
    id: "gdi-5",
    gene: "VKORC1",
    genotype: "-1639 A/G",
    phenotype: "Intermediate Sensitivity",
    drug: "Warfarin",
    riskLevel: "high",
    recommendation: "Combined with CYP2C9 result: significant dose reduction required. Use pharmacogenomic dosing algorithm.",
    evidenceLevel: "A",
    mechanism: "VKORC1 variant reduces vitamin K epoxide reductase expression, increasing warfarin sensitivity.",
    guidelineSource: "CPIC Guideline for Warfarin (2017)",
    referenceUrl: "https://cpicpgx.org/guidelines/guideline-for-warfarin-and-cyp2c9-and-vkorc1/",
    lastUpdated: "2024-08-15",
    therapeuticClass: "Anticoagulant",
    alternativeDrug: "Apixaban",
  },
  {
    id: "gdi-6",
    gene: "CYP3A5",
    genotype: "*3/*3",
    phenotype: "Poor Metabolizer",
    drug: "Amlodipine",
    riskLevel: "safe",
    recommendation: "Standard dosing. CYP3A5 status has minimal clinical impact for amlodipine.",
    evidenceLevel: "C",
    mechanism: "CYP3A5 plays a minor role in amlodipine metabolism. Clinical significance is limited.",
    guidelineSource: "PharmGKB Summary",
    referenceUrl: "https://www.pharmgkb.org/",
    lastUpdated: "2024-05-01",
    therapeuticClass: "Calcium Channel Blocker",
  },
  {
    id: "gdi-7",
    gene: "HLA-B",
    genotype: "Negative",
    phenotype: "Normal Risk",
    drug: "Metformin",
    riskLevel: "safe",
    recommendation: "No HLA-mediated risk identified. Standard use appropriate.",
    evidenceLevel: "B",
    mechanism: "No relevant HLA-mediated adverse drug reaction identified for metformin.",
    guidelineSource: "DPWG Guidelines",
    referenceUrl: "https://www.pharmgkb.org/",
    lastUpdated: "2024-04-12",
    therapeuticClass: "Biguanide Antidiabetic",
  },
  {
    id: "gdi-8",
    gene: "ACE",
    genotype: "I/D",
    phenotype: "Variable Response",
    drug: "Lisinopril",
    riskLevel: "unknown",
    recommendation: "Limited pharmacogenomic data. Continue standard dosing with clinical monitoring.",
    evidenceLevel: "C",
    mechanism: "ACE insertion/deletion polymorphism may influence ACE inhibitor response, but evidence is inconclusive.",
    guidelineSource: "PharmGKB Annotation",
    referenceUrl: "https://www.pharmgkb.org/",
    lastUpdated: "2024-03-20",
    therapeuticClass: "ACE Inhibitor",
  },
];

export const clinicalAlerts: ClinicalAlert[] = [
  {
    id: "alert-1",
    type: "hard",
    title: "HIGH BLEEDING RISK — Warfarin + CYP2C9/VKORC1",
    description: "Patient has CYP2C9 *1/*3 (Intermediate Metabolizer) and VKORC1 -1639 A/G. Combined effect significantly increases bleeding risk at standard doses. Pharmacogenomic dose algorithm required.",
    drug: "Warfarin",
    gene: "CYP2C9 / VKORC1",
    timestamp: "2024-12-15T09:23:00Z",
    acknowledged: false,
  },
  {
    id: "alert-2",
    type: "soft",
    title: "Dose Optimization — Sertraline + CYP2D6",
    description: "CYP2D6 Intermediate Metabolizer status may lead to elevated sertraline levels. Consider 25% dose reduction or switch to escitalopram.",
    drug: "Sertraline",
    gene: "CYP2D6",
    timestamp: "2024-12-15T09:23:00Z",
    acknowledged: false,
  },
  {
    id: "alert-3",
    type: "soft",
    title: "Myopathy Monitoring — Atorvastatin + SLCO1B1",
    description: "SLCO1B1 *1/*5 intermediate function increases statin-related myopathy risk. Monitor CK levels and muscle symptoms.",
    drug: "Atorvastatin",
    gene: "SLCO1B1",
    timestamp: "2024-12-14T14:05:00Z",
    acknowledged: true,
    acknowledgedBy: "Dr. Sarah Chen",
    acknowledgedAt: "2024-12-14T15:30:00Z",
  },
];

export const geneDetails: GeneDetail[] = [
  {
    gene: "CYP2D6",
    fullName: "Cytochrome P450 Family 2 Subfamily D Member 6",
    function: "Major drug-metabolizing enzyme responsible for ~25% of clinically used drugs",
    genotype: "*1/*4",
    phenotype: "Intermediate Metabolizer",
    clinicalImpact: "Reduced enzyme activity may increase plasma concentration of CYP2D6-metabolized drugs, requiring dose adjustments to avoid adverse effects.",
    chromosome: "22q13.2",
    associatedDrugs: geneDrugInteractions.filter(g => g.gene === "CYP2D6"),
  },
  {
    gene: "CYP2C9",
    fullName: "Cytochrome P450 Family 2 Subfamily C Member 9",
    function: "Metabolizes ~15% of drugs including warfarin, phenytoin, and NSAIDs",
    genotype: "*1/*3",
    phenotype: "Intermediate Metabolizer",
    clinicalImpact: "Decreased CYP2C9 activity reduces clearance of substrate drugs, particularly warfarin, increasing risk of supratherapeutic levels and bleeding.",
    chromosome: "10q23.33",
    associatedDrugs: geneDrugInteractions.filter(g => g.gene === "CYP2C9"),
  },
  {
    gene: "CYP2C19",
    fullName: "Cytochrome P450 Family 2 Subfamily C Member 19",
    function: "Metabolizes PPIs, clopidogrel, and several antidepressants",
    genotype: "*1/*1",
    phenotype: "Normal Metabolizer",
    clinicalImpact: "Normal enzyme activity. Standard drug dosing is expected to be effective with typical adverse effect profiles.",
    chromosome: "10q23.33",
    associatedDrugs: geneDrugInteractions.filter(g => g.gene === "CYP2C19"),
  },
  {
    gene: "SLCO1B1",
    fullName: "Solute Carrier Organic Anion Transporter Family Member 1B1",
    function: "Hepatic uptake transporter for statins and other drugs",
    genotype: "*1/*5",
    phenotype: "Intermediate Function",
    clinicalImpact: "Reduced hepatic uptake of statins leads to increased systemic exposure, elevating risk of dose-dependent myopathy.",
    chromosome: "12p12.2",
    associatedDrugs: geneDrugInteractions.filter(g => g.gene === "SLCO1B1"),
  },
  {
    gene: "VKORC1",
    fullName: "Vitamin K Epoxide Reductase Complex Subunit 1",
    function: "Target enzyme for warfarin anticoagulation",
    genotype: "-1639 A/G",
    phenotype: "Intermediate Sensitivity",
    clinicalImpact: "Reduced VKORC1 expression increases warfarin sensitivity, requiring lower doses to achieve target INR.",
    chromosome: "16p11.2",
    associatedDrugs: geneDrugInteractions.filter(g => g.gene === "VKORC1"),
  },
];

export const riskSummary = {
  high: geneDrugInteractions.filter(g => g.riskLevel === "high").length,
  moderate: geneDrugInteractions.filter(g => g.riskLevel === "moderate").length,
  safe: geneDrugInteractions.filter(g => g.riskLevel === "safe").length,
  unknown: geneDrugInteractions.filter(g => g.riskLevel === "unknown").length,
};
