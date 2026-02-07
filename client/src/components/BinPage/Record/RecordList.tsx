import { useRef, useState } from "react";
import Record from "./Record";
import type { BinProps } from "../../../utils/types";

const Bin = ({ selectedBin, records }: BinProps) => {
  const linkRef = useRef<HTMLSpanElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!linkRef.current) return;
    const link = linkRef.current.textContent ?? "";
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      // auto-hides copied link message after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mb-6 text-left rounded-xl bg-white p-5 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
      {/* Informational header */}
      <div className="mb-4 border-b border-gray-200 pb-3 dark:border-slate-700 space-y-2">
        <p className="text-sm text-gray-700 dark:text-gray-200">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            Bin:
          </span>{" "}
          {selectedBin.id}
        </p>

        <p className="text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            Requests:
          </span>{" "}
          collected at{" "}
          <span
            ref={linkRef}
            className="font-mono text-gray-800 dark:text-gray-100 break-all"
          >
            {`${import.meta.env.VITE_NGROK_STATIC_URL}/${selectedBin.id}`}
          </span>
          <button
            onClick={handleCopy}
            className="px-3 py-1 rounded bg-blue-900 text-white text-xs hover:bg-blue-800"
          >
            Copy
          </button>
          {copied && (
            <span className="text-xs text-green-600 dark:text-green-400">
              ✅ Copied!
            </span>
          )}
        </p>

        <p className="text-sm text-gray-700 dark:text-gray-200">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            Record Total:
          </span>{" "}
          {records.length}
        </p>
      </div>


      {/* Individual Records list */}

      <div className="space-y-4">
        {records.map((record) => (
          <Record key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
};

export default Bin;
