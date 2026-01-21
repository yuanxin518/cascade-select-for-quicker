import { createContext } from "react";

/** 触发一个事件，携带字符串 */
export const TriggerEventsContext = createContext<((toStringValue: string) => void)>(() => { })