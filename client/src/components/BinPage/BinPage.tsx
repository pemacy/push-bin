// import React from 'react'
import { useEffect } from 'react'
import BinPageHeader from './BinPageHeader'
import BinPageContent from './BinPageContent'
import type { RecordWithDoc } from '../../utils/types'
import { useBins, useRecords } from '../../contexts'

const BinPage = () => {
  const { setRecords } = useRecords()
  const { selectedBin } = useBins()

  if (selectedBin === undefined) throw new Error('In BinPage component, selectedBin is undefined')

  useEffect(() => {
    //const ngrokWebsocketURL = "wss://amazing-mostly-tadpole.ngrok-free.app/"
    const localhostWebsocketURL = `ws://127.0.0.1:3000`
    console.log("useEffect - websocket connection, url:", localhostWebsocketURL)
    const ws = new WebSocket(localhostWebsocketURL);
    ws.onopen = () => {
      console.log('Web Socket Connected')
    }
    ws.onmessage = (event) => {
      console.log("Event received:", event.type)
      const record: RecordWithDoc = JSON.parse(event.data);

      setRecords((prev) => {
        if (record.bin_id === selectedBin.id) {
          return [...prev, record];
        }
        return prev;
      });
    };

    return () => ws.close(); // closes socket when component unmounts
  }, [selectedBin])
  return (
    <div className="bg-gray dark:bg-gray-900 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
      <header className="w-full bg-gray-800 dark:bg-gray-900 shadow-md rounded-b-xl p-6 flex justify-center items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-gray-100 tracking-wide">
          {selectedBin.id}
        </h1>
      </header>
      <BinPageHeader />
      <BinPageContent />

    </div>
  )
}

export default BinPage
