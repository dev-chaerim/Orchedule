import { create } from 'zustand';

interface User {
  name: string;
  part: string;
  email: string;
}

interface UserStore {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoggedIn: false,

  login: (user) =>
    set(() => ({
      user,
      isLoggedIn: true,
    })),

  logout: () =>
    set(() => ({
      user: null,
      isLoggedIn: false,
    })),
}));
