import React, { useState } from "react";
import UserRegister from "./UserRegister";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

const UserLogin = () => {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEmailError, setLoginEmailError] = useState("");

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      setLoginEmailError("Invalid email format.");
      return false;
    }
    if (loginPassword.length < 6) {
      setLoginEmailError("Password should be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginEmailError("");
    if (!validateForm()) return;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        setLoginEmailError("Please verify your email before logging in.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          createdAt: new Date().toISOString(),
        });
      }

      console.log("success");
      navigate("/user-dashboard");
    } catch (err) {
      setLoginEmailError(err.message);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <a href="/" className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-black hover:underline">
                  QueueApp
                </h1>
              </a>

              {/* Desktop Menu */}
              <div className="hidden md:flex md:space-x-8">
                <a
                  href="/"
                  className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                >
                  Home
                </a>
                <a
                  href="/about"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600"
                >
                  About
                </a>
              </div>

              {/* Mobile Toggle (SVG icons) */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="text-gray-800 focus:outline-none"
                >
                  {mobileOpen ? (
                    // Close Icon (×)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    // Hamburger Icon (≡)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow">
              <a
                href="#"
                className="block text-sm font-medium text-gray-900 hover:text-indigo-600"
              >
                Home
              </a>
              <a
                href="#"
                className="block text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                About
              </a>
            </div>
          )}
        </nav>

        <div className="pt-16 pb-12 flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-md mt-8">
            {/* Login Form */}
            <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Login
              </h2>
              <form onSubmit={handleLogin}>
                <div className="mb-6">
                  <label
                    htmlFor="login-email"
                    className="block text-gray-700 text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    className={`w-full px-4 py-2 border ${
                      loginEmailError ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                    }}
                  />
                  {loginEmailError && (
                    <p className="mt-1 text-xs text-red-500">
                      {loginEmailError}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="login-password"
                      className="block text-gray-700 text-sm font-medium"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      <i
                        className={`fas ${
                          showLoginPassword ? "fa-eye-slash" : "fa-eye"
                        } text-gray-400`}
                      ></i>
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <a
                      href="/user-forgot-password"
                      className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>
                <div className="mb-6">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
            <UserRegister></UserRegister>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
