import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export const useRequireRole = (requiredRole?: 'admin' | 'user') => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser();
        if (!userRes.user) {
          window.location.href = '/auth';
          return;
        }

        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', userRes.user.id)
          .single();

        if (requiredRole === 'admin' && userData?.role !== 'admin') {
          window.location.href = '/user/home';
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
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  return { loading, handleLogout };
};
