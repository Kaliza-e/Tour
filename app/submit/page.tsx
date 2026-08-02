"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubmitResearchPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Environmental Science",
    submissionType: "Research Paper",
    abstract: "",
    authorName: "",
    authorSchool: "",
    pdfAttached: false,
    declaration: false,
  });

  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container-tour max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sapphire">
            <Upload className="h-4 w-4" /> Multi-Step Peer Submission
          </div>
          <h1 className="font-heading text-4xl font-extrabold text-navy">Submit Your Research Paper</h1>
          <p className="text-xs text-navy/70">Step {step} of 4: {step === 1 ? "Paper Details" : step === 2 ? "Author Details" : step === 3 ? "Upload PDF & Declarations" : "Review & Submit"}</p>
        </div>

        {/* Wizard Card */}
        <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card space-y-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="h-16 w-16 mx-auto text-emerald-600 animate-bounce" />
              <h3 className="font-heading text-3xl font-bold text-navy">Paper Submitted Successfully!</h3>
              <p className="text-sm text-navy/70 max-w-md mx-auto">
                Your paper has entered the TOUR double-blind peer review queue. Track status in your User Dashboard.
              </p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-navy/80 mb-1">Paper Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Microplastic Bioaccumulation in Urban Freshwater Systems"
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-navy/80 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                      >
                        <option>Environmental Science</option>
                        <option>Computer Science</option>
                        <option>Psychology</option>
                        <option>Physics</option>
                        <option>Biology</option>
                        <option>Medicine</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-navy/80 mb-1">Submission Type</label>
                      <select
                        value={formData.submissionType}
                        onChange={(e) => setFormData({ ...formData, submissionType: e.target.value })}
                        className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                      >
                        <option>Research Paper</option>
                        <option>Review Article</option>
                        <option>Research Essay / Hypothesis</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-navy/80 mb-1">Abstract (150 - 300 words)</label>
                    <textarea
                      rows={5}
                      value={formData.abstract}
                      onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                      placeholder="Summarize the core research question, methodology, data findings, and conclusions..."
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                    ></textarea>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-navy/80 mb-1">Lead Author Name</label>
                    <input
                      type="text"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      placeholder="e.g. Leah Martinez"
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-navy/80 mb-1">School or Institution</label>
                    <input
                      type="text"
                      value={formData.authorSchool}
                      onChange={(e) => setFormData({ ...formData, authorSchool: e.target.value })}
                      placeholder="e.g. Oakridge High School"
                      className="w-full rounded-2xl border border-navy/15 bg-ivory/40 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sapphire"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="rounded-2xl border-2 border-dashed border-navy/20 bg-ivory/30 p-8 text-center space-y-3">
                    <FileText className="h-10 w-10 mx-auto text-sapphire" />
                    <p className="text-xs font-bold text-navy">Drag & drop your compiled manuscript (PDF format)</p>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setFormData({ ...formData, pdfAttached: true })}
                      className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs"
                    >
                      {formData.pdfAttached ? "✓ PDF Attached (Research_Paper.pdf)" : "Browse Files"}
                    </Button>
                  </div>

                  <div className="rounded-2xl bg-champagne/40 p-4 space-y-2 text-xs text-navy">
                    <label className="flex items-start gap-2 cursor-pointer font-semibold">
                      <input
                        type="checkbox"
                        checked={formData.declaration}
                        onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                        className="mt-0.5"
                      />
                      <span>I declare that this paper represents original youth work and adheres to TOUR AI usage & citation ethics policies.</span>
                    </label>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 text-xs text-navy">
                  <div className="p-4 rounded-2xl bg-ivory/60 space-y-1">
                    <p className="font-bold uppercase text-sapphire text-[10px]">Title</p>
                    <p className="font-heading font-bold text-base">{formData.title || "Untitled Research Paper"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-ivory/60 space-y-1">
                    <p className="font-bold uppercase text-sapphire text-[10px]">Category & Type</p>
                    <p className="font-semibold">{formData.category} • {formData.submissionType}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-ivory/60 space-y-1">
                    <p className="font-bold uppercase text-sapphire text-[10px]">Author</p>
                    <p className="font-semibold">{formData.authorName || "Anonymous Student"} ({formData.authorSchool || "High School"})</p>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex justify-between pt-4 border-t border-navy/10">
                {step > 1 ? (
                  <Button variant="secondary" onClick={() => setStep(step - 1)} className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs px-5">
                    <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                  </Button>
                ) : <div />}

                {step < 4 ? (
                  <Button onClick={() => setStep(step + 1)} className="rounded-full bg-navy hover:bg-sapphire text-ivory text-xs px-6">
                    Next Step <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={() => setSubmitted(true)} className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-ivory text-xs px-6 font-bold">
                    Submit Paper for Peer Review
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
