"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export function OpeningExperience() {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    // Elegant, brief 900ms opening reveal that never blocks the user
    const timer = setTimeout(() => {
      setVisible(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="opening-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-midnight-950 flex items-center justify-center pointer-events-none select-none"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Lightning-inspired kinetic brand emblem */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-16 h-16 rounded-2xl bg-midnight-900 border border-gold-500/50 flex items-center justify-center shadow-goldGlow"
            >
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Zap className="w-8 h-8 text-gold-500 fill-current" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center"
            >
              <span className="text-xl font-heading font-extrabold tracking-widest text-ivory-100 uppercase">
                FLASH <span className="text-gold-500">SOLAR</span>
              </span>
              <span className="block text-[10px] tracking-widest text-ivory-400 font-mono uppercase mt-0.5">
                ENGINEERING ARCHITECTURE
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
