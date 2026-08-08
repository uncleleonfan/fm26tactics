import { Link } from "@/i18n/routing";
import { Shield, Zap, Compass } from "lucide-react";

export function StatsSection() {
  return (
    <section className="border-t border-[#1C2436]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Shield className="w-6 h-6" />,
              title: "10+ Formations",
              description: "From classic 4-4-2 to modern 3-4-2-1, every formation analyzed in depth.",
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: "All Player Roles",
              description: "Complete database of FM26 player roles with attribute requirements and best setups.",
            },
            {
              icon: <Compass className="w-6 h-6" />,
              title: "Interactive Builder",
              description: "Visual drag-and-drop tactic editor to experiment with formations in real-time.",
            },
          ].map((stat) => (
            <div key={stat.title} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
                {stat.icon}
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">{stat.title}</h3>
              <p className="text-sm text-text-secondary">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
