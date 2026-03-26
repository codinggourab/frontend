import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ExploreSection from './ExploreSection';
import EventDetails from './EventDetails';
import EventApplication from './EventApplication';
import { 
  Search, 
  Bell, 
  CircleUser, 
  Terminal, 
  Palette, 
  Calendar as CalendarIcon, 
  Bookmark, 
  ChevronRight, 
  Plus,
  Share2,
  Globe,
  LogOut,
  ChevronLeft,
  Trash2
} from 'lucide-react';
import { Event, Registration, Notification } from '../types';

interface StudentDashboardProps {
  userName: string;
  onLogout: () => void;
  events: Event[];
  onRegister: (registration: Registration) => void;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

const StudentDashboard = ({ userName, onLogout, events, onRegister, notifications, setNotifications }: StudentDashboardProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'dashboard' | 'explore' | 'eventDetails' | 'eventApplication'>('dashboard');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [appliedEvents, setAppliedEvents] = useState<any[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setCurrentView('eventDetails');
  };

  const handleApply = () => {
    setCurrentView('eventApplication');
  };

  const handleApplicationSubmit = (event: any, registrationData: any) => {
    const registration: Registration = {
      id: Math.random().toString(36).substr(2, 9),
      eventId: event.id,
      studentId: 'current-student', // In a real app, this would be the logged-in user's ID
      studentName: registrationData.fullName,
      studentEmail: registrationData.email,
      studentDept: registrationData.department,
      studentYear: registrationData.year,
      studentRoll: registrationData.roll,
      timestamp: new Date().toISOString()
    };
    onRegister(registration);
    setAppliedEvents(prev => [event, ...prev]);
    setCurrentView('dashboard');
    setSelectedEvent(null);
  };

  const handleBack = () => {
    if (currentView === 'eventApplication') {
      setCurrentView('eventDetails');
    } else if (selectedEvent) {
      setCurrentView('explore');
      setSelectedEvent(null);
    } else {
      setCurrentView('dashboard');
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = [];
  const totalDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Previous month padding
  const prevMonthDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth() - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, currentMonth: false });
  }

  // Current month
  for (let i = 1; i <= totalDays; i++) {
    days.push({ day: i, currentMonth: true });
  }

  // Next month padding
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, currentMonth: false });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  return (
    <div className="bg-[#0d1320] text-[#dce2f4] font-body min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0d1320]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex justify-between items-center px-8 h-16">
        <div className="flex items-center gap-8">
          <span 
            onClick={() => setCurrentView('dashboard')}
            className="text-xl font-bold tracking-tighter text-[#adc6ff] cursor-pointer"
          >
            Campus Radar
          </span>
          <div className="hidden md:flex gap-6">
            <button 
              onClick={() => setCurrentView('explore')}
              className={`font-brand text-sm tracking-wide transition-colors ${currentView === 'explore' ? 'text-[#adc6ff] border-b-2 border-[#adc6ff] pb-1' : 'text-[#c2c6d6] hover:text-[#dce2f4]'}`}
            >
              Explore
            </button>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`font-brand text-sm tracking-wide transition-colors ${currentView === 'dashboard' ? 'text-[#adc6ff] border-b-2 border-[#adc6ff] pb-1' : 'text-[#c2c6d6] hover:text-[#dce2f4]'}`}
            >
              Dashboard
            </button>
            <a className="font-brand text-sm tracking-wide text-[#c2c6d6] hover:text-[#dce2f4] transition-colors" href="#">Saved Events</a>
            <a className="font-brand text-sm tracking-wide text-[#c2c6d6] hover:text-[#dce2f4] transition-colors" href="#">Organizations</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#adc6ff] w-4 h-4" />
              <input 
                className="bg-[#2e3542] border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-[#adc6ff] outline-none" 
                placeholder="Search events..." 
                type="text"
              />
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markAllAsRead();
              }}
              className="p-2 hover:bg-white/5 rounded-lg transition-all active:scale-95 duration-200 relative"
            >
              <Bell className="text-[#adc6ff]" size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#0d1320]" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 glass-card rounded-xl border border-white/10 shadow-2xl overflow-hidden z-[100]"
                >
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-sm font-bold text-[#dce2f4]">Notifications</h3>
                    <div className="flex gap-2">
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearNotifications}
                          className="text-[10px] text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={10} /> Clear
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-[#c2c6d6] text-xs">
                        No new notifications
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {notifications.map((n) => (
                          <div 
                            key={n.id} 
                            className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read ? 'bg-[#adc6ff]/5' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-bold text-[#adc6ff] uppercase tracking-widest">
                                {n.type === 'event_created' ? 'New Event' : 'New Application'}
                              </span>
                              <span className="text-[10px] text-[#8c909f]">{n.timestamp}</span>
                            </div>
                            <h4 className="text-xs font-bold text-[#dce2f4] mb-1">{n.title}</h4>
                            <p className="text-[11px] text-[#c2c6d6] leading-relaxed">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-2 hover:bg-white/5 rounded-lg transition-all active:scale-95 duration-200"
            >
              <CircleUser className="text-[#adc6ff]" size={20} />
            </button>
            
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-[#151c28] border border-white/10 rounded-xl shadow-2xl p-2 z-[60]"
                >
                  <div className="px-4 py-3 border-b border-white/5 mb-2">
                    <p className="text-xs text-[#c2c6d6] uppercase font-bold tracking-widest">Signed in as</p>
                    <p className="text-sm font-bold text-[#dce2f4] truncate">{userName}</p>
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

      <main className="flex-grow pt-24 pb-16 px-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Welcome */}
              <header className="mb-12">
                  <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-extrabold tracking-tight text-[#dce2f4] mb-2"
                  >
                    Welcome back, {userName || 'Alex'}
                  </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[#c2c6d6] text-lg"
                >
                  You have 3 upcoming events this week. Keep the momentum going!
                </motion.p>
              </header>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Applied Section (Large Card) */}
                <section className="md:col-span-8 flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <h2 className="text-2xl font-bold text-[#dce2f4]">Recent Applications</h2>
                    <a className="text-[#adc6ff] text-sm font-medium hover:underline cursor-pointer">View all</a>
                  </div>
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {appliedEvents.length > 0 ? (
                      appliedEvents.map((event, idx) => (
                        <motion.div 
                          key={idx}
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          whileHover={{ y: -5 }}
                          className="bg-[#151c28] rounded-lg p-6 flex flex-col justify-between group hover:bg-[#232a37] transition-colors border border-white/5"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 rounded bg-[#2e3542] flex items-center justify-center">
                                <Terminal className="text-[#adc6ff]" size={24} />
                              </div>
                              <span className="px-3 py-1 rounded-full bg-[#304671] text-[#9fb5e7] text-xs font-semibold">Under Review</span>
                            </div>
                            <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                            <p className="text-[#c2c6d6] text-sm mb-4">{event.location}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#c2c6d6]">
                            <CalendarIcon size={14} />
                            <span>Applied on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <>
                        {/* Application Card 1 */}
                        <motion.div 
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          whileHover={{ y: -5 }}
                          className="bg-[#151c28] rounded-lg p-6 flex flex-col justify-between group hover:bg-[#232a37] transition-colors border border-white/5"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 rounded bg-[#2e3542] flex items-center justify-center">
                                <Terminal className="text-[#adc6ff]" size={24} />
                              </div>
                              <span className="px-3 py-1 rounded-full bg-[#304671] text-[#9fb5e7] text-xs font-semibold">Under Review</span>
                            </div>
                            <h3 className="text-lg font-bold mb-1">Global Tech Summit 2024</h3>
                            <p className="text-[#c2c6d6] text-sm mb-4">Tech Innovators Hub</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#c2c6d6]">
                            <CalendarIcon size={14} />
                            <span>Applied on Oct 12</span>
                          </div>
                        </motion.div>
 
                        {/* Application Card 2 */}
                        <motion.div 
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          whileHover={{ y: -5 }}
                          className="bg-[#151c28] rounded-lg p-6 flex flex-col justify-between group hover:bg-[#232a37] transition-colors border border-white/5"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 rounded bg-[#2e3542] flex items-center justify-center">
                                <Palette className="text-[#adc6ff]" size={24} />
                              </div>
                              <span className="px-3 py-1 rounded-full bg-[#df7412]/20 text-[#ffb786] text-xs font-semibold">Shortlisted</span>
                            </div>
                            <h3 className="text-lg font-bold mb-1">Creative Arts Expo</h3>
                            <p className="text-[#c2c6d6] text-sm mb-4">Visual Arts Collective</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#c2c6d6]">
                            <CalendarIcon size={14} />
                            <span>Applied on Oct 08</span>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </motion.div>

                  {/* Recommended Events */}
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-[#dce2f4] mb-6">Recommended for You</h2>
                    <div className="flex flex-col gap-4">
                      {events.slice(0, 1).map((event) => (
                        <motion.div 
                          key={event.id}
                          whileHover={{ scale: 1.01 }}
                          className="relative overflow-hidden rounded-xl bg-[#151c28] p-1 group border border-white/5"
                        >
                          <div className="flex flex-col md:flex-row gap-6 p-6">
                            <div className="w-full md:w-1/3 aspect-video md:aspect-square overflow-hidden rounded-lg">
                              <img 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                                src={event.image}
                                alt={event.title}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded-full bg-[#adc6ff]/10 text-[#adc6ff] text-[10px] uppercase tracking-widest font-bold">Featured</span>
                                <span className="text-[#c2c6d6] text-xs">Based on your interests</span>
                              </div>
                              <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                              <p className="text-[#c2c6d6] mb-6 line-clamp-2">Join industry leaders for an exclusive deep dive into the frameworks of tomorrow's technology.</p>
                              <div className="flex flex-wrap gap-4 items-center">
                                <button 
                                  onClick={() => handleEventClick(event)}
                                  className="bg-gradient-to-r from-[#adc6ff] to-[#4d8eff] px-6 py-2 rounded-full text-[#00285d] font-bold text-sm active:scale-95 transition-transform"
                                >
                                  Register Now
                                </button>
                                <button className="flex items-center gap-2 text-[#adc6ff] font-semibold text-sm hover:opacity-80">
                                  <Bookmark size={18} />
                                  Save for Later
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Saved & Stats (Sidebar Grid) */}
                <aside className="md:col-span-4 flex flex-col gap-8">
                  {/* Quick Stats */}
                  <div className="bg-[#232a37] rounded-lg p-6 border border-white/5">
                    <h3 className="text-sm font-bold text-[#adc6ff] mb-4 tracking-widest uppercase">Your Activity</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#2e3542] p-4 rounded">
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-[10px] text-[#c2c6d6] uppercase font-bold tracking-tight">Saved</div>
                      </div>
                      <div className="bg-[#2e3542] p-4 rounded">
                        <div className="text-2xl font-bold">
                          {appliedEvents.length < 10 ? `0${appliedEvents.length}` : appliedEvents.length}
                        </div>
                        <div className="text-[10px] text-[#c2c6d6] uppercase font-bold tracking-tight">Applied</div>
                      </div>
                    </div>
                  </div>

                  {/* Saved Events List */}
                  <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-[#dce2f4] px-1">Saved Events</h2>
                    <div className="flex flex-col gap-3">
                      {[
                        { title: 'Startup Pitch Night', time: 'Tomorrow, 6:00 PM', img: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=200' },
                        { title: 'Annual Jazz Gala', time: 'Friday, 8:30 PM', img: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=200' },
                        { title: 'UX Design Sprint', time: 'Oct 24, 10:00 AM', img: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=200' }
                      ].map((item, i) => (
                        <motion.div 
                          key={i}
                          whileHover={{ x: 5 }}
                          className="bg-[#151c28] hover:bg-[#2e3542] p-4 rounded-lg flex gap-4 items-center transition-colors group cursor-pointer border border-white/5"
                        >
                          <div className="w-12 h-12 rounded bg-[#2e3542] flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <img 
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                              src={item.img}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-bold text-sm truncate">{item.title}</h4>
                            <p className="text-xs text-[#c2c6d6]">{item.time}</p>
                          </div>
                          <ChevronRight className="text-[#adc6ff]" size={20} />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Calendar Mini View */}
                  <div className="bg-[#070e1a] border border-white/5 rounded-lg p-6 mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-sm text-[#dce2f4]">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </span>
                      <div className="flex gap-2">
                        <ChevronLeft 
                          size={16} 
                          className="cursor-pointer hover:text-[#adc6ff] transition-colors" 
                          onClick={handlePrevMonth}
                        />
                        <ChevronRight 
                          size={16} 
                          className="cursor-pointer hover:text-[#adc6ff] transition-colors" 
                          onClick={handleNextMonth}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-[10px] text-center text-[#c2c6d6] mb-2">
                      <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-[11px] text-center font-medium">
                      {days.map((d, i) => {
                        const isToday = d.currentMonth && 
                          d.day === new Date().getDate() && 
                          currentDate.getMonth() === new Date().getMonth() && 
                          currentDate.getFullYear() === new Date().getFullYear();
                        
                        return (
                          <div 
                            key={i} 
                            className={`p-1 ${!d.currentMonth ? 'opacity-20' : ''} ${isToday ? 'bg-[#adc6ff]/20 text-[#adc6ff] rounded-full' : ''}`}
                          >
                            {d.day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </aside>
              </div>
            </motion.div>
          )}

          {currentView === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ExploreSection onEventClick={handleEventClick} userType="student" events={events} />
            </motion.div>
          )}

          {currentView === 'eventDetails' && selectedEvent && (
            <motion.div
              key="eventDetails"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[100] overflow-y-auto bg-[#0d1320]"
            >
              <EventDetails 
                event={selectedEvent} 
                onBack={handleBack} 
                onApply={handleApply}
                userType="student"
                userName={userName}
                onLogout={onLogout}
              />
            </motion.div>
          )}

          {currentView === 'eventApplication' && selectedEvent && (
            <motion.div
              key="eventApplication"
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[110] overflow-y-auto bg-[#0d1320]"
            >
              <EventApplication 
                event={selectedEvent} 
                onBack={handleBack} 
                onSubmitSuccess={handleApplicationSubmit}
                userName={userName}
                onLogout={onLogout}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#0d1320] w-full py-12 px-8 mt-auto border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold text-[#dce2f4]">Campus Radar</span>
          <p className="font-brand text-xs text-[#c2c6d6]">© 2024 Campus Event Radar. Built for students.</p>
        </div>
        <div className="flex gap-8">
          {['Support', 'Privacy Policy', 'Terms of Service', 'Campus Map'].map(item => (
            <a key={item} className="font-brand text-xs text-[#c2c6d6] hover:text-[#adc6ff] transition-colors" href="#">{item}</a>
          ))}
        </div>
        <div className="flex gap-4">
          <Share2 size={16} className="cursor-pointer hover:text-[#adc6ff] transition-colors" />
          <Globe size={16} className="cursor-pointer hover:text-[#adc6ff] transition-colors" />
        </div>
      </footer>

      {/* FAB */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-[#adc6ff] to-[#4d8eff] rounded-full shadow-lg flex items-center justify-center text-[#00285d] z-40"
      >
        <Plus size={24} />
      </motion.button>
    </div>
  );
};

export default StudentDashboard;
