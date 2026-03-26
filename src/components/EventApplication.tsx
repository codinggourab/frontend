import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  CircleUser, 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  Terminal, 
  PersonStanding, 
  Mail, 
  School, 
  Code, 
  Link as LinkIcon,
  Rocket,
  CheckCircle2,
  ChevronLeft,
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  X,
  LogOut
} from 'lucide-react';

import { Event } from '../types';

interface EventApplicationProps {
  event: Event;
  onBack: () => void;
  onSubmitSuccess: (event: any, formData: any) => void;
  userName?: string;
  onLogout?: () => void;
}

const EventApplication: React.FC<EventApplicationProps> = ({ event, onBack, onSubmitSuccess, userName, onLogout }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: 'Computer Science',
    year: '',
    college: '',
    roll: '',
    github: '',
    linkedin: '',
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate rocket fly animation and network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);

    // Show success message for a bit then redirect
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSubmitSuccess(event, formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0d1320] text-on-surface selection:bg-[#adc6ff]/30 font-body"
    >
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0d1320]/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-6 py-3 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 text-[#adc6ff] hover:bg-white/5 rounded-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            <span className="hidden md:inline text-sm font-medium">Back</span>
          </button>
          <span className="text-xl font-bold text-white tracking-tighter font-headline">Campus Event Radar</span>
        </div>
          <div className="hidden md:flex items-center gap-6">
            <a className="text-[#adc6ff] border-b-2 border-[#adc6ff] pb-1 font-headline tracking-tight" href="#">Events</a>
            <a className="text-on-surface-variant hover:text-white transition-colors font-headline tracking-tight" href="#">Organize</a>
            <a className="text-on-surface-variant hover:text-white transition-colors font-headline tracking-tight" href="#">Applications</a>
          </div>
        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
            <input 
              className="bg-surface-container-highest text-sm rounded-full pl-10 pr-4 py-2 border-none focus:ring-2 focus:ring-[#adc6ff] w-64 outline-none" 
              placeholder="Search events..." 
              type="text"
            />
          </div>
          <button className="p-2 text-on-surface-variant hover:bg-white/5 rounded-lg transition-all active:scale-95 duration-200">
            <Bell size={20} />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-1 text-on-surface-variant hover:bg-white/5 rounded-lg transition-all active:scale-95 duration-200"
            >
              <CircleUser size={30} />
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

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 min-h-[calc(100vh-80px)]">
        {/* Sidebar: Event Context */}
        <aside className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="bg-surface-container/70 backdrop-blur-xl p-8 rounded-2xl border border-white/5 flex flex-col gap-8 sticky top-28">
            <div className="flex flex-col gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-[#adc6ff] to-primary-container rounded-2xl flex items-center justify-center shadow-lg shadow-[#adc6ff]/20">
                <Terminal className="text-on-primary-container text-3xl" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">{event.title}</h2>
                <p className="text-[#adc6ff] mt-1 font-medium tracking-wide">{event.category}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 py-6 border-y border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-[#adc6ff]">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">EVENT DATE</p>
                  <p className="text-on-surface font-semibold">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-[#adc6ff]">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">LOCATION</p>
                  <p className="text-on-surface font-semibold">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-[#adc6ff]">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">CAPACITY</p>
                  <p className="text-on-surface font-semibold">50 Applicants Only</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl aspect-video group">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src={event.image}
                alt={event.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0d1320]/80 to-transparent"></div>
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Join the brightest minds on campus for a weekend of rapid prototyping, mentorship from industry leads, and $10k in prizes.
              </p>
            </div>
          </div>
        </aside>

        {/* Application Form Card */}
        <section className="flex-1">
          <div className="bg-surface-container/70 backdrop-blur-xl p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Close Icon */}
            <button 
              onClick={onBack}
              className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-full transition-all z-20"
            >
              <X size={24} />
            </button>

            {/* Subtle Gradient Background Element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#adc6ff]/10 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-container/10 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10">
              <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-on-surface mb-2 tracking-tighter font-headline">Event Application</h1>
                <p className="text-on-surface-variant">Complete your profile to secure your spot at the {event.title}.</p>
              </div>

              <motion.form 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8" 
                onSubmit={handleSubmit}
              >
                {/* Full Name */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-col gap-2"
                >
                  <label className="text-sm font-semibold text-on-surface ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#adc6ff] transition-colors" size={20} />
                    <input 
                      required
                      className="w-full bg-surface-container-highest border-none rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container transition-all outline-none" 
                      placeholder="e.g. Alex Rivera" 
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-col gap-2"
                >
                  <label className="text-sm font-semibold text-on-surface ml-1">University Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#adc6ff] transition-colors" size={20} />
                    <input 
                      required
                      className="w-full bg-surface-container-highest border-none rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container transition-all outline-none" 
                      placeholder="alex.r@university.edu" 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </motion.div>

                {/* Department */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-col gap-2"
                >
                  <label className="text-sm font-semibold text-on-surface ml-1">Department</label>
                  <div className="relative group">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#adc6ff] transition-colors" size={20} />
                    <select 
                      className="w-full bg-surface-container-highest border-none rounded-2xl py-4 pl-12 pr-4 text-on-surface appearance-none focus:ring-2 focus:ring-primary-container transition-all outline-none"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option>Computer Science</option>
                      <option>Engineering</option>
                      <option>Design & Arts</option>
                      <option>Business & Finance</option>
                    </select>
                  </div>
                </motion.div>

                {/* Stream */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-col gap-2"
                >
                  <label className="text-sm font-semibold text-on-surface ml-1">Current Stream / Year</label>
                  <div className="relative group">
                    <PlusCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#adc6ff] transition-colors" size={20} />
                    <input 
                      required
                      className="w-full bg-surface-container-highest border-none rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container transition-all outline-none" 
                      placeholder="e.g. B.Tech 3rd Year" 
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    />
                  </div>
                </motion.div>

                {/* College */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-col gap-2"
                >
                  <label className="text-sm font-semibold text-on-surface ml-1">College Name</label>
                  <div className="relative group">
                    <LayoutDashboard className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#adc6ff] transition-colors" size={20} />
                    <input 
                      required
                      className="w-full bg-surface-container-highest border-none rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container transition-all outline-none" 
                      placeholder="Global Institute of Technology" 
                      type="text"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    />
                  </div>
                </motion.div>

                {/* College Roll */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-col gap-2"
                >
                  <label className="text-sm font-semibold text-on-surface ml-1">College Roll No.</label>
                  <div className="relative group">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#adc6ff] transition-colors" size={20} />
                    <input 
                      required
                      className="w-full bg-surface-container-highest border-none rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container transition-all outline-none" 
                      placeholder="e.g. 123456789" 
                      type="text"
                      value={formData.roll}
                      onChange={(e) => setFormData({ ...formData, roll: e.target.value })}
                    />
                  </div>
                </motion.div>

                {/* Links */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-col gap-2"
                >
                  <label className="text-sm font-semibold text-on-surface ml-1">GitHub Link</label>
                  <div className="relative group">
                    <Code className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#adc6ff] transition-colors" size={20} />
                    <input 
                      className="w-full bg-surface-container-highest border-none rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container transition-all outline-none" 
                      placeholder="github.com/username" 
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    />
                  </div>
                </motion.div>
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-col gap-2"
                >
                  <label className="text-sm font-semibold text-on-surface ml-1">LinkedIn Profile</label>
                  <div className="relative group">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-[#adc6ff] transition-colors" size={20} />
                    <input 
                      className="w-full bg-surface-container-highest border-none rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container transition-all outline-none" 
                      placeholder="linkedin.com/in/username" 
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    />
                  </div>
                </motion.div>

                {/* Why Join? */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="col-span-1 md:col-span-2 flex flex-col gap-2"
                >
                  <label className="text-sm font-semibold text-on-surface ml-1">Why do you want to join {event.title}?</label>
                  <div className="relative group">
                    <textarea 
                      required
                      className="w-full bg-surface-container-highest border-none rounded-2xl p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container transition-all outline-none resize-none" 
                      placeholder="Tell us about your skills, project ideas, and what motivates you..." 
                      rows={4}
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    ></textarea>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="col-span-1 md:col-span-2 pt-4"
                >
                  <button 
                    disabled={isSubmitting || isSuccess}
                    className="w-full py-5 bg-linear-to-r from-[#adc6ff] to-primary-container text-on-primary-container font-bold text-lg rounded-full shadow-[0_0_30px_rgba(77,142,255,0.4)] hover:shadow-[0_0_50px_rgba(77,142,255,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed" 
                    type="submit"
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="submitting"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3"
                        >
                          <span>Submitting...</span>
                          <motion.div
                            animate={{ 
                              x: [0, 50, 200],
                              y: [0, -5, 0],
                              opacity: [1, 1, 0],
                              scale: [1, 1.1, 0.8]
                            }}
                            transition={{ duration: 1.5, ease: "easeIn" }}
                          >
                            <Rocket size={24} className="rotate-90" />
                          </motion.div>
                        </motion.div>
                      ) : isSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-3"
                        >
                          <span>Application Submitted!</span>
                          <CheckCircle2 size={24} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-3"
                        >
                          <span>Submit Application</span>
                          <Rocket size={24} className="rotate-45" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                  <p className="text-center text-xs text-on-surface-variant mt-4 uppercase tracking-[0.2em] font-bold">Applications close in 48 hours</p>
                </motion.div>
              </motion.form>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-[#070e1a]/80 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-50">
        <div className="flex flex-col items-center justify-center text-on-surface-variant p-3 active:bg-[#adc6ff]/10 transition-all cursor-pointer" onClick={onBack}>
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-medium uppercase tracking-widest mt-1">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant p-3 active:bg-[#adc6ff]/10 transition-all cursor-pointer">
          <PlusCircle size={20} />
          <span className="text-[10px] font-medium uppercase tracking-widest mt-1">Create</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#adc6ff]/20 text-[#adc6ff] rounded-full p-3 scale-110">
          <FileText size={20} />
          <span className="text-[10px] font-medium uppercase tracking-widest mt-1">Apps</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant p-3 active:bg-[#adc6ff]/10 transition-all cursor-pointer">
          <CircleUser size={20} />
          <span className="text-[10px] font-medium uppercase tracking-widest mt-1">Profile</span>
        </div>
      </nav>
    </motion.div>
  );
};

export default EventApplication;
