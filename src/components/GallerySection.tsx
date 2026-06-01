import { useState } from 'react';
import { GalleryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export default function GallerySection({ galleryItems }: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const filters = [
    { id: 'all', label: 'Toutes les photos' },
    { id: 'interior', label: 'Salle & Ambiance' },
    { id: 'exterior', label: 'Terrasse & Bar' },
    { id: 'dishes', label: 'Nos Assiettes' },
    { id: 'events', label: 'Réceptions & Événements' }
  ];

  const filteredItems = galleryItems.filter(
    (item) => activeFilter === 'all' || item.category === activeFilter
  );

  const openLightbox = (item: GalleryItem) => {
    const idx = galleryItems.findIndex((gal) => gal.id === item.id);
    if (idx !== -1) {
      setLightboxIndex(idx);
      setZoomLevel(1);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setZoomLevel(1);
  };

  const navigateLightbox = (dir: 'next' | 'prev') => {
    if (lightboxIndex === null) return;
    setZoomLevel(1);
    let nextIdx = dir === 'next' ? lightboxIndex + 1 : lightboxIndex - 1;
    if (nextIdx >= galleryItems.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = galleryItems.length - 1;
    setLightboxIndex(nextIdx);
  };

  const handleZoom = (type: 'in' | 'out') => {
    if (type === 'in') {
      setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
    } else {
      setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
    }
  };

  return (
    <section id="gallery" className="py-24 bg-[#0F0F0F]/50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold-400 font-mono text-xs uppercase tracking-[0.3em] mb-2 block">
            Espace Visuel
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Galerie Gaspard Signature
          </h2>
          <p className="text-white/60 text-sm sm:text-base">
            Plongez dans l'esthétique soignée de notre restaurant à Angré. Découvrez notre bar chic, notre terrasse ombragée et des aperçus de notre cuisine.
          </p>
        </div>

        {/* Gallery Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {filters.map((f) => (
            <button
              key={f.id}
              id={`gal-filter-${f.id}`}
              onClick={() => setActiveFilter(f.id)}
              className={`px-5 py-2 rounded text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-gold-500 text-black shadow-lg font-bold'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                id={`gal-item-${item.id}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative h-72 rounded-xl overflow-hidden border border-white/5 shadow-md cursor-pointer bg-neutral-900"
                onClick={() => openLightbox(item)}
              >
                {/* Image */}
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />

                {/* Cover Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="absolute top-4 right-4 bg-gold-500 text-black p-2 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 size={16} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-gold-400 font-mono mb-1">
                    {item.category === 'interior' ? 'Salle' : item.category === 'exterior' ? 'Terrasse' : item.category === 'events' ? 'Événement' : 'Mets'}
                  </span>
                  <p className="font-serif text-white text-base font-semibold leading-tight line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox / Zoom Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              id="lightbox-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-10 select-none"
            >
              
              {/* Top controls */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10 text-white">
                <div className="flex flex-col">
                  <span className="text-gold-400 text-xs font-mono uppercase tracking-[0.2em]">
                    Photo {lightboxIndex + 1} / {galleryItems.length}
                  </span>
                  <span className="text-white/80 font-serif text-sm max-w-md hidden sm:block mt-1">
                    {galleryItems[lightboxIndex].caption}
                  </span>
                </div>

                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-1.5 rounded-lg">
                  <button
                    id="lightbox-zoom-in"
                    onClick={() => handleZoom('in')}
                    className="p-1.5 hover:text-gold-400 cursor-pointer"
                    title="Zoomer (+)"
                  >
                    <ZoomIn size={18} />
                  </button>
                  <button
                    id="lightbox-zoom-out"
                    onClick={() => handleZoom('out')}
                    className="p-1.5 hover:text-gold-400 cursor-pointer"
                    title="Dézoomer (-)"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <span className="h-4 w-[1px] bg-white/20" />
                  <button
                    id="lightbox-close"
                    onClick={closeLightbox}
                    className="p-1.5 hover:text-red-400 cursor-pointer"
                    title="Fermer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Prev Button */}
              <button
                id="lightbox-prev"
                onClick={() => navigateLightbox('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-3 rounded-full hover:text-gold-400 transition-colors cursor-pointer z-10"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Zoomable Image viewport */}
              <div className="overflow-hidden max-w-4xl max-h-[70vh] flex items-center justify-center relative">
                <motion.img
                  key={lightboxIndex}
                  src={galleryItems[lightboxIndex].imageUrl}
                  alt={galleryItems[lightboxIndex].caption}
                  style={{ scale: zoomLevel }}
                  className="max-w-full max-h-[70vh] rounded-lg object-contain transition-transform duration-200 shadow-2xl"
                />
              </div>

              {/* Next Button */}
              <button
                id="lightbox-next"
                onClick={() => navigateLightbox('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-3 rounded-full hover:text-gold-400 transition-colors cursor-pointer z-10"
              >
                <ChevronRight size={24} />
              </button>

              {/* Caption Overlay on mobile */}
              <div className="absolute bottom-6 left-6 right-6 text-center text-white/50 text-xs font-serif sm:hidden leading-snug">
                {galleryItems[lightboxIndex].caption}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
