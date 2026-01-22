import { createContext } from 'react'
import type { useQuickerTreeSelectData } from '../hooks/use-quicker-tree-select-data'

export const DataWithStateContext = createContext<ReturnType<typeof useQuickerTreeSelectData> | null>(null)
