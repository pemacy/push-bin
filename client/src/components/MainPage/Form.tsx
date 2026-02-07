import * as webhookApi from '../../services/webhookApi'
import { v4 as uuidv4 } from 'uuid'
import type { FormEvent } from "react"
import type { BinInterface, AppView } from '../../utils/types'
import { useBins, useViews } from '../../contexts'

const handleOnSubmit = async (
  e: FormEvent<HTMLFormElement>,
  setBins: React.Dispatch<React.SetStateAction<BinInterface[]>>,
  setSelectedBin: React.Dispatch<React.SetStateAction<BinInterface | undefined>>,
  setView: React.Dispatch<React.SetStateAction<AppView>>
) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const inputValue = String(formData.get('bin_id'))
  const inputElement = e.currentTarget.elements.namedItem("bin_id") as HTMLInputElement;
  const placeholder = inputElement.placeholder;
  const bin_id = inputValue.trim() || placeholder;
  try {
    const newBin = await webhookApi.createBin(bin_id)
    if (!newBin) throw new Error('Form handleOnSubmit: api returned undefined')
    setView('modal')
    setSelectedBin(newBin)
    setBins((prev) => [...prev, newBin])
  } catch (err) {
    alert('An error occurred with that bin id, try another')
  }
}

export const Form = () => {
  const { setBins, setSelectedBin } = useBins()
  const { setView } = useViews()

  const bin_id = uuidv4().slice(0, 7);

  return (
    <form
      onSubmit={(e) => handleOnSubmit(e, setBins, setSelectedBin, setView)}
      className="max-w-md bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md space-y-4 mx-auto"
    >
      <fieldset className="flex flex-col space-y-1">
        <label htmlFor="bin_id" className="text-sm font-medium text-gray-300">
          Bin Name
        </label>
        <input
          type="text"
          placeholder={bin_id}
          defaultValue=''
          name="bin_id"
          className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-600"
        />
      </fieldset>
      <button
        type="submit"
        className="w-full py-2 bg-sky-700 hover:bg-sky-600 rounded-md font-medium transition"
      >
        Create New Bin
      </button>
    </form>
  );
};
