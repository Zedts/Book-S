import { useRouter } from "next/navigation";
import { getSessionAction } from "@/src/lib/actions/auth";
import { useState, useEffect } from "react";

export const useAuthNavigation = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Periksa sesi hanya saat render (atau di-trigger)
  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      try {
        const session = await getSessionAction();
        if (isMounted && session) {
          setUserRole(session.role);
        }
      } catch (err) {
        console.error("Session check error", err);
      } finally {
        if (isMounted) setIsCheckingSession(false);
      }
    };
    checkSession();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const authPath = userRole === "admin" ? "/admin/home" : (userRole === "users" ? "/user/home" : "/auth");

  const handleAuthNavigation = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isNavigating) return;
    
    // Fallback if session is still checking, but user clicks
    if (isCheckingSession) {
      setIsNavigating(true);
      try {
        const currentSession = await getSessionAction();
        if (currentSession) {
          router.push(currentSession.role === "admin" ? "/admin/home" : "/user/home");
        } else {
          router.push("/auth");
        }
      } catch {
        router.push("/auth");
      } finally {
        setIsNavigating(false);
      }
      return;
    }

    router.push(authPath);
  };

  return { userRole, isCheckingSession, authPath, handleAuthNavigation, isNavigating };
};
