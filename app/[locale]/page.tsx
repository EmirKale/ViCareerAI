"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Briefcase, ChevronRight, CheckCircle2, 
  Globe, ShieldCheck, ArrowRight, Cpu, Shield, Clock, X
} from "lucide-react";
import { motion, useScroll, useTransform, type Transition } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

// New Components
import { ATSScore } from "@/components/landing/ATSScore";
import LiveCVPreview from "@/components/landing/LiveCVPreview";
import { ProcessSteps } from "@/components/landing/ProcessSteps";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { TestimonialCard } from "@/components/landing/TestimonialCard";

const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FADE_TRANSITION: Transition = { duration: 0.8, ease: EASE_SMOOTH };

export default function Home() {
  const t = useTranslations("Index");
  const tPricing = useTranslations("Pricing");
  const tFooter = useTranslations("Footer");
  const targetRef = useRef(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: FADE_TRANSITION as Transition,
  } as const;

  const tATS = useTranslations("ATS");
  
  return (
    <div className="flex min-h-screen flex-col font-sans overflow-x-hidden selection:bg-blue-500/10">
      {/* Hero Section */}
      <section ref={targetRef} className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 gradient-hero-bg z-0" />
        <div className="absolute inset-0 grid-pattern z-0 opacity-40" />
        
        {/* Animated Background Blobs */}
        <div className="absolute top-1/4 -left-20 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse [animation-delay:2s] pointer-events-none" />

        <motion.main 
          style={{ opacity, scale }}
          className="container relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center p-8 text-center sm:p-12 h-full"
        >
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-10 inline-flex items-center gap-3 rounded-full border border-blue-200/50 bg-blue-50/50 px-5 py-2 text-xs font-bold text-blue-600 backdrop-blur-xl dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 shadow-xl shadow-blue-500/5 ring-1 ring-white/20"
          >
            <Sparkles className="h-4 w-4 animate-spin-slow" />
            <span className="tracking-wide uppercase">{t("badge")}</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: EASE_SMOOTH }}
            className="mb-8 max-w-5xl text-5xl font-black tracking-tighter text-foreground sm:text-7xl md:text-9xl leading-[0.9] lg:leading-[0.85]"
          >
            {t.rich("title", {
              span: (chunks) => <span className="gradient-brand-text block mt-2">{chunks}</span>
            })}
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-14 max-w-3xl text-xl text-muted-foreground/80 sm:text-2xl leading-relaxed font-medium"
          >
            {t("description")}
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-6 sm:flex-row w-full sm:w-auto items-center"
          >
            <Link href={isLoggedIn ? "/dashboard" : "/register"} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-16 md:h-20 rounded-[2rem] px-8 md:px-14 text-lg md:text-xl font-black gradient-brand text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1.5 transition-all group active:scale-95">
                {t("ctaPrimary")}
                <ChevronRight className="ml-3 h-7 w-7 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <div className="flex flex-col items-center sm:items-start gap-1 w-full sm:w-auto">
               <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest sm:pl-2">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  {t("noCreditCard")}
               </div>
               <Link href="#features" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 md:h-20 rounded-[2rem] px-8 md:px-14 text-lg md:text-xl glass-card border-zinc-200/50 hover:bg-zinc-100/50 dark:border-zinc-800/80 dark:hover:bg-zinc-800/50 font-bold transition-all hover:-translate-y-1">
                  {t("ctaSecondary")}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Content ends here */}
        </motion.main>
      </section>


      {/* 2. LIVE PREVIEW SECTION (The "A-HA" moment) */}
      <section className="py-24 relative">
         <div className="container mx-auto max-w-7xl px-6">
            <div className="text-center mb-20">
               <motion.h2 {...fadeInUp} className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                  {t("previewTitle")}
               </motion.h2>
               <motion.p {...fadeInUp} transition={{ delay: 0.1 }} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t("previewDesc")}
               </motion.p>
            </div>
            
            <LiveCVPreview />
         </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="features" className="py-32 bg-zinc-50/50 dark:bg-zinc-950/20 relative border-y border-zinc-100 dark:border-zinc-900">
         <div className="container mx-auto max-w-6xl px-6">
            <div className="max-w-3xl mb-24">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">
                {t.rich("howItWorksTitle", {
                  span: (chunks) => <span className="text-blue-600">{chunks}</span>
                })}
              </h2>
              <p className="text-2xl text-muted-foreground font-medium">
                {t("howItWorksDesc")}
              </p>
            </div>

            <ProcessSteps />
         </div>
      </section>

      {/* 4. ATS & AI DIFFERENTIATION */}
      <section className="py-32 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
         
         <div className="container mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-10">
                  <div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                       {t("atsTitle")}
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                       {t("atsDesc")}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                     {[
                       { icon: Cpu, title: tATS("kw_title"), desc: tATS("kw_desc") },
                       { icon: Clock, title: tATS("time_title"), desc: tATS("time_desc") },
                       { icon: Shield, title: tATS("shield_title"), desc: tATS("shield_desc") },
                       { icon: CheckCircle2, title: tATS("check_title"), desc: tATS("check_desc") }
                     ].map((item, i) => (
                       <motion.div 
                         key={i}
                         initial={{ opacity: 0, x: -20 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: i * 0.1 }}
                         className="flex gap-4"
                       >
                          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 shrink-0">
                             <item.icon className="h-5 w-5" />
                          </div>
                          <div>
                             <h4 className="font-bold text-base">{item.title}</h4>
                             <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                       </motion.div>
                     ))}
                  </div>
               </div>

               <ATSScore />
            </div>
         </div>
      </section>

      {/* 5. COMPARISON SECTION */}
      <section className="py-32 bg-zinc-50/50 dark:bg-zinc-950/20">
         <div className="container mx-auto max-w-6xl px-6 text-center">
            <div className="mb-20">
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">{t("comparisonTitle")}</h2>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                  {t("comparisonDesc")}
               </p>
            </div>
            
            <ComparisonTable />
         </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-32 relative">
         <div className="container mx-auto max-w-7xl px-6">
            <div className="text-center">
               <motion.div 
                 initial={{ y: 30, opacity: 0 }}
                 whileInView={{ y: 0, opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="max-w-2xl mx-auto"
               >
                 <div className="inline-flex items-center gap-3 rounded-full border border-blue-200/50 bg-blue-50/50 px-6 py-3 text-sm font-bold text-blue-600 backdrop-blur-xl dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 shadow-xl shadow-blue-500/5 mb-6">
                   <Sparkles className="h-5 w-5" />
                   <span className="tracking-wide">{t("testimonialsTitle")}</span>
                 </div>
                 <p className="text-2xl md:text-4xl font-bold text-muted-foreground">
                   {t("testimonialsDesc")}
                 </p>
               </motion.div>
            </div>
            
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 overflow-x-auto pb-4 snap-x snap-mandatory">
              <div className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center">
                <TestimonialCard 
                  name="Ayşe Kaya" 
                  role="UX Designer, İstanbul" 
                  quote="ViCareerAI sayesinde CV'mi 30 dakikada hazırladım. ATS skoru 92 oldu ve ilk başvurumda mülakata çağrıldım!" 
                  avatar="https://api.dicebear.com/7.x/initials/svg?seed=AK&backgroundColor=2563EB" 
                  delay={0.1} 
                />
              </div>
              <div className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center">
                <TestimonialCard 
                  name="Mehmet Demir" 
                  role="Software Developer, Ankara" 
                  quote="Motivasyon mektuplarını her iş ilanına özel oluşturmak çok zaman alıyordu. Artık 2 dakikada profesyonel mektup hazırlıyorum." 
                  avatar="https://api.dicebear.com/7.x/initials/svg?seed=MD&backgroundColor=2563EB" 
                  delay={0.2} 
                />
              </div>
              <div className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center">
                <TestimonialCard 
                  name="Zeynep Arslan" 
                  role="Marketing Manager, İzmir" 
                  quote="Kanban takip sistemi sayesinde tüm başvurularımı organize ettim. 3 ayda 2 iş teklifi aldım!" 
                  avatar="https://api.dicebear.com/7.x/initials/svg?seed=ZA&backgroundColor=2563EB" 
                  delay={0.3} 
                />
              </div>
              <div className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center">
                <TestimonialCard 
                  name="Can Yıldız" 
                  role="Data Analyst, İstanbul" 
                  quote="Skill gap analizi hangi teknolojileri öğrenmem gerektiğini net gösterdi. Kariyerimde büyük fark yarattı." 
                  avatar="https://api.dicebear.com/7.x/initials/svg?seed=CY&backgroundColor=2563EB" 
                  delay={0.4} 
                />
              </div>
            </div>
         </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section id="pricing" className="py-32 bg-zinc-900 dark:bg-zinc-950/80 text-white relative overflow-hidden">
        {/* Background decorative ring */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] border border-white/5 rounded-full -translate-y-1/2 pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 italic">{t("pricingTitle")}</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium">
              {t("pricingDesc")}
            </p>
          </div>

          <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div {...fadeInUp} className="relative p-8 md:p-12 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-xl text-left flex flex-col items-start group hover:bg-white/10 transition-all duration-500">
              <div className="mb-8 space-y-2">
                <h3 className="text-3xl font-black uppercase tracking-tight">{tPricing("essential")}</h3>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">{tPricing("kickstart")}</p>
              </div>
              <div className="mb-10 flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter">{t("freePrice")}</span>
                <span className="text-lg text-zinc-500 font-bold">{t("perMonth")}</span>
              </div>
              <ul className="space-y-5 mb-14 flex-1 w-full">
                {[
                  { text: tPricing("f1"), included: true },
                  { text: tPricing("f2"), included: true },
                  { text: tPricing("f3"), included: true },
                  { text: tPricing("f4"), included: false }
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-4 font-medium pb-4 border-b border-white/5 last:border-0 ${item.included ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${item.included ? 'bg-white/10' : 'bg-white/5'}`}>
                      {item.included ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                      )}
                    </div>
                    <span className={item.included ? "" : "line-through"}>{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="w-full">
                <Button variant="outline" className="w-full h-16 rounded-[1.5rem] text-xl font-black bg-transparent text-white border-2 border-white/20 hover:bg-white hover:text-black transition-all">
                  {tPricing("getStarted")}
                </Button>
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              {...fadeInUp} 
              className="relative p-8 md:p-12 rounded-[3rem] bg-linear-to-br from-blue-600 to-indigo-700 text-white text-left flex flex-col items-start overflow-hidden group shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform duration-500"
            >
              <div className="absolute top-0 right-0 p-8 md:p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <Sparkles className="h-60 w-60 text-white" />
              </div>
              <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-white/20">{tPricing("mostPopular")}</div>
              
              <div className="mb-8 space-y-2">
                <h3 className="text-3xl font-black uppercase tracking-tight">{tPricing("pro")}</h3>
                <p className="text-blue-200 font-bold uppercase tracking-widest text-[10px]">{tPricing("proSubtitle")}</p>
              </div>
              <div className="mb-10 flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter">{t("proPrice")}</span>
                <span className="text-lg text-blue-200 font-bold">{t("perMonth")}</span>
              </div>
              <ul className="space-y-5 mb-14 flex-1 w-full">
                {[
                  tPricing("f_p_1"),
                  tPricing("f_p_2"),
                  tPricing("f_p_3"),
                  tPricing("f_p_4"),
                  tPricing("f_p_5")
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white font-semibold pb-4 border-b border-white/10 last:border-0 border-dashed">
                    <CheckCircle2 className="h-6 w-6 text-white shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href={isLoggedIn ? "/pricing" : "/register"} className="w-full">
                <Button className="w-full h-16 rounded-[1.5rem] text-xl font-black bg-white text-blue-700 hover:bg-blue-50 border-0 shadow-2xl">
                   {tPricing("upgrade")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="py-32 bg-white dark:bg-zinc-950">
        <div className="container mx-auto max-w-4xl px-6">
           <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic">{t("faqTitle")}</h2>
              <div className="h-2 w-24 bg-blue-500 mx-auto rounded-full" />
           </div>
          <div className="grid gap-4">
            {[
              {
                q: t("faq1q"),
                a: t("faq1a"),
                video: t("faq1video")
              },
              {
                q: t("faq2q"),
                a: t("faq2a"),
                video: t("faq2video")
              },
              {
                q: t("faq3q"),
                a: t("faq3a"),
                video: t("faq3video")
              }
            ].map((faq, i) => (
              <motion.div key={i} {...fadeInUp} className="p-6 md:p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 hover:border-blue-500/30 transition-all group">
                <h4 className="text-xl font-black mb-4 flex items-center gap-4">
                   <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles className="h-4 w-4" />
                   </div>
                   {faq.q}
                </h4>
                <div className="pl-12">
                  <p className="text-muted-foreground leading-relaxed font-medium">{faq.a}</p>
                  
                  {faq.video && faq.video !== "" && (
                    <div className="mt-6 relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg group-hover:border-blue-500/30 transition-colors bg-zinc-900/5 dark:bg-zinc-900 aspect-video">
                      <video 
                        src={faq.video} 
                        controls 
                        className="absolute inset-0 w-full h-full object-cover"
                        preload="metadata"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA SECTION */}
      <section className="py-32 relative px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative z-10 p-10 md:p-32 rounded-[3rem] md:rounded-[4rem] bg-zinc-900 text-white text-center shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden"
          >
            {/* Background design elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none grid-pattern" />
            <div className="absolute top-0 left-0 h-64 w-64 bg-blue-600 blur-[100px] opacity-20 -translate-x-1/2 -translate-y-1/2" />
            
            <motion.h2 {...fadeInUp} className="text-4xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9]">
               {t("ctaFinal")}
            </motion.h2>
            <motion.p {...fadeInUp} transition={{ delay: 0.1 }} className="text-xl md:text-3xl text-zinc-400 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
              {t("ctaFinalDesc")}
            </motion.p>
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Link href="/register">
                <Button size="lg" className="h-20 px-16 rounded-[2rem] text-2xl font-black bg-white text-black hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl">
                  {t("ctaFinalButton")}
                  <ArrowRight className="ml-3 h-8 w-8" />
                </Button>
              </Link>
            </motion.div>
            
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
               <span className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> {t("secureCheckout")}</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> {t("privacy")}</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> {t("aiPowered")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-900 py-20 px-6 bg-white dark:bg-zinc-950">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
             <div className="col-span-2 space-y-8">
                <Link href="/" className="flex items-center gap-2 font-black text-3xl">
                  <div className="h-10 w-10 rounded-xl gradient-brand flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="gradient-brand-text">CareerAI</span>
                </Link>
                <p className="text-muted-foreground max-w-xs font-medium leading-relaxed">
                   {tFooter("desc")}
                </p>
             </div>
             
             <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">{tFooter("platform")}</h4>
                <nav className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
                   <Link href="#features" className="hover:text-blue-600 transition-colors">{tFooter("features")}</Link>
                   <Link href="#pricing" className="hover:text-blue-600 transition-colors">{tFooter("pricing")}</Link>
                   <Link href="/templates" className="hover:text-blue-600 transition-colors">{tFooter("templates")}</Link>
                </nav>
             </div>

             <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">{tFooter("legal")}</h4>
                <nav className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
                   <Link href="/privacy" className="hover:text-blue-600 transition-colors">{tFooter("privacy")}</Link>
                   <Link href="/terms" className="hover:text-blue-600 transition-colors">{tFooter("terms")}</Link>
                </nav>
             </div>
          </div>
          
          <div className="pt-10 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-sm font-bold text-zinc-400 tracking-tight">
               {tFooter("rights", { year: new Date().getFullYear() })}
             </p>
             <div className="flex items-center gap-6 text-zinc-400">
                <Globe className="h-5 w-5 hover:text-blue-600 cursor-pointer transition-colors" />
                <Briefcase className="h-5 w-5 hover:text-blue-600 cursor-pointer transition-colors" />
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
