import { useEffect, useState } from "react";
import { getSessionAction, logoutAction } from "@/src/lib/actions/auth";

export const useRequireRole = (requiredRole?: 'admin' | 'users') => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const session = await getSessionAction();
        if (!session) {
          window.location.href = '/auth';
          return;
        }

        if (requiredRole && session.role !== requiredRole) {
          if (session.role === 'admin') {
            window.location.href = '/admin/home';
          } else {
            window.location.href = '/user/home';
          }
          return;
        }

        setLoading(false);
      } catch {
        window.location.href = '/auth';
      }
    };

    checkAccess();
  }, [requiredRole]);

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = '/auth';
  };

  return { loading, handleLogout };
};
