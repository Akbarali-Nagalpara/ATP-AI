import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  TerminalSquare, 
  Code2,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] overflow-x-hidden selection:bg-[var(--color-primary)]/30 selection:text-[var(--color-primary)]">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)]/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent)]/10 blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 w-full bg-[var(--canvas)]/80 backdrop-blur-xl border-b border-[var(--outline)] z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/Main_Logo.png" alt="Endpoint IQ Logo" className="w-48 max-w-none object-contain block dark:hidden" />
            <img src="/main_Logo_Dark.png" alt="Endpoint IQ Logo" className="w-48 max-w-none object-contain hidden dark:block" />
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[var(--ink-muted)]">
            <a href="#features" className="hover:text-[var(--ink)] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[var(--ink)] transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-[var(--ink)] transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-[var(--ink)] hover:text-[var(--color-primary)] transition-colors">
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="bg-[var(--color-primary)] text-[#080810] px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,229,160,0.15)] flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 relative z-10 flex flex-col items-center">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(0,229,160,0.1)]">
            <Zap className="w-3.5 h-3.5" />
            Endpoint IQ 2.0 is Live
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--ink)] mb-8 leading-tight">
            Automate API Security with <span className="gradient-text">Intelligent Intelligence</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-[var(--ink-muted)] mb-12 max-w-2xl mx-auto leading-relaxed">
            Import your OpenAPI specs, let AI detect access control roles, and automatically stress-test your backend for Broken Object Level Authorization (BOLA) and logic flaws.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto bg-[var(--color-primary)] text-[#080810] px-8 py-4 rounded-xl text-base font-bold hover:opacity-90 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,229,160,0.25)] flex items-center justify-center gap-2"
            >
              Start Testing Free <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              className="w-full sm:w-auto bg-transparent border border-[var(--outline-strong)] text-[var(--ink)] px-8 py-4 rounded-xl text-base font-bold hover:border-[var(--ink)] hover:bg-[var(--surface-hover)] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Code2 className="w-5 h-5" /> View Documentation
            </button>
          </motion.div>
        </motion.div>

        {/* Hero Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 w-full max-w-5xl rounded-2xl overflow-hidden border border-[var(--outline)] shadow-2xl relative"
        >
          {/* Mock window header */}
          <div className="bg-[var(--surface-hover)] border-b border-[var(--outline)] px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <div className="ml-4 text-xs font-mono text-[var(--ink-muted)] flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              project_workspace
            </div>
          </div>
          {/* Mock window body */}
          <div className="bg-[var(--surface)] p-6 md:p-10 flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-[var(--outline)] rounded w-1/3 mb-8 skeleton" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-[var(--outline)] bg-[var(--surface-hover)]">
                    <div className="w-12 h-6 rounded bg-[var(--method-get)]/20 border border-[var(--method-get)]/30" />
                    <div className="h-3 bg-[var(--outline)] rounded w-full max-w-[200px]" />
                    <div className="ml-auto w-16 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-[var(--canvas)] rounded-xl border border-[var(--outline)] p-5 font-mono text-xs leading-loose">
              <div className="text-[var(--color-primary)] flex items-center gap-2 mb-4">
                <TerminalSquare className="w-4 h-4" /> AI Diagnostics
              </div>
              <div className="text-[var(--ink-muted)] mb-2">Analyzing endpoint configurations...</div>
              <div className="text-[var(--color-warning)] mb-2">BOLA vulnerability detected in PUT /users/:id</div>
              <div className="text-rose-400 mb-4">Worker role accessed Admin resource</div>
              <div className="text-[var(--color-primary)]">&gt; Generating remediation prompt...</div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* How It Works Pipeline */}
      <section id="how-it-works" className="py-32 bg-[var(--surface)] border-y border-[var(--outline)] relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink)] mb-4">How Endpoint IQ Works</h2>
            <p className="text-[var(--ink-muted)] max-w-2xl mx-auto">A seamless, automated security pipeline from specification to remediation.</p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[3rem] left-[12%] right-[12%] h-[2px] bg-[var(--outline)] z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
              {[
                { 
                  icon: Code2, 
                  title: "1. Import", 
                  desc: "Provide your OpenAPI spec URL. Endpoint IQ maps your entire API." 
                },
                { 
                  icon: Cpu, 
                  title: "2. Analyze", 
                  desc: "AI automatically infers roles, endpoints, and authentication workflows." 
                },
                { 
                  icon: ShieldCheck, 
                  title: "3. Execute", 
                  desc: "Cross-role simulated attacks run to find BOLA and logic flaws." 
                },
                { 
                  icon: TerminalSquare, 
                  title: "4. Remediate", 
                  desc: "Instantly copy AI-generated developer prompts to fix the issues." 
                }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="flex flex-col items-center text-center relative group"
                >
                  <div className="w-24 h-24 rounded-2xl bg-[var(--canvas)] border-2 border-[var(--outline)] flex items-center justify-center mb-6 shadow-xl group-hover:border-[var(--color-primary)] group-hover:scale-110 transition-all z-10 relative">
                    <step.icon className="w-10 h-10 text-[var(--ink)] group-hover:text-[var(--color-primary)] transition-colors" />
                    {/* Background glow on hover */}
                    <div className="absolute inset-0 bg-[var(--color-primary)]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--ink)] mb-3">{step.title}</h3>
                  <p className="text-[var(--ink-muted)] text-sm leading-relaxed max-w-[240px]">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--ink)] mb-6">Ready to secure your backend?</h2>
          <p className="text-lg text-[var(--ink-muted)] mb-10">Join thousands of developers using Endpoint IQ to ship secure APIs faster.</p>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-[var(--color-primary)] text-[#080810] px-10 py-5 rounded-2xl text-lg font-bold hover:opacity-90 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,229,160,0.2)] inline-flex items-center gap-3"
          >
            Create your free workspace <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="mt-8 flex items-center justify-center gap-6 text-[var(--ink-muted)] text-sm font-semibold">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" /> No credit card required</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" /> 14-day free trial</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--outline)] bg-[var(--surface)] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <img src="/Main_Logo.png" alt="Endpoint IQ" className="w-32 max-w-none object-contain block dark:hidden opacity-70" />
             <img src="/main_Logo_Dark.png" alt="Endpoint IQ" className="w-32 max-w-none object-contain hidden dark:block opacity-70" />
          </div>
          <div className="text-[var(--ink-muted)] text-sm">
            © {new Date().getFullYear()} Endpoint IQ. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-semibold text-[var(--ink-muted)]">
            <a href="#" className="hover:text-[var(--ink)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--ink)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--ink)] transition-colors">Twitter</a>
            <a href="#" className="hover:text-[var(--ink)] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
