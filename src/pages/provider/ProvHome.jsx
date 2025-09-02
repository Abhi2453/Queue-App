import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "tailwindcss";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
// import { calculateCurrentToken } from "../../components/token";
import apData from "../../data/andhraPradesh.json";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const ProvHome = () => {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/prov-login");
      }

      const uid = user.uid;

      const providerDocRef = doc(db, "providers", uid);

      const providerSnap = await getDoc(providerDocRef);
      if (!providerSnap.exists()) {
        navigate("/prov-login");
      }
      setUserEmail(user.email);
    });

    return () => unsubscribe(); 
  }, [navigate]);

  const { currentUser } = useAuth();
  const [services, setServices] = useState([]);
  const [providerInfo, setProviderInfo] = useState(null); 

  const [formData, setFormData] = useState({
    state: "Andhra Pradesh",
    district: "",
    mandal: "",
    place: "",
    tokenTime: 5,
  });

  const providerId = currentUser?.uid;
  const serviceRef = collection(db, `providers/${providerId}/services`);

  const fetchServices = async () => {
    const querySnapshot = await getDocs(serviceRef);
    const fetchedServices = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setServices(fetchedServices);
  };

  const fetchProviderInfo = async () => {
    if (!providerId) return;
    const providerDoc = await getDoc(doc(db, "providers", providerId));
    if (providerDoc.exists()) {
      setProviderInfo(providerDoc.data());
    }
  };

  useEffect(() => {
    if (providerId) {
      fetchServices();
      fetchProviderInfo();
    }
  }, [providerId]);

  useEffect(() => {
    if (!services.length) return;

    const interval = setInterval(() => {
      services.forEach(async (service) => {
        if (service.active && !service.paused && service.remTokens > 0) {
          const now = Date.now();
          const start = new Date(service.tokenStartTime).getTime();
          const elapsedMins = Math.floor((now - start) / (1000 * 60));

          const tokensPassed = Math.floor(elapsedMins / service.tokenTime);

          if (tokensPassed > 0) {
            const newCurrentToken = service.currentToken + tokensPassed;
            const newTotalTokens = service.remTokens - tokensPassed;

            const updatedCurrentToken =
              newTotalTokens <= 0 ? 0 : newCurrentToken;
            const updatedTotalTokens = Math.max(newTotalTokens, 0);

            const nowISO = new Date().toISOString();
            const recTotalTokens = service.totalTokens;
            await updateDoc(doc(serviceRef, service.id), {
              currentToken: updatedCurrentToken,
              remTokens: updatedTotalTokens,
              totalTokens: updatedTotalTokens == 0 ? 0 : recTotalTokens,
              tokenStartTime: updatedTotalTokens > 0 ? nowISO : null,
            });

            
            setServices((prev) =>
              prev.map((s) =>
                s.id === service.id
                  ? {
                      ...s,
                      currentToken: updatedCurrentToken,
                      remTokens: updatedTotalTokens,
                      totalTokens: updatedTotalTokens == 0 ? 0 : recTotalTokens,
                      tokenStartTime: updatedTotalTokens > 0 ? nowISO : null,
                    }
                  : s
              )
            );
          }
        } else {
          await updateDoc(doc(serviceRef, service.id), {
            active: false,
          });
        }
      });
    }, 60000); // every 1 minute

    return () => clearInterval(interval);
  }, [services]);

  const districts = apData.districts.map((d) => d.district);

  const selectedDistrictObj = apData.districts.find(
    (d) => d.district === formData.district
  );
  const mandals = selectedDistrictObj
    ? selectedDistrictObj.subDistricts.map((sd) => sd.subDistrict)
    : [];

  const selectedMandalObj = selectedDistrictObj?.subDistricts.find(
    (sd) => sd.subDistrict === formData.mandal
  );
  const places = selectedMandalObj ? selectedMandalObj.villages : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "tokenTime" ? (value === "" ? "" : parseInt(value)) : value,
    }));
  };

  const handleDistrictChange = (e) => {
    setFormData({
      ...formData,
      district: e.target.value,
      mandal: "",
      place: "",
    });
  };

  const handleMandalChange = (e) => {
    setFormData({ ...formData, mandal: e.target.value, place: "" });
  };
  const { district, mandal, place, tokenTime } = formData;
  const addService = async () => {
    if (!providerInfo) return;
    console.log(district, mandal, place, tokenTime);
    if (!district || !mandal || !place || !tokenTime) {
      alert("Please fill all fields");
      return;
    }
    const nowISO = new Date().toISOString();
    const newService = {
      ...formData,
      bussinessName: providerInfo.businessName || "",
      serviceType: providerInfo.serviceType || "",
      tokenTime: parseInt(formData.tokenTime),
      active: true,
      paused: false,
      currentToken: 0,
      tokenStartTime: nowISO,
      totalTokens: 0,
      remTokens: 0,
      createdAt: nowISO,
    };

    try {
      const docRef = await addDoc(serviceRef, newService);
      setServices([...services, { ...newService, id: docRef.id }]);
      setFormData({
        state: "Andhra Pradesh",
        district: "",
        mandal: "",
        place: "",
        tokenTime: 5,
      });
    } catch (err) {
      console.error("Error adding service: ", err);
    }
  };

  // const toggleField = async (id, field) => {
  //   const service = services.find((s) => s.id === id);
  //   const newValue = !service[field];

  //   // Update Firestore
  //   await updateDoc(doc(serviceRef, id), {
  //     [field]: newValue,
  //     createdAt: newValue ? serverTimestamp() : null,
  //   });
  // };

  const toggleField = async (id, field) => {
    const service = services.find((s) => s.id === id);
    const newValue = !service[field]; 

    
    const updateData = { [field]: newValue };

   
    if (
      (field === "active" && newValue === true) ||
      (field === "paused" && newValue === false)
    ) {
      updateData.tokenStartTime = serverTimestamp();
    }

    // Update Firestore
    await updateDoc(doc(serviceRef, id), updateData);

   
    const updated = {
      ...service,
      [field]: newValue,
      tokenStartTime: newValue
        ? new Date().toISOString()
        : service.tokenStartTime, 
    };

    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const deleteService = async (id) => {
    await deleteDoc(doc(serviceRef, id));
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      console.log("Provider logged out successfully.");
      
      window.location.href = "/prov-login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-10 flex items-center justify-between bg-white shadow-sm p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-solid fa-user text-blue-600 text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Provider Dashboard
              </h1>
              <p className="text-sm text-gray-600">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to logout?")) {
                handleLogout();
              }
            }}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center space-x-2 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </header>
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Add New Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <div className="relative">
                <select
                  value={formData.district}
                  onChange={handleDistrictChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mandal
              </label>
              <div className="relative">
                <select
                  value={formData.mandal}
                  onChange={handleMandalChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Select Mandal</option>
                  {mandals.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Place
              </label>
              <div className="relative">
                <select
                  value={formData.place}
                  onChange={(e) =>
                    setFormData({ ...formData, place: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Select Place</option>
                  {places.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time per Token (minutes)
              </label>
              <input
                name="tokenTime"
                type="number"
                placeholder="Token time (min)"
                value={formData.tokenTime ?? ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={addService}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
            >
              Add Service
            </button>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Your Services
          </h2>

          {services.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">
                You haven't added any services yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {service.businessName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {service.serviceType}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            service.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {service.active ? "Active" : "Stopped"}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            service.paused
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {service.paused ? "Paused" : "Running"}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span>{" "}
                        {service.state}, {service.district}, {service.mandal},{" "}
                        {service.place}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500 mb-1">
                          Time per Token
                        </p>
                        <p className="font-medium">
                          {service.tokenTime} minutes
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500 mb-1">
                          Total Tokens Alloted
                        </p>
                        <p className="font-medium">{service.totalTokens}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500 mb-1">Start Time</p>
                        <p className="font-medium">
                          {" "}
                          {service.tokenStartTime
                            ? new Date(
                                service.tokenStartTime?.toDate
                                  ? service.tokenStartTime.toDate()
                                  : service.tokenStartTime
                              ).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500 mb-1">
                          Current Token
                        </p>
                        <p className="font-medium">{service.currentToken}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md col-span-2">
                        <p className="text-xs text-gray-500 mb-1">
                          Remaining Tokens
                        </p>
                        <p className="font-medium">{service.remTokens}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => toggleField(service.id, "active")}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                          service.active
                            ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                            : "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                        } !rounded-button whitespace-nowrap cursor-pointer`}
                      >
                        {service.active ? "Stop Service" : "Start Service"}
                      </button>

                      <button
                        onClick={() => toggleField(service.id, "paused")}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                          service.paused
                            ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                            : "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500"
                        } !rounded-button whitespace-nowrap cursor-pointer`}
                      >
                        {service.paused ? "Resume Tokens" : "Pause Tokens"}
                      </button>

                      <button
                        onClick={() => deleteService(service.id)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProvHome;
