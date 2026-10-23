import React, { useState } from 'react';
import { X, GitBranch, Copy, Check, ExternalLink, Terminal, Shield } from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const repoUrl = 'https://github.com/thathorserep/pantry-roulette-gemma4';
  const gitCommands = `# 1. Create a new public repository named "pantry-roulette-gemma4" at:
# https://github.com/new

# 2. Add your GitHub remote and push:
git remote add origin https://github.com/thathorserep/pantry-roulette-gemma4.git
git branch -M main
git add .
git commit -m "feat: Pantry Roulette with Gemma 4 variety engine and Apache 2.0 license"
git push -u origin main`;

  const handleCopy = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
                Push to GitHub: thathorserep
              </h3>
              <p className="text-xs text-stone-500">
                Publish as a public repository on github.com/thathorserep
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-stone-700 leading-relaxed">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <span className="font-semibold text-stone-800">Target GitHub Profile: </span>
              <a
                href="https://github.com/thathorserep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C2593F] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>github.com/thathorserep</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <span className="text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              Ready
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-stone-600" />
              <span>Shell commands to push to your GitHub:</span>
            </span>
            <div className="relative">
              <pre className="p-3.5 bg-stone-950 text-stone-200 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                {gitCommands}
              </pre>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-2 text-amber-950">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Shield className="w-4 h-4 text-amber-700" />
              <span>Built-in Compliance & Assets Checklist</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1 text-[11px]">
              <li><strong>LICENSE:</strong> Complete Apache 2.0 license file with Google Gemma terms included in root.</li>
              <li><strong>README.md:</strong> Thorough documentation of 6-axis variety algorithm & YouTube integration.</li>
              <li><strong>Centerpiece:</strong> Gemma 4 open AI system instructions with structured JSON schema.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#C2593F] hover:underline flex items-center gap-1"
          >
            <span>Open github.com/new</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Commands!' : 'Copy Push Commands'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
