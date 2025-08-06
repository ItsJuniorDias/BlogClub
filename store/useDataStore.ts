import { create } from "zustand";

type DataProps = {
  id: string;
  title: string;
  description: string;
  article: string;
  isLike: boolean;
  hours: number;
  numberLike: number;
  thumbnail: string;
  foreign_key: string;
  type: "technology" | "adventure" | "philosophy";
  createdAt: Date;
};

type DataStore = {
  data: DataProps;
  fetch: (item: DataProps) => void;
};

export const useDataStore = create<DataStore>((set) => ({
  data: {
    id: "",
    title: "",
    description: "",
    article: "",
    isLike: false,
    hours: 0,
    numberLike: 0,
    thumbnail: "",
    foreign_key: "",
    type: "technology",
    createdAt: new Date(),
  },
  fetch: (item: DataProps) => set(() => ({ data: item })),
}));
