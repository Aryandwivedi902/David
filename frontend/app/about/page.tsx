"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Award, ShieldCheck, HeartHandshake, Compass } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { value: "1994", label: "Established" },
    { value: "5", label: "Global Awards" },
    { value: "120", label: "Luxury Suites" },
    { value: "100%", label: "Guest Satisfaction" },
  ];

  const pillars = [
    {
      icon: <Award className="w-8 h-8 text-accent" />,
      title: "World-Class Excellence",
      description: "Recognized globally for setting the benchmark in ultra-luxury service, custom itineraries, and detailed hospitality.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-accent" />,
      title: "Private Sanctuary",
      description: "Our oceanfront grounds are fully secured and restricted to guests, offering unmatched intimacy, peace, and serenity.",
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-accent" />,
      title: "Anticipatory Service",
      description: "A private butler assigned to every villa guarantees your desires are met before they are spoken.",
    },
  ];

  return (
    <div className="bg-navy-deep min-h-screen text-white pt-12 pb-24 relative">
      {/* Background radial highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Compass className="w-5 h-5 text-accent" />
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">Our Story</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold font-serif mb-6 leading-tight"
          >
            Crafting Horizons of Pure Luxury
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gray-400 text-lg leading-relaxed font-sans"
          >
            The Grand Horizon began as a vision to merge Malibu’s raw coastal beauty with the timeless hospitality of European grand estates. Over thirty years, it has evolved into a global destination for discerning travelers looking to reset.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              className="glass-card p-8 text-center rounded-none"
            >
              <div className="text-4xl md:text-5xl font-bold text-accent font-serif mb-2">{stat.value}</div>
              <div className="text-xs tracking-widest uppercase text-gray-400 font-sans">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Philosophy section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white uppercase">
              The Heritage of Grand Horizon
            </h2>
            <div className="h-[2px] w-20 bg-accent" />
            <p className="text-gray-400 leading-relaxed font-sans text-base">
              Nestled on a private cliffside overlooking Malibu's blue coastline, Grand Horizon is a testament to fine architecture and bespoke comfort. Every detail—from the imported Italian marble in our bathrooms to the hand-woven linens on our signature beds—has been selected to provide an atmosphere of quiet luxury.
            </p>
            <p className="text-gray-400 leading-relaxed font-sans text-base">
              We believe luxury is not merely about grandeur, but the seamless alignment of space, comfort, and service. Whether you are swimming in our infinity pools or dining at our Michelin-starred bistro, you will find yourself surrounded by a design language that feels both classic and contemporary.
            </p>
            <div className="pt-4">
              <Link href="/rooms">
                <button className="px-8 py-3 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest hover:bg-transparent hover:text-white hover:border-white border border-accent transition-all duration-500 rounded-none">
                  EXPLORE OUR SUITES
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Luxury Graphic Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[450px] w-full border border-accent/20 overflow-hidden group"
          >
            {/* Visual gradient placeholder/styling, premium feel */}
            <div className="absolute inset-0 bg-gradient-to-tr from-navy-deep via-navy-light to-accent/10 z-10" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
              <span className="text-accent font-semibold text-xs tracking-widest uppercase mb-2">MALIBU BEACHFRONT</span>
              <h3 className="text-2xl font-serif text-white font-bold mb-4">A Sanctuary by the Sea</h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md font-sans">
                Experience California's premier coastal luxury. Wake up to direct ocean breezes and the sound of waves hitting the shore.
              </p>
            </div>
            <div className="absolute inset-0 transform group-hover:scale-105 transition-transform duration-700 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1470')" }} />
          </motion.div>
        </div>

        {/* Pillars Grid */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold font-serif text-center mb-16 uppercase tracking-wider">
            Our Hospitality Pillars
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 * idx }}
                className="glass-card p-10 flex flex-col items-center text-center rounded-none"
              >
                <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/5">
                  {pillar.icon}
                </div>
                <h4 className="text-lg font-serif font-bold text-white mb-4 uppercase">{pillar.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed font-sans">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
