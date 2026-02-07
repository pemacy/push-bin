import { IoClose } from 'react-icons/io5'
import { useFlash } from '../contexts'

const FlashMessage = () => {
  const { flashVisible, flashMessage, flashType, hideFlash } = useFlash()

  if (!flashVisible) return null

  const styles = {
    success: 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-400 dark:text-green-300',
    error: 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-300',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-400 dark:text-yellow-300',
    info: 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300',
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`
        flex items-center justify-between
        px-4 py-3 rounded-lg border-l-4 shadow-md
        min-w-[300px] max-w-md
        ${styles[flashType]}
      `}>
        <span className="text-sm font-medium">{flashMessage}</span>
        <button
          onClick={hideFlash}
          className="ml-4 p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Close"
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default FlashMessage
