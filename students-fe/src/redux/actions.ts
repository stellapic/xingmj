import { SETTOKEN } from "./constant";
export const createSetTokenAction = (data: string) => ({ type: SETTOKEN, data });
