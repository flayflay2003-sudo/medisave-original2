import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "pharmacy" | "doctor" | "importer" | "producer" | "wholesaler" | "citizen" | "admin";

export interface User {
  email: string;
  name: string;
  role: Role;
  wilaya?: string;
  status: "pending" | "approved";
  plan: "basic" | "silver" | "gold";
  trustScore: number;
  verified: boolean;
}

interface AuthCtx {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  setUser: (u: User) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const KEY = "medisave.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as User) : null;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  }, [user]);

  return (
    <Ctx.Provider
      value={{
        user,
        login: (u) => setUserState(u),
        logout: () => setUserState(null),
        setUser: (u) => setUserState(u),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("AuthProvider missing");
  return c;
}
