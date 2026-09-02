"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubmitResearchPage() {
  const [step, setStep] = useState(0);
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
          <h1 className="font-heading text-2xl font-semibold text-navy">Submit Your Research Paper</h1>
          <p className="text-xs text-navy/70">{step === 0 ? "Step 0: Submission Guidelines" : `Step ${step} of 4: ${step === 1 ? "Paper Details" : step === 2 ? "Author Details" : step === 3 ? "Upload PDF & Declarations" : "Review & Submit"}`}</p>
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
              {step === 0 && (
                <div className="space-y-8 text-navy text-sm leading-relaxed">
                  <div className="space-y-3">
                    <h2 className="font-heading text-2xl font-bold">Before Submitting Your Research</h2>
                    <p>Before submitting your work, please carefully review the following guidelines.</p>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-heading text-xl font-bold text-sapphire border-b border-navy/10 pb-2">Publishing Guidelines</h3>
                    
                    <div className="space-y-2">
                      <h4 className="font-bold">Authorship & Originality</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>All submitted research must be the author's own original work.</li>
                        <li>The author is fully responsible for the content submitted.</li>
                        <li>Plagiarism in any form, including AI-generated text presented as original work or copying content without proper citation, is strictly prohibited and will result in rejection.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold">Use of Artificial Intelligence (AI)</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>The use of Artificial Intelligence (AI) tools is not allowed when writing or preparing any research submitted to this website.</li>
                        <li>AI may be used only as a tool, not as a writer.</li>
                        <li>Permitted uses of AI include Grammar checks only.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold">Editorial Review & Publication</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>The website has the right to review, edit, and make minor changes to the research for publication purposes only, without changing the main idea or meaning.</li>
                        <li>The author will be notified of any changes and has the right to approve or reject them.</li>
                        <li>If no response is received within a reasonable period of time, the website may proceed with the edits.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold">Referencing & Sources</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>All sources used must be clearly and properly cited using a consistent referencing style.</li>
                        <li>Failure to provide accurate references may result in revision requests or rejection.</li>
                        <li>After publication, authors will receive a certificate for their work.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-heading text-xl font-bold text-sapphire border-b border-navy/10 pb-2">Submission Types</h3>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-navy/10 bg-ivory/50 p-4 space-y-2">
                        <h4 className="font-bold text-navy">Research Papers</h4>
                        <p className="text-xs text-navy/70">Original research-based work that explores a specific question or problem through structured methodology, analysis, and evidence. This type focuses on presenting new findings, insights, or data-driven conclusions.</p>
                      </div>
                      <div className="rounded-2xl border border-navy/10 bg-ivory/50 p-4 space-y-2">
                        <h4 className="font-bold text-navy">Review Articles</h4>
                        <p className="text-xs text-navy/70">Analytical articles that summarize, compare, and evaluate existing research on a specific topic. Review articles do not present new data but aim to organize current knowledge and highlight patterns, gaps, or trends.</p>
                      </div>
                      <div className="rounded-2xl border border-navy/10 bg-ivory/50 p-4 space-y-2">
                        <h4 className="font-bold text-navy">Research Essays</h4>
                        <p className="text-xs text-navy/70">Thoughtful, research-informed essays that explore ideas, concepts, or questions through critical thinking and evidence. This format allows for more reflection and discussion while still requiring credible sources and academic reasoning.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                {step > 0 ? (
                  <Button variant="secondary" onClick={() => setStep(step - 1)} className="rounded-full border-navy text-navy hover:bg-navy hover:text-ivory text-xs px-5">
                    <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                  </Button>
                ) : <div />}

                {step === 0 ? (
                  <Button onClick={() => setStep(1)} className="rounded-full bg-navy hover:bg-sapphire text-ivory text-xs px-6">
                    I Have Read The Guidelines <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                ) : step < 4 ? (
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
