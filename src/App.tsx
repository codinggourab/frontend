import { useState, useEffect, FormEvent, Dispatch, SetStateAction } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
const API_URL = "https://backend-zdko.onrender.com";

const socket = io("https://backend-zdko.onrender.com", {
  transports: ["websocket"],
});

import { 
  Bell, 
  MapPin, 
  Code, 
  Palette, 
  Users, 
  Rocket, 
  Github, 
  Mail, 
  Lock, 
  User, 
  X,
  Share2,
  Globe,
  Eye,
  EyeOff,
  CircleUser,
  ArrowRight,
  ChevronRight,
  LayoutDashboard,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import OrganizerDashboard from './components/OrganizerDashboard';
import StudentDashboard from './components/StudentDashboard';
import ExploreSection from './components/ExploreSection';
import CreateEvent from './components/CreateEvent';
import AboutDeveloper from './components/AboutDeveloper';
// import { events as initialEvents } from './constants';
import { Event, Registration, Notification } from './types';

// --- Components ---

const Navbar = ({ onAuthClick, onNavigate, currentView, notifications, setNotifications }: { 
  onAuthClick: (type: 'login' | 'signup') => void;
  onNavigate: (view: 'landing' | 'about') => void;
  currentView: string;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || currentView !== 'landing' ? 'bg-[#0d1320]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.06)] py-2' : 'bg-transparent py-4'}`}>
      <div className="flex justify-between items-center px-8 w-full max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold tracking-tighter text-[#adc6ff] font-brand cursor-pointer"
          onClick={() => onNavigate('landing')}
        >
          Campus Radar
        </motion.div>
        
        <div className="hidden md:flex items-center gap-8 font-brand text-sm tracking-wide">
          {[
            { name: 'Features', view: 'landing', id: 'features' },
            { name: 'Stats', view: 'landing', id: 'stats' },
            { name: 'About', view: 'about' }
          ].map((item, i) => (
            <motion.button 
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${(currentView === item.view) ? 'text-[#adc6ff] border-b-2 border-[#adc6ff] pb-1' : 'text-on-surface-variant hover:text-on-surface'} transition-colors cursor-pointer`}
              onClick={() => {
                if (item.view === 'landing' && item.id) {
                  onNavigate('landing');
                  setTimeout(() => {
                    document.getElementById(item.id!)?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  onNavigate(item.view as any);
                }
              }}
            >
              {item.name}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-[#adc6ff] hover:bg-white/5 rounded-lg transition-all relative"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markAllAsRead();
              }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#0d1320]" />
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 glass-card rounded-xl border border-white/10 shadow-2xl overflow-hidden z-100"
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
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-[#adc6ff] hover:bg-white/5 rounded-lg transition-all"
            onClick={() => onAuthClick('login')}
          >
            <CircleUser size={20} />
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

const AuthModal = ({ isOpen, type, onClose, onSwitch, onAuthSuccess }: { 
  isOpen: boolean; 
  type: 'login' | 'signup'; 
  onClose: () => void;
  onSwitch: (type: 'login' | 'signup') => void;
  onAuthSuccess: (role: 'student' | 'organizer', name: string) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'organizer'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [collegeName, setCollegeName] = useState('');

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const url =
        type === 'signup'
          ? `${API_URL}/api/auth/signup`
          : `${API_URL}/api/auth/login`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          collegeName,
          type: role
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || 'Something went wrong');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (type === 'signup') {
        setIsSuccess(true);
        setTimeout(() => {
          onAuthSuccess(data.user.type, data.user.name);
          setIsLoading(false);
          setIsSuccess(false);
        }, 1200);
      } else {
        onAuthSuccess(data.user.type, data.user.name);
        setIsLoading(false);
      }
    } catch {
      setError('Server error');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setIsSuccess(false);
      setError(null);
      setEmail('');
      setPassword('');
      setFullName('');
      setCollegeName('');
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-[#0d1320]/40 backdrop-blur-md"
        >
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-[0_40px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10 max-h-[90vh] overflow-y-auto md:overflow-hidden"
          >
            {isLoading && (
              <div className="absolute inset-0 z-120 bg-[#0d1320]/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-[#adc6ff]/20 flex items-center justify-center mb-6">
                        <CheckCircle2 className="text-[#adc6ff]" size={48} />
                      </div>
                      <h2 className="text-3xl font-headline font-bold text-on-surface mb-2">Registration Successful!</h2>
                      <p className="text-on-surface-variant">Redirecting to your dashboard...</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <Loader2 className="text-[#adc6ff] animate-spin mb-6" size={48} />
                      <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">
                        {type === 'login' ? 'Authenticating...' : 'Creating Account...'}
                      </h2>
                      <p className="text-on-surface-variant">Please wait a moment</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <button 
              className="absolute top-4 right-4 z-110 p-2 text-on-surface-variant hover:text-on-surface hover:bg-white/10 rounded-full transition-all"
              onClick={onClose}
            >
              <X size={20} />
            </button>

            {/* Left Side: Illustration */}
            <div className="hidden md:block w-1/2 relative bg-surface-container-low overflow-hidden">
              <motion.img 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={{ duration: 1.5 }}
                alt="Campus Life" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000"
              />
              <div className="absolute inset-0 bg-linear-to-br from-[#adc6ff]/30 via-[#0d1320]/40 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-12 z-10">
                <motion.h2 
                  key={type === 'login' ? 'login-title' : 'signup-title'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-headline font-extrabold text-[#adc6ff] mb-4 leading-tight"
                >
                  {type === 'login' ? "Connect with your campus pulse." : "Stay Ahead of the Curve."}
                </motion.h2>
                <motion.p 
                  key={type === 'login' ? 'login-desc' : 'signup-desc'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-on-surface-variant text-lg max-w-md"
                >
                  {type === 'login' 
                    ? "Discover exclusive student events, workshops, and social gatherings in real-time."
                    : "Join thousands of students across campus to discover hackathons and networking events."}
                </motion.p>
              </div>
            </div>

            {/* Right Side: Forms */}
            <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-[#0d1320]/40">
              <AnimatePresence mode="wait">
                {type === 'login' ? (
                  <motion.div 
                    key="login-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-10 text-center md:text-left">
                      <h1 className="text-3xl font-headline font-bold text-on-surface mb-2">Welcome Back</h1>
                      <p className="text-on-surface-variant font-medium">Sign in to your account</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-full bg-surface-container-highest hover:bg-surface-bright transition-all ring-1 ring-white/10 active:scale-[0.98]">
                        <img alt="Google" className="w-5 h-5" src="https://www.google.com/favicon.ico" />
                        <span className="text-sm font-semibold text-white">Google</span>
                      </button>
                      <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-full bg-surface-container-highest hover:bg-surface-bright transition-all ring-1 ring-white/10 active:scale-[0.98]">
                        <Github size={20} className="text-white" />
                        <span className="text-sm font-semibold text-white">GitHub</span>
                      </button>
                    </div>

                    <div className="relative flex items-center mb-8">
                      <div className="grow border-t border-white/10"></div>
                      <span className="shrink mx-4 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">OR USE EMAIL</span>
                      <div className="grow border-t border-white/10"></div>
                    </div>

                    <form className="space-y-6" onSubmit={handleAuth}>
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
                        >
                          <AlertCircle size={18} />
                          {error}
                        </motion.div>
                      )}
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">Role</label>
                        <select 
                          value={role}
                          onChange={(e) => setRole(e.target.value as 'student' | 'organizer')}
                          className="w-full bg-surface-container-highest border-none rounded-2xl py-4 px-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all outline-none"
                        >
                          <option value="student">Student</option>
                          <option value="organizer">Organizer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">Email address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adc6ff]" size={20} />
                          <input 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-surface-container-highest border-none rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-[#adc6ff]/50 transition-all" 
                            placeholder="name@campus.edu" 
                            type="email" 
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2 ml-1">
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Password</label>
                          <a className="text-xs font-bold text-[#adc6ff] hover:text-primary-container transition-colors" href="#">Forgot Password?</a>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adc6ff]" size={20} />
                          <input 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-surface-container-highest border-none rounded-2xl py-4 pl-12 pr-12 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-[#adc6ff]/50 transition-all" 
                            placeholder="••••••••" 
                            type={showPassword ? "text" : "password"} 
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <input className="w-5 h-5 rounded border-none bg-surface-container-highest text-[#adc6ff] focus:ring-offset-[#0d1320] focus:ring-[#adc6ff]" id="remember" type="checkbox" />
                        <label className="ml-3 text-sm font-medium text-on-surface-variant cursor-pointer select-none" htmlFor="remember">Remember Me</label>
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-4 rounded-full bg-linear-to-r from-[#adc6ff] to-primary-container text-on-primary font-headline font-bold text-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
                      >
                        Sign In
                      </button>
                    </form>
                    <p className="mt-8 text-center text-sm font-medium text-on-surface-variant">
                      Don't have an account? 
                      <button className="text-[#adc6ff] font-bold hover:underline decoration-2 underline-offset-4 ml-1" onClick={() => onSwitch('signup')}>Sign up</button>
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="signup-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <header className="mb-8 text-center md:text-left">
                      <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">Create Your Account</h1>
                      <p className="text-on-surface-variant font-medium">Join the community today</p>
                    </header>
                    <form className="space-y-4" onSubmit={handleAuth}>
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
                        >
                          <AlertCircle size={18} />
                          {error}
                        </motion.div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">Role</label>
                          <select 
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'student' | 'organizer')}
                            className="w-full bg-surface-container-highest border-none rounded-2xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all"
                          >
                            <option value="student">Student</option>
                            <option value="organizer">Organizer</option>
                          </select>
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adc6ff]" size={18} />
                            <input 
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full bg-surface-container-highest border-none rounded-2xl py-3 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-[#adc6ff]/50 transition-all" 
                              placeholder="Alex Rivera" 
                              type="text" 
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">College Name</label>
                          <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adc6ff]" size={18} />
                            <input 
                              required
                              value={collegeName}
                              onChange={(e) => setCollegeName(e.target.value)}
                              className="w-full bg-surface-container-highest border-none rounded-2xl py-3 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-[#adc6ff]/50 transition-all" 
                              placeholder="University of Technology" 
                              type="text" 
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adc6ff]" size={18} />
                            <input 
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-surface-container-highest border-none rounded-2xl py-3 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-[#adc6ff]/50 transition-all" 
                              placeholder="alex@gmail.com" 
                              type="email" 
                            />
                          </div>
                        </div>
                        
                        {role === 'student' && (
                          <>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">Department</label>
                              <select className="w-full bg-surface-container-highest border-none rounded-2xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all">
                                <option>Select</option>
                                <option>BCA</option>
                                <option>MCA</option>
                                <option>BTECH</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">Stream</label>
                              <select className="w-full bg-surface-container-highest border-none rounded-2xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all">
                                <option>Select</option>
                                <option>CA (Computer Application)</option>
                                <option>CS</option>
                                <option>IT</option>
                                <option>ECE</option>
                                <option>EE</option>
                              </select>
                            </div>
                          </>
                        )}

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
                          <input 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-surface-container-highest border-none rounded-2xl py-3 px-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-[#adc6ff]/50 transition-all" 
                            placeholder="••••••••" 
                            type="password" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">Confirm</label>
                          <input 
                            required
                            className="w-full bg-surface-container-highest border-none rounded-2xl py-3 px-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-[#adc6ff]/50 transition-all" 
                            placeholder="••••••••" 
                            type="password" 
                          />
                        </div>
                      </div>
                      <div className="pt-4">
                        <button 
                          type="submit"
                          className="w-full py-4 rounded-full bg-linear-to-r from-[#adc6ff] to-primary-container text-on-primary font-bold font-headline text-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                          Create Account
                          <ArrowRight size={20} />
                        </button>
                      </div>
                      <p className="text-center pt-4 text-on-surface-variant text-sm">
                        Already have an account? 
                        <button className="text-[#adc6ff] font-semibold hover:underline decoration-2 underline-offset-4 transition-all" onClick={() => onSwitch('login')}>Sign in</button>
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  
  const [view, setView] = useState<'landing' | 'student-dashboard' | 'organizer-dashboard' | 'about'>('landing');
  const [userName, setUserName] = useState<string>('');
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: 'login' | 'signup' }>({
    isOpen: false,
    type: 'login'
  });

  // Global State
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
  try {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_URL}/api/events`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("Server Error:", text);
      throw new Error("API failed");
    }

    const data = JSON.parse(text);
    setEvents(data);

  } catch (err) {
    console.error('Failed to fetch events:', err);
  }
};
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    fetchEvents();
    fetchRegistrations();
  }
}, []);

  const fetchRegistrations = async () => {
  try {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_URL}/api/registrations`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setRegistrations(data);

  } catch (err) {
    console.error('Failed to fetch registrations:', err);
  }
};

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    fetchRegistrations();
  }
}, []);

useEffect(() => {
  const token = localStorage.getItem('token');

  if (!token) return;

  // Verify token with backend
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setUserName(data.name);

        if (data.type === 'student') {
          setView('student-dashboard');
        } else {
          setView('organizer-dashboard');
        }
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
    }
  };

  fetchUser();
}, []);
  useEffect(() => {
  socket.on('new_event', (event) => {
    console.log('New event received:', event);

    setEvents(prev => [event, ...prev]);

    addNotification(
      'New Event Created',
      `"${event.title}" is now live`,
      'event_created'
    );
  });

  return () => {
    socket.off('new_event');
  };
}, []);

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (title: string, message: string, type: 'event_created' | 'student_applied') => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    toast(title, {
      description: message,
      action: {
        label: "View",
        onClick: () => console.log("View notification")
      },
    });
  };

  const handleAuthSuccess = (role: 'student' | 'organizer', name: string) => {
    closeAuth();
    setUserName(name);
    if (role === 'student') {
      setView('student-dashboard');
    } else {
      setView('organizer-dashboard');
    }
  };

  const handleLogout = () => {
  localStorage.removeItem('token'); // ✅ ADD THIS
  setView('landing');
  setUserName('');
};

 const handleCreateEvent = async (newEvent: Event) => {
  try {
    const { id, ...eventData } = newEvent;

    await fetch(`${API_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(eventData)
    });

    // ❌ DO NOT setEvents here anymore
    // Socket will handle it automatically

  } catch (err) {
    console.error(err);
  }
};
  const handleRegister = async (registration: Registration) => {
  try {
    await fetch(`${API_URL}/api/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(registration)
    });

    // ✅ FETCH fresh data from DB
    await fetchRegistrations();

    // Optional: notification
    const event = events.find(e => e.id === registration.eventId);

    addNotification(
      'New Application Received',
      `${registration.studentName} applied for "${event?.title || 'your event'}".`,
      'student_applied'
    );

  } catch (error) {
    console.error('Failed to save registration:', error);
  }
};

  const openAuth = (type: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, type });
    document.body.style.overflow = 'hidden';
  };

  const closeAuth = () => {
    setAuthModal({ ...authModal, isOpen: false });
    document.body.style.overflow = 'auto';
  };

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  if (view === 'student-dashboard') {
    return (
      <StudentDashboard 
        userName={userName} 
        onLogout={handleLogout} 
        events={events}
        onRegister={handleRegister}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    );
  }

  if (view === 'organizer-dashboard') {
    return (
      <>
        <OrganizerDashboard 
          userName={userName} 
          onLogout={handleLogout} 
          events={events}
          registrations={registrations}
          onCreateEventClick={() => setShowCreateEvent(true)}
          notifications={notifications}
          setNotifications={setNotifications}
        />
        <AnimatePresence>
          {showCreateEvent && (
            <CreateEvent 
              onClose={() => setShowCreateEvent(false)} 
              onPublish={handleCreateEvent} 
              userName={userName}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="bg-[#0d1320] text-on-surface font-body selection:bg-primary-container/30 min-h-screen flex flex-col">
      <Toaster position="bottom-right" theme="dark" richColors />
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-0 w-full z-50"
      >
        <Navbar 
          onAuthClick={openAuth} 
          onNavigate={(v) => setView(v as any)} 
          currentView={view}
          notifications={notifications}
          setNotifications={setNotifications}
        />
      </motion.div>
      
      <main className={`pt-16 transition-all duration-500 ${authModal.isOpen ? 'blur-md scale-[0.98]' : ''}`}>
        <AnimatePresence mode="wait">
          {view === 'about' ? (
            <motion.div 
              key="about"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="pt-12"
            >
              <AboutDeveloper />
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section */}
            <section id="features" className="relative min-h-217.5 flex items-center px-8 overflow-hidden">
          <motion.div 
            style={{ y: backgroundY }}
            className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-[#adc6ff]/10 rounded-full blur-[120px] -z-10"
          />
          <motion.div 
            style={{ y: backgroundY }}
            className="absolute bottom-[5%] left-[-5%] w-100 h-100 bg-primary-container/5 rounded-full blur-[100px] -z-10"
          />
          
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-highest/50 border border-white/10">
                <span className="flex h-2 w-2 rounded-full bg-[#adc6ff] animate-pulse"></span>
                <span className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant">Live for Fall Semester</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-headline font-extrabold leading-[1.1] text-on-surface">
                Discover and Apply to the <span className="text-gradient">Best College Events</span>
              </h1>
              <p className="text-lg text-on-surface-variant max-w-lg leading-relaxed">
                Navigate campus life with precision. Find workshops, networking nights, and social mixers tailored to your professional and personal growth.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-linear-to-r from-[#adc6ff] to-primary-container text-on-primary-container font-bold px-8 py-4 rounded-full shadow-lg shadow-primary-container/20 transition-all"
                  onClick={() => openAuth('signup')}
                >
                  Get Started Now
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  className="px-8 py-4 rounded-full border border-white/20 font-semibold text-on-surface transition-all"
                  onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Stats
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: 'spring' }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-linear-to-r from-[#adc6ff]/20 to-primary-container/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-surface-container rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  alt="Campus Event" 
                  className="w-full h-125 object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://d17thj9kqp1mkn.cloudfront.net/strapi-assets-tech_a34b41e7f9.jpg"
                />
                <div className="absolute bottom-6 left-6 right-6 p-6 glass-morphism rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#adc6ff]/20 text-[#adc6ff] text-xs font-bold uppercase tracking-wider">Featured Event</span>
                    <span className="text-on-surface-variant text-sm">Starts within 7 days</span>
                  </div>
                  <h3 className="text-xl font-headline font-bold mb-1 text-white">Android Development Workshop </h3>
                  <p className="text-on-surface-variant text-sm flex items-center gap-2">
                    <MapPin className="text-[#adc6ff]" size={16} />
                    MCA, BPPIMT
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-20 px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="container mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { label: 'Weekly Events', value: '500+' },
              { label: 'Active Students', value: '12k' },
              { label: 'Organizations', value: '45' },
              { label: 'Success Rate', value: '98%' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
                className="text-center p-8 rounded-2xl bg-[#070e1a] border border-white/5"
              >
                <div className="text-4xl font-headline font-extrabold text-[#adc6ff] mb-2">{stat.value}</div>
                <div className="text-on-surface-variant text-sm uppercase tracking-widest font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8 mb-12">
          <div className="container mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden bg-primary-container p-12 lg:p-20 flex flex-col items-center text-center"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-[#adc6ff]/40 to-transparent"></div>
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl lg:text-5xl font-headline font-extrabold text-on-primary-container mb-6">Ready to elevate your campus experience?</h2>
                <p className="text-on-primary-container/80 text-lg mb-10">Join thousands of students who never miss a beat. Your next big opportunity is just one click away.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-on-primary-container text-primary-fixed font-bold rounded-full transition-transform"
                    onClick={() => openAuth('signup')}
                  >
                    Create Free Account
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,40,93,0.1)' }}
                    className="px-10 py-4 border-2 border-on-primary-container/20 text-on-primary-container font-bold rounded-full transition-colors"
                  >
                    Talk to an Organizer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    )}
  </AnimatePresence>
</main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 mt-auto bg-[#0d1320] border-t border-white/5">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-lg font-semibold text-on-surface font-brand">Campus Event Radar</div>
            <div className="font-brand text-xs text-on-surface-variant">© 2024 Campus Event Radar. Built for students.</div>
          </div>
          <div className="flex gap-8">
            {['Support', 'Privacy Policy', 'Terms of Service', 'Campus Map'].map(item => (
              <a key={item} className="text-on-surface-variant hover:text-[#adc6ff] transition-colors font-brand text-xs uppercase tracking-widest" href="#">{item}</a>
            ))}
          </div>
          <div className="flex gap-4">
            <motion.div whileHover={{ scale: 1.2 }} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-[#adc6ff] cursor-pointer transition-colors">
              <Share2 size={16} />
            </motion.div>
            <motion.div whileHover={{ scale: 1.2 }} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-[#adc6ff] cursor-pointer transition-colors">
              <Globe size={16} />
            </motion.div>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModal.isOpen} 
        type={authModal.type} 
        onClose={closeAuth}
        onSwitch={(type) => setAuthModal({ ...authModal, type })}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
