import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { RiFileShredLine } from "react-icons/ri";
import type { RecordComponentProps } from '../../../utils/types';
import { useRecords, useFlash } from '../../../contexts';

const host = location.hostname;
export const DOMAIN =
  host === "localhost"
    ? `${location.protocol}//${host}:${location.port}`
    : `${location.protocol}//${host}`;

const Record = ({ record }: RecordComponentProps) => {
  const { setRecords } = useRecords()
  const { showFlash } = useFlash()
  const [headerVisible, setHeaderVisible] = useState<boolean>(false);
  const [bodyVisible, setBodyVisible] = useState<boolean>(false);

  const handleHeaderClick = () => {
    setHeaderVisible(!headerVisible);
  }

  const handleBodyClick = () => {
    setBodyVisible(!bodyVisible);
  }

  const removeRecord = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await axios.delete(`${DOMAIN}/bins/${record.bin_id}/records/${record.id}`)
      setRecords(prev => prev.filter(r => r.id !== record.id))
      showFlash('Record deleted successfully!', 'success')
    } catch (err) {
      showFlash('Failed to delete record', 'error')
    }
  }
  return (
    <section className="rounded-xl bg-white p-4 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
      {/* Method and Time heading information */}
      <div className='flex justify-between'>

        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          [{record.method}] — {new Date(record.created_at).toLocaleString()}
        </div>
        <button onClick={removeRecord}>
          <div className="relative group inline-block">
            <RiFileShredLine className="text-2xl text-gray-500 transition-all duration-200 ease-in-out hover:text-blue-500 hover:scale-110 cursor-pointer" />
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Delete This Record
            </div>
          </div>
        </button>
      </div>

      {/* Headers */}
      <div
        onClick={handleHeaderClick}
        className="mt-3 cursor-pointer rounded-lg bg-gray-50 px-3 py-2 shadow-sm hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600"
      >
        <span className="block text-sm font-medium text-gray-600 dark:text-gray-300">
          {headerVisible === true ? (
            `Hide Headers`
          ) : (
            `Show Headers`
          )}
        </span>

        {headerVisible && (
          <pre className="mt-1 whitespace-pre-wrap text-xs text-gray-800 dark:text-gray-100">
            {
              JSON.stringify(record.headers, null, 2)
                .split('\n')
                .slice(1, -1)
                .join('\n')
            }
          </pre>
        )}
      </div>

      {/* Body / Payload */}
      <div
        onClick={handleBodyClick}
        className="mt-3 cursor-pointer rounded-lg bg-gray-50 px-3 py-2 shadow-sm hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600">
        <span className="block text-sm font-medium text-gray-600 dark:text-gray-300">
          {bodyVisible === true ? (
            `Hide Body`
          ) : (
            `Show Body`
          )}
        </span>
        {bodyVisible && (
          <pre className="mt-1 whitespace-pre-wrap text-xs text-gray-800 dark:text-gray-100">
            {
              record.payload ?
                JSON.stringify(record.payload, null, 2)
                  .split('\n')
                  .slice(1, -1)
                  .join('\n')
                :
                "No Payload Sent"
            }
          </pre>
        )}
      </div>
    </section>
  )
}

export default Record


// Path: {record.bin_id}<br />
// Method: {record.method}<br />
// Headers: {record.headers}<br />

// {/* mongo_doc will need to be replaced with retrieved json */}
// Body: {record.payload}<br />
