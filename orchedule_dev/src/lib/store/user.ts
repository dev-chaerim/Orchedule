import { create } from "zustand";

export type User = {
  id: string;  // ✅ 사용자 ID 추가
  name: string;
  part: string;
  email: string;
  role?: "user" | "admin"; // ✅ 선택적 role 추가
};

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
