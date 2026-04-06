import { useState } from "react";
import { loginAction, registerAction } from "@/src/lib/actions/auth";

export const useAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!captchaToken) {
      setError("Silakan centang reCAPTCHA untuk memverifikasi bahwa Anda bukan robot.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('captchaToken', captchaToken);
      
      let res;
      if (isLogin) {
        res = await loginAction(formData);
      } else {
        formData.append('fullName', fullName);
        formData.append('phone', phone);
        res = await registerAction(formData);
      }

      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      if (res.success && res.role) {
        // Routing logic based on role
        if (res.role === 'admin') {
          window.location.href = '/admin/home';
        } else {
          window.location.href = '/user/home';
        }
      }
    } catch {
      setError('Terjadi kesalahan yang tidak terduga pada server.');
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFullName("");
    setPhone("");
    setCaptchaToken(null);
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
    captchaToken,
    setCaptchaToken,
    error,
    loading,
    handleSubmit,
    toggleMode
  };
};
