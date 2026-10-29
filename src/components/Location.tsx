import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Clock, Map } from 'lucide-react';

const venues = [
  {
    label: 'Wedding Ceremony',
    name: 'Nadsathiramahal Wedding Hall',
    address: 'A9 Road, Kodikamam',
    time: '09:00 AM · Followed by Lunch',
    mapQuery: 'Nadsathiramahal Wedding Hall, A9 Road, Kodikamam, Sri Lanka',
    liveLocationUrl: 'https://maps.app.goo.gl/hTKEXx6wuBno8qim6',
  },
  {
    label: 'Reception Party',
    name: 'Ashlyn & Abigail Mango Mansion',
    address: 'A9 Road, Mirusuvil',
    time: '06:00 PM Onwards',
    mapQuery: 'Ashlyn & Abigail Mango Mansion, A9 Road, Mirusuvil, Sri Lanka',
    liveLocationUrl: 'https://maps.app.goo.gl/yUYUTqF4gKMmUdEV6',
  },
];

export const Location: React.FC = () => {
  return (
    <div className="max-w-[85rem] mx-auto px-6 relative py-12">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-brand-beige/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="text-center mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-brand-beige-deep/60" />
          <span className="text-brand-beige-deep uppercase tracking-[0.5em] text-[10px] sm:text-[11px] font-bold drop-shadow-sm">
            The Venues
          </span>
          <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-brand-beige-deep/60" />
        </div>
        <h2 className="text-5xl sm:text-6xl font-display text-stone-800 leading-tight drop-shadow-sm">
          Where We <span className="italic font-light text-brand-beige-deep">Celebrate</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10">
        {venues.map((venue, index) => (
          <motion.div
            key={venue.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: index * 0.2, ease: 'easeOut' }}
            className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_30px_60px_rgba(176,137,104,0.15)] border border-brand-beige/30 relative overflow-hidden flex flex-col"
          >
            {/* Elegant top border gradient */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-champagne via-brand-beige to-brand-beige-deep z-10" />

            <div className="p-8 sm:p-12">
              <span className="text-brand-beige-deep uppercase tracking-[0.4em] text-[10px] sm:text-[11px] font-bold block mb-6">
                {venue.label}
              </span>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-stone-50 rounded-full border border-brand-beige/40 shadow-inner flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-brand-beige-deep w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-serif text-stone-800 mb-1">{venue.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-stone-400 leading-relaxed mb-4">
                    {venue.address}
                  </p>
                  <p className="flex items-center gap-2 text-stone-500 font-serif italic text-lg mb-8">
                    <Clock className="w-4 h-4 text-brand-gold" />
                    Wednesday, 27 January 2027 · {venue.time}
                  </p>

                  <a
                    href={venue.liveLocationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-stone-800 text-brand-champagne px-8 py-4 rounded-full font-sans tracking-[0.2em] text-xs uppercase hover:bg-stone-900 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-300 active:scale-95 group/btn"
                  >
                    <Navigation className="w-4 h-4 text-brand-gold group-hover/btn:rotate-45 transition-transform duration-300" />
                    Open Live Location
                  </a>
                </div>
              </div>
            </div>

            <div className="relative h-[320px] sm:h-[380px] mt-auto border-t-[8px] border-white group/map">
              <div className="absolute inset-0 bg-brand-beige/10 mix-blend-multiply pointer-events-none z-20 group-hover/map:opacity-0 transition-opacity duration-1000" />
              <iframe
                title={`${venue.name} Location`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.1) saturate(1.2)' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-[30%] group-hover/map:grayscale-0 transition-all duration-1000 ease-in-out"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-brand-beige/30 shadow-lg flex items-center gap-2 pointer-events-none z-30">
                <Map className="w-4 h-4 text-brand-beige-deep animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest font-bold text-stone-600">Live Map</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
