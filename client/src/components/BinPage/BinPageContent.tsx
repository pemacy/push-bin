import { useState, useRef } from 'react'
import RecordList from './Record'
import { useRecords, useBins } from '../../contexts'



const BinPageContent = () => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false)
  const linkRef = useRef<HTMLSpanElement>(null);

  const { selectedBin } = useBins()
  const { records } = useRecords()

  if (selectedBin === undefined) throw new Error('In BinPageContent component, selectedBin is undefined')

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
          <RecordList selectedBin={selectedBin} records={records} />
        ) : (
          <p className="text-sm italic text-gray-500 dark:text-gray-400">
            Empty Bin — use{" "}
            <span
              className="font-mono p-1 text-gray-700 dark:text-gray-200"
              ref={linkRef}
            >
              {`${import.meta.env.VITE_NGROK_STATIC_URL}/${selectedBin.id}`}
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
