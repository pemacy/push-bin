import type { MouseEvent } from 'react'
import type * as appType from '../../utils/types'
import { getBin } from '../../services/webhookApi'
import { useRecords, useViews, useBins } from '../../contexts'

const goToMainPage = (
  e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
  setView: React.Dispatch<React.SetStateAction<appType.AppView>>,
) => {
  e.stopPropagation()
  setView('home')
}

const goToBinPage = async (
  e: MouseEvent<HTMLButtonElement>,
  setView: React.Dispatch<React.SetStateAction<appType.AppView>>,
  setSelectedBin: React.Dispatch<React.SetStateAction<appType.BinInterface | undefined>>,
  setRecords: React.Dispatch<React.SetStateAction<appType.RecordWithDoc[]>>
) => {
  e.preventDefault()
  e.stopPropagation()
  const bin_id = e.currentTarget.dataset.binId
  if (!bin_id) throw new Error('goToBinPage: data-bin-id undefined on Open Basket button')
  const bin = await getBin(bin_id)
  setView('bins')
  setSelectedBin(bin)
  setRecords([]);
}

export const Modal = () => {
  const { setRecords } = useRecords()
  const { setView } = useViews()
  const { setSelectedBin, selectedBin } = useBins()
  if (selectedBin === undefined) throw new Error('In Modal component, selectedBin is undefined')
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => goToMainPage(e, setView)}
    >
      <div
        className="bg-white p-8 rounded-lg max-w-lg w-[90%] shadow-lg font-sans leading-relaxed text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="mb-4 text-lg font-semibold border-b border-gray-200 pb-2">
          Created
        </h1>
        <div>
          Bin '{selectedBin.id}' has been successfully created!
        </div>
        <div className="mt-2 p-2 bg-gray-100 rounded font-mono text-sm break-words">
          https://amazing-mostly-tadpole.ngrok-free.app/{selectedBin.id}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded border border-gray-300 bg-gray-100 text-sm hover:bg-gray-200"
            onClick={(e) => goToMainPage(e, setView)}
          >
            Close
          </button>
          <button
            className="px-4 py-2 rounded border border-blue-600 bg-blue-600 text-white text-sm hover:bg-blue-700"
            data-bin-id={selectedBin.id}
            onClick={(e) => goToBinPage(e, setView, setSelectedBin, setRecords)}
          >
            Open Bin
          </button>
        </div>
      </div>
    </div>
  );
};
