import React, { useState } from "react";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const ProvForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const checkEmailInFirestore = async (email) => {
    const usersRef = collection(db, "providers");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);
    return !snapshot.empty; // true if user exists
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      const exists = await checkEmailInFirestore(email);
      if (!exists) {
        setError("Email is not registered.");
        return;
      }

      await sendPasswordResetEmail(auth, email);
      alert("Password Reset Link Sent Successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forgot Password-Provider
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w">
          Enter your email address
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-circle text-red-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-check-circle text-green-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{message}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400 text-sm"></i>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="!rounded-button whitespace-nowrap w-full flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Password
              </button>
            </div>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Remember your password?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/prov-login"
                className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    // <form onSubmit={handleResetPassword}>
    //   <h2>Forgot Password</h2>

    //   <input
    //     type="email"
    //     placeholder="Enter your registered email"
    //     value={email}
    //     onChange={(e) => setEmail(e.target.value)}
    //     required
    //   />

    //   <button type="submit">Reset Password</button>

    //   {message && <p style={{ color: "green" }}>{message}</p>}
    //   {error && <p style={{ color: "red" }}>{error}</p>}
    // </form>
  );
};

export default ProvForgotPassword;
