// About.jsx (React Component using Tailwind CSS)

import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-white py-16 px-6 md:px-20 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-black-600 mb-6">
          About{" "}
          <a href="/" className="hover:underline">
            QueueApp
          </a>
        </h1>
        <p className="text-lg leading-relaxed mb-6">
          <strong>QueueApp</strong> is a smart queue and token management system
          designed to reduce waiting times, streamline service experiences, and
          modernize appointment-based operations for both public and private
          sectors. From local salons to government passport offices, QueueApp
          empowers service providers to handle appointments and walk-ins more
          efficiently.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
          Why We Built QueueApp
        </h2>
        <p className="text-base leading-relaxed mb-4">
          Standing in long queues is outdated. QueueApp was built to solve the
          problem of overcrowding, unmanaged appointments, and inconsistent
          customer experiences. Our mission is to give businesses and
          institutions a digital toolkit to manage customer flow, while
          providing users with control, comfort, and timely service.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
          Who It's For
        </h2>
        <ul className="list-disc list-inside text-base mb-6">
          <li>
            <strong>Service Providers:</strong> Salons, clinics, repair centers,
            freelancers, and more.
          </li>
          <li>
            <strong>Government Offices:</strong> Transport offices, utilities,
            registration centers, and other public services.
          </li>
          <li>
            <strong>Customers:</strong> Anyone looking to avoid lines and book
            services efficiently.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
          Key Features
        </h2>
        <ul className="list-disc list-inside text-base mb-6 space-y-1">
          <li>Real-time token updates and wait time tracking.</li>
          <li>Advanced time-slot booking with automatic scheduling.</li>
          <li>Pre-payment with smart refund automation.</li>
          <li>Live progress bar for upcoming tokens.</li>
          <li>SMS/email/app notifications for timely alerts.</li>
          <li>Role-based dashboards for admins, providers, and users.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
          Our Vision
        </h2>
        <p className="text-base leading-relaxed mb-10">
          We envision a future where time isn’t wasted in queues. QueueApp
          brings precision, efficiency, and trust to the everyday service
          experience. With real-time technology, we aim to create a world where
          services are always on time and stress-free.
        </p>
      </div>
    </div>
  );
};

export default About;
