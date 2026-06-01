import { useEffect } from 'react';
import { Music, Play } from 'lucide-react';

export default function TikTokFeed() {
  useEffect(() => {
    // Remove existing script if any to force reload and parsing of the new blockquote element
    const existingScript = document.getElementById('tiktok-embed-script');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'tiktok-embed-script';
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Optional cleanup
      const scriptToRemove = document.getElementById('tiktok-embed-script');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <section id="tiktok-feed" className="py-20 bg-gradient-to-b from-neutral-950 to-[#080808] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section with Premium typography */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold-400 font-mono text-xs uppercase tracking-[0.3em] mb-2 flex items-center justify-center gap-2">
            <Music size={12} className="animate-pulse text-gold-400" />
            <span>Suivez notre aventure</span>
          </span>
          <h2 className="font-serif text-3xl font-bold text-white mb-4">GASPARD Signature sur TikTok</h2>
          <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            Découvrez les coulisses de nos grillades au feu de bois, le secret de nos garnitures d'exception et l'ambiance chaleureuse de notre table à Angré.
          </p>
        </div>

        {/* Dynamic Embedded TikTok Blockquote Wrapper */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[540px] sm:max-w-[620px] md:max-w-[780px] bg-[#121111] p-4 sm:p-6 rounded-2xl border border-gold-500/10 shadow-[0_0_50px_rgba(197,160,89,0.03)] hover:border-gold-500/20 transition-all duration-300">
            
            {/* Ambient gold glow decoration */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/5 to-transparent rounded-2xl blur-xl opacity-50 pointer-events-none" />
            
            <div className="relative z-10 w-full overflow-hidden flex justify-center">
              {/* Official TikTok embed snippet provided by user */}
              <blockquote 
                className="tiktok-embed w-full" 
                cite="https://www.tiktok.com/@gaspardsignature_" 
                data-unique-id="gaspardsignature_" 
                data-embed-type="creator" 
                style={{ maxWidth: '780px', minWidth: '288px', width: '100%', margin: '0 auto' }}
              >
                <section className="p-4 text-center text-white/40 font-mono text-xs"> 
                  <a 
                    target="_blank" 
                    rel="noreferrer"
                    href="https://www.tiktok.com/@gaspardsignature_?refer=creator_embed"
                    className="text-gold-400 hover:underline"
                  >
                    @gaspardsignature_
                  </a> 
                  <p className="mt-2 animate-pulse">Chargement de l'aperçu TikTok...</p>
                </section> 
              </blockquote>
            </div>

            {/* Direct Link CTA button */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400">
                  <Play size={14} className="fill-gold-400" />
                </div>
                <div className="text-left">
                  <p className="text-white text-xs font-serif font-bold">Compte Officiel</p>
                  <p className="text-white/40 font-mono text-[10px]">@gaspardsignature_</p>
                </div>
              </div>
              <a 
                href="https://www.tiktok.com/@gaspardsignature_"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-transparent border border-gold-400/30 hover:border-gold-400 text-gold-400 hover:text-black hover:bg-gold-400 font-serif text-xs font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 text-center uppercase tracking-wider"
              >
                Rejoignez-nous sur TikTok
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
