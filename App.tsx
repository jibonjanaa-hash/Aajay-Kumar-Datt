
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Menu, X, MessageCircle, 
  Sparkles, CheckCircle, Star, ChevronRight, 
  Send, Loader2, Wand2, Calculator, Globe,
  Facebook, Instagram, Youtube, GraduationCap, Award, Flame, Zap, Heart, MapPin
} from 'lucide-react';
import { TRANSLATIONS, IMAGES, SERVICES, PRODUCTS, PHONE_NUMBER, SOCIAL_LINKS, WA_GROUP_LINK } from './constants';
import { Language, ChatMessage } from './types';
import { oracleService } from './services/gemini';
import { GlowCard } from './components/ui/spotlight-card';

const NUMEROLOGY_LIMIT = 5;

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en'); 
  const [darkMode, setDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOracleOpen, setIsOracleOpen] = useState(false);
  
  const [oracleMessages, setOracleMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isOracleLoading, setIsOracleLoading] = useState(false);
  
  const [showNumCalc, setShowNumCalc] = useState(false);
  const [calcName, setCalcName] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [isCalcLoading, setIsCalcLoading] = useState(false);
  
  // Numerology Usage Tracking
  const [calcUsageCount, setCalcUsageCount] = useState<number>(() => {
    const saved = localStorage.getItem('numerology_usage_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const t = TRANSLATIONS[lang];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('numerology_usage_count', calcUsageCount.toString());
  }, [calcUsageCount]);

  // Body scroll lock logic
  useEffect(() => {
    if (isMenuOpen || isOracleOpen || showNumCalc) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isMenuOpen, isOracleOpen, showNumCalc]);

  // Handle intersection for animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => revealElements.forEach(el => observer.unobserve(el));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll for oracle chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [oracleMessages, isOracleLoading]);

  const openWhatsApp = (msg: string) => {
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'bn' : 'en');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setIsMenuOpen(false);
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavClick = (id: string, type: string) => {
    if (type === 'scroll') {
      scrollToSection(id);
    } else if (id === 'oracle') {
      setIsMenuOpen(false);
      setIsOracleOpen(true);
    }
  };

  const navItems = [
    { label: t.nav[0], id: 'home', type: 'scroll' },
    { label: t.nav[1], id: 'about', type: 'scroll' },
    { label: t.nav[2], id: 'services', type: 'scroll' },
    { label: t.nav[3], id: 'mastery', type: 'scroll' },
    { label: t.nav[4], id: 'oracle', type: 'action' },
    { label: t.nav[5], id: 'shop', type: 'scroll' },
  ];

  const handleOracleSend = async () => {
    if (!inputMessage.trim() || isOracleLoading) return;
    
    const userMsg = inputMessage;
    setInputMessage('');
    
    const newHistory: ChatMessage[] = [...oracleMessages, { role: 'user', text: userMsg }];
    setOracleMessages(newHistory);
    setIsOracleLoading(true);

    let currentResponse = '';
    setOracleMessages(prev => [...prev, { role: 'model', text: '' }]);

    try {
      const stream = oracleService.getOracleGuidanceStream(userMsg, oracleMessages);
      for await (const chunk of stream) {
        currentResponse += chunk;
        setOracleMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'model', text: currentResponse };
          return updated;
        });
        setIsOracleLoading(false);
      }
    } catch (err) {
      setOracleMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'model', text: "The cosmic energy is currently unstable. Please try again soon." };
        return updated;
      });
    } finally {
      setIsOracleLoading(false);
    }
  };

  const handleNumCalc = async () => {
    if (!calcName.trim() || isCalcLoading || calcUsageCount >= NUMEROLOGY_LIMIT) return;
    setIsCalcLoading(true);
    try {
      const result = await oracleService.calculateNumerology(calcName);
      setCalcResult(result || '');
      setCalcUsageCount(prev => prev + 1);
    } catch (err) {
      setCalcResult("The numbers are shifting rapidly. I cannot see clearly right now.");
    } finally {
      setIsCalcLoading(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-700 overflow-x-hidden ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-amber-50 text-slate-900'}`}>
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? (darkMode ? 'bg-slate-950/95' : 'bg-white/95') + ' backdrop-blur-xl shadow-2xl py-2 md:py-3' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <button onClick={() => scrollToSection('home')} className="flex items-center gap-2 md:gap-3 cursor-pointer outline-none text-left">
            <div className="relative">
              <Sun className={`w-6 h-6 md:w-9 md:h-9 animate-spin-slow ${darkMode ? 'text-amber-400' : 'text-orange-500'}`} />
              <Moon className={`w-2.5 h-2.5 md:w-4 md:h-4 absolute top-1.5 left-1.5 md:top-2 md:left-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <span className={`text-base md:text-2xl font-serif font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${darkMode ? 'from-amber-200 to-amber-500' : 'from-indigo-600 to-purple-600'}`}>
              AAJAY KUMAR DATT
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex gap-6 font-medium text-xs md:text-sm tracking-[0.2em] uppercase">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => handleNavClick(item.id, item.type)} className="hover:text-amber-500 transition-colors uppercase cursor-pointer outline-none">
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3 border-l pl-8 border-slate-700/30">
              <button onClick={toggleLanguage} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[10px] font-bold tracking-tighter hover:bg-slate-700 transition-colors text-white uppercase">
                <Globe size={14}/>
                {t.langLabel}
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-white/10 rounded-full transition-all outline-none">
                {darkMode ? <Sun size={20} className="text-amber-400"/> : <Moon size={20} className="text-indigo-600"/>}
              </button>
            </div>

            <button onClick={() => openWhatsApp("Namaste! I want to join the Universal Touch Healing family.")} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-2.5 px-8 rounded-full shadow-[0_5px_20px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-[0.2em]">
              {t.bookBtn}
            </button>
          </div>

          {/* Mobile Menu Toggles */}
          <div className="flex lg:hidden items-center gap-2">
             <button onClick={toggleLanguage} className="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-white uppercase tracking-tighter">
                {t.langLabel}
             </button>
             <button className={`${darkMode ? 'text-amber-400' : 'text-slate-900'} p-2 outline-none`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
               {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
             </button>
          </div>
        </div>

        {/* Mobile Menu Overlay - Fixed Background Issues */}
        {isMenuOpen && (
          <div className={`lg:hidden fixed inset-0 h-screen w-full flex flex-col p-6 animate-in fade-in zoom-in duration-300 shadow-2xl ${darkMode ? 'bg-slate-950' : 'bg-white'} z-[100]`}>
            <div className="flex justify-between items-center mb-10">
               <div className="flex items-center gap-2">
                 <Sun size={24} className="text-amber-500 animate-spin-slow" />
                 <span className="text-lg font-serif font-bold text-amber-500 tracking-widest uppercase">Navigation</span>
               </div>
               <button onClick={() => setIsMenuOpen(false)} className={`p-3 rounded-full outline-none ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}><X size={24}/></button>
            </div>
            <div className="flex flex-col gap-1 text-center overflow-y-auto pb-10">
              {navItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => handleNavClick(item.id, item.type)} 
                  className={`text-2xl font-serif font-bold hover:text-amber-500 transition-all py-6 border-b uppercase tracking-widest outline-none ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col gap-4 mt-10">
                 <button onClick={() => { setDarkMode(!darkMode); setIsMenuOpen(false); }} className={`p-5 rounded-2xl flex items-center justify-center gap-3 outline-none ${darkMode ? 'bg-slate-900 text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
                   {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
                   <span className="text-sm uppercase font-black tracking-widest">Toggle Theme</span>
                 </button>
                 <button onClick={() => { openWhatsApp("Namaste! I want to join the Universal Touch Family."); setIsMenuOpen(false); }} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-black py-6 text-sm uppercase tracking-[0.2em] shadow-xl shadow-amber-500/30 outline-none">
                   {t.bookBtn}
                 </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <img src={IMAGES.HERO_BG} alt="Divine Cosmos" className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow" />
          <div className={`absolute inset-0 bg-gradient-to-b ${darkMode ? 'from-slate-950/60 via-slate-950/80 to-slate-950' : 'from-amber-100/40 via-white/70 to-amber-50'}`}></div>
        </div>

        <div className="relative z-10 container mx-auto text-center px-4">
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 md:mb-8 backdrop-blur-md border ${darkMode ? 'bg-slate-900/40 border-amber-500/30 text-amber-200' : 'bg-white/60 border-indigo-200 text-indigo-900'} animate-float shadow-xl`}>
            <Flame size={14} className="text-amber-400" />
            <span className="font-medium tracking-[0.1em] md:tracking-[0.3em] text-[7px] md:text-xs uppercase whitespace-nowrap">ICRT (USA) AFFILIATE MEMBER</span>
          </div>
          
          <h1 className="text-3xl md:text-7xl lg:text-8xl font-serif font-bold mb-4 md:mb-6 leading-tight md:leading-tight drop-shadow-2xl reveal">
            {t.heroTitle}
          </h1>
          
          <p className="text-xs md:text-xl lg:text-2xl max-w-4xl mx-auto mb-8 md:mb-14 leading-relaxed font-light opacity-90 reveal px-2">
            {t.heroSub}
            <span className="text-amber-500 block mt-4 md:mt-6 font-serif italic text-base md:text-2xl animate-pulse">
              {t.heroQuote}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center reveal">
            <button onClick={() => window.open(WA_GROUP_LINK, '_blank')} className="w-full sm:w-auto px-8 md:px-14 py-4 md:py-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold text-white text-xs md:text-lg shadow-[0_15px_40px_rgba(34,197,94,0.4)] hover:shadow-green-500/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
              <Heart className="w-5 h-5 md:w-6 md:h-6" />
              Free Meditation Class
            </button>
            <button onClick={() => setIsOracleOpen(true)} className={`w-full sm:w-auto px-8 md:px-14 py-4 md:py-6 backdrop-blur-md border rounded-full font-bold text-xs md:text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 ${darkMode ? 'border-slate-700 text-slate-100' : 'border-slate-300 text-slate-800'}`}>
              <Wand2 size={20}/>
              Consult Oracle
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-32 relative overflow-hidden px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-24">
            <div className="w-full lg:w-1/2 flex justify-center relative reveal">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 to-indigo-600/30 rounded-full blur-[60px] md:blur-[120px] animate-pulse"></div>
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] rounded-full p-2 md:p-3.5 bg-gradient-to-br from-amber-500 via-amber-300 to-amber-600 animate-aura-glow shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden border-4 md:border-8 border-slate-900 shadow-inner bg-slate-900 flex items-center justify-center">
                  <img 
                    src={IMAGES.PORTRAIT} 
                    alt="Aajay Kumar Datt" 
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-[2000ms]" 
                    loading="eager"
                  />
                </div>
              </div>
              
              <div className={`absolute -bottom-4 right-0 md:bottom-8 md:-right-4 p-4 md:p-8 rounded-2xl md:rounded-[2rem] shadow-2xl flex items-center gap-3 md:gap-4 animate-float ${darkMode ? 'bg-slate-950/90 backdrop-blur-xl border border-amber-500/30' : 'bg-white border border-slate-200'}`}>
                <div className="bg-amber-500 rounded-full p-2 md:p-3 text-white shadow-lg shadow-amber-500/40">
                  <CheckCircle className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <div>
                   <p className="font-serif text-sm md:text-xl font-bold whitespace-nowrap">Aajay Kumar Datt</p>
                   <p className="text-[10px] md:text-xs opacity-70 font-semibold text-amber-500 uppercase tracking-widest">Reiki Grand Master,</p>
                   <p className="text-[10px] md:text-xs opacity-60">Affiliated Member of ICRT, USA</p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 text-center lg:text-left reveal">
              <div className="mb-6 md:mb-10 inline-block p-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600">
                <div className="px-6 py-2 rounded-full bg-slate-950 text-amber-500 text-[10px] md:text-sm font-bold tracking-widest uppercase">
                  Authorized Teacher
                </div>
              </div>
              <h2 className="text-2xl md:text-6xl font-serif font-bold mb-4 md:mb-8 leading-tight">
                {t.aboutTitle}
              </h2>
              <div className="mb-8 md:mb-12">
                 <p className="text-xl md:text-3xl font-serif font-bold text-amber-500 mb-2">Aajay Kumar Datt</p>
                 <p className="text-xs md:text-lg opacity-80 uppercase tracking-widest font-semibold mb-1">Reiki Grand Master,</p>
                 <p className="text-[10px] md:text-base opacity-60 uppercase tracking-widest">Affiliated Member of ICRT, USA</p>
              </div>
              <p className="text-sm md:text-xl leading-relaxed opacity-80 mb-6 md:mb-12 max-w-2xl mx-auto lg:mx-0">
                {t.aboutDesc}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 md:mb-14">
                 <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" 
                    className="relative group w-full sm:w-auto px-10 py-5 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white rounded-2xl font-bold 
                               shadow-[0_15px_35px_rgba(220,38,38,0.4)] 
                               hover:shadow-[0_25px_60px_rgba(220,38,38,0.7)] 
                               hover:scale-110 hover:-rotate-2 hover:-translate-y-2
                               transition-all duration-500 ease-out flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] md:text-xs active:scale-95 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                    <div className="bg-white text-red-600 p-2 rounded-lg group-hover:scale-125 group-hover:rotate-[360deg] transition-all duration-700 shadow-lg">
                      <Youtube size={18} fill="currentColor" />
                    </div>
                    <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-black">{t.ytLabel}</span>
                    <div className="absolute -inset-2 rounded-3xl border-2 border-red-400/20 opacity-0 group-hover:opacity-100 animate-pulse-slow"></div>
                 </a>
                 <button onClick={() => setShowNumCalc(true)} className="w-full sm:w-auto px-8 py-5 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl font-bold hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] md:text-xs outline-none">
                    <Calculator size={18}/> Calculate Vibration
                 </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mastery Section */}
      <section id="mastery" className={`py-16 md:py-32 relative overflow-hidden px-4 ${darkMode ? 'bg-slate-900/40' : 'bg-amber-100/30'}`}>
         <div className="container mx-auto">
           <div className="flex flex-col lg:flex-row-reverse items-center gap-10 md:gap-24">
              <div className="w-full lg:w-1/2 relative reveal">
                <div className="relative flex flex-wrap justify-center gap-4 md:gap-8 items-center py-6 md:py-10">
                  <GlowCard glowColor="orange" customSize borderRadius="full" className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden animate-float animate-aura-glow p-0 flex items-center justify-center aspect-square">
                    <img src={IMAGES.MASTERY_1} alt="Mastery 1" className="w-full h-full object-cover" />
                  </GlowCard>
                  <GlowCard glowColor="orange" customSize borderRadius="full" className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden animate-float animate-aura-glow [animation-delay:2s] p-0 flex items-center justify-center aspect-square">
                    <img src={IMAGES.MASTERY_2} alt="Mastery 2" className="w-full h-full object-cover" />
                  </GlowCard>
                  <GlowCard glowColor="orange" customSize borderRadius="full" className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden animate-float animate-aura-glow [animation-delay:4s] p-0 flex items-center justify-center aspect-square">
                    <img src={IMAGES.MASTERY_3} alt="Mastery 3" className="w-full h-full object-cover" />
                  </GlowCard>
                </div>
              </div>

              <div className="w-full lg:w-1/2 reveal text-center lg:text-left">
                <div className="inline-flex items-center gap-3 text-amber-500 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs mb-4 md:mb-6">
                  <GraduationCap className="w-[18px] h-[18px] md:w-5 md:h-5" />
                  <span>Advanced Master Teacher</span>
                </div>
                <h2 className="text-2xl md:text-6xl font-serif font-bold mb-6 md:mb-8 leading-tight">{t.masteryTitle}</h2>
                <p className="text-xs md:text-xl opacity-70 leading-relaxed mb-8 md:mb-10 max-w-2xl mx-auto lg:mx-0">{t.masteryDesc}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 md:mb-12 text-left">
                   {[
                     "Holy Fire® III Master Teacher",
                     "Lama Fera Master Teacher",
                     "Karuna Reiki® Master",
                     "Money Reiki Grand Master"
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center gap-3">
                       <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                         <CheckCircle size={12}/>
                       </div>
                       <span className="font-medium text-sm md:text-lg">{item}</span>
                     </div>
                   ))}
                </div>

                <button onClick={() => openWhatsApp("Namaste! I want to join the Universal Touch Healing family.")} className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-amber-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-xs md:text-sm uppercase tracking-widest outline-none">
                  {t.learnMore}
                </button>
              </div>
           </div>
         </div>
      </section>

      {/* Numerology Modal */}
      {showNumCalc && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl">
          <div className={`w-full max-w-2xl rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border ${darkMode ? 'bg-slate-900 border-amber-500/20' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="p-5 md:p-8 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
               <h3 className="text-lg md:text-2xl font-serif font-bold flex items-center gap-2 md:gap-3">
                 <Calculator className="text-amber-500 w-5 h-5 md:w-6 md:h-6" />
                 Divine Calculator
               </h3>
               <button onClick={() => setShowNumCalc(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors outline-none"><X size={20}/></button>
            </div>
            <div className="p-6 md:p-10">
              {calcUsageCount >= NUMEROLOGY_LIMIT ? (
                <div className="text-center py-10 reveal">
                   <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageCircle size={32} className="text-amber-500" />
                   </div>
                   <h4 className="text-xl font-serif font-bold mb-4">Calculation Limit Reached</h4>
                   <p className="opacity-70 mb-8 leading-relaxed">You have explored your divine vibrations 5 times. For deep personalized analysis and future guidance, please contact Aajay Kumar Datt directly.</p>
                   <button onClick={() => openWhatsApp("Namaste Aajay! I reached my calculation limit. I want deeper insights into my name vibrations.")} className="w-full bg-[#25D366] text-white p-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                      <MessageCircle size={20} fill="white"/> WhatsApp for Details
                   </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 md:mb-8 text-center md:text-left">
                    <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-3 opacity-50">Vibration Analysis ({calcUsageCount}/{NUMEROLOGY_LIMIT} used)</label>
                    <div className="flex flex-col gap-3">
                      <input 
                        value={calcName} 
                        onChange={e => setCalcName(e.target.value)} 
                        placeholder="Enter full name..." 
                        className={`w-full p-4 md:p-5 rounded-2xl outline-none border transition-all text-sm md:text-base ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} 
                      />
                      <button onClick={handleNumCalc} disabled={isCalcLoading} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 md:p-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all text-xs md:text-base outline-none">
                        {isCalcLoading ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
                        Analyze Signature
                      </button>
                    </div>
                  </div>
                  <div className={`custom-scrollbar overflow-y-auto max-h-[250px] md:max-h-[350px] p-5 md:p-8 rounded-2xl md:rounded-3xl border transition-all duration-700 ${darkMode ? 'bg-slate-950/80 border-white/5' : 'bg-slate-50 border-slate-200'} ${calcResult ? 'opacity-100 shadow-inner' : 'opacity-40'}`}>
                    {calcResult ? (
                      <div className="prose prose-invert prose-amber prose-sm md:prose-base max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-lg font-medium opacity-90">{calcResult}</p>
                      </div>
                    ) : (
                      <p className="text-center italic mt-4 md:mt-10 tracking-widest uppercase text-[10px] md:text-xs">Awaiting spiritual signature...</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shop Section */}
      <section id="shop" className="py-16 md:py-32 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-6xl font-serif font-bold text-center mb-12 md:mb-24 reveal">{t.productsTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-14">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="reveal group flex flex-col items-center max-w-sm mx-auto w-full">
                <div className="relative w-full aspect-square rounded-3xl md:rounded-[3.5rem] overflow-hidden shadow-2xl mb-6 md:mb-10 border-2 md:border-4 border-white/5 p-1 bg-slate-900/50 hover:shadow-amber-500/40 transition-all cursor-pointer">
                  <div className="w-full h-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2000ms]" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-10">
                    <button onClick={() => openWhatsApp(`Namaste Aajay! I am interested in ${p.title}. Please share details.`)} className="w-full py-4 md:py-5 bg-white text-slate-950 font-bold rounded-xl md:rounded-2xl shadow-xl hover:bg-amber-500 hover:text-white transition-all uppercase tracking-widest text-[8px] md:text-[11px] outline-none">
                      Enroll Now
                    </button>
                  </div>
                </div>
                <div className="text-center px-2">
                  <h3 className="text-xl md:text-3xl font-serif font-bold mb-3 md:mb-4 tracking-tight text-amber-500">{p.title}</h3>
                  <p className="text-xs md:text-base opacity-60 leading-relaxed font-light italic">
                    {p.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 md:py-24 border-t px-4 ${darkMode ? 'bg-slate-950 border-white/5 text-slate-400' : 'bg-indigo-950 text-indigo-200 border-indigo-900'}`}>
        <div className="container mx-auto text-center">
          <div className="mb-10 md:mb-12">
            <h3 className="text-2xl md:text-5xl font-serif text-amber-500 font-bold mb-4 md:mb-6 tracking-tighter uppercase">AAJAY KUMAR DATT</h3>
            <p className="max-w-md mx-auto opacity-60 italic text-[10px] md:text-base leading-relaxed px-2">{t.footerDesc}</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10 md:mb-12">
             <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="p-3 md:p-4 rounded-full border border-slate-700 hover:text-blue-500 hover:border-blue-500 hover:scale-110 transition-all bg-slate-900/50 shadow-inner">
                <Facebook className="w-5 h-5 md:w-6 md:h-6" />
             </a>
             <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="p-3 md:p-4 rounded-full border border-slate-700 hover:text-pink-500 hover:border-pink-500 hover:scale-110 transition-all bg-slate-900/50 shadow-inner">
                <Instagram className="w-5 h-5 md:w-6 md:h-6" />
             </a>
             <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="p-3 md:p-4 rounded-full border border-slate-700 hover:text-red-500 hover:border-red-500 hover:scale-110 transition-all bg-slate-900/50 shadow-inner">
                <Youtube className="w-5 h-5 md:w-6 md:h-6" />
             </a>
             <a href={SOCIAL_LINKS.googleMaps} target="_blank" rel="noopener noreferrer" className="p-3 md:p-4 rounded-full border border-slate-700 hover:text-green-500 hover:border-green-500 hover:scale-110 transition-all bg-slate-900/50 shadow-inner">
                <MapPin className="w-5 h-5 md:w-6 md:h-6" />
             </a>
             <a href={SOCIAL_LINKS.website} target="_blank" className="p-3 md:p-4 rounded-full border border-slate-700 hover:text-amber-500 hover:border-amber-500 hover:scale-110 transition-all bg-slate-900/50 shadow-inner">
                <Globe className="w-5 h-5 md:w-6 md:h-6" />
             </a>
          </div>
          
          <div className="text-[7px] md:text-xs opacity-40 font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase px-4">
            &copy; {new Date().getFullYear()} REIKI KNOWLEDGE AKD &bull; AAJAY KUMAR DATT
          </div>
        </div>
      </footer>

      {/* Spiritual Oracle Drawer */}
      {isOracleOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] z-[200] bg-slate-950/98 backdrop-blur-3xl border-l border-amber-500/20 shadow-[-30px_0_80px_rgba(0,0,0,0.9)] flex flex-col animate-in slide-in-from-right duration-500">
           <div className="p-4 md:p-8 border-b border-amber-500/20 bg-slate-900/40 flex justify-between items-center">
             <div className="flex items-center gap-3 md:gap-4">
               <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 md:p-3 rounded-xl md:rounded-2xl text-white shadow-xl shadow-amber-500/20">
                 <Wand2 className="w-6 h-6 md:w-7 md:h-7" />
               </div>
               <div>
                 <h4 className="font-serif font-bold text-lg md:text-2xl text-amber-500">{t.nav[4]}</h4>
                 <p className="text-[7px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-40 font-bold">Divine Wisdom Channel</p>
               </div>
             </div>
             <button onClick={() => setIsOracleOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 outline-none">
               <X className="w-5 h-5 md:w-6 md:h-6" />
             </button>
           </div>
           <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 md:p-10 space-y-6 md:y-8 custom-scrollbar">
             {oracleMessages.length === 0 && (
               <div className="text-center py-16 md:py-32">
                 <div className="w-20 h-20 md:w-28 md:h-28 bg-amber-500/5 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-10 border border-amber-500/10 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
                    <Sparkles className="text-amber-500 animate-aura-glow w-8 h-8 md:w-12 md:h-12" />
                 </div>
                 <p className="font-serif italic text-xl md:text-2xl opacity-70 px-4 leading-relaxed">"Welcome to the Universal Touch family. What clarity do you seek through the sacred vibrations today?"</p>
               </div>
             )}
             {oracleMessages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[90%] md:max-w-[85%] p-4 md:p-7 rounded-2xl md:rounded-[2rem] shadow-2xl ${m.role === 'user' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-br-none' : 'glass-card rounded-bl-none'}`}>
                    <p className="leading-relaxed whitespace-pre-wrap text-xs md:text-base">{m.text || (i === oracleMessages.length - 1 && isOracleLoading ? '...' : '')}</p>
                 </div>
               </div>
             ))}
             {isOracleLoading && !oracleMessages[oracleMessages.length - 1]?.text && (
               <div className="flex justify-start">
                 <div className="glass-card p-4 md:p-7 rounded-2xl md:rounded-[2rem] rounded-bl-none flex items-center gap-4 md:gap-5">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <span className="italic text-[7px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-amber-500">Channeling...</span>
                 </div>
               </div>
             )}
           </div>
           <div className="p-4 md:p-10 border-t border-amber-500/20 bg-slate-900/60">
             <div className="relative flex items-center">
               <input 
                 value={inputMessage}
                 onChange={e => setInputMessage(e.target.value)}
                 onKeyPress={e => e.key === 'Enter' && handleOracleSend()}
                 placeholder="Message the stars..." 
                 className="w-full bg-slate-950/80 border border-slate-800 p-4 md:p-6 pr-14 md:pr-20 rounded-2xl md:rounded-[1.8rem] outline-none focus:border-amber-500/50 transition-all text-xs md:text-base text-white"
               />
               <button onClick={handleOracleSend} disabled={isOracleLoading} className="absolute right-2 md:right-4 p-3 md:p-5 bg-amber-500 text-white rounded-xl md:rounded-2xl hover:bg-amber-600 active:scale-90 transition-all disabled:opacity-40 outline-none">
                 <Send className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" />
               </button>
             </div>
           </div>
        </div>
      )}

      {/* Floating WhatsApp Action */}
      <div className="pb-16 md:pb-0">
        <button onClick={() => openWhatsApp("Namaste! I want to join the Universal Touch Healing family.")} className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[150] bg-[#25D366] text-white p-4 md:p-6 rounded-full shadow-[0_20px_50px_rgba(37,211,102,0.6)] hover:scale-110 hover:-rotate-12 active:scale-95 transition-all group overflow-hidden outline-none">
           <MessageCircle className="w-7 h-7 md:w-10 md:h-10" fill="white"/>
        </button>
      </div>

    </div>
  );
};

export default App;
