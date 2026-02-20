import { useState, useCallback, useRef } from "react";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileText,
  X,
  AlertTriangle,
  CheckCircle2,
  Download,
  Copy,
  ChevronDown,
  ChevronRight,
  Info,
  Search,
  Shield,
} from "lucide-react";
import { geneDrugInteractions, type RiskLevel } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [".vcf"];

// --- VCF Parsing & Validation ---

interface VcfVariant {
  chrom: string;
  pos: number;
  id: string;
  ref: string;
  alt: string;
  qual: string;
  filter: string;
  info: string;
  genotype?: string;
}

interface VcfParseResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  variants: VcfVariant[];
  sampleName?: string;
  headerLines: number;
  fileFormatVersion?: string;
}

function parseVcf(content: string): VcfParseResult {
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  const errors: string[] = [];
  const warnings: string[] = [];
  const variants: VcfVariant[] = [];
  let headerLines = 0;
  let fileFormatVersion: string | undefined;
  let sampleName: string | undefined;
  let headerFound = false;

  if (lines.length === 0) {
    return { valid: false, errors: ["File is empty."], warnings, variants, headerLines };
  }

  // Check file format line
  if (!lines[0].startsWith("##fileformat=VCF")) {
    errors.push(
      "Missing or invalid file format header. VCF files must start with '##fileformat=VCFv4.x'."
    );
  } else {
    fileFormatVersion = lines[0].split("=")[1];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("##")) {
      headerLines++;
      continue;
    }

    if (line.startsWith("#CHROM")) {
      headerLines++;
      headerFound = true;
      const cols = line.split("\t");
      if (cols.length < 8) {
        errors.push(
          `Header line has only ${cols.length} columns. Minimum 8 required (CHROM, POS, ID, REF, ALT, QUAL, FILTER, INFO).`
        );
      }
      if (cols.length >= 10) {
        sampleName = cols[9];
      }
      continue;
    }

    if (!headerFound) {
      continue;
    }

    const cols = line.split("\t");
    if (cols.length < 8) {
      warnings.push(`Line ${i + 1}: Skipped — only ${cols.length} columns (need ≥8).`);
      continue;
    }

    const pos = parseInt(cols[1], 10);
    if (isNaN(pos) || pos < 1) {
      warnings.push(`Line ${i + 1}: Invalid position value "${cols[1]}".`);
      continue;
    }

    const ref = cols[3];
    const alt = cols[4];
    if (!/^[ACGTN.]+$/i.test(ref)) {
      warnings.push(`Line ${i + 1}: Invalid REF allele "${ref}".`);
    }

    variants.push({
      chrom: cols[0],
      pos,
      id: cols[2],
      ref,
      alt,
      qual: cols[5],
      filter: cols[6],
      info: cols[7],
      genotype: cols.length >= 10 ? cols[9] : undefined,
    });
  }

  if (!headerFound) {
    errors.push("No #CHROM header line found. The file may not be a valid VCF.");
  }

  if (variants.length === 0 && errors.length === 0) {
    warnings.push("File parsed successfully but contains no variant records.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    variants,
    sampleName,
    headerLines,
    fileFormatVersion,
  };
}

// --- Mock annotation matching ---

interface AnnotatedResult {
  variant: VcfVariant;
  gene: string | null;
  interactions: typeof geneDrugInteractions;
  annotationMissing: boolean;
  explanation: string;
}

function annotateVariants(variants: VcfVariant[], drugFilter?: string): AnnotatedResult[] {
  // Map some chromosomes/positions to genes (mock)
  const chromGeneMap: Record<string, string> = {
    "22": "CYP2D6",
    "10": "CYP2C9",
    "12": "SLCO1B1",
    "16": "VKORC1",
    chr22: "CYP2D6",
    chr10: "CYP2C9",
    chr12: "SLCO1B1",
    chr16: "VKORC1",
  };

  return variants.map((v) => {
    const gene = chromGeneMap[v.chrom] || null;
    let interactions = gene
      ? geneDrugInteractions.filter((g) => g.gene === gene)
      : [];

    if (drugFilter && drugFilter.trim()) {
      interactions = interactions.filter((g) =>
        g.drug.toLowerCase().includes(drugFilter.toLowerCase())
      );
    }

    const annotationMissing = !gene;
    const explanation = annotationMissing
      ? `No pharmacogenomic annotation found for chromosome ${v.chrom} at position ${v.pos}. This variant may not be in the current PGx knowledge base, or it may reside in a gene without established drug-gene interactions.`
      : `Variant on chromosome ${v.chrom} maps to gene ${gene}. ${interactions.length} drug interaction(s) found.`;

    return { variant: v, gene, interactions, annotationMissing, explanation };
  });
}

// --- Risk badge helpers ---

const riskBadgeClass: Record<RiskLevel, string> = {
  high: "risk-badge risk-badge-high",
  moderate: "risk-badge risk-badge-moderate",
  safe: "risk-badge risk-badge-safe",
  unknown: "risk-badge risk-badge-unknown",
};

const riskLabel: Record<RiskLevel, string> = {
  high: "High Risk",
  moderate: "Dose Adj.",
  safe: "Standard",
  unknown: "No Data",
};

// --- Component ---

const VcfAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [parseResult, setParseResult] = useState<VcfParseResult | null>(null);
  const [results, setResults] = useState<AnnotatedResult[] | null>(null);
  const [drugQuery, setDrugQuery] = useState("");
  const [drugError, setDrugError] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateDrugInput = (val: string) => {
    if (val.length > 100) {
      setDrugError("Drug name must be under 100 characters.");
      return false;
    }
    if (val && !/^[a-zA-Z0-9\s\-()]+$/.test(val)) {
      setDrugError("Only letters, numbers, spaces, hyphens, and parentheses allowed.");
      return false;
    }
    setDrugError("");
    return true;
  };

  const handleDrugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDrugQuery(val);
    validateDrugInput(val);
  };

  const validateFile = (f: File): string | null => {
    const ext = f.name.substring(f.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return `Invalid file type "${ext}". Only VCF (.vcf) files are accepted.`;
    }
    if (f.size > MAX_FILE_SIZE_BYTES) {
      return `File exceeds the maximum size of ${MAX_FILE_SIZE_MB} MB.`;
    }
    if (f.size === 0) {
      return "File is empty (0 bytes).";
    }
    return null;
  };

  const processFile = useCallback(
    async (f: File) => {
      const fileError = validateFile(f);
      if (fileError) {
        toast({ title: "Invalid File", description: fileError, variant: "destructive" });
        return;
      }

      setFile(f);
      setProcessing(true);
      setResults(null);
      setParseResult(null);
      setExpandedRows(new Set());

      try {
        const text = await f.text();
        const parsed = parseVcf(text);
        setParseResult(parsed);

        if (parsed.valid) {
          const annotated = annotateVariants(parsed.variants, drugQuery);
          setResults(annotated);
        }
      } catch {
        toast({
          title: "Read Error",
          description: "Could not read the file. Please ensure it is a valid text-based VCF.",
          variant: "destructive",
        });
      } finally {
        setProcessing(false);
      }
    },
    [drugQuery]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) processFile(f);
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) processFile(f);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [processFile]
  );

  const rerunWithDrug = () => {
    if (!parseResult || !parseResult.valid) return;
    if (drugQuery && !validateDrugInput(drugQuery)) return;
    const annotated = annotateVariants(parseResult.variants, drugQuery);
    setResults(annotated);
    setExpandedRows(new Set());
  };

  const clearFile = () => {
    setFile(null);
    setParseResult(null);
    setResults(null);
    setExpandedRows(new Set());
  };

  const toggleRow = (idx: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // --- JSON Export ---

  const buildExportData = () => {
    if (!results) return null;
    return {
      file: file?.name,
      parsedAt: new Date().toISOString(),
      vcfVersion: parseResult?.fileFormatVersion,
      sampleName: parseResult?.sampleName,
      totalVariants: results.length,
      results: results.map((r) => ({
        chrom: r.variant.chrom,
        pos: r.variant.pos,
        ref: r.variant.ref,
        alt: r.variant.alt,
        gene: r.gene,
        annotationMissing: r.annotationMissing,
        explanation: r.explanation,
        interactions: r.interactions.map((i) => ({
          drug: i.drug,
          riskLevel: i.riskLevel,
          phenotype: i.phenotype,
          recommendation: i.recommendation,
          evidenceLevel: i.evidenceLevel,
          mechanism: i.mechanism,
          guidelineSource: i.guidelineSource,
          alternativeDrug: i.alternativeDrug,
        })),
      })),
    };
  };

  const downloadJson = () => {
    const data = buildExportData();
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vcf-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "JSON report saved." });
  };

  const copyJson = async () => {
    const data = buildExportData();
    if (!data) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast({ title: "Copied", description: "JSON copied to clipboard." });
    } catch {
      toast({ title: "Copy Failed", description: "Could not copy to clipboard.", variant: "destructive" });
    }
  };

  const annotatedCount = results?.filter((r) => !r.annotationMissing).length ?? 0;
  const missingCount = results?.filter((r) => r.annotationMissing).length ?? 0;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <BreadcrumbNav items={[{ label: "Dashboard", href: "/" }, { label: "VCF Analysis" }]} />

      <div className="flex-1 overflow-y-auto p-4 max-w-4xl space-y-4">
        {/* Upload Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-md border-2 border-dashed p-8 text-center transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".vcf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!file ? (
            <div className="space-y-3">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drag & drop a VCF file here, or{" "}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary font-semibold hover:underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Only <span className="font-mono font-semibold">.vcf</span> files accepted
                  &middot; Max {MAX_FILE_SIZE_MB} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* VCF Parse Errors */}
        {parseResult && !parseResult.valid && (
          <div className="rounded-md border p-4 space-y-2" style={{ borderColor: "hsl(var(--risk-high) / 0.4)", backgroundColor: "hsl(var(--risk-high-bg))" }}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" style={{ color: "hsl(var(--risk-high-foreground))" }} />
              <p className="text-sm font-semibold" style={{ color: "hsl(var(--risk-high-foreground))" }}>
                Invalid VCF File
              </p>
            </div>
            <ul className="text-sm space-y-1 ml-6 list-disc" style={{ color: "hsl(var(--risk-high-foreground))" }}>
              {parseResult.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              <Info className="inline h-3 w-3 mr-1" />
              VCF files must start with <span className="font-mono">##fileformat=VCFv4.x</span> and include a <span className="font-mono">#CHROM</span> header row with tab-separated columns.
            </p>
          </div>
        )}

        {/* Warnings */}
        {parseResult && parseResult.warnings.length > 0 && (
          <div className="rounded-md border p-3 space-y-1" style={{ borderColor: "hsl(var(--risk-moderate) / 0.4)", backgroundColor: "hsl(var(--risk-moderate-bg))" }}>
            <p className="text-xs font-semibold" style={{ color: "hsl(var(--risk-moderate-foreground))" }}>
              ⚠ {parseResult.warnings.length} warning(s)
            </p>
            {parseResult.warnings.slice(0, 5).map((w, i) => (
              <p key={i} className="text-xs" style={{ color: "hsl(var(--risk-moderate-foreground))" }}>{w}</p>
            ))}
            {parseResult.warnings.length > 5 && (
              <p className="text-xs text-muted-foreground">
                ...and {parseResult.warnings.length - 5} more
              </p>
            )}
          </div>
        )}

        {/* Drug Filter */}
        {parseResult?.valid && (
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Filter by Drug (optional)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={drugQuery}
                  onChange={handleDrugChange}
                  placeholder="e.g. Warfarin, Sertraline..."
                  className="pl-9"
                  maxLength={100}
                />
              </div>
              <Button onClick={rerunWithDrug} variant="outline" size="sm" disabled={!!drugError}>
                Apply
              </Button>
            </div>
            {drugError && (
              <p className="text-xs" style={{ color: "hsl(var(--risk-high-foreground))" }}>
                {drugError}
              </p>
            )}
          </div>
        )}

        {/* Processing spinner */}
        {processing && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Parsing VCF file...
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-3">
            {/* Summary bar */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">
                  {results.length} variant(s) parsed
                </span>
                <span className="text-xs text-muted-foreground">
                  <CheckCircle2 className="inline h-3 w-3 mr-0.5 text-risk-safe" />
                  {annotatedCount} annotated
                </span>
                {missingCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    <AlertTriangle className="inline h-3 w-3 mr-0.5" style={{ color: "hsl(var(--risk-moderate))" }} />
                    {missingCount} unannotated
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyJson}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy JSON
                </Button>
                <Button variant="outline" size="sm" onClick={downloadJson}>
                  <Download className="h-3.5 w-3.5 mr-1" /> Download JSON
                </Button>
              </div>
            </div>

            {/* Result cards */}
            {results.map((r, idx) => {
              const expanded = expandedRows.has(idx);
              return (
                <div
                  key={idx}
                  className="rounded-md border bg-card overflow-hidden"
                >
                  {/* Row header */}
                  <button
                    onClick={() => toggleRow(idx)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {expanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <span className="font-mono text-sm font-medium text-foreground">
                          {r.variant.chrom}:{r.variant.pos}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {r.variant.ref} → {r.variant.alt}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.gene ? (
                        <span className="text-xs font-semibold text-primary">{r.gene}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No gene match</span>
                      )}
                      {r.interactions.length > 0 && (
                        <span
                          className={
                            riskBadgeClass[
                              r.interactions.reduce(
                                (worst, i) =>
                                  i.riskLevel === "high"
                                    ? "high"
                                    : i.riskLevel === "moderate" && worst !== "high"
                                    ? "moderate"
                                    : worst,
                                "safe" as RiskLevel
                              )
                            ]
                          }
                        >
                          {riskLabel[
                            r.interactions.reduce(
                              (worst, i) =>
                                i.riskLevel === "high"
                                  ? "high"
                                  : i.riskLevel === "moderate" && worst !== "high"
                                  ? "moderate"
                                  : worst,
                              "safe" as RiskLevel
                            )
                          ]}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {expanded && (
                    <div className="border-t px-4 py-4 space-y-4">
                      {/* Explanation */}
                      <div className="flex items-start gap-2 p-3 rounded bg-muted/50">
                        <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-sm text-foreground">{r.explanation}</p>
                      </div>

                      {/* Variant details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-[10px] font-semibold uppercase text-muted-foreground">ID</p>
                          <p className="font-mono text-foreground">{r.variant.id || "."}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase text-muted-foreground">Quality</p>
                          <p className="text-foreground">{r.variant.qual}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase text-muted-foreground">Filter</p>
                          <p className="text-foreground">{r.variant.filter}</p>
                        </div>
                        {r.variant.genotype && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Genotype</p>
                            <span className="genotype-box">{r.variant.genotype}</span>
                          </div>
                        )}
                      </div>

                      {/* Missing annotation notice */}
                      {r.annotationMissing && (
                        <div
                          className="rounded-md border p-3 flex items-start gap-2"
                          style={{
                            borderColor: "hsl(var(--risk-unknown) / 0.4)",
                            backgroundColor: "hsl(var(--risk-unknown-bg))",
                          }}
                        >
                          <Shield className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "hsl(var(--risk-unknown-foreground))" }} />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: "hsl(var(--risk-unknown-foreground))" }}>
                              No Annotation Available
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "hsl(var(--risk-unknown-foreground))" }}>
                              This variant is not currently mapped to a pharmacogene in our knowledge base. It may be a benign polymorphism, located in a non-coding region, or in a gene without established drug-gene interactions. Consult PharmGKB or CPIC for additional resources.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Interactions */}
                      {r.interactions.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Drug Interactions ({r.interactions.length})
                          </p>
                          {r.interactions.map((interaction) => (
                            <div key={interaction.id} className="rounded border bg-card p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm text-foreground">
                                  {interaction.drug}
                                </span>
                                <span className={riskBadgeClass[interaction.riskLevel]}>
                                  {riskLabel[interaction.riskLevel]}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {interaction.phenotype} &middot; Evidence: {interaction.evidenceLevel}
                              </p>
                              <div className="rounded bg-muted/50 border p-2">
                                <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                                  Recommendation
                                </p>
                                <p className="text-sm text-foreground">{interaction.recommendation}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">Mechanism</p>
                                  <p className="text-foreground">{interaction.mechanism}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">Guideline</p>
                                  <p className="text-foreground">{interaction.guidelineSource}</p>
                                </div>
                              </div>
                              {interaction.alternativeDrug && (
                                <div className="rounded border p-2 border-primary/20" style={{ backgroundColor: "hsl(var(--clinical-blue-light))" }}>
                                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                                    Alternative
                                  </p>
                                  <p className="text-sm font-semibold text-primary">
                                    {interaction.alternativeDrug}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VcfAnalysis;
