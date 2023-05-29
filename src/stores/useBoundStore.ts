import { create } from 'zustand';
import { AppStateSlice, createAppStateSlice } from './appStateSlice';
import { LoadingSlice, createLoadingSlice } from './loadingSlice';

export const useBoundStore = create<LoadingSlice & AppStateSlice>((...a) => ({
  ...createLoadingSlice(...a),
  ...createAppStateSlice(...a),
}));
