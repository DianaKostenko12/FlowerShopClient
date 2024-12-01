import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthorized: boolean;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("jwtToken");
      setIsAuthorized(!!token); // Перетворює значення в булеве
    };

    checkToken(); // Перевірка при першому завантаженні

    window.addEventListener("storage", checkToken); // Відстежує зміни у localStorage
    return () => window.removeEventListener("storage", checkToken); // Очищення прослуховувача
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthorized, setIsAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
