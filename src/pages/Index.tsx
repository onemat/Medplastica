import { useState } from "react";
import ChatBot from "@/components/ChatBot";
import { Shield, Users, HeartPulse, ArrowRight } from "lucide-react";

const Index = () => {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <ChatBot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-primary" />
          <span className="font-serif text-lg">MedPlástica</span>
        </div>
        <div className="trust-badge">
          <Shield className="w-3 h-3" />
          Plataforma verificada
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif leading-tight">
              Tu decisión,{" "}
              <span className="text-primary">bien informada</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Te acompañamos de manera consultiva para conectarte con
              profesionales certificados en cirugía plástica.
            </p>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="chat-option-btn text-base px-8 py-3.5 inline-flex items-center gap-2"
          >
            Comenzar consulta guiada
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: Shield, label: "Seguro y confidencial" },
              { icon: Users, label: "Profesionales certificados" },
              { icon: HeartPulse, label: "Enfoque consultivo" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          No realizamos procedimientos ni damos diagnósticos médicos. Conectamos
          pacientes con profesionales certificados.
        </p>
      </footer>
    </div>
  );
};

export default Index;