import { create } from "zustand";

type UserProps = {
  name: string;
  email: string;
};

type DataStore = {
  data: UserProps;
  fetch: (item: UserProps) => void;
};

export const useUserStore = create<DataStore>((set) => ({
  data: {
    name: "",
    email: "",
  },
  fetch: (item: UserProps) => set(() => ({ data: item })),
}));
