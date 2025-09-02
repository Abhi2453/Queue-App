import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const ProvRegister = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    businessName: "",
    serviceType: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { email, password, businessName, serviceType } = formData;

    if (!email || !password || !businessName || !serviceType) {
      setError("All fields are required.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "providers", user.uid), {
        uid: user.uid,
        email,
        businessName,
        serviceType,
        createdAt: new Date().toISOString(),
      });

      setMessage(
        "Account created. Please verify your email before logging in."
      );
      setFormData({
        email: "",
        password: "",
        businessName: "",
        serviceType: "",
      });
      navigate("/prov-login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Want to provide service?
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
            name="email"
            type="email"
            className={`w-full px-4 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showRegisterPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
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
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Bussiness Name
          </label>
          <input
            name="businessName"
            type="text"
            className={`w-full px-4 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
            placeholder="Enter Your Bussiness Name"
            value={formData.businessName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Service Type
          </label>
          <input
            name="serviceType"
            type="text"
            className={`w-full px-4 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
            placeholder="Enter Your Service Type"
            value={formData.serviceType}
            onChange={handleChange}
            required
          />
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

export default ProvRegister;
