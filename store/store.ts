import { create } from "zustand";

type DataStore = {
  data: {
    title: string;
    description: string;
    article: string;
    isLike: boolean;
    hours: number;
    numberLike: number;
    thumbnail: string;
  };
  fetch: (item: {}) => void;
};

export const useDataStore = create<DataStore>((set) => ({
  data: {
    title: "",
    description: "",
    article: "",
    isLike: false,
    hours: 0,
    numberLike: 0,
    thumbnail: "",
  },
  fetch: (item) => set(() => ({ data: item })),
}));
