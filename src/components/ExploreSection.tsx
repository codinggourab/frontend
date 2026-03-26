import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, MapPin, Bookmark, Plus, ArrowRight } from 'lucide-react';
import { Event } from '../types';

const categories = ['All Events', 'Technology', 'Arts & Culture', 'Sports', 'Academic', 'Social'];

interface ExploreSectionProps {
  onEventClick?: (event: Event) => void;
  userType?: 'student' | 'organizer';
  events: Event[];
}

const ExploreSection: React.FC<ExploreSectionProps> = ({ onEventClick, userType, events }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Events');

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'All Events' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="explore" className="py-24 px-8 bg-[#0d1320]">
      <div className="container mx-auto">
        {/* Hero Search Section */}
        <div className="mb-16">
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="text-[#adc6ff]" size={24} />
            </div>
            <input 
              className="w-full bg-[#1e293b] border-none rounded-full py-6 pl-16 pr-8 text-[#dce2f4] placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#adc6ff]/50 text-lg shadow-2xl transition-all outline-none" 
              placeholder="Search for hackathons, workshops, and tech talks" 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Discovery Header */}
        <header className="mb-12 text-center md:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-headline font-extrabold tracking-tight text-[#dce2f4] mb-4"
          >
            Discover <span className="text-gradient">Events</span>
          </motion.h2>
          <p className="text-lg text-[#c2c6d6] max-w-2xl leading-relaxed">
            Stay ahead of the curve. Find the latest campus gatherings, career-boosting workshops, and social highlights tailored for you.
          </p>
        </header>

        {/* Filter Bar */}
        <div className="mb-12 overflow-x-auto pb-4 -mx-2 scrollbar-hide">
          <div className="flex items-center gap-3 px-2">
            {categories.map((category) => (
              <button 
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-8 py-3 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-[#adc6ff] to-[#4d8eff] text-[#00285d] shadow-lg shadow-[#4d8eff]/20' 
                    : 'bg-[#1e293b] text-[#94a3b8] hover:text-[#dce2f4] hover:bg-[#334155]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode='popLayout'>
            {filteredEvents.map((event) => (
              <motion.div 
                layout
                key={event.id}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileHover={{ 
                  y: -12,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="group relative bg-[#1e293b] rounded-3xl overflow-hidden border border-white/5 transition-all duration-300 shadow-xl hover:border-[#adc6ff]/30 hover:shadow-[0_40px_80px_rgba(0,0,0,0.5),0_0_40px_rgba(173,198,255,0.1)] cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src={event.image}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-5 left-5 flex gap-2">
                    {event.tag && (
                      <span className={`px-4 py-1.5 rounded-full backdrop-blur-md text-[10px] font-bold tracking-widest uppercase border ${
                        event.tag === 'FEATURED' 
                          ? 'bg-[#adc6ff]/20 text-[#adc6ff] border-[#adc6ff]/30' 
                          : 'bg-green-500/20 text-green-400 border-green-500/30'
                      }`}>
                        {event.tag}
                      </span>
                    )}
                  </div>
                  <button className="absolute top-5 right-5 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#adc6ff] transition-colors">
                    <Bookmark size={20} />
                  </button>
                </div>
                <div className="p-8">
                  <div className="flex flex-col gap-2 mb-6">
                    <h3 className="text-xl font-headline font-bold text-[#dce2f4] leading-tight group-hover:text-[#adc6ff] transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[#94a3b8] text-sm">
                      <Calendar size={16} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#94a3b8] text-sm">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onEventClick?.(event)}
                    disabled={userType === 'organizer'}
                    className={`w-full py-4 rounded-full font-bold text-sm tracking-wide transition-all active:scale-95 shadow-lg ${
                      userType === 'organizer'
                        ? 'bg-white/5 text-[#94a3b8] cursor-not-allowed border border-white/10'
                        : 'bg-gradient-to-r from-[#adc6ff] to-[#4d8eff] text-[#00285d] shadow-[#4d8eff]/10'
                    }`}
                  >
                    {userType === 'organizer' ? 'Registration Disabled' : 'Register Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#94a3b8] text-lg">No events found matching your criteria.</p>
            <button 
              onClick={() => { setSelectedCategory('All Events'); setSearchQuery(''); }}
              className="mt-4 text-[#adc6ff] font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExploreSection;
