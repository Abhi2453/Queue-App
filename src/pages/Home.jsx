import React from "react";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Home = () => {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-40 group/design-root overflow-x-hidden"
      style={{ fontFamily: "Inter, 'Noto Sans', sans-serif" }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="w-full border-b border-[#eaedf1] px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <h2 className="text-[#101518] text-lg font-bold tracking-[-0.015em]">
                QueueApp
              </h2>

              {/* Hamburger for small screens */}
              <div className="md:hidden">
                <button
                  onClick={() =>
                    document
                      .getElementById("mobile-menu")
                      .classList.toggle("hidden")
                  }
                  className="text-[#101518] focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Nav Links & Buttons */}
            <div
              id="mobile-menu"
              className="hidden flex-col gap-4 md:flex md:flex-row md:items-center md:gap-9"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <a href="/prov-login">
                  <button className="w-full sm:w-auto cursor-pointer flex items-center justify-center rounded-xl h-10 px-4 bg-[#dce8f3] text-[#101518] text-sm font-bold tracking-[0.015em]">
                    Provider Login
                  </button>
                </a>
                <a href="/user-login">
                  <button className="w-full sm:w-auto cursor-pointer flex items-center justify-center rounded-xl h-10 px-4 bg-[#eaedf1] text-[#101518] text-sm font-bold tracking-[0.015em]">
                    User Login
                  </button>
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4">
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-black text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                      Streamline Your Wait Times
                    </h1>
                    <h2 className="text-black text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      Managing long lines and waiting times has never been
                      easier. QueueApp offers a powerful, user-friendly queue
                      management system designed to help businesses reduce wait
                      times, optimize customer flow, and improve overall service
                      experience
                    </h2>

                    <div className="flex justify-center">
                      <a href="/user-login">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#dce8f3] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                          <span className="truncate">Get Started</span>
                        </button>
                      </a>
                    </div>

                    <DotLottieReact
                      src="https://lottie.host/dd9ae472-daa2-444f-96e1-ac42e451d8c0/WGgQ2Gv66G.lottie"
                      loop
                      autoplay
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-4">
                <h1 className="text-[#101518] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                  Key Features
                </h1>
                <p className="text-[#101518] text-base font-normal leading-normal max-w-[720px]">
                  QueueApp offers a range of features designed to enhance the
                  queue management experience for both providers and users.
                </p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                <div className="flex flex-1 gap-3 rounded-lg border border-[#d4dce2] bg-gray-50 p-4 flex-col">
                  <div
                    className="text-[#101518]"
                    data-icon="Clock"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#101518] text-base font-bold leading-tight">
                      Real-Time Updates
                    </h2>
                    <p className="text-[#5c748a] text-sm font-normal leading-normal">
                      Stay informed with real-time updates on queue status,
                      estimated wait times, and notifications.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#d4dce2] bg-gray-50 p-4 flex-col">
                  <div
                    className="text-[#101518]"
                    data-icon="Users"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,0-11.29-3.28,52.18,52.18,0,0,1-38.06,10.2,4,4,0,0,1-1.28-.22,51.64,51.64,0,0,0-27.81-2.17,79.44,79.44,0,0,0-32.48,14.43,8,8,0,1,0,9.14,13.25,63.32,63.32,0,0,1,25.88-11.48,36,36,0,0,1,19.44.32,43.84,43.84,0,0,0,27.22,2.17,52.3,52.3,0,0,0,38.32-11.57A8,8,0,0,0,250.14,206.7Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#101518] text-base font-bold leading-tight">
                      Easy Booking
                    </h2>
                    <p className="text-[#5c748a] text-sm font-normal leading-normal">
                      Users can quickly book tokens from nearby providers based
                      on their location and availability.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#d4dce2] bg-gray-50 p-4 flex-col">
                  <div
                    className="text-[#101518]"
                    data-icon="ShieldCheck"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm36-104-40,40-16-16a8,8,0,1,0-11.31,11.31l21.65,21.65a8,8,0,0,0,11.31,0l45.31-45.32a8,8,0,0,0-11.31-11.31Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#101518] text-base font-bold leading-tight">
                      Secure & Reliable
                    </h2>
                    <p className="text-[#5c748a] text-sm font-normal leading-normal">
                      All data is handled securely with privacy in mind to
                      protect users and providers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-5 p-10">
              <h2 className="text-[#101518] text-3xl font-bold leading-tight tracking-[-0.033em] max-w-[720px] text-center">
                Ready to Get Started?
              </h2>
              <p className="max-w-[720px] text-center text-[#5c748a] text-base font-normal leading-normal">
                Join QueueApp today and revolutionize the way you manage queues
                and customer experience.
              </p>
              <a href="./about">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#dce8f3] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Learn More</span>
                </button>
              </a>
            </div>
          </div>
        </div>
        <footer className="flex items-center justify-between border-t border-solid border-t-[#eaedf1] px-10 py-3">
          <div className="flex gap-3 text-[#5c748a] text-sm font-normal leading-normal">
            <a href="#" className="cursor-pointer hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="cursor-pointer hover:underline">
              Terms of Service
            </a>
          </div>
          <div className="flex gap-3 text-[#5c748a]">
            <a
              href="#"
              aria-label="Twitter"
              className="cursor-pointer hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.46 6c-.77.35-1.5.59-2.24.7a4.11 4.11 0 001.8-2.27c-.8.47-1.68.8-2.62.99a4.09 4.09 0 00-7 3.73A11.6 11.6 0 013 5.14a4.1 4.1 0 001.27 5.45 4.07 4.07 0 01-1.85-.5v.05a4.1 4.1 0 003.28 4 4.1 4.1 0 01-1.84.07 4.1 4.1 0 003.82 2.84A8.22 8.22 0 012 18.57a11.6 11.6 0 006.29 1.84c7.55 0 11.68-6.25 11.68-11.68 0-.18 0-.35-.01-.52A8.34 8.34 0 0022.46 6z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="cursor-pointer hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12a10 10 0 10-11.5 9.87v-7H8v-3h2.5v-2.5a3.5 3.5 0 013.5-3.5h2v3h-2a.5.5 0 00-.5.5V12h3l-.5 3h-2.5v7A10 10 0 0022 12z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="cursor-pointer hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 2A3.75 3.75 0 004 7.75v8.5A3.75 3.75 0 007.75 20h8.5a3.75 3.75 0 003.75-3.75v-8.5A3.75 3.75 0 0016.25 4h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.5-.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" />
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
