import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collectionGroup,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";
import apData from "../../data/andhraPradesh.json";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const UserDashboard = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [filters, setFilters] = useState({
    state: "Andhra Pradesh",
    district: "",
    mandal: "",
    place: "",
  });
  const [matchedServices, setMatchedServices] = useState([]);
  const [bookingStatus, setBookingStatus] = useState({});

  const [myBookings, setMyBookings] = useState([]);
  const [bookingServiceDetails, setBookingServiceDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) navigate("/user-login");
      else {
        setUserEmail(user.email);
        const uid = user.uid;

        const userDocRef = doc(db, "users", uid);
        const userSnap = await getDoc(userDocRef);

        if (!userSnap.exists()) {
          navigate("/user-login");
        }

        fetchUserBookings(user.uid);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserBookings = async (uid = auth.currentUser?.uid) => {
    if (!uid) return;
    const snap = await getDocs(collection(db, `users/${uid}/bookings`));
    const bookings = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMyBookings(bookings);

    // Fetch service details for current token tracking
    const serviceDetails = {};
    await Promise.all(
      bookings.map(async (booking) => {
        const serviceRef = doc(
          db,
          `providers/${booking.providerId}/services/${booking.serviceId}`
        );
        const serviceSnap = await getDoc(serviceRef);
        if (serviceSnap.exists()) {
          serviceDetails[booking.serviceId] = serviceSnap.data();
        }
      })
    );
    setBookingServiceDetails(serviceDetails);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      const reset = { ...prev, [name]: value };
      if (name === "district") {
        reset.mandal = "";
        reset.place = "";
      } else if (name === "mandal") {
        reset.place = "";
      }
      return reset;
    });
  };

  const searchServices = async () => {
    setMatchedServices([]);

    const q = query(
      collectionGroup(db, "services"),
      where("state", "==", filters.state),
      where("district", "==", filters.district),
      where("mandal", "==", filters.mandal),
      where("place", "==", filters.place)
    );

    const snapshot = await getDocs(q);
    const services = snapshot.docs.map((doc) => ({
      id: doc.id,
      providerId: doc.ref.path.split("/")[1],
      ...doc.data(),
    }));

    setMatchedServices(services);
  };

  const bookToken = async (service) => {
    const user = auth.currentUser;
    if (!user) return;

    const serviceDocRef = doc(
      db,
      `providers/${service.providerId}/services/${service.id}`
    );
    const docSnap = await getDoc(serviceDocRef);
    if (!docSnap.exists()) return;

    const data = docSnap.data();

    const newTotalToken = (data.totalTokens || 0) + 1;
    const newReToken = (data.remTokens || 0) + 1;

    await updateDoc(serviceDocRef, {
      totalTokens: newTotalToken,
      remTokens: newReToken,
    });

    await addDoc(collection(db, `users/${user.uid}/bookings`), {
      serviceId: service.id,
      providerId: service.providerId,
      state: service.state,
      district: service.district,
      mandal: service.mandal,
      place: service.place,
      serviceType: service.serviceType,
      bookStatus: true,
      tokenNumber: newTotalToken,
      bookingTime: new Date(),
    });

    setBookingStatus((prev) => ({
      ...prev,
      [service.id]: {
        bookedToken: newTotalToken,
        estTime: (newTotalToken - data.currentToken) * (data.tokenTime || 5),
      },
    }));

    fetchUserBookings();
  };

  const cancelBooking = async (booking) => {
    const confirmCancel = window.confirm("Cancel this booking?");
    if (!confirmCancel) return;

    const user = auth.currentUser;
    if (!user) return;
    booking.bookStatus = false;

    await deleteDoc(doc(db, `users/${user.uid}/bookings/${booking.id}`));

    const serviceRef = doc(
      db,
      `providers/${booking.providerId}/services/${booking.serviceId}`
    );
    const snap = await getDoc(serviceRef);
    if (snap.exists()) {
      const data = snap.data();
      await updateDoc(serviceRef, {
        totalTokens: Math.max((data.totalTokens || 1) - 1, 0),
        remTokens: Math.max((data.remTokens || 1) - 1, 0),
      });
    }
    setBookingStatus((prev) => {
      const updated = { ...prev };
      delete updated[booking.serviceId]; // or set to false if you prefer
      return updated;
    });

    fetchUserBookings();
  };

  const districts = apData.districts || [];
  const selectedDistrict = districts.find(
    (d) => d.district === filters.district
  );
  const mandals = selectedDistrict?.subDistricts || [];
  const selectedMandal = mandals.find((m) => m.subDistrict === filters.mandal);
  const places = selectedMandal?.villages || [];

  // const calculateWaitingTime = (booking: Booking) => {
  //   const tokensAhead = booking.tokenNumber - booking.currentToken;
  //   return tokensAhead > 0 ? tokensAhead * booking.tokenTime : 0;
  // };

  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      console.log("Provider logged out successfully.");
      // Optionally redirect to login page
      window.location.href = "/prov-login"; // Update path as needed
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-40">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-blue-600 text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                User Dashboard
              </h1>
              <p className="text-sm sm:text-base break-all">{userEmail}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to logout?")) {
                handleLogout();
              }
            }}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
          >
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Search for Available Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <div className="relative">
                <select
                  className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                  value=""
                  disabled
                >
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>

            {/* Dropdown Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <div className="relative">
                <select
                  name="district"
                  className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                  value={filters.district}
                  onChange={handleFilterChange}
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.district} value={d.district}>
                      {d.district}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mandal
              </label>
              <div className="relative">
                <select
                  name="mandal"
                  className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                  value={filters.mandal}
                  onChange={handleFilterChange}
                  disabled={!selectedDistrict}
                >
                  <option value="">Select Mandal</option>
                  {mandals.map((m) => (
                    <option key={m.subDistrict} value={m.subDistrict}>
                      {m.subDistrict}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Place
              </label>
              <div className="relative">
                <select
                  name="place"
                  className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                  value={filters.place}
                  onChange={handleFilterChange}
                  disabled={!selectedMandal}
                >
                  <option value="">Select Place</option>
                  {places.map((place) => (
                    <option key={place} value={place}>
                      {place}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
            <button
              onClick={searchServices}
              className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
              disabled={!filters.place}
            >
              Search Services
            </button>
          </div>
        </section>

        {/* <button onClick={searchServices} disabled={!filters.place}>
          Search Services
        </button>
      </div> */}

        {/* Search Results */}
        {/* Available Services */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Available Services
          </h2>

          {matchedServices.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
              <p className="text-gray-600">
                {selectedDistrict
                  ? "No services available for the selected criteria. Try different filters."
                  : "Please select a district to view available services."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="bg-indigo-600 p-4">
                    <h3 className="text-lg font-semibold text-white">
                      {service.serviceType}
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <p className="text-gray-600 mb-1">
                        <i className="fas fa-map-marker-alt mr-2 text-indigo-500"></i>
                        {service.place}, {service.mandal}, {service.district}
                      </p>
                      <p className="text-gray-600">
                        <i className="fas fa-clock mr-2 text-indigo-500"></i>
                        {service.tokenTime} minutes per customer
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">
                          Token Progress
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {service.currentToken} / {service.totalTokens}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{
                            width: `${
                              (service.currentToken / service.totalTokens) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>Current: {service.currentToken}</span>
                        <span>Remaining: {service.remTokens}</span>
                      </div>
                    </div>

                    {bookingStatus[service.id] ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                        <span className="text-green-700">Already Booked</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => bookToken(service)}
                        disabled={service.active === false}
                        className={`!rounded-button whitespace-nowrap w-full py-2 px-4 rounded-md flex items-center justify-center cursor-pointer ${
                          service.active
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <i className="fas fa-ticket-alt mr-2"></i>
                        {service.active ? "Book Token" : "Service Stopped"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Bookings */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            My Bookings
          </h2>

          {myBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <i className="fas fa-calendar-alt text-gray-400 text-4xl mb-4"></i>
              <p className="text-gray-600">
                You don't have any active bookings.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Book a service to see your bookings here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBookings.map((booking) => {
                const service = bookingServiceDetails[booking.serviceId];
                if (!service) return null;

                const progress =
                  (service.currentToken /
                    Math.max(service.totalTokens || 1, 1)) *
                  100;
                const remaining = Math.max(
                  0,
                  booking.tokenNumber - service.currentToken
                );
                const estWait = remaining * (service.tokenTime || 5);

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="bg-indigo-600 p-4">
                      <h3 className="text-lg font-semibold text-white">
                        {booking.serviceType}
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <p className="text-gray-600 mb-1">
                          <i className="fas fa-map-marker-alt mr-2 text-indigo-500"></i>
                          {booking.place}, {booking.mandal}, {booking.district}
                        </p>
                        <div className="flex justify-between mt-2">
                          <p className="text-gray-600">
                            <i className="fas fa-ticket-alt mr-2 text-indigo-500"></i>
                            Your Token:{" "}
                            <span className="font-semibold">
                              {booking.tokenNumber}
                            </span>
                          </p>
                          <p className="text-gray-600">
                            <i className="fas fa-play-circle mr-2 text-indigo-500"></i>
                            Current:{" "}
                            <span className="font-semibold">
                              {booking.currentToken}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-100 p-3 rounded-lg mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            Queue Progress
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {booking.currentToken} / {booking.tokenNumber}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-indigo-600 h-2.5 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-sm text-gray-600">
                            <i className="fas fa-clock mr-2 text-indigo-500"></i>
                            Estimated Waiting Time:{" "}
                            <span className="font-medium">
                              {estWait} minutes
                            </span>
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => cancelBooking(booking)}
                        className="!rounded-button whitespace-nowrap w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center cursor-pointer"
                      >
                        <i className="fas fa-times-circle mr-2"></i>
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

{
  /* My Bookings Section */
}
// <hr style={{ margin: "2rem 0" }} />
// <h2>My Bookings</h2>

// {myBookings.length === 0 ? (
//   <p>No bookings yet.</p>
// ) : (
//   myBookings.map((booking) => {
//     const service = bookingServiceDetails[booking.serviceId];
//     if (!service) return null;

//     const progress =
//       (service.currentToken / Math.max(service.totalTokens || 1, 1)) *
//       100;
//     const remaining = Math.max(
//       0,
//       booking.tokenNumber - service.currentToken
//     );
//     const estWait = remaining * (service.tokenTime || 5);

//           return (
//             <div
//               key={booking.id}
//               style={{
//                 border: "1px solid #aaa",
//                 padding: "10px",
//                 marginBottom: "10px",
//               }}
//             >
//               <p>
//                 <strong>Service:</strong> {booking.serviceType}
//               </p>
//               <p>
//                 <strong>Location:</strong> {booking.district}, {booking.mandal},{" "}
//                 {booking.place}
//               </p>
//               <p>
//                 <strong>Your Token:</strong> {booking.tokenNumber}
//               </p>
//               <p>
//                 <strong>Current Token:</strong> {service.currentToken}
//               </p>
//               <p>
//                 <strong>Estimated Wait:</strong> {estWait} minutes
//               </p>

//               <div
//                 style={{ background: "#eee", height: "10px", width: "100%" }}
//               >
//                 <div
//                   style={{
//                     height: "100%",
//                     width: `${progress}%`,
//                     background: "#2196f3",
//                   }}
//                 ></div>
//               </div>

//               <button
//                 style={{
//                   marginTop: "10px",
//                   backgroundColor: "red",
//                   color: "white",
//                   border: "none",
//                   padding: "6px 12px",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => cancelBooking(booking)}
//               >
//                 Cancel Booking
//               </button>
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// };

export default UserDashboard;
