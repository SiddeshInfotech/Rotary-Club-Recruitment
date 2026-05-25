import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = sessionStorage.getItem("eqhire_user");
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState(() => {
        return sessionStorage.getItem("eqhire_token") || null;
    });

    useEffect(() => {
        if (user) {
            sessionStorage.setItem("eqhire_user", JSON.stringify(user));
        } else {
            sessionStorage.removeItem("eqhire_user");
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            sessionStorage.setItem("eqhire_token", token);
        } else {
            sessionStorage.removeItem("eqhire_token");
        }
    }, [token]);

    const login = (userData, authToken) => {
        setUser(userData);
        if (authToken) setToken(authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
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
