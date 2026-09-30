import React, { useState, useRef, useEffect, useCallback } from 'react';
import UserMessage from './Usermessage';
import ArenaResponse from './ArenaResponse';
import axios from 'axios';
import { 
  Swords, 
  Sparkles, 
  Send, 
  Trash2, 
  Code2, 
  BrainCircuit, 
  Layers, 
  Terminal, 
  Crown,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const API_URL = '/invoke';

// const API_URL = 'http://localhost:3000/invoke';

const SAMPLE_PROMPTS = [
  {
    icon: Code2,
    category: 'Algorithms',
    label: 'Write an efficient LRU Cache with O(1) ops in JavaScript',
  },
  {
    icon: BrainCircuit,
    category: 'Logic & Proof',
    label: 'Explain the Monty Hall Paradox with mathematical proof',
  },
  {
    icon: Layers,
    category: 'Architecture',
    label: 'Design a scalable real-time chat & notifications backend',
  },
  {
    icon: Terminal,
    category: 'System Performance',
    label: 'Benchmark REST vs GraphQL vs gRPC for microservices',
  },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const trimmed = inputValue.trim();
      if (!trimmed || isSending) return;

      const id = Date.now();

      setInputValue('');
      setIsSending(true);

      setMessages((prev) => [
        ...prev,
        {
          id,
          problem: trimmed,
          loading: true,
        },
      ]);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      try {
        const response = await axios.post(API_URL, {
          input: trimmed,
        });

        const result = response.data?.result ?? {};

        setMessages((prev) =>
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  ...result,
                  loading: false,
                }
              : m
          )
        );
      } catch (err) {
        console.error('Failed to get response:', err);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  loading: false,
                  error: true,
                }
              : m
          )
        );
      } finally {
        setIsSending(false);
      }
    },
    [inputValue, isSending]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (window.confirm('Clear all arena matches?')) {
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#08080a] font-sans text-zinc-100 antialiased selection:bg-amber-400/30 selection:text-amber-100">
      {/* Responsive Golden Header */}
      <header className="glass-gold-header sticky top-0 z-40 px-3 sm:px-8 py-3.5 sm:py-4 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-400/25 via-amber-500/10 to-transparent shadow-lg shadow-amber-500/10 shrink-0">
              <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-serif-luxury text-sm sm:text-lg font-extrabold tracking-[0.14em] sm:tracking-[0.18em] text-white truncate">
                  AI ARENA
                </h1>
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold tracking-widest text-amber-300 uppercase shrink-0">
                  GOLDEN EDITION
                </span>
              </div>
              <p className="hidden sm:block text-[10px] font-medium tracking-widest text-zinc-400 uppercase truncate">
                Dual Execution • Gemini Evaluation
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="hidden sm:inline text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Matches
                </span>
                <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-xs font-bold text-amber-300">
                  {String(messages.length).padStart(2, '0')}
                </span>
              </div>

              <div className="h-4 w-px bg-amber-400/20" />

              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                </span>
                <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                  Active
                </span>
              </div>
            </div>

            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-300 transition-all hover:bg-amber-400/20 active:scale-95"
                title="Clear current match history"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Scroll Area */}
      <main className="relative flex-1 overflow-y-auto w-full min-w-0">
        {/* Ambient Grid Background */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />
          <div className="absolute left-1/2 top-12 h-[500px] w-[750px] -translate-x-1/2 rounded-full bg-amber-500/[0.035] blur-[140px]" />
        </div>

        {/* Content Area with Generous Padding to PREVENT Input Overlap */}
        <div className="relative z-10 mx-auto min-h-full max-w-6xl px-3 sm:px-8 lg:px-12 py-6 sm:py-10 pb-44 sm:pb-56">
          {messages.length === 0 ? (
            /* Golden Hero Stage */
            <div className="flex min-h-[calc(100vh-250px)] flex-col items-center justify-center animate-fade-in py-6">
              <div className="w-full max-w-4xl text-center">
                {/* Hero Badge */}
                <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 shadow-inner">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-amber-300 uppercase">
                    Autonomous Intelligence Benchmark
                  </span>
                </div>

                {/* Hero Heading */}
                <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-wide text-white leading-tight">
                  Two AI Minds.
                  <br />
                  <span className="gold-gradient-text">
                    One Golden Verdict.
                  </span>
                </h2>

                <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-lg leading-relaxed text-zinc-300 px-2">
                  Submit any prompt to evaluate <span className="text-amber-200 font-semibold">Mistral AI</span> and <span className="text-amber-200 font-semibold">Cohere</span> side-by-side. 
                  <span className="text-white font-semibold"> Gemini Referee</span> autonomously audits logic, code, and clarity.
                </p>

                {/* Challenger Spec Stage */}
                <div className="relative mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-center">
                  {/* Challenger 1 */}
                  <div className="group rounded-3xl border border-amber-500/25 bg-[#0f1015] p-5 sm:p-6 text-left shadow-2xl transition-all duration-300 hover:border-amber-400/50">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-400/20 to-amber-600/10 font-black text-xl text-amber-300 shrink-0">
                        M
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Mistral AI</h3>
                        <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                          Challenger 01
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                      High-precision algorithm design, logical reasoning, and concise execution.
                    </p>
                  </div>

                  {/* Referee Badge */}
                  <div className="flex flex-col items-center justify-center py-1">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/40 bg-gradient-to-b from-amber-400/20 to-[#12131a] shadow-2xl shadow-amber-500/20">
                      <Swords className="h-5 w-5 text-amber-300" />
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-bold text-amber-200">
                      <ShieldCheck className="h-3 w-3 text-amber-300 shrink-0" />
                      Refereed by Gemini
                    </div>
                  </div>

                  {/* Challenger 2 */}
                  <div className="group rounded-3xl border border-amber-500/25 bg-[#0f1015] p-5 sm:p-6 text-left shadow-2xl transition-all duration-300 hover:border-amber-400/50">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-400/20 to-amber-600/10 font-black text-xl text-amber-300 shrink-0">
                        C
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Cohere</h3>
                        <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                          Challenger 02
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                      Comprehensive contextual depth, structured explanations, and step-by-step logic.
                    </p>
                  </div>
                </div>

                {/* Sample Prompt Cards */}
                <div className="mt-10 sm:mt-14 text-center">
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Select a challenge to start the arena
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                    {SAMPLE_PROMPTS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setInputValue(item.label);
                            inputRef.current?.focus();
                          }}
                          className="group flex items-center justify-between rounded-2xl border border-amber-500/20 bg-[#0d0e13] p-3.5 sm:p-4 text-left transition-all duration-200 hover:border-amber-400/50 hover:bg-amber-400/5 hover:shadow-xl w-full min-w-0"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-300">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[10px] font-bold uppercase tracking-widest text-amber-400">
                                {item.category}
                              </span>
                              <span className="text-xs font-medium text-zinc-200 group-hover:text-white truncate block">
                                {item.label}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-amber-400/60 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-300 shrink-0 ml-2" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Active Battle Rounds */
            <div className="mx-auto max-w-5xl space-y-10 sm:space-y-14 w-full min-w-0">
              {messages.map((msg, index) => (
                <div key={msg.id} className="relative w-full min-w-0">
                  {/* Round Header Badge */}
                  <div className="mb-4 sm:mb-6 flex items-center gap-3">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl border border-amber-400/40 bg-amber-400/15 shrink-0">
                      <span className="font-mono text-xs font-bold text-amber-300">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                      Match Round #{index + 1}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-amber-400/20 to-transparent" />
                  </div>

                  {/* User Message */}
                  <UserMessage message={msg.problem} />

                  {/* Error State */}
                  {msg.error ? (
                    <div className="rounded-3xl border border-red-500/30 bg-red-500/[0.06] p-5 sm:p-6 shadow-xl">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 font-bold shrink-0">
                          !
                        </div>
                        <div>
                          <p className="text-sm font-bold text-red-300">
                            Arena Match Interrupted
                          </p>
                          <p className="mt-1 text-xs text-red-400/80">
                            Failed to reach backend API. Ensure server on http://localhost:3000 is active.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Arena Response Pair & Judge */
                    <ArenaResponse
                      solution1={msg.solution_1}
                      solution2={msg.solution_2}
                      judge={msg.judge}
                      model1Name="Mistral AI"
                      model2Name="Cohere"
                      judgeName="Gemini Referee"
                      loading={msg.loading}
                    />
                  )}
                </div>
              ))}

              {/* Explicit Bottom Clearance Spacer to Prevent Fixed Bar Overlap */}
              <div className="h-28 sm:h-36 w-full shrink-0 pointer-events-none" aria-hidden="true" />
              <div ref={endOfMessagesRef} />
            </div>
          )}
        </div>
      </main>

      {/* Floating Prompt Bar with Dark Gradient Fade Protection */}
      <div className="fixed bottom-0 left-0 right-0 z-40 w-full pointer-events-none bg-gradient-to-t from-[#08080a] via-[#08080a]/95 to-transparent pt-8 pb-3 sm:pb-6 px-3 sm:px-8">
        <div className="mx-auto max-w-4xl pointer-events-auto">
          <form onSubmit={handleSend}>
            <div className="glass-gold-panel relative rounded-3xl p-2 sm:p-2.5 transition-all duration-300 focus-within:border-amber-400/50 focus-within:shadow-[0_0_50px_rgba(245,158,11,0.25)] shadow-2xl">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Input Icon */}
                <div className="ml-2 hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/15 text-amber-300">
                  <Zap className="h-5 w-5" />
                </div>

                {/* Input Field */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your challenge for the Arena..."
                  disabled={isSending}
                  className="min-w-0 flex-1 bg-transparent px-2.5 py-2.5 sm:px-3 sm:py-3 text-sm sm:text-base text-white outline-none placeholder:text-zinc-500 disabled:opacity-50"
                />

                {/* Golden Send Button */}
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isSending}
                  className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl gold-gradient-bg text-black font-extrabold shadow-lg shadow-amber-500/20 transition-all duration-200 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none"
                >
                  {isSending ? (
                    <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  ) : (
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Footer Subtext */}
          <div className="mt-2 flex items-center justify-between px-3 text-[9px] sm:text-[10px] text-zinc-500 font-mono">
            <span>Mistral AI × Cohere × Gemini Referee</span>
            <span className="hidden sm:inline">Press Enter ↵ to launch match</span>
          </div>
        </div>
      </div>
    </div>
  );
}