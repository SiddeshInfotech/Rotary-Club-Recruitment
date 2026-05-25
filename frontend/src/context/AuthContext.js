import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        // Check localStorage first (remembered), then sessionStorage (session-only)
        const remembered = localStorage.getItem("eqhire_user");
        if (remembered) return JSON.parse(remembered);
        const session = sessionStorage.getItem("eqhire_user");
        if (session) return JSON.parse(session);
        return null;
    });

    const [rememberMe, setRememberMe] = useState(() => {
        return !!localStorage.getItem("eqhire_user");
    });

    useEffect(() => {
        if (user) {
            const data = JSON.stringify(user);
            if (rememberMe) {
                localStorage.setItem("eqhire_user", data);
                sessionStorage.removeItem("eqhire_user");
            } else {
                sessionStorage.setItem("eqhire_user", data);
                localStorage.removeItem("eqhire_user");
            }
        } else {
            localStorage.removeItem("eqhire_user");
            sessionStorage.removeItem("eqhire_user");
        }
    }, [user, rememberMe]);

    const login = (userData, remember = false) => {
        setRememberMe(remember);
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        setRememberMe(false);
        localStorage.removeItem("eqhire_user");
        sessionStorage.removeItem("eqhire_user");
    };

    const updateUser = (updates) => {
        setUser((prev) => (prev ? { ...prev, ...updates } : null));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
