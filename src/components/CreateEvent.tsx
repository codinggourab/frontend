import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Calendar, 
  MapPin, 
  Type, 
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight
} from 'lucide-react';
import { Event } from '../types';
const API_URL = "https://backend-zdko.onrender.com";
interface CreateEventProps {
  onClose: () => void;
  onPublish: (event: Event) => void;
  userName?: string;
}

const steps = [
  { id: 1, title: 'Basics', description: 'Event Identity' },
  { id: 2, title: 'Details', description: 'Content & Rules' },
  { id: 3, title: 'Timeline', description: 'Dates & Times' },
  { id: 4, title: 'Review', description: 'Final Check' }
];

export default function CreateEvent({ onClose, onPublish, userName }: CreateEventProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    category: 'Technology',
    location: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
    details: {
      eligibility: '',
      prizes: '',
      timeline: {
        registrationOpens: '',
        registrationCloses: '',
        eventBegins: '',
        eventEnds: '',
        winnersAnnouncement: ''
      }
    }
  });

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const [loading, setLoading] = useState(false);

const handlePublish = async (e?: FormEvent) => {
  e?.preventDefault(); // 🔥 prevents double submit

  if (loading) return; // 🔥 prevents double clicks
  setLoading(true);

  const newEvent: Event = {
    ...formData as Event,
    id: Math.random().toString(36).slice(2, 11),
   
    organizerName: userName || 'Event Organizer',
    registrationCount: 0,
    status: 'upcoming',
    date: formData.details?.timeline?.eventBegins || new Date().toISOString(), // ✅ better date format
    time: '10:00 AM',
  };

  try {
    const res = await fetch(`${API_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newEvent)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || 'Failed to publish event');
    }

    // ✅ ONLY use backend response
    onPublish((data?.event || data) as Event);

  } catch (error) {
    console.error('❌ Publish event failed:', error);
    // ❌ removed fake success (important)
  } finally {
    setLoading(false);
  }
};
  const updateFormData = (field: keyof Event, value: Event[keyof Event]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "z0yqqaca"); // ✅ YOUR preset

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dzzbcjxkv/image/upload", // 🔥 replace this
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    console.log("Cloudinary response:", data); // 👈 check this

    // ✅ save image URL
    updateFormData("image", data.secure_url);

  } catch (err) {
    console.error("Image upload failed", err);
  }
};

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const updateTimeline = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        timeline: {
          ...prev.details?.timeline,
          [field]: value
        }
      } as any
    }));
  };

  return (
    <div className="fixed inset-0 z-100 bg-[#070e1a] overflow-y-auto font-body selection:bg-primary-container/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0d1320]/80 backdrop-blur-xl border-b border-white/10 py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-on-surface-variant transition-all"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-headline font-bold text-on-surface">Create New Event</h1>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Campus Event Radar</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-full border border-white/10 text-on-surface-variant font-semibold hover:bg-white/5 transition-all"
            >
              Save Draft
            </button>
            
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Stepper */}
        <div className="lg:col-span-3 space-y-8">
          <div className="sticky top-32">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="space-y-6"
            >
              {steps.map((step) => (
                <motion.div 
                  key={step.id} 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex gap-4 group"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                      currentStep === step.id 
                        ? 'bg-[#adc6ff] text-on-primary shadow-[0_0_20px_rgba(173,198,255,0.4)]' 
                        : currentStep > step.id 
                          ? 'bg-green-500 text-white' 
                          : 'bg-surface-container text-on-surface-variant border border-white/10'
                    }`}>
                      {currentStep > step.id ? <CheckCircle2 size={20} /> : step.id}
                    </div>
                    {step.id !== 4 && (
                      <div className={`w-0.5 h-12 my-2 transition-colors duration-500 ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-white/10'
                      }`} />
                    )}
                  </div>
                  <div className="pt-1">
                    <h3 className={`font-headline font-bold transition-colors ${
                      currentStep === step.id ? 'text-[#adc6ff]' : 'text-on-surface-variant'
                    }`}>{step.title}</h3>
                    <p className="text-xs text-outline font-medium">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-12 p-6 rounded-2xl bg-[#adc6ff]/5 border border-[#adc6ff]/10">
              <div className="flex items-center gap-3 text-[#adc6ff] mb-3">
                <AlertCircle size={20} />
                <h4 className="font-bold text-sm">Pro Tip</h4>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Events with high-quality banners and clear timelines get 40% more registrations.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Form Content */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-headline font-bold text-on-surface">Basic Information</h2>
                  <p className="text-on-surface-variant">Set the core identity of your event.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Event Title</label>
                    <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adc6ff]" size={20} />
                      <input 
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                        placeholder="e.g. HackTheCampus 2024"
                        className="w-full bg-surface-container border-white/10 rounded-2xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => updateFormData('category', e.target.value)}
                      className="w-full bg-surface-container border-white/10 rounded-2xl py-4 px-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all outline-none"
                    >
                      <option>Technology</option>
                      <option>Arts & Culture</option>
                      <option>Social</option>
                      <option>Sports</option>
                      <option>Academic</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Location / Venue</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adc6ff]" size={20} />
                      <input 
                        type="text"
                        value={formData.location}
                        onChange={(e) => updateFormData('location', e.target.value)}
                        placeholder="e.g. Main Auditorium, Hall A"
                        className="w-full bg-surface-container border-white/10 rounded-2xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Event Banner</label>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <div 
                      onClick={triggerFileInput}
                      className="relative group cursor-pointer"
                    >
                      <div className="w-full h-64 rounded-3xl border-2 border-dashed border-white/10 bg-surface-container flex flex-col items-center justify-center gap-4 group-hover:border-[#adc6ff]/50 transition-all overflow-hidden relative">
                        {formData.image ? (
                          <>
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-50" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                              <Upload className="text-[#adc6ff]" size={32} />
                              <span className="text-on-surface font-bold">Change Banner Image</span>
                              <span className="text-xs text-on-surface-variant">1920 x 1080 recommended</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 rounded-full bg-[#adc6ff]/10 flex items-center justify-center text-[#adc6ff]">
                              <Upload size={32} />
                            </div>
                            <div className="text-center">
                              <p className="text-on-surface font-bold">Click or drag to upload banner</p>
                              <p className="text-xs text-on-surface-variant mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-headline font-bold text-on-surface">Event Details</h2>
                  <p className="text-on-surface-variant">Provide in-depth information about your event.</p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Description</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 text-[#adc6ff]" size={20} />
                      <textarea 
                        rows={6}
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        placeholder="Describe your event in detail..."
                        className="w-full bg-surface-container border-white/10 rounded-2xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Eligibility Criteria</label>
                      <textarea 
                        rows={4}
                        value={formData.details?.eligibility}
                        onChange={(e) => setFormData(prev => ({ ...prev, details: { ...prev.details, eligibility: e.target.value } as any }))}
                        placeholder="Who can participate?"
                        className="w-full bg-surface-container border-white/10 rounded-2xl py-4 px-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Prizes & Rewards</label>
                      <textarea 
                        rows={4}
                        value={formData.details?.prizes}
                        onChange={(e) => setFormData(prev => ({ ...prev, details: { ...prev.details, prizes: e.target.value } as any }))}
                        placeholder="What are the rewards?"
                        className="w-full bg-surface-container border-white/10 rounded-2xl py-4 px-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-headline font-bold text-on-surface">Event Timeline</h2>
                  <p className="text-on-surface-variant">Define key dates and times for your event.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Registration Opens</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adc6ff]" size={20} />
                      <input 
                        type="datetime-local"
                        value={formData.details?.timeline?.registrationOpens}
                        onChange={(e) => updateTimeline('registrationOpens', e.target.value)}
                        className="w-full bg-surface-container border-white/10 rounded-2xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Registration Closes</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adc6ff]" size={20} />
                      <input 
                        type="datetime-local"
                        value={formData.details?.timeline?.registrationCloses}
                        onChange={(e) => updateTimeline('registrationCloses', e.target.value)}
                        className="w-full bg-surface-container border-white/10 rounded-2xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Event Begins</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adc6ff]" size={20} />
                      <input 
                        type="datetime-local"
                        value={formData.details?.timeline?.eventBegins}
                        onChange={(e) => updateTimeline('eventBegins', e.target.value)}
                        className="w-full bg-surface-container border-white/10 rounded-2xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Event Ends</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adc6ff]" size={20} />
                      <input 
                        type="datetime-local"
                        value={formData.details?.timeline?.eventEnds}
                        onChange={(e) => updateTimeline('eventEnds', e.target.value)}
                        className="w-full bg-surface-container border-white/10 rounded-2xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Winners Announcement</label>
                    <div className="relative">
                      <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adc6ff]" size={20} />
                      <input 
                        type="datetime-local"
                        value={formData.details?.timeline?.winnersAnnouncement}
                        onChange={(e) => updateTimeline('winnersAnnouncement', e.target.value)}
                        className="w-full bg-surface-container border-white/10 rounded-2xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-[#adc6ff]/50 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-headline font-bold text-on-surface">Review & Publish</h2>
                  <p className="text-on-surface-variant">One last look before your event goes live.</p>
                </div>

                <div className="bg-surface-container rounded-3xl border border-white/10 overflow-hidden">
                  <div className="h-48 relative">
                    <img src={formData.image} alt="Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-surface-container to-transparent" />
                    <div className="absolute bottom-6 left-8">
                      <span className="px-3 py-1 rounded-full bg-[#adc6ff]/20 text-[#adc6ff] text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                        {formData.category}
                      </span>
                      <h3 className="text-3xl font-headline font-bold text-white">{formData.title || 'Untitled Event'}</h3>
                    </div>
                  </div>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-6 md:col-span-2">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-[#adc6ff] uppercase tracking-widest">Description</h4>
                        <p className="text-on-surface-variant text-sm leading-relaxed">
                          {formData.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-[#adc6ff] uppercase tracking-widest">Location</h4>
                          <p className="text-on-surface text-sm flex items-center gap-2">
                            <MapPin size={16} />
                            {formData.location || 'Not specified'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-[#adc6ff] uppercase tracking-widest">Registration</h4>
                          <p className="text-on-surface text-sm flex items-center gap-2">
                            <Calendar size={16} />
                            {formData.details?.timeline?.registrationCloses ? new Date(formData.details.timeline.registrationCloses).toLocaleDateString() : 'TBD'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0d1320]/50 rounded-2xl p-6 space-y-4 border border-white/5">
                      <h4 className="text-xs font-bold text-[#adc6ff] uppercase tracking-widest">Publishing Checklist</h4>
                      <div className="space-y-3">
                        {[
                          { label: 'Basic Info Complete', done: !!formData.title && !!formData.location },
                          { label: 'Banner Uploaded', done: !!formData.image },
                          { label: 'Description Added', done: !!formData.description },
                          { label: 'Timeline Set', done: !!formData.details?.timeline?.eventBegins }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                              {item.done ? <CheckCircle2 size={14} /> : <X size={14} />}
                            </div>
                            <span className={`text-xs font-medium ${item.done ? 'text-on-surface-variant' : 'text-red-400'}`}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 rounded-2xl bg-[#adc6ff]/5 border border-[#adc6ff]/10">
                  <input type="checkbox" className="w-5 h-5 rounded border-white/10 bg-surface-container text-[#adc6ff] focus:ring-[#adc6ff]" />
                  <p className="text-sm text-on-surface-variant">
                    I agree to the <span className="text-[#adc6ff] font-bold underline cursor-pointer">Terms of Service</span> and confirm that all information provided is accurate.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-12 flex justify-between items-center pt-8 border-t border-white/10">
            <button 
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                currentStep === 1 ? 'opacity-0 cursor-default' : 'text-on-surface-variant hover:bg-white/5'
              }`}
            >
              <ArrowLeft size={20} />
              Back
            </button>
            
            <div className="flex gap-4">
              {currentStep < 4 ? (
                <button 
                  onClick={handleNext}
                  className="flex items-center gap-2 px-10 py-3 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                >
                  Next Step
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button 
  type="button" // 🔥 important
  onClick={handlePublish} // 🔥 THIS WAS MISSING
  disabled={loading}
  className="flex items-center gap-2 px-12 py-4 rounded-full bg-linear-to-r from-[#adc6ff] to-primary-container text-on-primary font-headline font-extrabold text-lg shadow-xl shadow-primary-container/20 hover:scale-105 active:scale-95 transition-all"
>
  {loading ? 'Publishing...' : 'Publish Event'}
  <ChevronRight size={24} />
</button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
