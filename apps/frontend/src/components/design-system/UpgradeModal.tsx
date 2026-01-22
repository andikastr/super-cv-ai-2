import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-900 border border-[#2F6BFF]/30 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#2F6BFF]/20">
                <Crown size={40} className="text-white" fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Credits Exhausted</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                You've used all your credits. Purchase more to continue analyzing CVs.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="w-full py-3.5 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg"
                >
                  Buy Credits
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}