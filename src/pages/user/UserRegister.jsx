import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

const UserRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateForm()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send email verification
      await sendEmailVerification(userCredential.user);
      setMessage("Signup successful! Check your email for verification.");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Register
      </h2>
      <form onSubmit={handleSignup}>
        <div className="mb-6">
          <label
            htmlFor="register-email"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Email Address
          </label>
          <input
            id="register-email"
            type="email"
            className={`w-full px-4 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
        <div className="mb-6">
          <label
            htmlFor="register-password"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showRegisterPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
            >
              <i
                className={`fas ${
                  showRegisterPassword ? "fa-eye-slash" : "fa-eye"
                } text-gray-400`}
              ></i>
            </button>
          </div>
        </div>
        <div className="mb-6">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer"
          >
            Register
          </button>
        </div>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default UserRegister;
