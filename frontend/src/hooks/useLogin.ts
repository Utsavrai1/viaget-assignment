import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/constants/index";
import { useToast } from "./use-toast";
import { useAuthStore } from "@/zustand/auth";

export const useLogin = () => {
  const { toast } = useToast();
  const { setToken } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, {
        email,
        password,
      });
      setToken(response.data.token);

      localStorage.setItem("token", response.data.token);
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });

      return response.data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Login failed. Please check your credentials.",
        variant: "destructive",
      });
      setError("Login failed. Please check your credentials.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
