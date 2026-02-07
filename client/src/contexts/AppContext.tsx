import { BinsProvider } from "./BinsContext";
import { ViewProvider } from "./ViewContext";
import { RecordsProvider } from "./RecordsContext";
import { FlashProvider } from "./FlashContext";
import type { ReactNode } from "react";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ViewProvider>
      <BinsProvider>
        <RecordsProvider>
          <FlashProvider>
            {children}
          </FlashProvider>
        </RecordsProvider>
      </BinsProvider>
    </ViewProvider>
  )
}
