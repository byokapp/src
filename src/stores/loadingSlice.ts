import { StateCreator } from 'zustand';

export interface LoadingSlice {
  isLoading: boolean;
  setIsLoading: (l: boolean) => void;
}
export const createLoadingSlice: StateCreator<LoadingSlice> = (set) => ({
  isLoading: false,
  setIsLoading: (l: boolean) => set(() => ({ isLoading: l })),
});
