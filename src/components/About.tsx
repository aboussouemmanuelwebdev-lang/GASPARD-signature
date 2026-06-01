import { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, Award, Heart, CheckCircle } from 'lucide-react';

export default function About() {
  const [activePillar, setActivePillar] = useState<'mission' | 'vision' | 'valeurs'>('mission');

  const pillars = {
    mission: {
      title: "Notre Mission",
      icon: <Compass className="text-gold-400" size={32} />,
      quote: "Offrir un voyage culinaire d'exception où tradition familiale et haute gastronomie s'unissent pour sublimer chaque instant partagé à notre table.",
      points: [
        "Sélection rigoureuse de produits locaux ivoiriens d'excellence et d'ingrédients nobles importés.",
        "Maîtrise absolue du fumage et de la cuisson lente au feu de bois (grillades signatures).",
        "Créer une expérience de convivialité chaleureuse pour toutes les générations."
      ]
    },
    vision: {
      title: "Notre Vision",
      icon: <Sparkles className="text-gold-400" size={32} />,
      quote: "Devenir la référence gastronomique suprême à Abidjan mariant avec audace la convivialité d'un bistrot chaleureux et l'élégance d'une table d'exception.",
      points: [
        "Inspirer la scène bistronomique d'Angré et Cocody par des techniques de cuisson d'avant-garde.",
        "Renforcer continuellement l'artisanat culinaire notamment notre pâte à pizza brevetée à longue fermentation.",
        "Construire un héritage durable pour l'excellence de la restauration ivoirienne."
      ]
    },
    valeurs: {
      title: "Nos Valeurs",
      icon: <Heart className="text-gold-400" size={32} />,
      quote: "Intégrité, Passion Culinaire et Partage Sacré sont le socle immuable qui guide chacune de nos créations quotidiennes.",
      points: [
        "L'Intégrité : Transparence absolue sur la provenance de nos produits frais.",
        "La Passion : Un dévouement sans faille mené par notre Chef exécutif.",
        "L'Excellence : Un service prévenant, discret et d'une rigueur constante."
      ]
    }
  };

  const team = [
    {
      name: "Chef Amadou Diallo",
      role: "Chef Exécutif & Maître rôtisseur",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
      bio: "Fort de 15 années d'expérience dans les cuisines de palaces parisiens et genevois, le Chef Amadou sublime les viandes de Côte d'Ivoire au feu de bois et insuffle son génie créatif dans chaque assiette."
    },
    {
      name: "Eunice Koffi",
      role: "Responsable Pâtisserie",
      image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=600&q=80",
      bio: "Véritable virtuose du sucré, Eunice revisite avec finesse et poésie les recettes traditionnelles pour concevoir les desserts signatures légers et croustillants de notre restaurant."
    }
  ];

  return (
    <section id="about" className="py-24 bg-[#0F0F0F]/50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          
          {/* Visual Showcase */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-gold-400/5 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl -z-10" />
            
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                alt="Salle de restaurant premium"
                className="rounded-lg shadow-2xl border border-white/5 object-cover h-64 w-full"
                id="about-img-interior"
              />
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
                alt="Spécialités de grillades"
                className="rounded-lg shadow-2xl border border-white/5 object-cover h-64 w-full mt-8"
                id="about-img-grill"
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="flex flex-col">
            <span className="text-gold-400 font-mono text-xs uppercase tracking-[0.3em] mb-3">Notre Histoire</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              Une passion familiale, <br />
              <span className="text-gold-400">une exigence signature.</span>
            </h2>
            <p className="text-white/70 mb-5 leading-relaxed text-sm sm:text-base">
              Né d’un rêve familial de sublimer la tradition gastronomique et d’offrir un havre culinaire d'exception pour les passionnés du goût, <strong>Gaspard Signature</strong> s’est rapidement imposé comme le repère prestigieux de la 8ème Tranche à Angré, Cocody.
            </p>
            <p className="text-white/70 mb-8 leading-relaxed text-sm sm:text-base">
              Nos fourneaux combinent un savoir-faire bistronomique à des influences internationales rigoureuses. Qu’il s’agisse de nos pizzas artisanales élaborées sur une pâte reposée 72 heures, de nos généreuses brochettes et filets de bœuf saisis au charbon, ou encore de nos pâtisseries aériennes, chaque plat reflète notre obsession de perfection.
            </p>

            {/* Quick Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/10">
              <div className="text-center">
                <div className="text-gold-400 font-serif text-2xl font-bold mb-1">100%</div>
                <div className="text-white/40 text-[10px] uppercase tracking-wider font-mono">Frais & Fait Maison</div>
              </div>
              <div className="text-center border-x border-white/10">
                <div className="text-gold-400 font-serif text-2xl font-bold mb-1">72h</div>
                <div className="text-white/40 text-[10px] uppercase tracking-wider font-mono">Pâte à Pizza Maturée</div>
              </div>
              <div className="text-center">
                <div className="text-gold-400 font-serif text-2xl font-bold mb-1">Chef</div>
                <div className="text-white/40 text-[10px] uppercase tracking-wider font-mono">Expérience Étoilée</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars - Mission/Vision/Values Interactive Section */}
        <div className="bg-[#121212] border border-white/5 rounded-xl p-8 sm:p-12 mb-24">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
            {Object.keys(pillars).map((key) => (
              <button
                key={key}
                id={`btn-pillar-${key}`}
                onClick={() => setActivePillar(key as 'mission' | 'vision' | 'valeurs')}
                className={`px-6 py-3 rounded-full text-xs sm:text-sm uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                  activePillar === key
                    ? 'bg-gradient-to-r from-gold-600 to-gold-400 text-black shadow-lg scale-105'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {pillars[key as 'mission' | 'vision' | 'valeurs'].title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="p-4 bg-gold-400/5 rounded-2xl border border-gold-400/10 mb-5">
                {pillars[activePillar].icon}
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-4">
                {pillars[activePillar].title}
              </h3>
              <p className="text-lg italic text-gold-200/90 leading-relaxed font-serif">
                &ldquo; {pillars[activePillar].quote} &rdquo;
              </p>
            </div>
            
            <div className="lg:col-span-7 bg-[#161616] p-6 sm:p-8 rounded-lg border border-white/5 space-y-4">
              {pillars[activePillar].points.map((pt, idx) => (
                <div key={`pillar-${activePillar}-point-${idx}`} className="flex items-start space-x-3 text-white/80">
                  <CheckCircle size={18} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meet the culinary artists Team */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold-400 font-mono text-xs uppercase tracking-[0.3em] mb-2 block">L'Équipe d'Exception</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Les artistes derrière vos assiettes</h2>
            <p className="text-white/60 mt-4 text-sm sm:text-base">
              Une brigade dévouée et passionnée, orchestrée pour magnifier chaque plat et sublimer votre expérience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {team.map((member, idx) => (
              <div
                key={`team-member-${idx}-${member.name}`}
                id={`team-member-${idx}`}
                className="bg-[#121212] rounded-xl overflow-hidden border border-white/5 flex flex-col sm:flex-row group hover:border-gold-400/20 transition-all duration-300"
              >
                <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-102 group-hover:scale-105"
                  />
                </div>
                <div className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-center">
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-gold-400 transition-colors">
                    {member.name}
                  </h4>
                  <div className="text-gold-400/75 text-xs font-mono uppercase tracking-widest mt-1 mb-4">
                    {member.role}
                  </div>
                  <p className="text-white/60 leading-relaxed text-sm">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
