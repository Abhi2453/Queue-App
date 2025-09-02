// src/components/ProviderRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const ProviderRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    const checkProvider = async () => {
      if (currentUser) {
        const docRef = doc(db, "providers", currentUser.uid);
        const docSnap = await getDoc(docRef);
        setIsProvider(docSnap.exists());
      }
      setIsLoading(false);
    };

    checkProvider();
  }, [currentUser]);

  if (isLoading) return <p>Loading...</p>;

  if (!currentUser) return <Navigate to="/provider-login" />;

  if (!isProvider) return <Navigate to="/not-authorized" />;

  return children;
};

export default ProviderRoute;
