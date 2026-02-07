import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";
import type { BinsContextType, BinInterface } from "../utils/types";

export const BinsContext = createContext<BinsContextType | undefined>(undefined)

export const BinsProvider = ({ children }: { children: ReactNode }) => {
  const [bins, setBins] = useState<BinInterface[]>([]);
  const [selectedBin, setSelectedBin] = useState<BinInterface | undefined>();

  return (
    <BinsContext.Provider value={{ bins, setBins, selectedBin, setSelectedBin }}>
      {children}
    </BinsContext.Provider>
  )
}

export const useBins = () => {
  const context = useContext(BinsContext)
  if (!context) {
    throw new Error('useBins must be used with a BinsProvider')
  }
  return context
}
