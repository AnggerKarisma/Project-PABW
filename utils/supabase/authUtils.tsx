"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Create and Export AuthContext
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// Optional Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <div>
      {/* You could add a context provider here if you want to use React Context */}
      {!loading && children}
    </div>
  );
}

// Utility hooks for auth
export function useAuth() {
  const supabase = createClient();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  };

  return {
    signOut,
    getUser,
    supabase,
  };
}

// Protected route wrapper component
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/sign-in?redirect=" + window.location.pathname);
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [router, supabase]);

  if (isAuthenticated === null) {
    // Return loading state
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}

// Auth callback handler for OAuth
export function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Get the intended redirect URL from localStorage or default to dashboard
      const redirectTo = localStorage.getItem("redirectTo") || "/dashboard";
      localStorage.removeItem("redirectTo");

      if (session) {
        router.push(redirectTo);
      } else {
        router.push("/sign-in");
      }
    };

    handleAuthCallback();
  }, [router, supabase]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Mengautentikasi...</p>
    </div>
  );
}
