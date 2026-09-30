import React, { useEffect, useRef, memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { 
  Copy, 
  Check, 
  Trophy, 
  Scale, 
  Sparkles, 
  Code, 
  BarChart3,
  Crown
} from 'lucide-react';

// Golden & White Responsive Code Block Component
function CodeBlock({ className, children }) {
  const [copied, setCopied] = useState(false);
  const content = String(children).replace(/\n$/, '');
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'code';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-amber-500/20 bg-[#090a0d] shadow-2xl">
      <div className="flex items-center justify-between border-b border-amber-500/15 bg-[#0e0f14] px-3.5 py-2.5 sm:px-4">
        <div className="flex items-center gap-2 min-w-0">
          <Code className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="font-mono text-xs font-semibold tracking-widest text-amber-300 uppercase truncate">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 transition-all hover:bg-amber-400/20 active:scale-95 shrink-0"
          title="Copy code snippet"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-[11px] font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-[11px]">Copy Code</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto max-w-full p-3.5 sm:p-4 font-mono text-xs leading-relaxed text-zinc-200">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

const markdownComponents = {
  h1: ({ node, ...props }) => (
    <h1 className="mt-6 mb-4 font-serif-luxury text-xl font-bold tracking-wider text-amber-200 sm:text-2xl break-words" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="mt-5 mb-3 font-serif-luxury text-lg font-bold tracking-wide text-amber-200 sm:text-xl break-words" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="mt-4 mb-2 font-sans text-base font-semibold text-white break-words" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="mb-4 text-sm sm:text-base font-normal leading-7 sm:leading-8 text-zinc-200 break-words" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="mb-4 list-disc space-y-2.5 pl-5 sm:pl-6 text-sm sm:text-base leading-7 sm:leading-8 text-zinc-200 break-words" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="mb-4 list-decimal space-y-2.5 pl-5 sm:pl-6 text-sm sm:text-base leading-7 sm:leading-8 text-zinc-200 break-words" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className="leading-7 sm:leading-8 text-zinc-200 break-words" {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="my-4 border-l-2 border-amber-400 bg-amber-400/5 py-2.5 pl-4 italic text-amber-100 rounded-r-lg break-words" {...props} />
  ),
  a: ({ node, ...props }) => (
    <a className="font-medium text-amber-300 underline underline-offset-4 hover:text-amber-200 transition-colors break-words" {...props} />
  ),
  code: ({ node, className, children, ...props }) => {
    const content = String(children).replace(/\n$/, '');
    const isInline = !content.includes('\n');

    if (isInline) {
      return (
        <code
          className="rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 font-mono text-xs text-amber-200 break-words"
          {...props}
        >
          {children}
        </code>
      );
    }

    return <CodeBlock className={className}>{children}</CodeBlock>;
  },
};

// Dark skeleton loading placeholder
function SolutionSkeleton({ title, brandLogo }) {
  return (
    <div className="flex flex-col rounded-3xl border border-amber-500/20 bg-[#0c0d12] p-5 sm:p-8 shadow-2xl w-full min-w-0">
      <div className="mb-6 flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/15 font-bold text-amber-300 shrink-0">
            {brandLogo}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-white tracking-wide truncate">{title}</h3>
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
              Generating Solution...
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4 animate-pulse">
        <div className="h-4 rounded-md bg-zinc-800/60 w-5/6" />
        <div className="h-4 rounded-md bg-zinc-800/60 w-full" />
        <div className="h-4 rounded-md bg-zinc-800/60 w-3/4" />
        <div className="mt-4 h-28 rounded-2xl bg-zinc-800/40 w-full border border-white/[0.04]" />
      </div>
    </div>
  );
}

const SolutionPanel = memo(function SolutionPanel({ 
  title, 
  brandLogo, 
  content, 
  score 
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.querySelectorAll('pre code:not(.hljs)').forEach((el) => {
      hljs.highlightElement(el);
    });
  }, [content]);

  return (
    <div className="group flex flex-col rounded-3xl border border-amber-500/20 bg-[#0d0e14] p-5 sm:p-8 shadow-2xl transition-all duration-300 hover:border-amber-400/40 hover:shadow-amber-500/[0.05] w-full min-w-0 overflow-hidden">
      {/* Panel Header */}
      <div className="mb-6 flex items-center justify-between border-b border-white/[0.08] pb-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/20 to-amber-600/10 font-black text-lg text-amber-300 shadow-inner shrink-0">
            {brandLogo}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-tight truncate">{title}</h3>
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[9px] font-bold tracking-widest text-amber-300 uppercase shrink-0">
                Challenger
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-zinc-400 uppercase tracking-widest font-mono truncate">
              Independent Model
            </p>
          </div>
        </div>

        {score !== undefined && score !== null && (
          <div className="flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 shrink-0">
            <BarChart3 className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-sm font-bold text-amber-300 font-mono">{score}</span>
            <span className="text-[10px] text-amber-400/70 font-mono">/10</span>
          </div>
        )}
      </div>

      {/* Content body with generous leading space */}
      <div className="flex-1 text-zinc-100 font-sans w-full min-w-0 overflow-hidden" ref={containerRef}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
});

const JudgeSkeleton = () => (
  <div className="mt-8 rounded-3xl border border-amber-400/30 bg-[#0e0f16] p-5 sm:p-8 shadow-2xl animate-pulse w-full min-w-0">
    <div className="mb-6 flex items-center gap-3 border-b border-white/[0.08] pb-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 shrink-0">
        <Scale className="h-5 w-5" />
      </div>
      <div>
        <div className="h-5 w-48 rounded bg-zinc-800" />
        <div className="mt-1 h-3 w-32 rounded bg-zinc-800/60" />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="h-28 rounded-2xl bg-zinc-800/40" />
      <div className="h-28 rounded-2xl bg-zinc-800/40" />
    </div>
  </div>
);

function ArenaResponse({
  solution1,
  solution2,
  judge,
  model1Name = 'Mistral AI',
  model2Name = 'Cohere',
  judgeName = 'Gemini Referee',
  loading = false,
}) {
  // Winner calculation
  const score1 = typeof judge?.solution_1 === 'number' ? judge.solution_1 : parseInt(judge?.solution_1, 10);
  const score2 = typeof judge?.solution_2 === 'number' ? judge.solution_2 : parseInt(judge?.solution_2, 10);
  
  let winnerText = null;
  if (!isNaN(score1) && !isNaN(score2)) {
    if (score1 > score2) {
      winnerText = `${model1Name} Wins`;
    } else if (score2 > score1) {
      winnerText = `${model2Name} Wins`;
    } else {
      winnerText = 'Dual Excellence (Tie)';
    }
  }

  return (
    <div className="my-6 flex flex-col gap-8 w-full min-w-0 animate-fade-in">
      {/* Side-by-Side Model Solutions Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 w-full min-w-0">
        {loading ? (
          <>
            <SolutionSkeleton title={model1Name} brandLogo="M" />
            <SolutionSkeleton title={model2Name} brandLogo="C" />
          </>
        ) : (
          <>
            <SolutionPanel
              title={model1Name}
              brandLogo="M"
              content={solution1}
              score={judge?.solution_1}
            />
            <SolutionPanel
              title={model2Name}
              brandLogo="C"
              content={solution2}
              score={judge?.solution_2}
            />
          </>
        )}
      </div>

      {/* Gemini Referee Evaluation Section */}
      {loading ? (
        <JudgeSkeleton />
      ) : (
        judge && (
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-b from-[#13141c] via-[#0f1017] to-[#0a0b0e] p-5 sm:p-8 shadow-2xl shadow-amber-500/5 w-full min-w-0">
            {/* Top Glow Ambient Accent */}
            <div className="absolute left-1/2 -top-16 h-36 w-[500px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.1] pb-6">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-400/25 to-amber-600/15 text-amber-300 shadow-xl shadow-amber-500/10 shrink-0">
                  <Crown className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif-luxury text-xl font-bold tracking-wide text-amber-100">
                      {judgeName} Verdict
                    </h3>
                    <span className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-0.5 text-[10px] font-bold text-amber-300 shrink-0">
                      <Sparkles className="h-3 w-3 text-amber-300" />
                      Supreme Referee
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-400 truncate">
                    Comparative analytical evaluation & precision scoring
                  </p>
                </div>
              </div>

              {winnerText && (
                <div className="flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-400/15 px-4 py-2 text-xs font-bold text-amber-200 shadow-lg w-fit shrink-0">
                  <Trophy className="h-4 w-4 text-amber-300" />
                  <span>{winnerText}</span>
                </div>
              )}
            </div>

            {/* Scores & Breakdown Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full min-w-0">
              {/* Model 1 Score Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-amber-400/25 bg-amber-400/[0.04] p-5 sm:p-6 transition-all hover:border-amber-400/45 w-full min-w-0">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      {model1Name} Score
                    </span>
                    <span className="font-mono text-2xl font-black text-amber-300">
                      {judge.solution_1 ?? '—'}<span className="text-xs font-normal text-zinc-400">/10</span>
                    </span>
                  </div>
                  
                  {/* Visual Progress Bar */}
                  {!isNaN(score1) && (
                    <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div 
                        className="h-full rounded-full gold-gradient-bg transition-all duration-700" 
                        style={{ width: `${Math.min(100, Math.max(0, (score1 / 10) * 100))}%` }} 
                      />
                    </div>
                  )}

                  <p className="text-xs sm:text-sm font-normal leading-relaxed text-zinc-200 break-words">
                    {judge.solution_1_reasoning}
                  </p>
                </div>
              </div>

              {/* Model 2 Score Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-amber-400/25 bg-amber-400/[0.04] p-5 sm:p-6 transition-all hover:border-amber-400/45 w-full min-w-0">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      {model2Name} Score
                    </span>
                    <span className="font-mono text-2xl font-black text-amber-300">
                      {judge.solution_2 ?? '—'}<span className="text-xs font-normal text-zinc-400">/10</span>
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  {!isNaN(score2) && (
                    <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div 
                        className="h-full rounded-full gold-gradient-bg transition-all duration-700" 
                        style={{ width: `${Math.min(100, Math.max(0, (score2 / 10) * 100))}%` }} 
                      />
                    </div>
                  )}

                  <p className="text-xs sm:text-sm font-normal leading-relaxed text-zinc-200 break-words">
                    {judge.solution_2_reasoning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default memo(ArenaResponse);