import React, { useState } from 'react';
import { X, ShieldCheck, Copy, Check, ExternalLink, Code2 } from 'lucide-react';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const licenseSummary = `Apache License Version 2.0, January 2004
Copyright (c) 2026 thathorserep (https://github.com/thathorserep)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

---
GEMMA 4 OPEN MODEL ATTRIBUTION:
This app is powered by Google Gemma 4 open weights and research.
Gemma models are subject to Google's Gemma Terms of Use:
https://ai.google.dev/gemma/terms`;

  const handleCopy = () => {
    navigator.clipboard.writeText(licenseSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
                Apache 2.0 License & Gemma 4
              </h3>
              <p className="text-xs text-stone-500">
                Open-source license compliance & model attribution
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
          <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl text-amber-950">
            <p className="font-semibold text-amber-900 mb-1">
              Open-Source First: Built with Gemma 4
            </p>
            <p>
              This application is built around Gemma 4 open model architecture and research by Google DeepMind. The application source code is released under the permissive <strong>Apache License 2.0</strong>, allowing you to freely inspect, fork, modify, and host on your GitHub repository.
            </p>
          </div>

          <div>
            <span className="font-bold text-stone-900 text-xs block mb-1">Key Permissions under Apache 2.0:</span>
            <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
              <li>Commercial use and private modifications permitted</li>
              <li>Public distribution and patent license grants included</li>
              <li>State changes on redistributed copies required</li>
              <li>Full LICENSE file preserved in root directory</li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-stone-900 text-xs block mb-1.5">Official License Notice:</span>
            <pre className="p-3 bg-stone-900 text-stone-100 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
              {licenseSummary}
            </pre>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-stone-500">
            <span>Official repository: github.com/thathorserep</span>
            <a
              href="https://ai.google.dev/gemma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C2593F] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Learn about Gemma</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied License!' : 'Copy License Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
