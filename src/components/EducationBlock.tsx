import { Shield, Award, Stethoscope, HelpCircle } from "lucide-react";

const tips = [
  {
    icon: Shield,
    title: "Certificaciones",
    text: "Colaboramos únicamente con cirujanos certificados en tu país.",
  },
  {
    icon: Stethoscope,
    title: "Valoración personalizada",
    text: "Cada cuerpo es diferente. Una valoración presencial es indispensable antes de cualquier decisión.",
  },
  {
    icon: HelpCircle,
    title: "Preguntas para tu consulta",
    text: "Tómate tu tiempo, pregunta sobre experiencia, tiempo de recuperación y resultados esperados.",
  },
  {
    icon: Award,
    title: "Caso único",
    text: "Los resultados varían entre pacientes. No compares tu caso con fotos de otros. Tu cirujano te orientará.",
  },
];

const EducationBlock = ({ onContinue }: { onContinue: () => void }) => {
  return (
    <div className="slide-up space-y-3">
      <div className="chat-bubble-bot p-4 space-y-4">
        <p className="font-semibold text-sm">
          📚 Antes de continuar, queremos compartirte información importante:
        </p>
        <div className="grid gap-3">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-3 items-start bg-muted/50 rounded-lg p-3">
              <div className="mt-0.5 shrink-0">
                <tip.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold">{tip.title}</p>
                <p className="text-xs text-muted-foreground">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic">
          La valoración final siempre debe hacerse con un profesional de la salud.
        </p>
      </div>
      <button onClick={onContinue} className="chat-option-btn">
        Entendido, continuar →
      </button>
    </div>
  );
};

export default EducationBlock;