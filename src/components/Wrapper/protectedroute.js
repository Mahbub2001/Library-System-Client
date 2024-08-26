"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const withProtectedRoute = (WrappedComponent) => {
  const WithAuthProtection = (props) => {
    const user = typeof window !== "undefined" ? localStorage.getItem("lib_user") : null;
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      setIsLoading(true);
      if (user === null) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }, [user, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthProtection.displayName = `WithProtectedRoute(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithAuthProtection;
};

export default withProtectedRoute;
