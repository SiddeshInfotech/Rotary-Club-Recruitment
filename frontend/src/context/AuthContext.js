import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const remembered = localStorage.getItem("eqhire_user");
        if (remembered) return JSON.parse(remembered);
        const saved = sessionStorage.getItem("eqhire_user");
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("eqhire_token") || sessionStorage.getItem("eqhire_token") || null;
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

    useEffect(() => {
        if (token) {
            if (rememberMe) {
                localStorage.setItem("eqhire_token", token);
                sessionStorage.removeItem("eqhire_token");
            } else {
                sessionStorage.setItem("eqhire_token", token);
                localStorage.removeItem("eqhire_token");
            }
        } else {
            localStorage.removeItem("eqhire_token");
            sessionStorage.removeItem("eqhire_token");
        }
    }, [token, rememberMe]);

    const login = (userData, authToken, remember = false) => {
        setRememberMe(remember);
        setUser(userData);
        if (authToken) setToken(authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setRememberMe(false);
        localStorage.removeItem("eqhire_user");
        localStorage.removeItem("eqhire_token");
        localStorage.removeItem("eqhire_remembered_email");
        sessionStorage.removeItem("eqhire_user");
        sessionStorage.removeItem("eqhire_token");
    };

    const updateUser = (updates) => {
        setUser((prev) => (prev ? { ...prev, ...updates } : null));
    };

    const isAuthenticated = !!user && !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
