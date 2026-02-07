import { useEffect } from 'react'
import './App.css'
import { Form, Modal, Sidebar } from './components/MainPage'
import BinPage from './components/BinPage'
import FlashMessage from './components/FlashMessage'
import * as webhookApi from './services/webhookApi'
import { useViews, useBins } from './contexts'

function App() {
  const { view } = useViews(); // controls which components are visible
  const { selectedBin, setBins } = useBins()

  useEffect(() => {
    document.title = "Request Bin";
  }, [selectedBin]);

  useEffect(() => {
    const fetchBins = async () => {
      const bins = await webhookApi.getBins()
      setBins(bins)
    }

    fetchBins()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 rounded-lg text-white flex flex-col md:flex-row">
      <FlashMessage />
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
            <Form />
          </main>

          <aside className="flex-[1] w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-700 bg-gray-800">
            <Sidebar />
          </aside>

        </>
      )}

      {/* Modal */}
      {view === 'modal' && selectedBin && (
        <Modal />
      )}

      {/* Bin records view */}
      {view === 'bins' && selectedBin &&
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-5xl bg-gray dark:bg-gray-900 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
            <BinPage />
          </div>
        </div>
      }

      {/* <BinPage selectedBin={selectedBin} records={records}/> */}
    </div>
  );
}

export default App
