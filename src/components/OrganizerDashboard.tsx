import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ExploreSection from './ExploreSection';
import EventDetails from './EventDetails';
import EventApplication from './EventApplication';
import { 
  Search, 
  Bell, 
  CircleUser, 
  Calendar, 
  Download, 
  TrendingUp, 
  CheckCircle, 
  UserPlus, 
  Star, 
  Terminal, 
  Brain, 
  Gamepad2,
  Share2,
  Globe,
  LogOut,
  Plus,
  Users,
  ArrowLeft,
  X,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import { Event, Registration, Notification } from '../types';
const API_URL = "https://backend-zdko.onrender.com";

interface OrganizerDashboardProps {
  userName: string;
  onLogout: () => void;
  events: Event[];
  registrations: Registration[];
  onCreateEventClick: () => void;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

const OrganizerDashboard = ({ 
  userName, 
  onLogout, 
  events, 
  registrations, 
  onCreateEventClick,
  notifications,
  setNotifications
}: OrganizerDashboardProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'explore' | 'eventDetails' | 'registrationList'>('dashboard');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [previousView, setPreviousView] = useState<'dashboard' | 'explore'>('dashboard');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [localEvents, setLocalEvents] = useState<Event[]>(events);

  // keep localEvents synced if props change
  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    setCurrentUserId(payload.id);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const handleEventClick = (event: any) => {
    setPreviousView(currentView as 'dashboard' | 'explore');
    setSelectedEvent(event);
    setCurrentView('eventDetails');
  };

  const handleViewRegistrations = (event: Event) => {
    setSelectedEvent(event);
    setCurrentView('registrationList');
  };

  
const handleDelete = async (eventId: string) => {
  if (!confirm("Delete this event?")) return;

  try {
    const res = await fetch(`${API_URL}/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // ✅ update UI instantly
    setLocalEvents(prev => prev.filter(e => e._id !== eventId));

  } catch (err) {
    console.error("Delete failed", err);
  }
};


  const handleDownloadList = (event: Event) => {
    const eventRegistrations = registrations.filter(r => r.eventId === event.id)
    
    if (eventRegistrations.length === 0) {
      alert('No registrations yet for this event.');
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Student Name,Email,Department,Year,Timestamp\n"
      + eventRegistrations.map(r => `${r.studentName},${r.studentEmail},${r.studentDept},${r.studentYear},${r.timestamp}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${event.title}_registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBack = () => {
    setCurrentView(previousView);
  };

  return (
    <div className="bg-[#0d1320] text-on-surface font-body min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-[#0d1320]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.06)] font-brand text-sm tracking-wide">
        <div className="flex items-center gap-8">
          <span 
            onClick={() => setCurrentView('dashboard')}
            className="text-xl font-bold tracking-tighter text-[#adc6ff] cursor-pointer"
          >
            Campus Radar
          </span>
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setCurrentView('explore')}
              className={`transition-colors active:scale-95 duration-200 ${currentView === 'explore' ? 'text-[#adc6ff] border-b-2 border-[#adc6ff] pb-1' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Explore
            </button>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`transition-colors active:scale-95 duration-200 ${currentView === 'dashboard' ? 'text-[#adc6ff] border-b-2 border-[#adc6ff] pb-1' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Dashboard
            </button>
            <a className="text-on-surface-variant hover:text-on-surface transition-colors active:scale-95 duration-200" href="#">My Applications</a>
            <a className="text-on-surface-variant hover:text-on-surface transition-colors active:scale-95 duration-200" href="#">Saved Events</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#adc6ff] w-4 h-4" />
            <input 
              className="bg-surface-container-highest border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#adc6ff] w-64 transition-all outline-none" 
              placeholder="Search analytics..." 
              type="text"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markAllAsRead();
              }}
              className="p-2 hover:bg-white/5 rounded-lg transition-all text-on-surface-variant relative"
            >
              <Bell size={20} />
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
                  className="absolute right-0 mt-2 w-80 bg-surface-container-low rounded-xl border border-white/10 shadow-2xl overflow-hidden z-100"
                >
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-sm font-bold text-on-surface">Notifications</h3>
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
                      <div className="p-8 text-center text-on-surface-variant text-xs">
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
                              <span className="text-[10px] text-outline">{n.timestamp}</span>
                            </div>
                            <h4 className="text-xs font-bold text-on-surface mb-1">{n.title}</h4>
                            <p className="text-[11px] text-on-surface-variant leading-relaxed">{n.message}</p>
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
              className="p-2 hover:bg-white/5 rounded-lg transition-all text-on-surface-variant"
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
                    <p className="text-sm font-bold text-on-surface truncate">{userName}</p>
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

      <main className="pt-24 pb-12 px-8 max-w-7xl mx-auto w-full grow">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header Section */}
              <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Welcome back, {userName || 'Organizer'}</h1>
                  <p className="text-on-surface-variant max-w-xl">Real-time performance metrics for your organization's events and student engagement.</p>
                </motion.div>
                <div className="flex gap-3">
                  <button 
                    onClick={onCreateEventClick}
                    className="px-8 py-3 rounded-full bg-linear-to-br from-[#adc6ff] to-primary-container text-on-primary-container font-headline font-extrabold text-sm shadow-xl shadow-primary-container/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Create Event
                  </button>
                  <button className="px-6 py-3 rounded-full bg-surface-container-high text-on-surface font-semibold text-sm hover:bg-surface-bright transition-all flex items-center gap-2 border border-white/5">
                    <Calendar size={18} />
                    Last 30 Days
                  </button>
                </div>
              </header>

              {/* Analytics Bento Grid */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
              >
                {/* Metric 1 */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="md:col-span-1 p-8 rounded-xl bg-surface-container-low border border-white/5 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4 block">Total Registrations</span>
                    <h3 className="text-5xl font-extrabold text-[#adc6ff] mb-2">{registrations.length}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                    <TrendingUp size={18} />
                    <span>Live data</span>
                  </div>
                </motion.div>
 
                {/* Metric 2 */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="md:col-span-1 p-8 rounded-xl bg-surface-container-low border border-white/5 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4 block">Attendance Rate</span>
                    <h3 className="text-5xl font-extrabold text-secondary mb-2">84%</h3>
                  </div>
                  <div className="flex items-center gap-2 text-[#adc6ff] text-sm font-medium">
                    <CheckCircle size={18} />
                    <span>Stable engagement</span>
                  </div>
                </motion.div>
 
                {/* Large Chart Panel */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  className="md:col-span-2 md:row-span-2 p-8 rounded-xl bg-surface-container-high border border-white/5 relative overflow-hidden group"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h4 className="text-xl font-bold text-on-surface">Engagement Trends</h4>
                      <p className="text-on-surface-variant text-sm">Active participants per week</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#adc6ff]"></div>
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    </div>
                  </div>
                  {/* Mock Chart Visualization */}
                  <div className="h-64 flex items-end justify-between gap-3 px-2">
                    {[40, 65, 50, 85, 60, 75, 95].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={`w-full rounded-t-lg transition-all duration-700 ${i === 3 ? 'bg-linear-to-t from-[#adc6ff]/40 to-[#adc6ff]' : 'bg-[#adc6ff]/20'}`}
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#adc6ff]/10 to-transparent pointer-events-none"></div>
                </motion.div>
 
                {/* Metric 3 */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="md:col-span-1 p-8 rounded-xl bg-surface-container-low border border-white/5 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4 block">Member Growth</span>
                    <h3 className="text-5xl font-extrabold text-tertiary mb-2">+142</h3>
                  </div>
                  <div className="flex items-center gap-2 text-tertiary text-sm font-medium">
                    <UserPlus size={18} />
                    <span>New students joined</span>
                  </div>
                </motion.div>
 
                {/* Metric 4 */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="md:col-span-1 p-8 rounded-xl bg-surface-container-low border border-white/5 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4 block">Avg. Rating</span>
                    <h3 className="text-5xl font-extrabold text-on-surface mb-2">4.9</h3>
                  </div>
                  <div className="flex items-center gap-1 text-[#adc6ff]">
                    {[1, 2, 3, 4].map(i => <Star key={i} size={18} fill="currentColor" />)}
                    <Star size={18} fill="currentColor" className="opacity-50" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Secondary Section: Recent Events & Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Event Performance Table */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="lg:col-span-2 bg-surface-container rounded-xl p-8 border border-white/5"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-2xl font-bold text-on-surface">Recent Event Performance</h4>
                    <a className="text-[#adc6ff] text-sm font-semibold hover:underline" href="#">View all events</a>
                  </div>
                  
                  <div className="space-y-4">
                    {localEvents.slice(0, 5).map((event, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center overflow-hidden">
                            <img src={event.image} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div>
                            <h5 className="font-bold text-on-surface">{event.title}</h5>
                            <p className="text-xs text-on-surface-variant">{event.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-8 text-right items-center">
                          <div>
                            <p className="text-xs text-on-surface-variant mb-1">Registrations</p>
                            <p className="font-bold text-[#adc6ff]">{event.registrationCount}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleViewRegistrations(event)}
                              className="p-2 rounded-lg bg-[#adc6ff]/10 text-[#adc6ff] hover:bg-[#adc6ff]/20 transition-all"
                              title="View Registrations"
                            >
                              <Users size={18} />
                            </button>
                            <button 
                              onClick={() => handleDownloadList(event)}
                              className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all"
                              title="Download CSV"
                            >
                              <Download size={18} />
                            </button>
                            {event.organizerId === currentUserId && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleDelete(event._id);
    }}
    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
    title="Delete Event"
  >
    <Trash2 size={18} />
  </button>
)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Audience Breakdown */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-surface-container-highest rounded-xl p-8 border border-white/5 flex flex-col"
                >
                  <h4 className="text-xl font-bold text-on-surface mb-6">Demographic Breakdown</h4>
                  <div className="relative w-48 h-48 mx-auto mb-8">
                    {/* Circular Chart Mock */}
                    <div className="absolute inset-0 rounded-full border-16 border-[#adc6ff]/20"></div>
                    <div className="absolute inset-0 rounded-full border-16 border-[#adc6ff] border-t-transparent border-r-transparent rotate-45"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-on-surface">62%</span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Undergrads</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Undergraduate', value: '1,538', color: 'bg-[#adc6ff]' },
                      { label: 'Postgraduate', value: '712', color: 'bg-secondary' },
                      { label: 'Faculty/Staff', value: '232', color: 'bg-[#ffb786]' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm text-on-surface-variant">{item.label}</span>
                        </div>
                        <span className="text-sm font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-auto w-full py-4 rounded-xl bg-[#0d1320] text-on-surface font-semibold text-sm border border-outline-variant hover:bg-surface-container-low transition-all">
                    Detailed Analytics
                  </button>
                </motion.div>
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
              <ExploreSection onEventClick={handleEventClick} userType="organizer" events={events} />
            </motion.div>
          )}

          {currentView === 'registrationList' && selectedEvent && (
            <motion.div
              key="registrationList"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="p-2 hover:bg-white/5 rounded-full text-on-surface-variant"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-on-surface">Registered Students</h2>
                    <p className="text-sm text-on-surface-variant">{selectedEvent.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDownloadList(selectedEvent)}
                  className="px-6 py-2 rounded-full bg-green-500/20 text-green-500 font-bold flex items-center gap-2 hover:bg-green-500/30 transition-all"
                >
                  <FileSpreadsheet size={18} />
                  Download Excel
                </button>
              </div>

              <div className="bg-surface-container-low rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#0d1320] border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-[#adc6ff] uppercase tracking-widest">Student Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#adc6ff] uppercase tracking-widest">Roll No.</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#adc6ff] uppercase tracking-widest">Department</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#adc6ff] uppercase tracking-widest">Year</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#adc6ff] uppercase tracking-widest">Email</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#adc6ff] uppercase tracking-widest">Applied On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {registrations.filter(r => r.eventId === selectedEvent.id).length > 0 ? (
                      registrations.filter(r => r.eventId === selectedEvent.id).map((reg, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium text-on-surface">{reg.studentName}</td>
                          <td className="px-6 py-4 text-on-surface-variant">{reg.studentRoll}</td>
                          <td className="px-6 py-4 text-on-surface-variant">{reg.studentDept}</td>
                          <td className="px-6 py-4 text-on-surface-variant">{reg.studentYear}</td>
                          <td className="px-6 py-4 text-on-surface-variant">{reg.studentEmail}</td>
                          <td className="px-6 py-4 text-on-surface-variant">{new Date(reg.timestamp).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                          No students have registered for this event yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {currentView === 'eventDetails' && selectedEvent && (
            <motion.div
              key="eventDetails"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-100 overflow-y-auto bg-[#0d1320]"
            >
              <EventDetails 
                event={selectedEvent} 
                onBack={handleBack} 
                onApply={() => {}}
                userType="organizer"
                userName={userName}
                onLogout={onLogout}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 mt-auto bg-[#0d1320] border-t border-white/5 text-xs text-on-surface-variant">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-semibold text-on-surface">Campus Radar</span>
            <p>© 2024 Campus Event Radar. Built for students.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-on-surface-variant hover:text-[#adc6ff] transition-colors" href="#">Support</a>
            <a className="text-on-surface-variant hover:text-[#adc6ff] transition-colors" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant hover:text-[#adc6ff] transition-colors" href="#">Terms of Service</a>
            <a className="text-on-surface-variant hover:text-[#adc6ff] transition-colors" href="#">Campus Map</a>
          </div>
          <div className="flex gap-4">
            <Share2 size={16} className="cursor-pointer hover:text-[#adc6ff] transition-colors" />
            <Globe size={16} className="cursor-pointer hover:text-[#adc6ff] transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrganizerDashboard;
