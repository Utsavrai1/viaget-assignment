import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/constants/index";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/zustand/auth";

export const useRegister = () => {
  const { toast } = useToast();
  const { setToken } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/register`, {
        name,
        email,
        password,
      });
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      toast({
        title: "Registered Successful",
        description: "You have successfully registered.",
      });
    } catch (err) {
      toast({
        title: "Registration Error",
        description: "Registration failed. Please try again",
        variant: "destructive",
      });
      setError("Registration failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
