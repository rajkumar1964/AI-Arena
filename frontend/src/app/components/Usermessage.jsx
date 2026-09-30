import React from 'react';
import { User } from 'lucide-react';

export default function UserMessage({ message }) {
  return (
    <div className="flex justify-end my-6 sm:my-10 animate-fade-in w-full">
      <div className="group relative w-full sm:w-auto max-w-full sm:max-w-[82%]">
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 opacity-0 blur-md transition duration-300 group-hover:opacity-100" />

        <div className="relative rounded-2xl rounded-tr-xs border border-amber-500/25 bg-[#101116] p-4 sm:p-6 text-white shadow-2xl shadow-black/60 w-full min-w-0">
          <div className="mb-3 flex items-center justify-between border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 shrink-0">
                <User className="h-3 w-3" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                User Challenge
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              Input Prompt
            </span>
          </div>
          <p className="text-sm sm:text-base font-normal leading-relaxed text-zinc-100 whitespace-pre-wrap break-words min-w-0">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}