import type { MouseEvent } from "react"
import { getBin, getBins, deleteBin, deleteRecords } from "../../services/webhookApi"
import type * as appType from "../../utils/types"
import type { BinPageHeaderProps } from "../../utils/types"
import { RiFileShredLine } from "react-icons/ri";
import { FcReuse } from "react-icons/fc";
import { useViews, useBins, useRecords } from "../../contexts";

const removeRecords = async (
  e: MouseEvent<HTMLElement>,
  selectedBin: appType.BinInterface,
  setView: React.Dispatch<React.SetStateAction<appType.AppView>>,
  setSelectedBin: React.Dispatch<React.SetStateAction<appType.BinInterface | undefined>>,
  setRecords: React.Dispatch<React.SetStateAction<appType.RecordWithDoc[]>>
) => {
  e.stopPropagation()
  if (!selectedBin.id) throw new Error('removeRecords: Error validating bin exists before deletiong its records')
  await deleteRecords(selectedBin.id)
  const bin = await getBin(selectedBin.id)
  setView('bins')
  setSelectedBin(bin)
  setRecords([]);
}

const removeBin = async (
  e: MouseEvent<HTMLElement>,
  setBins: React.Dispatch<React.SetStateAction<appType.BinInterface[]>>,
  selectedBin: appType.BinInterface,
  setView: React.Dispatch<React.SetStateAction<appType.AppView>>,
  setSelectedBin: React.Dispatch<React.SetStateAction<appType.BinInterface | undefined>>,
  setRecords: React.Dispatch<React.SetStateAction<appType.RecordWithDoc[]>>
) => {
  e.stopPropagation()
  if (!selectedBin.id) throw new Error('removeBin: Error checking validating bin exists before deletiong')
  await deleteBin(selectedBin.id)
  setView('home')
  setSelectedBin(undefined)
  setRecords([]);
  const bins = await getBins();
  setBins(bins);
}


const BinPageHeader = () => {
  const { setBins, selectedBin, setSelectedBin } = useBins()
  const { setView } = useViews()
  const { setRecords } = useRecords()

  if (selectedBin === undefined) throw new Error('In BinPageHeader: selectedBin is undefined')

  return (
    <div className="grid grid-cols-10 rounded-xl bg-white p-4 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
      <span className="col-start-1 col-end 4">
        <a
          className="text-xl text-gray-300 transition-all duration-200 ease-in-out hover:text-blue-500 hover:scale-110 hover:cursor-pointer"
          onClick={() => setView('home')}>Home</a>
      </span>
      <span className="col-start-9 col-end-9">
        <button onClick={(e) => removeRecords(e, selectedBin, setView, setSelectedBin, setRecords)}>
          <div className="relative group inline-block">
            <RiFileShredLine className="text-2xl text-gray-500 transition-all duration-200 ease-in-out hover:text-blue-500 hover:scale-110 cursor-pointer" />
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Delete Records
            </div>
          </div>
        </button>
      </span>
      <span className="col-start-10">
        <button onClick={(e) => removeBin(e, setBins, selectedBin, setView, setSelectedBin, setRecords)}>

          <div className="relative group inline-block">
            <FcReuse className="text-2xl text-yellow-400 transition-all duration-200 ease-in-out hover:text-blue-500 hover:scale-110 hover:cursor-pointer" />
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Delete Bin
            </div>
          </div>
        </button>
      </span>
    </div>
  )
}

export default BinPageHeader
