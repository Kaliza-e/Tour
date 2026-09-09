"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, FileText, FolderUp, ShieldCheck, Sparkles } from "lucide-react";

const researchTypes = [
  "Research Article",
  "Student Science Writing",
  "Exploratory Essay",
  "Literature Review",
  "Research Project",
  "Experimental Study",
  "Opinion / Reflection based on research",
  "Other",
];

const requirements = [
  "This is my original work or I have properly credited sources.",
  "The information provided is accurate to the best of my knowledge.",
  "I have permission to submit this work for review.",
  "I understand that submission does not guarantee publication.",
  "TOUR may request revisions before publication.",
  "I agree that approved work may be published on the TOUR platform.",
];

const statuses = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "REVISION_REQUESTED",
  "RESUBMITTED",
  "APPROVED",
  "PUBLISHED",
  "REJECTED",
];

const initialForm = {
  fullName: "",
  email: "",
  institution: "",
  country: "",
  academicLevel: "",
  coAuthors: "",
  authorBio: "",
  title: "",
  abstract: "",
  category: "",
  researchType: researchTypes[0],
  keywords: "",
  description: "",
  methodology: "",
  references: "",
  supportingLinks: "",
  fileName: "",
  file: null as File | null,
  isTermsAccepted: false,
};

export default function GetPublishedPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const progress = useMemo(() => (step / 5) * 100, [step]);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (step === 1) return Boolean(form.title && form.abstract && form.category);
    if (step === 2) return Boolean(form.fullName && form.email);
    if (step === 3) return Boolean(form.fileName || form.title);
    if (step === 4) return form.isTermsAccepted;
    return true;
  };

  const next = () => setStep((prev) => Math.min(prev + 1, 5));
  const previous = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage("");

    try {
      let uploadedFile = { fileUrl: "", fileName: form.fileName || "research-submission.pdf", fileType: "application/pdf" };

      if (form.file) {
        const uploadData = new FormData();
        uploadData.append("file", form.file);
        const uploadResponse = await fetch("/api/submissions/upload", { method: "POST", body: uploadData });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.error || "Unable to upload your file.");
        uploadedFile = uploadResult;
      }

      const payload = {
        ...form,
        file: undefined,
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        coAuthors: form.coAuthors.split(",").map((k) => k.trim()).filter(Boolean),
        supportingLinks: form.supportingLinks.split("\n").map((link) => link.trim()).filter(Boolean),
        ...uploadedFile,
        isTermsAccepted: form.isTermsAccepted,
      };

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data: { error?: string; submission?: { submissionId?: string } } = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error("The server returned an invalid response. Please try again.");
        }
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit research.");
      }

      setMessage(`Submission received! Your submission ID is ${data.submission?.submissionId || "TOUR-NEW"}.`);
      setStep(5);
      setForm(initialForm);
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Unable to submit your research right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory py-16 md:py-20">
      <div className="container-tour space-y-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sapphire">Get published</p>
          <h1 className="mt-4 font-heading text-3xl font-semibold text-navy md:text-5xl">
            Get your work published.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-navy/70">
            Have you completed a research project, scientific article, exploratory essay, or student-led investigation? Submit your work to TOUR for review. Our team evaluates submissions for originality, clarity, research quality, and alignment with TOUR’s mission. Approved work can be published on the TOUR platform and shared with other young researchers and readers.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy/90"
            >
              Submit your research <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sapphire/10 text-sapphire">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-navy">Submission requirements</h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-navy/70">
                {requirements.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-sapphire" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-champagne text-navy">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-navy">Status workflow</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <span key={status} className="rounded-full border border-navy/10 bg-ivory px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy/70">
                    {status}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card">
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-navy/60">
                <span>Submission process</span>
                <span>{step}/5</span>
              </div>
              <div className="h-2.5 rounded-full bg-ivory">
                <div className="h-2.5 rounded-full bg-sapphire transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {message && (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                {message}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-heading text-2xl font-bold text-navy">Step 1: About your work</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="md:col-span-2 block text-sm font-medium text-navy">
                    Research/project title *
                    <input value={form.title} onChange={(e) => updateField("title", e.target.value)} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm text-navy outline-none focus:border-sapphire" placeholder="The Hidden Effects of Urban Air Pollution" />
                  </label>
                  <label className="md:col-span-2 block text-sm font-medium text-navy">
                    Abstract / short summary *
                    <textarea value={form.abstract} onChange={(e) => updateField("abstract", e.target.value)} rows={5} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm text-navy outline-none focus:border-sapphire" placeholder="Briefly summarize your work and the main findings." />
                  </label>
                  <label className="block text-sm font-medium text-navy">
                    Research topic/category *
                    <input value={form.category} onChange={(e) => updateField("category", e.target.value)} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm text-navy outline-none focus:border-sapphire" placeholder="Environment" />
                  </label>
                  <label className="block text-sm font-medium text-navy">
                    Research type *
                    <select value={form.researchType} onChange={(e) => updateField("researchType", e.target.value)} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm text-navy outline-none focus:border-sapphire">
                      {researchTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </label>
                  <label className="md:col-span-2 block text-sm font-medium text-navy">
                    Keywords
                    <input value={form.keywords} onChange={(e) => updateField("keywords", e.target.value)} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm text-navy outline-none focus:border-sapphire" placeholder="air pollution, student research, environment" />
                  </label>
                  <label className="md:col-span-2 block text-sm font-medium text-navy">
                    Research/project description
                    <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm text-navy outline-none focus:border-sapphire" placeholder="Describe the problem, context, or motivation behind the work." />
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-heading text-2xl font-bold text-navy">Step 2: Author details</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-medium text-navy">
                    Full name *
                    <input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-sapphire" />
                  </label>
                  <label className="block text-sm font-medium text-navy">
                    Email address *
                    <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-sapphire" />
                  </label>
                  <label className="block text-sm font-medium text-navy">
                    School / institution
                    <input value={form.institution} onChange={(e) => updateField("institution", e.target.value)} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-sapphire" />
                  </label>
                  <label className="block text-sm font-medium text-navy">
                    Country
                    <input value={form.country} onChange={(e) => updateField("country", e.target.value)} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-sapphire" />
                  </label>
                  <label className="block text-sm font-medium text-navy">
                    Academic level
                    <input value={form.academicLevel} onChange={(e) => updateField("academicLevel", e.target.value)} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-sapphire" placeholder="High school / undergraduate / graduate" />
                  </label>
                  <label className="block text-sm font-medium text-navy">
                    Optional co-authors
                    <input value={form.coAuthors} onChange={(e) => updateField("coAuthors", e.target.value)} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-sapphire" placeholder="Jane Doe, Alex Kim" />
                  </label>
                  <label className="md:col-span-2 block text-sm font-medium text-navy">
                    Author bio
                    <textarea value={form.authorBio} onChange={(e) => updateField("authorBio", e.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-sapphire" placeholder="Briefly describe your background and your research interests." />
                  </label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-heading text-2xl font-bold text-navy">Step 3: Upload your work</h2>
                <div className="rounded-2xl border-2 border-dashed border-navy/15 bg-ivory p-6 text-center">
                  <FolderUp className="mx-auto h-10 w-10 text-sapphire" />
                  <p className="mt-3 text-sm font-medium text-navy">Upload PDF or DOCX</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setForm((previous) => ({ ...previous, file, fileName: file?.name || "" }));
                    }}
                    className="mt-4 block w-full text-sm text-navy file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                  {form.fileName && <p className="mt-3 text-xs text-navy/60">Selected file: {form.fileName}</p>}
                </div>

                <div className="grid gap-4">
                  <label className="block text-sm font-medium text-navy">
                    Methodology
                    <textarea value={form.methodology} onChange={(e) => updateField("methodology", e.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-sapphire" placeholder="Describe how the research was conducted." />
                  </label>
                  <label className="block text-sm font-medium text-navy">
                    References / sources
                    <textarea value={form.references} onChange={(e) => updateField("references", e.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-sapphire" placeholder="Add citations or link to the sources used." />
                  </label>
                  <label className="block text-sm font-medium text-navy">
                    Supporting links
                    <textarea value={form.supportingLinks} onChange={(e) => updateField("supportingLinks", e.target.value)} rows={2} className="mt-2 w-full rounded-2xl border border-navy/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-sapphire" placeholder="Add links to datasets, GitHub repos, or demo materials (one per line)" />
                  </label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <h2 className="font-heading text-2xl font-bold text-navy">Step 4: Review and submit</h2>
                <div className="rounded-2xl border border-navy/10 bg-ivory p-5 text-sm text-navy/75">
                  <p className="font-semibold">Summary</p>
                  <div className="mt-3 space-y-2">
                    <p><strong>Title:</strong> {form.title}</p>
                    <p><strong>Category:</strong> {form.category}</p>
                    <p><strong>Author:</strong> {form.fullName}</p>
                    <p><strong>Document:</strong> {form.fileName || "No file selected"}</p>
                  </div>
                </div>

                <label className="flex items-start gap-3 rounded-2xl border border-navy/10 bg-ivory p-4 text-sm text-navy/75">
                  <input type="checkbox" checked={form.isTermsAccepted} onChange={(e) => updateField("isTermsAccepted", e.target.checked)} className="mt-1 h-4 w-4 rounded border-navy/20" />
                  <span>I agree to the TOUR submission and publication terms.</span>
                </label>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-navy">Submission received!</h2>
                <p className="text-sm leading-relaxed text-navy/70">
                  Your research has been successfully submitted to TOUR. A member of the TOUR team will review it, and you can track its progress from your dashboard.
                </p>
                <div className="rounded-2xl border border-navy/10 bg-ivory p-4 text-sm text-navy/75">
                  Submission ID: <span className="font-semibold">TOUR-NEW</span>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-navy/10 pt-5">
              <button
                type="button"
                onClick={previous}
                disabled={step === 1 || step === 5}
                className="rounded-full border border-navy/10 px-4 py-2 text-sm font-medium text-navy disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canProceed()}
                  className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              ) : step === 4 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="rounded-full bg-sapphire px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSubmitting ? "Submitting..." : "Submit your research"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Submit another
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
