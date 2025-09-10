import { useState, useEffect } from 'react';
import './App.css';
import Form from './components/MainPage/Form';
import Sidebar from './components/MainPage/Sidebar';
import Modal from './components/MainPage/Modal';
import BinPage from './components/BinPage/BinPage';
import type { RecordWithDoc, BinInterface, AppView } from './utils/types';
import * as webhookApi from './services/webhookApi';

function App() {
  const [view, setView] = useState<AppView>('home');
  const [bins, setBins] = useState<BinInterface[]>([]);
  const [selectedBin, setSelectedBin] = useState<BinInterface | undefined>();
  const [records, setRecords] = useState<RecordWithDoc[]>([]);

  useEffect(() => {
    document.title = "Request Bin";
  }, [selectedBin]);

  useEffect(() => {
    const fetchBins = async () => {
      const retrievedBins = await webhookApi.getBins();
      const sanitizedBins = Array.isArray(retrievedBins) ? retrievedBins : [];
      setBins(sanitizedBins);
    };

    fetchBins();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 rounded-lg text-white flex flex-col md:flex-row">
      {(view === 'home' || view === 'modal') && (
        <>
          <main className="flex-[3] w-full p-6 md:p-10">
            <header className="w-full bg-gray-800 dark:bg-gray-900 shadow-md rounded-b-xl p-6 flex justify-center items-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-gray-100 tracking-wide">
                Request Bin
              </h1>
            </header>
            <h1 className="text-xl font-semibold mb-6">Create a New Bin</h1>
            {/* import.meta.env.VITE_WEBHOOK_URL */}
            <Form
              setBins={setBins}
              setView={setView}
              setRecords={setRecords}
              setSelectedBin={setSelectedBin}
            />
          </main>

          <aside className="flex-[1] w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-700 bg-gray-800">
            <Sidebar
              bins={bins}
              setRecords={setRecords}
              setView={setView}
              setSelectedBin={setSelectedBin}
            />
          </aside>

        </>
      )}

      {/* Modal */}
      {view === 'modal' && selectedBin && (
        <Modal
          bin={selectedBin}
          setView={setView}
          setSelectedBin={setSelectedBin}
          setRecords={setRecords} />
      )}

      {/* Bin records view */}
      {view === 'bins' && selectedBin &&
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-5xl bg-gray dark:bg-gray-900 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
            <BinPage setBins={setBins} selectedBin={selectedBin} records={records} setView={setView} setSelectedBin={setSelectedBin} setRecords={setRecords} />
          </div>
        </div>
      }

      {/* <BinPage selectedBin={selectedBin} records={records}/> */}
    </div>
  );
}

export default App;
