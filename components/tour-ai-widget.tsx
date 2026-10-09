"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  RefreshCw,
} from "lucide-react";

interface MessageButton {
  label: string;
  pageKey: string;
  href: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  buttons?: MessageButton[];
  feedback?: "up" | "down" | null;
  isFallback?: boolean;
}

const STARTER_CHIPS = [
  "How do I submit my research?",
  "How do I earn volunteer hours?",
  "Which submission type should I choose?",
  "Can I use AI in my research?",
];

const FALLBACK_FAQS: Array<{ question: string; answer: string; buttonLabel: string; href: string }> = [
  {
    question: "How do I submit my research?",
    answer: "You can start a research draft in your Researcher Notebook after logging in. Submit your title, abstract, methodology, and paper file!",
    buttonLabel: "Go to Publish",
    href: "/get-published",
  },
  {
    question: "Can I use AI to write my paper?",
    answer: "No. TOUR strictly forbids AI-written research, conclusions, or abstracts. All work must be 100% original to the student author(s).",
    buttonLabel: "Publishing Guidelines",
    href: "/get-published",
  },
  {
    question: "How do I earn volunteer hours?",
    answer: "You can earn volunteer hours by publishing research, opening a chapter, creating social media content, or editing and reviewing papers.",
    buttonLabel: "Volunteer Opportunities",
    href: "/volunteer",
  },
  {
    question: "Do I get a certificate or recommendation?",
    answer: "Yes! TOUR offers Digital Certificates, documented hours records, and Recommendation Letters for volunteers serving 2+ consecutive months.",
    buttonLabel: "Learn About Recognition",
    href: "/volunteer",
  },
  {
    question: "How do I contact the TOUR team?",
    answer: "You can reach out via our contact form or email tourresearchhub@gmail.com directly. We guarantee a response within 24 hours on business days!",
    buttonLabel: "Contact Team",
    href: "/contact",
  },
];

export function TourAiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm Tour AI, your guide for Tour. How can I help you navigate our platform, publishing rules, or volunteer program today?",
      buttons: [
        { label: "Publishing Guide", pageKey: "publish", href: "/get-published" },
        { label: "Volunteer Info", pageKey: "volunteer", href: "/volunteer" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFaqList, setShowFaqList] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const chatTriggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Map pathname to page key
  const getPageKey = useCallback((): string => {
    if (!pathname || pathname === "/") return "home";
    if (pathname.startsWith("/about")) return "about";
    if (pathname.startsWith("/research")) return "research";
    if (pathname.startsWith("/get-published") || pathname.startsWith("/researcher")) return "publish";
    if (pathname.startsWith("/volunteer")) return "volunteer";
    if (pathname.startsWith("/contact")) return "contact";
    return "home";
  }, [pathname]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Handle focus trap & restoration
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      chatTriggerRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsLoading(true);
    setShowFaqList(false);

    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const pageKey = getPageKey();

      const res = await fetch("/api/tour-ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          page: pageKey,
        }),
      });

      if (!res.ok) {
        throw new Error(`API response error status: ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: data.text || "I'm having trouble getting that answer right now. Please reach out to our team!",
        buttons: data.buttons || [{ label: "Contact Team", pageKey: "contact", href: "/contact" }],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Tour AI widget fetch error:", err);
      setShowFaqList(true);
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "It looks like our live assistant service is currently unreachable. Don't worry! You can check our top FAQs below or contact the Tour team directly.",
        buttons: [{ label: "Contact the Team", pageKey: "contact", href: "/contact" }],
        isFallback: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (msgId: string, type: "up" | "down") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === msgId
          ? { ...msg, feedback: msg.feedback === type ? null : type }
          : msg
      )
    );
  };

  const handleNavigate = (href: string) => {
    router.push(href);
    // On mobile small screen optional auto-close or keep open
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        ref={chatTriggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Tour AI chat" : "Open Tour AI assistant chat"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-navy px-5 py-3.5 text-ivory shadow-2xl transition-all duration-300 border-2 border-champagne/40 hover:bg-sapphire focus:outline-none focus:ring-4 focus:ring-sapphire/40 cursor-pointer"
      >
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-sapphire text-white">
          <Sparkles size={16} className="animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-navy" />
        </div>
        <span className="font-heading font-semibold text-sm tracking-wide text-ivory">
          Ask Tour AI
        </span>
      </motion.button>

      {/* Chat Panel Modal / Sheet */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-end sm:p-6 pointer-events-none">
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-navy/40 backdrop-blur-sm sm:hidden pointer-events-auto"
            />

            {/* Panel Box */}
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-label="Tour AI Assistant Chat Window"
              aria-modal="true"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="pointer-events-auto flex h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl border-2 border-navy/20 bg-ivory shadow-2xl sm:h-[580px] sm:w-[420px] sm:rounded-3xl"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-navy/10 bg-navy px-5 py-4 text-ivory">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sapphire text-white border border-champagne/30">
                    <Bot size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading text-lg font-bold text-ivory leading-none">
                        Tour AI
                      </h2>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                        Online
                      </span>
                    </div>
                    <p className="text-[11px] text-ivory/70 font-light mt-0.5">
                      Student Guide & Platform Assistant
                    </p>
                  </div>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Tour AI panel"
                  className="rounded-full p-2 text-ivory/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* MESSAGES SCROLL BODY */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-start gap-2 max-w-[85%]">
                      {msg.role === "assistant" && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sapphire text-white mt-1">
                          <Bot size={14} />
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          msg.role === "user"
                            ? "bg-navy text-ivory rounded-tr-none font-sans"
                            : "bg-white text-navy border border-navy/15 rounded-tl-none font-sans"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                          {msg.text}
                        </p>

                        {/* Action buttons embedded in message */}
                        {msg.buttons && msg.buttons.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-navy/10">
                            {msg.buttons.map((btn, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleNavigate(btn.href)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-sapphire/30 bg-sapphire/10 px-3 py-1.5 text-xs font-semibold text-sapphire hover:bg-sapphire hover:text-white transition cursor-pointer"
                              >
                                <span>{btn.label}</span>
                                <ArrowRight size={12} />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {msg.role === "user" && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy/20 text-navy mt-1">
                          <User size={14} />
                        </div>
                      )}
                    </div>

                    {/* Feedback rating row for assistant answers */}
                    {msg.role === "assistant" && !msg.isFallback && msg.id !== "welcome" && (
                      <div className="flex items-center gap-2 mt-1.5 ml-9 text-[11px] text-navy/50">
                        <span>Was this helpful?</span>
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg.id, "up")}
                          aria-label="Thumbs up"
                          className={`p-1 rounded hover:text-emerald-600 transition ${
                            msg.feedback === "up" ? "text-emerald-600 font-bold" : ""
                          }`}
                        >
                          <ThumbsUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg.id, "down")}
                          aria-label="Thumbs down"
                          className={`p-1 rounded hover:text-rose-600 transition ${
                            msg.feedback === "down" ? "text-rose-600 font-bold" : ""
                          }`}
                        >
                          <ThumbsDown size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* TYPING INDICATOR */}
                {isLoading && (
                  <div className="flex items-center gap-2 text-navy/60">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sapphire text-white">
                      <Bot size={14} />
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl border border-navy/15 bg-white px-4 py-3">
                      <span className="h-2 w-2 rounded-full bg-sapphire animate-bounce" />
                      <span className="h-2 w-2 rounded-full bg-sapphire animate-bounce [animation-delay:0.2s]" />
                      <span className="h-2 w-2 rounded-full bg-sapphire animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                {/* STARTER CHIPS (Visible at start) */}
                {messages.length === 1 && !isLoading && (
                  <div className="mt-4 space-y-2 pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-navy/60">
                      Suggested Questions:
                    </p>
                    <div className="flex flex-col gap-2">
                      {STARTER_CHIPS.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(chip)}
                          className="text-left rounded-2xl border border-navy/15 bg-white p-3 text-xs font-medium text-navy hover:border-navy hover:bg-navy/5 transition cursor-pointer flex items-center justify-between"
                        >
                          <span>{chip}</span>
                          <ArrowRight size={13} className="text-navy/40" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* OFFLINE / UNREACHABLE FALLBACK FAQ ACCORDION */}
                {showFaqList && (
                  <div className="mt-4 space-y-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                      <HelpCircle size={15} className="text-amber-600 shrink-0" />
                      <span>Quick FAQ Guide</span>
                    </div>
                    <div className="space-y-2">
                      {FALLBACK_FAQS.map((faq, idx) => (
                        <div key={idx} className="rounded-xl border border-amber-200/80 bg-white p-3 space-y-1.5">
                          <p className="text-xs font-bold text-navy">{faq.question}</p>
                          <p className="text-[11px] text-navy/70 leading-relaxed">{faq.answer}</p>
                          <button
                            type="button"
                            onClick={() => handleNavigate(faq.href)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-sapphire hover:underline pt-1"
                          >
                            <span>{faq.buttonLabel}</span>
                            <ArrowRight size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* DISCLAIMER */}
              <div className="bg-ivory border-t border-navy/10 px-4 py-1.5 text-center">
                <p className="text-[10px] text-navy/60 font-light">
                  Tour AI can make mistakes. Check important details with the Tour team.
                </p>
              </div>

              {/* INPUT FORM */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 border-t border-navy/15 bg-white p-3"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about Tour..."
                  aria-label="Type your question for Tour AI"
                  disabled={isLoading}
                  className="flex-1 rounded-full border border-navy/15 bg-ivory/60 px-4 py-2.5 text-xs sm:text-sm text-navy placeholder:text-navy/40 focus:border-sapphire focus:bg-white focus:outline-none transition disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send question"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-ivory hover:bg-sapphire transition disabled:opacity-40 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
