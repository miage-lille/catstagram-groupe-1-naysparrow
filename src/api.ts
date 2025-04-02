import { Picture } from "./types/picture.type";

export const loading = (): Picture[] => []; 
export const success = (payload: unknown): Picture[] => payload as Picture[];
export const failure = (error: string): Picture[] => []; 