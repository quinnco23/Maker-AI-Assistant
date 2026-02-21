import { createContext, useContext, useState } from "react";

type Role = "member" | "admin";

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  plainLanguage: boolean;
  togglePlainLanguage: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("member");
  const [plainLanguage, setPlainLanguage] = useState(false);

  const togglePlainLanguage = () => setPlainLanguage((v) => !v);

  return (
    <AppContext.Provider value={{ role, setRole, plainLanguage, togglePlainLanguage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
