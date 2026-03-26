import { motion } from 'motion/react';

const AboutDeveloper = () => {
  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-32">
        <div className="md:col-span-5 relative group flex justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700"></div>
          <div className="relative w-full max-w-100 aspect-square rounded-full overflow-hidden border-4 border-primary/20 p-1.5 bg-surface-container-low shadow-2xl">
            <img 
              alt="Gourab Dey" 
              className="w-full h-full object-cover rounded-full transition-all duration-700" 
              src="https://avatars.githubusercontent.com/u/116297847?v=4"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="md:col-span-7 flex flex-col items-start gap-4">
          <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold tracking-widest uppercase">Developer Profile</span>
          <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface">
            <span className="text-primary">Gourab Dey</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant font-light max-w-lg leading-relaxed mt-4">
            MCA Student & Web Developer focusing on scalable system architectures and user-centric design.
          </p>
          <div className="flex flex-col gap-2 mt-4 text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">call</span>
              <span>+91-6291008213</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">mail</span>
              <span>gourabdey1357@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Experience & Projects (Bento Large) */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="md:col-span-2 glass-card rounded-lg p-10 flex flex-col justify-between border border-outline-variant/10 indigo-glow"
        >
          <div>
            <div className="flex items-center gap-3 mb-6 text-primary">
              <span className="material-symbols-outlined">work_history</span>
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase">Professional Journey</h2>
            </div>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-headline font-bold">Web Developer Intern</h3>
                  <span className="text-xs font-bold px-3 py-1 bg-surface-container-highest rounded-full text-primary">2021 — 2022</span>
                </div>
                <p className="text-on-surface-variant font-medium">SNLTR, Kolkata</p>
              </div>
              <div className="pt-6 border-t border-outline-variant/10">
                <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant mb-4">Featured Projects</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary mt-1">rocket</span>
                    <div>
                      <p className="font-bold text-on-surface">AI-Powered Train Traffic Optimization System</p>
                      <p className="text-sm text-on-surface-variant">Intelligent scheduling and traffic flow management using predictive algorithms.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary mt-1">restaurant</span>
                    <div>
                      <p className="font-bold text-on-surface">Canteen Management System</p>
                      <p className="text-sm text-on-surface-variant">Full-stack solution for inventory, orders, and digital transactions.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 flex gap-8">
            <div>
              <div className="text-4xl font-headline font-extrabold text-primary">8.44</div>
              <div className="text-xs text-on-surface-variant tracking-widest uppercase mt-1">MCA CGPA</div>
            </div>
            <div>
              <div className="text-4xl font-headline font-extrabold text-primary">8.79</div>
              <div className="text-xs text-on-surface-variant tracking-widest uppercase mt-1">BCA CGPA</div>
            </div>
          </div>
        </motion.div>

        {/* Education (Bento Small) */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="glass-card rounded-lg p-10 border border-outline-variant/10 flex flex-col justify-center"
        >
          <div className="flex items-center gap-3 mb-6 text-tertiary">
            <span className="material-symbols-outlined">school</span>
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-on-surface-variant">Education</h2>
          </div>
          <div className="space-y-8">
            <div>
              <h4 className="text-xl font-headline font-bold text-on-surface leading-tight">Masters of Computer Applications</h4>
              <p className="text-primary font-medium text-sm mt-1">B.P. Poddar Institute of Management & Technology</p>
              <p className="text-xs text-on-surface-variant mt-1">Oct 2024 — Jul 2026 | Kolkata</p>
            </div>
            <div className="h-px bg-outline-variant/10"></div>
            <div>
              <h4 className="text-lg font-headline font-bold text-on-surface/80 leading-tight">BCA</h4>
              <p className="text-on-surface-variant text-sm mt-1">Swami Vivekananda Institute of Modern Science</p>
              <p className="text-xs text-on-surface-variant/60 mt-1">Sep 2021 — Jun 2024</p>
            </div>
          </div>
        </motion.div>

        {/* Skills & Expertise */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="md:col-span-3 glass-card rounded-lg p-10 border border-outline-variant/10"
        >
          <div className="flex items-center gap-3 mb-10 text-primary">
            <span className="material-symbols-outlined">terminal</span>
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-on-surface-variant">Technical Arsenal</h2>
          </div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
            className="flex flex-wrap gap-3"
          >
            {[
              'Java', 'Spring Boot', 'Python', 'JavaScript', 'SQL', 
              'REST APIs', 'MySQL', 'DSA', 'OOP', 'Git', 'Linux', 'Postman'
            ].map((skill, index) => (
              <motion.span 
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
                className={`px-6 py-3 rounded-full font-medium border border-outline-variant/10 ${
                  skill === 'Java' ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20' : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Social Links */}
      <section className="mt-32 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-headline font-bold mb-4">Let's connect and innovate.</h2>
        <p className="text-on-surface-variant mb-12">I'm currently seeking opportunities where I can contribute to meaningful projects and grow as a software engineer.</p>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="group flex items-center gap-3 px-8 py-4 bg-surface-container-low rounded-full border border-outline-variant/20 hover:bg-primary transition-all duration-300" href="https://github.com/codinggourab" target="_blank" rel="noreferrer">
            <span className="material-symbols-outlined group-hover:text-on-primary transition-colors">code</span>
            <span className="font-headline font-bold group-hover:text-on-primary transition-colors">GitHub</span>
          </a>
          <a className="group flex items-center gap-3 px-8 py-4 bg-surface-container-low rounded-full border border-outline-variant/20 hover:bg-primary transition-all duration-300" href="https://www.linkedin.com/in/gourab-dey/" target="_blank" rel="noreferrer">
            <span className="material-symbols-outlined group-hover:text-on-primary transition-colors">link</span>
            <span className="font-headline font-bold group-hover:text-on-primary transition-colors">LinkedIn</span>
          </a>
          <a className="group flex items-center gap-3 px-8 py-4 bg-surface-container-low rounded-full border border-outline-variant/20 hover:bg-primary transition-all duration-300" href="#" target="_blank" rel="noreferrer">
            <span className="material-symbols-outlined group-hover:text-on-primary transition-colors">photo_camera</span>
            <span className="font-headline font-bold group-hover:text-on-primary transition-colors">Instagram</span>
          </a>
          <a className="group flex items-center gap-3 px-8 py-4 bg-primary text-on-primary rounded-full shadow-2xl shadow-primary/30 hover:scale-105 transition-all duration-300" href="#">
            <span className="material-symbols-outlined">download</span>
            <span className="font-headline font-bold">Download CV</span>
          </a>
        </div>
      </section>
    </section>
  );
};

export default AboutDeveloper;
