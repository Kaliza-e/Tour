"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, Bot, X, Send, BookOpen, Lightbulb, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIAssistantModal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const pathname = usePathname();
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "Greetings young researcher! I am your TOUR AI Assistant. I can help you generate research hypotheses, summarize abstracts, format APA/IEEE citations, or structure your paper draft. How can I guide your discovery today?",
    },
  ]);

  const hideFloatingButton = pathname?.startsWith("/workspace") || pathname?.startsWith("/dashboard");

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);

    setTimeout(() => {
      let reply = "That is a fascinating research vector! To structure your inquiry, start by formulating a testable hypothesis with clear independent and dependent variables.";
      if (userMsg.toLowerCase().includes("citation") || userMsg.toLowerCase().includes("cite")) {
        reply = "Here is a standard APA 7th edition citation format:\nAuthor, A. A. (2026). Title of student research paper. TOUR Journal of Youth Science, 4(1), 12–28.";
      } else if (userMsg.toLowerCase().includes("abstract") || userMsg.toLowerCase().includes("summary")) {
        reply = "A strong abstract contains 4 key components:\n1. Problem & Background\n2. Research Methodology\n3. Key Findings & Data\n4. Scientific Implication.";
      }

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 600);
  };

  return (
    <>
      {!hideFloatingButton && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-6 sm:bottom-24 z-50 flex items-center gap-2.5 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-ivory shadow-soft transition hover:bg-sapphire hover:scale-105"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="h-4 w-4 text-champagne animate-pulse" />
          <span>Tour</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
          <div className="flex h-[600px] w-full max-w-2xl flex-col rounded-3xl border border-navy/10 bg-ivory shadow-soft overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-navy/10 bg-navy px-6 py-4 text-ivory">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-sapphire/50 p-2">
                  <Bot className="h-5 w-5 text-champagne" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold">TOUR Scientific AI Co-Pilot</h3>
                  <p className="text-xs text-ivory/70">Ethical assistance for paper structure, methodology & citations</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-ivory/70 hover:bg-white/10 hover:text-ivory"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Presets */}
            <div className="flex gap-2 overflow-x-auto border-b border-navy/5 bg-champagne/40 px-6 py-2.5 text-xs">
              <button
                onClick={() => setInput("How do I structure my research paper abstract?")}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-navy/10 bg-white px-3 py-1 text-navy hover:bg-sapphire hover:text-ivory"
              >
                <FileText className="h-3 w-3" /> Abstract Guide
              </button>
              <button
                onClick={() => setInput("Generate APA citation template")}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-navy/10 bg-white px-3 py-1 text-navy hover:bg-sapphire hover:text-ivory"
              >
                <BookOpen className="h-3 w-3" /> APA Citations
              </button>
              <button
                onClick={() => setInput("Suggest research methodology for environmental science")}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-navy/10 bg-white px-3 py-1 text-navy hover:bg-sapphire hover:text-ivory"
              >
                <Lightbulb className="h-3 w-3" /> Methodology Help
              </button>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="h-8 w-8 shrink-0 rounded-full bg-sapphire text-ivory flex items-center justify-center font-bold text-xs">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user"
                        ? "bg-navy text-ivory rounded-br-none"
                        : "bg-white border border-navy/10 text-navy rounded-bl-none shadow-sm"
                      }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="border-t border-navy/10 bg-white p-4 flex gap-3 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about research methodology, formatting, or citations..."
                className="flex-1 rounded-full border border-navy/15 bg-ivory/50 px-4 py-2.5 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sapphire"
              />
              <Button type="submit" size="sm" className="rounded-full bg-navy hover:bg-sapphire text-ivory px-5">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
