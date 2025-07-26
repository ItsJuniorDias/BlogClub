import { create } from "zustand";

type UserProps = {
  id: string;
  name: string;
  email: string;
  thumbnail: string;
};

type DataStore = {
  data: UserProps;
  fetch: (item: UserProps) => void;
};

export const useUserStore = create<DataStore>((set) => ({
  data: {
    id: "",
    name: "",
    email: "",
    thumbnail: "",
  },
  fetch: (item: UserProps) => set(() => ({ data: item })),
}));
