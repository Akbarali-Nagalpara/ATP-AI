import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Clock, Layers } from 'lucide-react';

interface SummaryCardsProps {
  total: number;
  passed: number;
  failed: number;
  avgResponseTime: number;
  isLoading?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  total,
  passed,
  failed,
  avgResponseTime,
  isLoading = false,
}) => {
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  } as any;

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    },
  } as any;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse flex flex-col justify-between p-5"
          >
            <div className="w-1/2 h-3 bg-white/10 rounded" />
            <div className="w-3/4 h-8 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Success Rate',
      value: `${passRate}%`,
      subtitle: `${passed} of ${total} passed`,
      icon: ShieldCheck,
      colorClass: passRate > 80 ? 'text-emerald-400' : passRate > 50 ? 'text-amber-400' : 'text-rose-400',
      gradient: passRate > 80 
        ? 'from-emerald-500/10 via-transparent to-transparent border-emerald-500/20' 
        : passRate > 50 
        ? 'from-amber-500/10 via-transparent to-transparent border-amber-500/20' 
        : 'from-rose-500/10 via-transparent to-transparent border-rose-500/20',
      glowingShadow: passRate > 80
        ? 'shadow-emerald-500/5'
        : passRate > 50
        ? 'shadow-amber-500/5'
        : 'shadow-rose-500/5'
    },
    {
      title: 'Total Tested',
      value: total,
      subtitle: 'API endpoints covered',
      icon: Layers,
      colorClass: 'text-blue-400',
      gradient: 'from-blue-500/10 via-transparent to-transparent border-blue-500/20',
      glowingShadow: 'shadow-blue-500/5'
    },
    {
      title: 'Passed APIs',
      value: passed,
      subtitle: 'Completed successfully',
      icon: CheckCircle2,
      colorClass: 'text-emerald-400',
      gradient: 'from-emerald-500/10 via-transparent to-transparent border-emerald-500/10',
      glowingShadow: 'shadow-emerald-500/5'
    },
    {
      title: 'Failed APIs',
      value: failed,
      subtitle: failed > 0 ? `${failed} failures to fix` : 'All systems clear',
      icon: failed > 0 ? AlertTriangle : XCircle,
      colorClass: failed > 0 ? 'text-rose-400' : 'text-gray-400',
      gradient: failed > 0 
        ? 'from-rose-500/10 via-transparent to-transparent border-rose-500/20' 
        : 'from-gray-500/5 via-transparent to-transparent border-white/5',
      glowingShadow: failed > 0 ? 'shadow-rose-500/5' : 'shadow-transparent'
    },
    {
      title: 'Avg Latency',
      value: `${avgResponseTime}ms`,
      subtitle: 'Response latency',
      icon: Clock,
      colorClass: 'text-amber-400',
      gradient: 'from-amber-500/10 via-transparent to-transparent border-amber-500/10',
      glowingShadow: 'shadow-amber-500/5'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.15 } }}
            className={`relative bg-[#0d0d0f]/60 backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xl ${card.glowingShadow} transition-shadow duration-300`}
          >
            {/* Glowing top gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-40 -z-10`} />

            <div className="flex justify-between items-start mb-3">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                {card.title}
              </span>
              <Icon className={`w-4 h-4 ${card.colorClass} opacity-80`} />
            </div>

            <div className="mt-1">
              <h3 className={`text-3xl font-extrabold ${card.colorClass} tracking-tight font-sans`}>
                {card.value}
              </h3>
              <p className="text-gray-400 text-xs mt-1.5 font-medium tracking-wide">
                {card.subtitle}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
