import { useState, useEffect, useRef, useCallback } from "react";
import {
  StepId,
  ChatMessage,
  UserProfile,
  getStepMessages,
  getNextStep,
  updateProfile,
  PREV_PROCEDURES,
} from "@/lib/chatFlow";
import EducationBlock from "@/components/EducationBlock";
import { Shield, MessageCircle } from "lucide-react";

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<StepId>("welcome");
  const [profile, setProfile] = useState<UserProfile>({});
  const [isTyping, setIsTyping] = useState(false);
  const answeredIds = useRef<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const addMessages = useCallback((msgs: ChatMessage[]) => {
    let totalDelay = 0;
    msgs.forEach((msg, i) => {
      const delay = msg.delay !== undefined ? msg.delay : (i === 0 ? 0 : 600);
      totalDelay += delay;
      const typingAt = Math.max(0, totalDelay - 400);
      setTimeout(() => setIsTyping(true), typingAt);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, msg]);
      }, totalDelay);
    });
  }, []);

  useEffect(() => {
    addMessages(getStepMessages("welcome", {}));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleOptionSelect = (msgId: string, value: string, label: string) => {
    if (answeredIds.current.has(msgId)) return;
    answeredIds.current.add(msgId);

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      type: "user",
      content: label,
    };
    setMessages((prev) => [...prev, userMsg]);

    const newProfile = updateProfile(profile, currentStep, value);
    setProfile(newProfile);

    if (value === "recommendations") {
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: Math.random().toString(36).slice(2),
          type: "bot",
          content: "✅ Perfecto, te estamos redirigiendo a los profesionales recomendados para ti…",
        }]);
      }, 500);
      return;
    }

    if (value === "procedures") {
      const saved: UserProfile = {
        city: newProfile.city,
        budget: newProfile.budget,
        preparationLevel: newProfile.preparationLevel,
      };
      setProfile(saved);
      setCurrentStep("procedure_area");
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: Math.random().toString(36).slice(2),
          type: "bot",
          content: "¡Claro! Empecemos de nuevo con la selección del procedimiento.",
        }]);
        setTimeout(() => addMessages(getStepMessages("procedure_area", saved)), 700);
      }, 500);
      return;
    }

    const nextStep = getNextStep(currentStep, value, newProfile);
    setCurrentStep(nextStep);
    setTimeout(() => addMessages(getStepMessages(nextStep, newProfile)), 400);
  };

  const handleMultiSelectConfirm = (msgId: string, selected: string[]) => {
    if (answeredIds.current.has(msgId)) return;
    answeredIds.current.add(msgId);

    const newProfile = { ...profile, previousProcedures: selected };
    setProfile(newProfile);

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      type: "user",
      content: selected.join(", "),
    };
    setMessages((prev) => [...prev, userMsg]);

    const nextStep = getNextStep(currentStep, "confirm", newProfile);
    setCurrentStep(nextStep);
    setTimeout(() => addMessages(getStepMessages(nextStep, newProfile)), 600);
  };

  const handleEducationContinue = () => {
    const nextStep = getNextStep(currentStep, "continue", profile);
    setCurrentStep(nextStep);
    addMessages(getStepMessages(nextStep, profile));
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold">Asistente de Consulta</h2>
          <p className="text-xs text-muted-foreground">Tu guía para una decisión informada</p>
        </div>
        <div className="trust-badge">
          <Shield className="w-3 h-3" />
          Consulta segura
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          if (msg.type === "bot") {
            return (
              <div key={msg.id} className="slide-up flex gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <MessageCircle className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="chat-bubble-bot px-4 py-3">
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            );
          }

          if (msg.type === "user") {
            return (
              <div key={msg.id} className="slide-up flex justify-end">
                <div className="chat-bubble-user px-4 py-3 max-w-[75%]">
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            );
          }

          if (msg.type === "options") {
            return (
              <div key={msg.id} className="slide-up space-y-3">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <MessageCircle className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="chat-bubble-bot px-4 py-3">
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pl-9">
                  {msg.options?.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleOptionSelect(msg.id, opt.value, opt.label)}
                      disabled={answeredIds.current.has(msg.id)}
                      className="chat-option-btn disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {opt.icon && <span className="mr-1">{opt.icon}</span>}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          if (msg.type === "multiselect") {
            return (
              <MultiSelectBlock
                key={msg.id}
                msgId={msg.id}
                question={msg.content}
                options={msg.multiSelectOptions || PREV_PROCEDURES}
                onConfirm={handleMultiSelectConfirm}
                disabled={answeredIds.current.has(msg.id)}
              />
            );
          }

          if (msg.type === "education") {
            return (
              <div key={msg.id} className="pl-9">
                <EducationBlock onContinue={handleEducationContinue} />
              </div>
            );
          }

          return null;
        })}

        {isTyping && (
          <div className="flex gap-2 max-w-[85%] fade-in">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="chat-bubble-bot px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-card/50 backdrop-blur-sm">
        <p className="text-xs text-center text-muted-foreground">
          🔒 Esta plataforma no reemplaza asesoría médica. La decisión final debe tomarse tras valoración profesional.
        </p>
      </div>
    </div>
  );
};

/* ── MultiSelect inline component ── */
interface MultiSelectBlockProps {
  msgId: string;
  question: string;
  options: string[];
  onConfirm: (msgId: string, selected: string[]) => void;
  disabled: boolean;
}

const MultiSelectBlock = ({ msgId, question, options, onConfirm, disabled }: MultiSelectBlockProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const toggle = (opt: string) => {
    if (confirmed || disabled) return;
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  const handleConfirm = () => {
    if (!selected.length || confirmed) return;
    setConfirmed(true);
    onConfirm(msgId, selected);
  };

  return (
    <div className="slide-up space-y-3">
      <div className="flex gap-2 max-w-[85%]">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
          <MessageCircle className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="chat-bubble-bot px-4 py-3">
          <p className="text-sm">{question}</p>
          <p className="text-xs text-muted-foreground mt-1 italic">Puedes seleccionar varias opciones</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pl-9">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            disabled={confirmed || disabled}
            className={`rounded-full px-4 py-2 text-xs font-medium border transition-all
              ${selected.includes(opt)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-foreground border-border hover:border-primary hover:text-primary"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {selected.includes(opt) && <span className="mr-1">✓</span>}
            {opt}
          </button>
        ))}
      </div>
      <div className="pl-9">
        <button
          onClick={handleConfirm}
          disabled={!selected.length || confirmed || disabled}
          className="chat-option-btn disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirmar selección →
        </button>
      </div>
    </div>
  );
};

export default ChatBot;