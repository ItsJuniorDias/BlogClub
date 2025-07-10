import { create } from "zustand";

type DataProps = {
  title: string;
  description: string;
  article: string;
  isLike: boolean;
  hours: number;
  numberLike: number;
  thumbnail: string;
};

type DataStore = {
  data: DataProps;
  fetch: (item: DataProps) => void;
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
  fetch: (item: DataProps) => set(() => ({ data: item })),
}));
