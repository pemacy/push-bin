import { createContext, useState, useContext } from "react";
import type { ViewContextType, AppView } from "../utils/types";
import type { ReactNode } from "react";

export const ViewContext = createContext<ViewContextType | undefined>(undefined)

export const ViewProvider = ({ children }: { children: ReactNode }) => {
  const [view, setView] = useState<AppView>('home'); // controls which components are visible

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  )
}

export const useViews = () => {
  const context = useContext(ViewContext)
  if (!context) {
    throw new Error('useView must be used with a ViewContext')
  }
  return context
}
