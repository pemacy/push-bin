import { createContext, useContext, useState, useCallback, useRef } from "react";
import type { ReactNode } from "react";

type FlashType = 'success' | 'error' | 'warning' | 'info'

interface FlashContextType {
  flashVisible: boolean
  flashMessage: string
  flashType: FlashType
  showFlash: (message: string, type?: FlashType, duration?: number) => void
  hideFlash: () => void
}

export const FlashContext = createContext<FlashContextType | undefined>(undefined)

export const FlashProvider = ({ children }: { children: ReactNode }) => {
  const [flashVisible, setFlashVisible] = useState<boolean>(false)
  const [flashMessage, setFlashMessage] = useState<string>('')
  const [flashType, setFlashType] = useState<FlashType>('success')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hideFlash = useCallback(() => {
    setFlashVisible(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const showFlash = useCallback((message: string, type: FlashType = 'success', duration: number = 5000) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setFlashMessage(message)
    setFlashType(type)
    setFlashVisible(true)

    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        setFlashVisible(false)
      }, duration)
    }
  }, [])

  return (
    <FlashContext.Provider value={{ flashVisible, flashMessage, flashType, showFlash, hideFlash }}>
      {children}
    </FlashContext.Provider>
  )
}

export const useFlash = () => {
  const context = useContext(FlashContext)
  if (!context) throw new Error('useFlash must be used in a FlashProvider')
  return context
}
