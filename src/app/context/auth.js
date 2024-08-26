"use client";

import React, { useState, useEffect, createContext } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [change, setChange] = useState(false);
  const [token,setToken] = useState("");

  useEffect(() => {
    setLoading(true);
    const storedUserToken =
      typeof window !== "undefined" ? localStorage.getItem("lb_token") : null;
    const storedUser =
      typeof window !== "undefined" ? localStorage.getItem("lib_user") : null;

    if (storedUser && storedUserToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedUserToken);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("lib_user");
      }
    }
    setLoading(false);
  }, []);

  const signin = async (email, password) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/account/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.error) {
          toast.error(data.error);
          return { success: false, error: data.error };
        }
        toast.success("Successfully logged in!");
        setUser(data.user_id);
        localStorage.setItem("lb_token", data.token);
        localStorage.setItem("lib_user", data.user_id);
        setToken(data.token);
        router.push("/dashboard", { scroll: false });
        return { success: true };
      } else {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Login failed" };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("lb_token");
  
    localStorage.removeItem("lb_token");
    localStorage.removeItem("lib_user");
    setUser(null);
  
    await fetch("http://127.0.0.1:8000/account/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          router.push("/auth/login", { scroll: false });
        } else {
          console.log("Failed to logout:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };
  
  const authInfo = {
    user,
    loading,
    signin,
    logout,
    change,
    setChange,
    token,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {/* <Toaster /> */}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
