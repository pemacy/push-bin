import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { RecordWithDoc, RecordsContextType } from '../utils/types'

const RecordsContext = createContext<RecordsContextType | undefined>(undefined)

export const RecordsProvider = ({ children }: { children: ReactNode }) => {
  const [records, setRecords] = useState<RecordWithDoc[]>([])

  return (
    <RecordsContext.Provider value={{ records, setRecords }}>
      {children}
    </RecordsContext.Provider>

  )
}

export const useRecords = () => {
  const context = useContext(RecordsContext)
  if (!context) {
    throw new Error('useRecords must be with a Records Provider')
  }
  return context
}
