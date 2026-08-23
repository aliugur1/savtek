import { useEffect, useMemo, useState } from "react";
import { hasSupabaseEnv, supabase } from "../lib/supabaseClient";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoRole, setDemoRole] = useState(() => {
    try {
      return localStorage.getItem("savtek-demo-role") || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncDemoRole = () => {
      try {
        setDemoRole(localStorage.getItem("savtek-demo-role") || null);
      } catch {
        setDemoRole(null);
      }
    };

    window.addEventListener("storage", syncDemoRole);
    window.addEventListener("savtek-auth", syncDemoRole);
    return () => {
      window.removeEventListener("storage", syncDemoRole);
      window.removeEventListener("savtek-auth", syncDemoRole);
    };
  }, []);

  useEffect(() => {
    if (!hasSupabaseEnv || !supabase) {
      setSession(null);
      setUser(demoRole === "admin" ? { id: "local", email: "admin@local" } : null);
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          setSession(null);
          setUser(null);
        } else {
          setSession(data.session ?? null);
          setUser(data.session?.user ?? null);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setSession(null);
        setUser(null);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [demoRole]);

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      hasSupabaseEnv,
      demoRole,
      signInWithPassword: (email, password) => {
        if (!supabase) {
          const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;
          if (adminPass && password === adminPass) {
            localStorage.setItem("savtek-demo-role", "admin");
            window.dispatchEvent(new Event("savtek-auth"));
            return Promise.resolve({ data: { user: { id: "local", email }, session: {} }, error: null });
          }
          return Promise.resolve({ data: null, error: new Error("Hatalı e-posta veya şifre.") });
        }
        return supabase.auth.signInWithPassword({ email, password });
      },
      clearDemoSession: () => {
        try {
          localStorage.removeItem("savtek-demo-role");
          window.dispatchEvent(new Event("savtek-auth"));
        } catch {
          // ignore
        }
      },
      signOut: () => {
        if (!supabase) {
          return Promise.resolve({ error: null });
        }
        return supabase.auth.signOut();
      },
    }),
    [demoRole, loading, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
