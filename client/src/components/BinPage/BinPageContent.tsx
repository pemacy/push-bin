import { useState, useRef } from 'react'
import type { BinComponentProps } from '../../utils/types'
import Bin from './Bin'



const BinPageContent = ({ selectedBin, records }: BinComponentProps) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false)
  const linkRef = useRef<HTMLSpanElement>(null);
  const handleCopy = () => {
    if (!linkRef.current) return;
    const link = linkRef.current.textContent ?? "";
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000); // auto-hides copied link message after 2 seconds
    });
  };

  return (
    <div className="mb-4 rounded-xl bg-white p-4 shadow-md outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
      {/* Content below */}
      <div className="mt-3">
        {records.length > 0 ? (
          <Bin selectedBin={selectedBin} records={records} />
        ) : (
          <p className="text-sm italic text-gray-500 dark:text-gray-400">
            Empty Bin — use{" "}
            <span
              className="font-mono p-1 text-gray-700 dark:text-gray-200"
              ref={linkRef}
            >
              https://amazing-mostly-tadpole.ngrok-free.app/api/{selectedBin.id}
            </span>
            <span className="inline-flex items-center gap-2 ml-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded bg-blue-900 text-white text-sm hover:bg-blue-800"
              >
                Copy
              </button>
              {copiedLink && (
                <span className="text-xs text-green-600 dark:text-green-400">
                  ✅ Copied!
                </span>
              )}
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

export default BinPageContent
