"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useSession } from "next-auth/react";
import {
  X,
  Upload,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Award,
  Sparkles,
  HelpCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { FlaticonHeart, FlaticonCheckCircle, FlaticonGraduation } from "@/components/flaticons";

export const PUBLICATION_CATEGORIES = [
  "Life Sciences",
  "Medicine & Public Health",
  "Technology & Engineering",
  "Environment & Future Science",
  "Social Sciences & Education",
  "History, Culture & Humanities",
  "Business & Economics",
  "Other",
] as const;

export const SUBMISSION_TYPES = [
  "Research Paper",
  "Review Article",
  "Research Essay",
] as const;

export const AI_USE_OPTIONS = [
  { value: "No", label: "No", desc: "No AI tools were used at all." },
  {
    value: "Yes, only for grammar/spelling",
    label: "Yes, only for grammar/spelling",
    desc: "Used strictly for proofreading grammar and typos.",
  },
  {
    value: "Yes, for coding or methodology",
    label: "Yes, for coding or methodology",
    desc: "Assisted with code snippets or computational modeling (declared in text).",
  },
  {
    value: "Other",
    label: "Other",
    desc: "Other transparent educational assistance.",
  },
] as const;

export interface ExistingDraft {
  id: string;
  title: string;
  abstract: string;
  category: string;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
}

interface PublicationSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingDrafts?: ExistingDraft[];
  preselectedDraftId?: string | null;
  prefilledQuestionId?: string | null;
  prefilledQuestionTitle?: string | null;
}

export function PublicationSubmissionModal({
  isOpen,
  onClose,
  onSuccess,
  existingDrafts = [],
  preselectedDraftId,
  prefilledQuestionId,
  prefilledQuestionTitle,
}: PublicationSubmissionModalProps) {
  const { data: session } = useSession();

  // Mode: "upload" or "attach_draft"
  const [paperSource, setPaperSource] = useState<"upload" | "attach_draft">("upload");
  const [selectedDraftId, setSelectedDraftId] = useState<string>("");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("");
  const [title, setTitle] = useState("");
  const [submissionType, setSubmissionType] = useState<string>(SUBMISSION_TYPES[0]);
  const [category, setCategory] = useState<string>(PUBLICATION_CATEGORIES[0]);
  const [isFirstPaper, setIsFirstPaper] = useState<string>("No");
  const [referencesIncluded, setReferencesIncluded] = useState<string>("Yes");
  const [whyTopic, setWhyTopic] = useState("");
  const [isOriginalWork, setIsOriginalWork] = useState<string>("Yes");
  const [isPublishedBefore, setIsPublishedBefore] = useState<string>("No");
  const [publishedWhere, setPublishedWhere] = useState("");
  const [aiUse, setAiUse] = useState<string>(AI_USE_OPTIONS[0].value);
  const [wantsVolunteerHours, setWantsVolunteerHours] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{
    fileUrl: string;
    fileName: string;
    fileType: string;
  } | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Honeypot & UI state
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submissionSuccessData, setSubmissionSuccessData] = useState<{
    code: string;
    title: string;
  } | null>(null);

  // Prefill user data & initial draft/question info
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) {
        setFullName((prev) => prev || session.user.name || "");
      }
      if (session.user.email) {
        setEmail((prev) => prev || session.user.email || "");
      }
    }
  }, [session]);

  // Handle draft preselection
  useEffect(() => {
    if (preselectedDraftId && existingDrafts.length > 0) {
      const match = existingDrafts.find((d) => d.id === preselectedDraftId);
      if (match) {
        setPaperSource("attach_draft");
        setSelectedDraftId(match.id);
        setTitle(match.title);
        if (match.category && PUBLICATION_CATEGORIES.includes(match.category as any)) {
          setCategory(match.category);
        }
        if (match.fileUrl && match.fileName) {
          setUploadedFileInfo({
            fileUrl: match.fileUrl,
            fileName: match.fileName,
            fileType: match.fileType || "application/pdf",
          });
        }
      }
    }
  }, [preselectedDraftId, existingDrafts]);

  // Handle draft selection changes
  const handleSelectDraft = (draftId: string) => {
    setSelectedDraftId(draftId);
    setErrors((prev) => ({ ...prev, paper: "" }));
    const draft = existingDrafts.find((d) => d.id === draftId);
    if (draft) {
      if (!title || title.trim() === "") setTitle(draft.title);
      if (draft.category && PUBLICATION_CATEGORIES.includes(draft.category as any)) {
        setCategory(draft.category);
      }
      if (draft.fileUrl && draft.fileName) {
        setUploadedFileInfo({
          fileUrl: draft.fileUrl,
          fileName: draft.fileName,
          fileType: draft.fileType || "application/pdf",
        });
      } else {
        setUploadedFileInfo(null);
      }
    }
  };

  // Upload file to server
  const handleFileUpload = async (selectedFile: File) => {
    setErrors((prev) => ({ ...prev, file: "" }));
    // Client-side file type & size check
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const isDoc =
      allowed.includes(selectedFile.type) ||
      /\.(pdf|doc|docx)$/i.test(selectedFile.name);

    if (!isDoc) {
      setErrors((prev) => ({
        ...prev,
        file: "Only PDF (.pdf) and Word (.docx, .doc) files are accepted.",
      }));
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: "File size exceeds 10 MB limit. Please compress or optimize your document.",
      }));
      return;
    }

    setFile(selectedFile);
    setIsUploadingFile(true);

    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      const res = await fetch("/api/submissions/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload file.");
      }
      setUploadedFileInfo(data);
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        file: err.message || "Failed to upload file.",
      }));
      setFile(null);
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Validate all fields
  const validate = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name.";
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (!country.trim() || country.trim().length < 2) {
      errs.country = "Please enter your country.";
    }

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
      errs.age = "Please enter a valid age (10 or above).";
    }

    if (!grade.trim()) {
      errs.grade = "Please enter your grade or year of study (e.g., 11th Grade, Sophomore).";
    }

    if (!title.trim() || title.trim().length < 5) {
      errs.title = "Please provide your research title (at least 5 characters).";
    }

    if (!submissionType) {
      errs.submissionType = "Please select a submission type.";
    }

    if (!category) {
      errs.category = "Please select a research category.";
    }

    // Paper file validation
    if (paperSource === "upload") {
      if (!uploadedFileInfo) {
        errs.file = "Please upload your manuscript file (PDF or DOCX, max 10 MB).";
      }
    } else {
      if (!selectedDraftId) {
        errs.paper = "Please choose a draft from your notebook to attach.";
      } else if (!uploadedFileInfo) {
        errs.file = "The selected draft does not have an attached file. Please upload a file below.";
      }
    }

    if (isOriginalWork !== "Yes") {
      errs.isOriginalWork = "Tour only accepts original research written by the author.";
    }

    if (isPublishedBefore === "Yes" && (!publishedWhere || publishedWhere.trim().length < 3)) {
      errs.publishedWhere = "Please specify where and when the research was previously published.";
    }

    if (!isTermsAccepted) {
      errs.isTermsAccepted = "You must agree to Tour's publication guidelines and rules.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) {
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        document.getElementById(`sub-field-${firstKey}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    // Honeypot check
    if (honeypot && honeypot.trim().length > 0) {
      onClose();
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          abstract: whyTopic.trim() || title.trim(),
          category,
          researchType: submissionType,
          fullName: fullName.trim(),
          email: email.trim(),
          country: country.trim(),
          age: parseInt(age, 10),
          academicLevel: grade.trim(),
          isFirstPaper: isFirstPaper === "Yes",
          referencesIncluded: referencesIncluded === "Yes",
          whyTopic: whyTopic.trim() || undefined,
          isOriginalWork: isOriginalWork === "Yes",
          isPublishedBefore: isPublishedBefore === "Yes",
          publishedWhere: isPublishedBefore === "Yes" ? publishedWhere.trim() : undefined,
          aiUse,
          wantsVolunteerHours,
          isTermsAccepted: true,
          fileUrl: uploadedFileInfo?.fileUrl,
          fileName: uploadedFileInfo?.fileName,
          fileType: uploadedFileInfo?.fileType,
          questionId: prefilledQuestionId || undefined,
          questionTitle: prefilledQuestionTitle || undefined,
          isDraft: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit research.");
      }

      setSubmissionSuccessData({
        code: data.submission?.submissionId || "TOUR-PENDING",
        title: title.trim(),
      });
      onSuccess();
    } catch (err: any) {
      setServerError(err.message || "Failed to submit research. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-3 sm:p-4 md:p-6 backdrop-blur-md overflow-y-auto">
      <div className="relative my-auto w-full max-w-3xl rounded-[32px] border-2 border-navy/20 bg-white p-6 sm:p-8 md:p-10 shadow-2xl text-navy max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close submission modal"
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-navy/5 text-navy/60 hover:bg-navy/10 hover:text-navy transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* THANK YOU / SUCCESS STATE */}
        {submissionSuccessData ? (
          <div className="text-center py-6 space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-sapphire/10 text-sapphire border border-sapphire/20">
              <CheckCircle2 size={44} />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sapphire">
                Manuscript Received
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy">
                Thank you, {fullName}!
              </h2>
              <p className="max-w-md mx-auto text-sm text-navy/70 leading-relaxed">
                Your research manuscript has been successfully submitted to the Tour editorial desk.
              </p>
            </div>

            <div className="rounded-2xl border border-navy/15 bg-ivory/60 p-5 max-w-md mx-auto text-left space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-navy/10 pb-2">
                <span className="text-navy/60">Reference Code:</span>
                <span className="font-mono font-bold text-sapphire">
                  {submissionSuccessData.code}
                </span>
              </div>
              <div className="flex justify-between border-b border-navy/10 pb-2">
                <span className="text-navy/60">Manuscript:</span>
                <span className="font-semibold text-navy truncate max-w-[200px]">
                  {submissionSuccessData.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy/60">Category:</span>
                <span className="font-semibold text-navy">{category}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-sapphire/20 bg-champagne/40 p-4 max-w-md mx-auto text-xs text-navy/75 text-left leading-relaxed">
              <p className="font-bold text-navy mb-1 flex items-center gap-1.5">
                <Sparkles size={14} className="text-sapphire" /> Next Steps & Review
              </p>
              Tour editors will conduct an initial originality and structure check. If revisions are
              suggested, you will be notified directly in your Notebook and via email.
            </div>

            <div className="pt-2 flex justify-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full bg-navy px-8 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-sapphire transition shadow-md"
              >
                <span>Done & Return to Notebook</span>
              </button>
            </div>
          </div>
        ) : (
          /* MAIN PUBLICATION SUBMISSION FORM */
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/25 bg-sapphire/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-sapphire">
                <BookOpen size={14} /> Submit for Publication
              </div>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-navy">
                Publish Your Research
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-navy/65">
                Submit your paper or essay for peer and editorial review on Tour.
              </p>
            </div>

            {/* Linked Question Hub Callout */}
            {prefilledQuestionTitle && (
              <div className="rounded-2xl border border-sapphire/30 bg-sapphire/5 p-4 flex items-start gap-3">
                <BookOpen size={18} className="text-sapphire shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-sapphire uppercase tracking-wider">
                    Linked Question Hub Inquiry
                  </span>
                  <p className="font-semibold text-navy mt-0.5">{prefilledQuestionTitle}</p>
                  <p className="text-navy/60 mt-0.5">
                    This submission will be tied to your claimed question in the Question Hub upon approval.
                  </p>
                </div>
              </div>
            )}

            {/* TOUR RULES & GUIDELINES BANNER */}
            <div className="rounded-2xl border-2 border-sapphire/20 bg-champagne/40 p-4 sm:p-5 text-xs text-navy/80 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-navy text-sm">
                <ShieldCheck size={18} className="text-sapphire" /> Tour Publication Rules & Standards
              </div>
              <ul className="grid gap-1.5 sm:grid-cols-2 text-navy/75 pl-4 list-disc">
                <li>Must be original work written by the author.</li>
                <li>All sources, datasets, and citations must be properly credited.</li>
                <li>Plagiarism, including AI-generated text, results in immediate rejection.</li>
                <li>AI tools may only be used for grammar/spelling checks or transparent coding.</li>
                <li>Tour may make minor editorial improvements and will notify the author to approve or reject.</li>
              </ul>
            </div>

            {serverError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-xs text-red-700">
                <AlertCircle size={18} className="shrink-0 text-red-600" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Honeypot for spam bots */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* SECTION 1: AUTHOR INFORMATION */}
              <div className="space-y-3.5 border-b border-navy/10 pb-5">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-navy/80">
                  1. Author Profile
                </h3>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div id="sub-field-fullName">
                    <label className="block text-xs font-bold text-navy/80">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      className={`mt-1 h-10 w-full rounded-xl border bg-ivory/30 px-3.5 text-xs sm:text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                        errors.fullName
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-navy/20 focus:border-sapphire"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div id="sub-field-email">
                    <label className="block text-xs font-bold text-navy/80">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. maya@example.com"
                      className={`mt-1 h-10 w-full rounded-xl border bg-ivory/30 px-3.5 text-xs sm:text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                        errors.email
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-navy/20 focus:border-sapphire"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div id="sub-field-country">
                    <label className="block text-xs font-bold text-navy/80">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Canada, Germany, Nigeria"
                      className={`mt-1 h-10 w-full rounded-xl border bg-ivory/30 px-3.5 text-xs sm:text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                        errors.country
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-navy/20 focus:border-sapphire"
                      }`}
                    />
                    {errors.country && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.country}</p>
                    )}
                  </div>

                  <div id="sub-field-age">
                    <label className="block text-xs font-bold text-navy/80">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 17"
                      className={`mt-1 h-10 w-full rounded-xl border bg-ivory/30 px-3.5 text-xs sm:text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                        errors.age
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-navy/20 focus:border-sapphire"
                      }`}
                    />
                    {errors.age && <p className="mt-1 text-[11px] text-red-600">{errors.age}</p>}
                  </div>
                </div>

                <div id="sub-field-grade">
                  <label className="block text-xs font-bold text-navy/80">
                    Grade or Year of Study <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g. 11th Grade, High School Senior, Undergraduate Year 1, Gap Year"
                    className={`mt-1 h-10 w-full rounded-xl border bg-ivory/30 px-3.5 text-xs sm:text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                      errors.grade
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-navy/20 focus:border-sapphire"
                    }`}
                  />
                  {errors.grade && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.grade}</p>
                  )}
                </div>
              </div>

              {/* SECTION 2: RESEARCH DETAILS */}
              <div className="space-y-3.5 border-b border-navy/10 pb-5">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-navy/80">
                  2. Manuscript Details
                </h3>

                <div id="sub-field-title">
                  <label className="block text-xs font-bold text-navy/80">
                    Research Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Evaluating Microplastic Ingestion in Local Freshwater Systems"
                    className={`mt-1 h-10 w-full rounded-xl border bg-ivory/30 px-3.5 text-xs sm:text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                      errors.title
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-navy/20 focus:border-sapphire"
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div id="sub-field-submissionType">
                    <label className="block text-xs font-bold text-navy/80">
                      Submission Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={submissionType}
                      onChange={(e) => setSubmissionType(e.target.value)}
                      className="mt-1 h-10 w-full rounded-xl border border-navy/20 bg-ivory/30 px-3.5 text-xs sm:text-sm text-navy focus:border-sapphire focus:outline-none transition"
                    >
                      {SUBMISSION_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div id="sub-field-category">
                    <label className="block text-xs font-bold text-navy/80">
                      Research Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 h-10 w-full rounded-xl border border-navy/20 bg-ivory/30 px-3.5 text-xs sm:text-sm text-navy focus:border-sapphire focus:outline-none transition"
                    >
                      {PUBLICATION_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-navy/80">
                      Is this your first research paper? <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[11px] text-navy/55 mb-1.5">Note: This does not affect review.</p>
                    <div className="flex gap-4">
                      {["No", "Yes"].map((val) => (
                        <label key={val} className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="isFirstPaper"
                            value={val}
                            checked={isFirstPaper === val}
                            onChange={(e) => setIsFirstPaper(e.target.value)}
                            className="text-navy focus:ring-sapphire"
                          />
                          <span>{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy/80">
                      Are references and citations included? <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[11px] text-navy/55 mb-1.5">Academic sources should be properly listed.</p>
                    <div className="flex gap-4">
                      {["Yes", "No"].map((val) => (
                        <label key={val} className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="referencesIncluded"
                            value={val}
                            checked={referencesIncluded === val}
                            onChange={(e) => setReferencesIncluded(e.target.value)}
                            className="text-navy focus:ring-sapphire"
                          />
                          <span>{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy/80">
                    Why this topic? (Optional)
                  </label>
                  <p className="text-[11px] text-navy/55 mb-1">
                    What sparked your curiosity or motivated you to study this problem?
                  </p>
                  <textarea
                    rows={2}
                    value={whyTopic}
                    onChange={(e) => setWhyTopic(e.target.value)}
                    placeholder="Briefly describe what inspired you..."
                    className="w-full rounded-xl border border-navy/20 bg-ivory/30 p-3 text-xs sm:text-sm text-navy placeholder:text-navy/30 focus:border-sapphire focus:outline-none transition"
                  />
                </div>
              </div>

              {/* SECTION 3: MANUSCRIPT UPLOAD OR DRAFT ATTACHMENT */}
              <div id="sub-field-file" className="space-y-3.5 border-b border-navy/10 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-navy/80">
                    3. Manuscript Document <span className="text-red-500">*</span>
                  </h3>

                  {existingDrafts.length > 0 && (
                    <div className="inline-flex rounded-xl bg-ivory p-1 border border-navy/10 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setPaperSource("upload")}
                        className={`px-3 py-1 rounded-lg transition ${
                          paperSource === "upload"
                            ? "bg-navy text-white shadow-xs"
                            : "text-navy/70 hover:text-navy"
                        }`}
                      >
                        Upload Document
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaperSource("attach_draft")}
                        className={`px-3 py-1 rounded-lg transition ${
                          paperSource === "attach_draft"
                            ? "bg-navy text-white shadow-xs"
                            : "text-navy/70 hover:text-navy"
                        }`}
                      >
                        Attach from Notebook ({existingDrafts.length})
                      </button>
                    </div>
                  )}
                </div>

                {paperSource === "attach_draft" && existingDrafts.length > 0 ? (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-navy/80">
                      Select Notebook Draft to Submit:
                    </label>
                    <select
                      value={selectedDraftId}
                      onChange={(e) => handleSelectDraft(e.target.value)}
                      className="h-10 w-full rounded-xl border border-navy/20 bg-ivory/30 px-3.5 text-xs sm:text-sm text-navy focus:border-sapphire focus:outline-none"
                    >
                      <option value="">Choose a draft...</option>
                      {existingDrafts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.title} ({d.fileName || "No file attached"})
                        </option>
                      ))}
                    </select>

                    {uploadedFileInfo && (
                      <div className="rounded-xl border border-sapphire/30 bg-sapphire/5 p-3 flex items-center justify-between text-xs text-navy">
                        <span className="flex items-center gap-2">
                          <FileText size={16} className="text-sapphire" />
                          <span>
                            Attached: <strong>{uploadedFileInfo.fileName}</strong>
                          </span>
                        </span>
                        <a
                          href={uploadedFileInfo.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sapphire hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Preview</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(f);
                      }}
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
                        uploadedFileInfo
                          ? "border-sapphire bg-sapphire/5"
                          : errors.file
                          ? "border-red-400 bg-red-50/30"
                          : "border-navy/20 bg-ivory/30 hover:border-sapphire hover:bg-ivory/60"
                      }`}
                    >
                      {isUploadingFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 size={24} className="animate-spin text-sapphire" />
                          <span className="text-xs font-semibold text-navy">
                            Uploading and verifying manuscript...
                          </span>
                        </div>
                      ) : uploadedFileInfo ? (
                        <div className="flex flex-col items-center gap-2 text-navy">
                          <CheckCircle2 size={26} className="text-sapphire" />
                          <span className="text-xs font-bold">{uploadedFileInfo.fileName}</span>
                          <span className="text-[11px] text-sapphire underline">
                            Click to change file
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload size={24} className="text-sapphire" />
                          <span className="text-xs font-bold text-navy">
                            Click to upload your manuscript file
                          </span>
                          <span className="text-[11px] text-navy/55">
                            Accepted formats: PDF or DOCX (max 10 MB)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {errors.file && <p className="text-[11px] text-red-600 font-medium">{errors.file}</p>}
                {errors.paper && (
                  <p className="text-[11px] text-red-600 font-medium">{errors.paper}</p>
                )}
              </div>

              {/* SECTION 4: INTEGRITY, PREVIOUS PUBLICATION & AI USE */}
              <div className="space-y-3.5 border-b border-navy/10 pb-5">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-navy/80">
                  4. Academic Integrity & Disclosures
                </h3>

                <div id="sub-field-isOriginalWork">
                  <label className="block text-xs font-bold text-navy/80">
                    Is this original work written by you? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 mt-1">
                    {["Yes", "No"].map((val) => (
                      <label key={val} className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="isOriginalWork"
                          value={val}
                          checked={isOriginalWork === val}
                          onChange={(e) => setIsOriginalWork(e.target.value)}
                          className="text-navy focus:ring-sapphire"
                        />
                        <span>{val}</span>
                      </label>
                    ))}
                  </div>
                  {errors.isOriginalWork && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.isOriginalWork}</p>
                  )}
                </div>

                <div id="sub-field-isPublishedBefore">
                  <label className="block text-xs font-bold text-navy/80">
                    Has this paper been published anywhere before? <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-navy/55 mb-1">
                    School journal, blog, archive, preprint, or competition.
                  </p>
                  <div className="flex gap-4">
                    {["No", "Yes"].map((val) => (
                      <label key={val} className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="isPublishedBefore"
                          value={val}
                          checked={isPublishedBefore === val}
                          onChange={(e) => setIsPublishedBefore(e.target.value)}
                          className="text-navy focus:ring-sapphire"
                        />
                        <span>{val}</span>
                      </label>
                    ))}
                  </div>

                  {isPublishedBefore === "Yes" && (
                    <div id="sub-field-publishedWhere" className="mt-2.5">
                      <label className="block text-xs font-bold text-navy/80">
                        Where was it published? <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={publishedWhere}
                        onChange={(e) => setPublishedWhere(e.target.value)}
                        placeholder="e.g. School Science Fair Journal (May 2024)"
                        className={`mt-1 h-10 w-full rounded-xl border bg-ivory/30 px-3.5 text-xs sm:text-sm text-navy placeholder:text-navy/30 focus:outline-none transition ${
                          errors.publishedWhere
                            ? "border-red-500 ring-1 ring-red-500"
                            : "border-navy/20 focus:border-sapphire"
                        }`}
                      />
                      {errors.publishedWhere && (
                        <p className="mt-1 text-[11px] text-red-600">{errors.publishedWhere}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy/80">
                    AI Tool Usage Declaration <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-navy/55 mb-2">
                    Tour permits AI only for spelling, grammar, or coding assistance. Generating text with AI is prohibited.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {AI_USE_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className={`rounded-xl border p-3 flex items-start gap-2.5 cursor-pointer transition ${
                          aiUse === opt.value
                            ? "border-navy bg-navy text-white shadow-xs"
                            : "border-navy/15 bg-ivory/20 hover:border-navy/30 text-navy"
                        }`}
                      >
                        <input
                          type="radio"
                          name="aiUse"
                          value={opt.value}
                          checked={aiUse === opt.value}
                          onChange={(e) => setAiUse(e.target.value)}
                          className="mt-0.5"
                        />
                        <div className="text-xs">
                          <span className="font-bold block">{opt.label}</span>
                          <span
                            className={`text-[11px] leading-tight block mt-0.5 ${
                              aiUse === opt.value ? "text-ivory/80" : "text-navy/60"
                            }`}
                          >
                            {opt.desc}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 5: RECOGNITION, VOLUNTEER HOURS & DISCLAIMER */}
              <div className="space-y-3.5 rounded-2xl border border-navy/15 bg-ivory/40 p-4 sm:p-5 text-xs text-navy/80">
                <div className="flex items-center gap-2 font-bold text-navy text-sm">
                  <Award size={18} className="text-sapphire" /> Recognition & Volunteer Hours
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-navy/10 bg-white p-3 flex items-start gap-2.5">
                    <FlaticonGraduation size={20} className="text-sapphire shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-navy">Certificate of Publication</span>
                      <p className="text-[11px] text-navy/65 mt-0.5 leading-relaxed">
                        Authors of accepted manuscripts receive an official digital Certificate of Publication.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-navy/10 bg-white p-3 flex items-start gap-2.5">
                    <FlaticonHeart size={20} className="text-sapphire shrink-0 mt-0.5" />
                    <div>
                      <label className="font-bold text-navy flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={wantsVolunteerHours}
                          onChange={(e) => setWantsVolunteerHours(e.target.checked)}
                          className="rounded text-navy focus:ring-sapphire"
                        />
                        <span>Request Volunteer Hours</span>
                      </label>
                      <p className="text-[11px] text-navy/65 mt-0.5 leading-relaxed">
                        Request volunteer service hours for the time spent researching and writing this manuscript.
                      </p>
                    </div>
                  </div>
                </div>

                {/* NON-PROFIT DISCLAIMER */}
                <div className="rounded-xl border border-navy/10 bg-white/80 p-3 text-[11px] text-navy/65 leading-relaxed">
                  <span className="font-bold text-navy">Tour Platform Disclaimer: </span>
                  Tour is a student-led initiative and is not yet a registered 501(c)(3) non-profit organization.
                  Certificates and volunteer hours awarded do not represent an academic qualification or an
                  accredited institutional certification, with verification letters available upon request for schools and applications.
                </div>
              </div>

              {/* SECTION 6: TERMS AGREEMENT & SUBMIT BUTTON */}
              <div id="sub-field-isTermsAccepted" className="space-y-4 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTermsAccepted}
                    onChange={(e) => setIsTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-navy/30 text-navy focus:ring-sapphire"
                  />
                  <span className="text-xs text-navy/80 leading-relaxed">
                    I confirm that this manuscript represents original work, all references are cited, AI was
                    not used to write the paper, and I agree to Tour's editorial review policy.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.isTermsAccepted && (
                  <p className="text-[11px] text-red-600 font-medium">{errors.isTermsAccepted}</p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-navy/10">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto rounded-full border border-navy/20 bg-white px-6 py-2.5 text-xs font-semibold text-navy hover:bg-ivory transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || isUploadingFile}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-navy px-8 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-sapphire active:scale-[0.98] transition shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Submitting for Publication...</span>
                      </>
                    ) : (
                      <>
                        <BookOpen size={16} />
                        <span>Submit for Publication</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
