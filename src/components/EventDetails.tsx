import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ChevronLeft, 
  Bell, 
  CircleUser, 
  Verified, 
  ArrowRight,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';

import { Event } from '../types';

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
  onApply: () => void;
  userType?: 'student' | 'organizer';
  userName?: string;
  onLogout?: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onBack, onApply, userType = 'student', userName, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Dynamic timeline items based on event details
  const timelineItems = [
    {
      time: 'Registration Opens',
      date: event.details?.timeline?.registrationOpens || 'TBA',
      title: 'Registration Phase Begins',
      description: 'Students can start applying for the event.'
    },
    {
      time: 'Registration Closes',
      date: event.details?.timeline?.registrationCloses || 'TBA',
      title: 'Final Call for Applications',
      description: 'Last chance to secure your spot.'
    },
    {
      time: 'Event Begins',
      date: event.details?.timeline?.eventBegins || event.date || 'TBA',
      title: 'Main Event Kickoff',
      description: 'The official start of the event activities.'
    },
    {
      time: 'Event Ends',
      date: event.details?.timeline?.eventEnds || 'TBA',
      title: 'Closing Ceremony',
      description: 'Wrapping up the event and networking.'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0d1320] text-on-surface selection:bg-[#adc6ff]/30"
    >
      {/* TopNavBar - Reusing style from provided HTML */}
      <nav className="fixed top-0 w-full z-50 bg-[#0d1320]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex justify-between items-center px-8 h-16">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 text-[#adc6ff] hover:bg-white/5 rounded-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            <span className="hidden md:inline text-sm font-medium">Back</span>
          </button>
          <div className="text-xl font-bold tracking-tighter text-[#adc6ff] font-headline">Campus Radar</div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-headline text-sm tracking-wide">
          <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">Explore</a>
          <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">My Applications</a>
          <a className="text-[#adc6ff] border-b-2 border-[#adc6ff] pb-1" href="#">Saved Events</a>
          <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">Organizations</a>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#adc6ff] hover:bg-white/5 rounded-lg transition-all active:scale-95">
            <Bell size={20} />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-2 text-[#adc6ff] hover:bg-white/5 rounded-lg transition-all active:scale-95"
            >
              <CircleUser size={20} />
            </button>
            
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-surface-container-low border border-white/10 rounded-xl shadow-2xl p-2 z-60"
                >
                  <div className="px-4 py-3 border-b border-white/5 mb-2">
                    <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">Signed in as</p>
                    <p className="text-sm font-bold text-on-surface truncate">{userName || 'User'}</p>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <div className="relative w-full h-153.5 overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full object-cover" 
            src={event.image}
            alt={event.title}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-bottom from-transparent to-[#0d1320]"></div>
          
          <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-6"
            >
              <span className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-widest">
                {event.category}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-surface-container-highest text-[#adc6ff] text-xs font-semibold uppercase tracking-widest">
                Career Development
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-extrabold text-on-surface tracking-tight leading-none mb-6 font-headline"
            >
              {event.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col md:flex-row gap-6 text-on-surface-variant font-medium"
            >
              <div className="flex items-center gap-2">
                <Calendar className="text-[#adc6ff]" size={20} />
                {event.date}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-[#adc6ff]" size={20} />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-[#adc6ff]" size={20} />
                30+ Students Attending
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Details & Timeline */}
          <div className="lg:col-span-8 space-y-16">
            {/* Description Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-on-surface mb-8 font-headline">About the Event</h2>
              <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed">
                <p>Join us for the most anticipated technical gathering of the semester. The {event.title} brings together industry leaders, academic visionaries, and ambitious students for three days of deep-dive workshops, keynote speeches, and networking sessions.</p>
                <p>This year's focus is on the integration of Ethical AI in consumer software and the future of decentralized infrastructure. Whether you're a freshman looking for inspiration or a senior seeking career opportunities, there's a path for you here.</p>
              </div>
            </motion.section>

            {/* Timeline Section */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } }
              }}
            >
              <h2 className="text-3xl font-bold text-on-surface mb-10 font-headline">Event Timeline</h2>
              <div className="space-y-0 relative">
                {/* Vertical line */}
                <div className="absolute left-2.75 top-4 bottom-4 w-0.5 bg-surface-container-highest"></div>
                
                {timelineItems.map((item, index) => (
                  <motion.div 
                    key={index} 
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className={`relative pl-12 ${index !== timelineItems.length - 1 ? 'pb-12' : ''}`}
                  >
                    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full ${index === 0 ? 'bg-[#adc6ff] shadow-[0_0_15px_rgba(173,198,255,0.4)]' : 'bg-surface-container-highest'} flex items-center justify-center`}>
                      <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-on-primary-container' : 'bg-outline'}`}></div>
                    </div>
                    <div className="bg-surface-container-low p-6 rounded-xl border border-white/5">
                      <div className="text-[#adc6ff] text-sm font-bold mb-1 uppercase tracking-tighter">{item.time} — {item.date}</div>
                      <h3 className="text-xl font-bold text-on-surface mb-2 font-headline">{item.title}</h3>
                      <p className="text-on-surface-variant">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right Column: Sidebar (Apply/Info) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Apply Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-surface-container p-8 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#adc6ff]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h3 className="text-2xl font-bold text-on-surface mb-2 font-headline">Ready to Join?</h3>
                <p className="text-on-surface-variant mb-8">Registration closes in 4 days. Limited seats available for the hands-on workshops.</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                    <span className="text-on-surface-variant text-sm">General Admission</span>
                    <span className="text-[#adc6ff] font-bold">Free</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                    <span className="text-on-surface-variant text-sm">Workshop Access</span>
                    <span className="text-[#adc6ff] font-bold">Free</span>
                  </div>
                </div>
                
                <button 
                  onClick={onApply}
                  disabled={userType === 'organizer'}
                  className={`w-full py-4 rounded-full font-bold text-lg transition-transform active:scale-95 shadow-[0_10px_30px_rgba(77,142,255,0.3)] ${
                    userType === 'organizer' 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                    : 'bg-linear-to-br from-[#adc6ff] to-primary-container text-on-primary-container'
                  }`}
                >
                  {userType === 'organizer' ? 'Registration Disabled' : 'Apply for Event'}
                </button>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant text-xs">
                  <Verified size={14} className="text-[#adc6ff]" />
                  Verified University Event
                </div>
              </motion.div>

              {/* Organizer Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-surface-container-low p-6 rounded-2xl border border-white/5"
              >
                <h4 className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4">Organized By</h4>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#adc6ff] to-primary-container flex items-center justify-center text-on-primary-container font-bold text-xl">
                    {event.organizerName?.charAt(0) || 'E'}
                  </div>
                  <div>
                    <div className="text-on-surface font-bold">{event.organizerName || 'Event Organizer'}</div>
                    <div className="text-on-surface-variant text-xs">Campus Student Org</div>
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-lg border border-white/10 text-[#adc6ff] text-sm font-semibold hover:bg-white/5 transition-colors">
                  View Organization
                </button>
              </motion.div>

              {/* Map/Location */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-[#070e1a] h-64 rounded-2xl border border-white/5 overflow-hidden relative"
              >
                <img 
                  className="w-full h-full object-cover opacity-50" 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=600" 
                  alt="Location Map"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#0d1320]/40 backdrop-blur-sm">
                  <MapPin size={40} className="text-[#adc6ff] mb-2" />
                  <div className="text-on-surface font-bold">{event.location}</div>
                  <div className="text-on-surface-variant text-xs">University Campus</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 mt-auto bg-[#0d1320] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-lg font-semibold text-on-surface font-headline">Campus Radar</div>
        <div className="flex gap-8">
          {['Support', 'Privacy Policy', 'Terms of Service', 'Campus Map'].map(item => (
            <a key={item} className="text-xs text-on-surface-variant hover:text-[#adc6ff] transition-colors" href="#">{item}</a>
          ))}
        </div>
        <div className="text-xs text-on-surface-variant font-headline">
          © 2026 Campus Event Radar. Built for students.
        </div>
      </footer>
    </motion.div>
  );
};

export default EventDetails;
