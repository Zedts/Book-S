import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

export const useAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
            }
          }
        });
        if (signUpError) throw signUpError;
      }

      // Fetch user role
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) throw new Error("Terjadi kesalahan saat mengambil data pengguna.");

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userRes.user.id)
        .single();
        
      if (userError) throw userError;

      // Routing logic based on role
      if (userData?.role === 'admin') {
        window.location.href = '/admin/home';
      } else {
        window.location.href = '/user/home';
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan, silahkan coba lagi.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFullName("");
    setPhone("");
  };

  return {
    isLogin,
    showPassword,
    setShowPassword,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    phone,
    setPhone,
    error,
    loading,
    handleSubmit,
    toggleMode
  };
};
