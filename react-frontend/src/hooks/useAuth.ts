import { useMemo } from "react";

export type UserRole = "cliente" | "trabajador" | "administrador";

export interface User {
  email: string;
  role: UserRole;
  name?: string;
}

interface UseAuth {
  user: User | null | undefined; // ← undefined mientras no leemos token
  role: UserRole | null | undefined;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuth = (): UseAuth => {
  const raw = localStorage.getItem("token");

  const { user, role } = useMemo(() => {
    if (!raw) return { user: null, role: null };
    try {
      const payload = JSON.parse(atob(raw.split(".")[1])) as Record<
        string,
        any
      >;
      const role = payload.groups?.[0] as UserRole;
      return {
        user: { email: payload.upn, role, name: payload.name },
        role,
      };
    } catch {
      return { user: null, role: null };
    }
  }, [raw]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    window.dispatchEvent(new Event("auth"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth"));
  };

  return { user, role, login, logout };
};
