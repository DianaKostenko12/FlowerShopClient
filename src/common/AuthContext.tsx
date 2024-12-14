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
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const parsedToken = JSON.parse(atob(token.split(".")[1]));
          const role =
            parsedToken[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];
          console.log("role", role);

          setIsAuthorized(true);
          if (!!role) {
            console.log("role in if", role);
            setUserRole(role);
          }
        } catch (error) {
          console.error("Error parsing token:", error);
          setIsAuthorized(false);
          setUserRole(null);
        }
      } else {
        setIsAuthorized(false);
        setUserRole(null);
      }
    };

    checkToken(); // Перевірка при першому завантаженні

    window.addEventListener("storage", checkToken); // Відстежує зміни у localStorage
    return () => window.removeEventListener("storage", checkToken); // Очищення прослуховувача
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthorized, setIsAuthorized, userRole, setUserRole }}
    >
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
