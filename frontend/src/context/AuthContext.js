import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("eqhire_user") || sessionStorage.getItem("eqhire_user");
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("eqhire_token") || sessionStorage.getItem("eqhire_token") || null;
    });

    const [isPersistent, setIsPersistent] = useState(() => {
        return !!localStorage.getItem("eqhire_token");
    });

    useEffect(() => {
        if (user) {
            if (isPersistent) {
                localStorage.setItem("eqhire_user", JSON.stringify(user));
            } else {
                sessionStorage.setItem("eqhire_user", JSON.stringify(user));
            }
        } else {
            localStorage.removeItem("eqhire_user");
            sessionStorage.removeItem("eqhire_user");
        }
    }, [user, isPersistent]);

    useEffect(() => {
        if (token) {
            if (isPersistent) {
                localStorage.setItem("eqhire_token", token);
            } else {
                sessionStorage.setItem("eqhire_token", token);
            }
        } else {
            localStorage.removeItem("eqhire_token");
            sessionStorage.removeItem("eqhire_token");
        }
    }, [token, isPersistent]);

    const login = (userData, authToken, rememberMe = false) => {
        // Clear conflicting previous stores
        if (rememberMe) {
            sessionStorage.removeItem("eqhire_user");
            sessionStorage.removeItem("eqhire_token");
        } else {
            localStorage.removeItem("eqhire_user");
            localStorage.removeItem("eqhire_token");
        }
        
        setIsPersistent(rememberMe);
        setUser(userData);
        if (authToken) setToken(authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsPersistent(false);
        localStorage.removeItem("eqhire_user");
        localStorage.removeItem("eqhire_token");
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
