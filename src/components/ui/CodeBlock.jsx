import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { copyToMobileClipboard } from '../../lib/utils';

export const CodeBlock = ({ code = '', language = 'python' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToMobileClipboard(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-2.5 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-lg text-xs font-mono">
      {/* Header bar */}
      <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code2 className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-medium flex items-center space-x-1 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code contents with line numbers */}
      <div className="p-3 overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                <td className="pr-3 text-slate-600 text-[10px] select-none text-right font-mono w-6">
                  {idx + 1}
                </td>
                <td className="whitespace-pre text-slate-200 leading-relaxed pl-2 border-l border-slate-800/60 font-mono">
                  {line}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
