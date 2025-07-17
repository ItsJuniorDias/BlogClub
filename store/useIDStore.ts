import { create } from "zustand";

type UIDProps = {
  uid: string;
};

type DataStore = {
  data: UIDProps;
  fetch: (item: UIDProps) => void;
};

export const useIUDStore = create<DataStore>((set) => ({
  data: {
    uid: "",
  },
  fetch: (item: UIDProps) => set(() => ({ data: item })),
}));
