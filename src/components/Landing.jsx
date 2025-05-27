"use client";
import Link from "next/link";
import { BookOpen, Gift, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="scroll-smooth">
      <img
        src="/bookmark.svg"
        className="absolute right-0 opacity-80 w-32 h-32 top-0 invert-100 p-10 z-[100]"
      />
      <section className="relative lg:h-screen lg:flex lg:items-center">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted className="w-full h-full object-cover">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-6"
          >
            Go from Reading to Rewards with
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-extrabold">
              Readify
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 text-lg text-cyan-100 sm:text-xl max-w-xl mx-auto"
          >
            Track your reading journey, earn crypto rewards, and collect unique
            NFTs - all while building better habits!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex justify-center space-x-4"
          >
            <Link href="/wallet">
              <div className=" border-2 flex gap-3 justify-center items-center rounded-lg bg-blue-400 px-5 py-3 text-lg font-semibold text-white shadow-lg hover:scale-105 transition-transform duration-300">
                <p>Start Reading </p>
                <img
                  width="30"
                  height="30"
                  src="https://img.icons8.com/ios/50/open-book--v1.png"
                  alt="open-book--v1"
                  className="invert-100"
                />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="bg-gradient-to-b from-blue-50 to-cyan-50 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left"
            >
              <h2 className="text-4xl font-bold text-blue-900 mb-6">
                About Readify
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Readify was created by three passionate third-year students at
                the University of Curaçao who wanted to make reading more fun
                and rewarding. With Readify, students earn tokens by logging
                their reading—what they read, for how long, and a brief summary.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                These tokens are securely tracked using blockchain technology
                and can be used to redeem rewards on campus, like snacks, school
                supplies, or event access. Readify makes reading more than just
                educational—it turns it into a game with real-life benefits.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Start reading, start earning!
              </p>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <p className="text-gray-600 italic">
                  "We combined blockchain tech with our love for literature to
                  create a platform that rewards every page turned!"
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                    Michelangelo Finies
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Jerald Sanchez
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Marily-Anne Lacle
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <img
                src="/login-hero.png"
                alt="Student team"
                className="w-full max-w-md rounded-lg transition-transform opacity-75"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-blue-900 mb-12"
          >
            Why you should Use Readify
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Track Your Reading",
                desc: "Easily log your sessions with a smooth, user-friendly interface.",
                icon: <BookOpen className="w-6 h-6 text-white" />,
                color: "from-green-400 to-cyan-500",
              },
              {
                title: "Earn as You Read",
                desc: "Unlock tokens, crypto, and NFTs as you hit reading goals.",
                icon: <Gift className="w-6 h-6 text-white" />,
                color: "from-yellow-400 to-orange-500",
              },
              {
                title: "Secure Reading History",
                desc: "Your logs are stored on the blockchain—tamper-proof and forever yours.",
                icon: <ShieldCheck className="w-6 h-6 text-white" />,
                color: "from-purple-400 to-pink-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`bg-gradient-to-br ${feature.color} p-1 rounded-xl shadow-lg`}
              >
                <div className="bg-gray-100 rounded-xl p-4 h-full flex items-center space-x-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-700">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
          <div className="bg-yellow-50 h-64 border-2 border-gray-400 rounded-lg flex items-center p-4">
            <div>
              {" "}
              <p className="mb-2">
                Please note that Readify is <strong>completely free</strong> to
                use.{" "}
              </p>
              <p>
                However, if you value what we’re building, you can support us
                with a donation — and unlock a few bonus features as a thank
                you.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 p-6 shadow-xs sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900"></h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-700 sm:text-4xl">
                  {" "}
                  $3.00
                </strong>
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-blue-700 shadow-sm"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> Faster reviews </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-blue-700 shadow-sm"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700"> AI features </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-blue-700 shadow-sm"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700">
                  {" "}
                  Early Access to latest features{" "}
                </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-blue-700 shadow-sm"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>

                <span className="text-gray-700">Customization Themes</span>
              </li>
            </ul>

            <Link
              href="https://www.paypal.com/cw/home"
              className="mt-8 block rounded border border-blue-600 bg-white px-12 py-3 text-center text-sm font-medium text-blue-600 hover:ring-1 hover:ring-blue-600 focus:ring-3 focus:outline-hidden"
            >
              Donate
            </Link>
          </div>
        </div>
      </div>

      <footer className=" lg:grid lg:grid-cols-8 dark:bg-gray-900 h-10">
        <div className="relative block bg-blue-100 h-32 lg:col-span-2 lg:h-full bg-opacity-75 rounded-tr-4xl">
          <div className="h-full w-full flex items-center justify-center content-center ">
            <img
              src="/mascot2.png"
              alt=""
              className="absolute rounded-tr-4xl opacity-90 w-64 h-64"
            />
          </div>
        </div>

        <div className="px-4 py-16 sm:px-6 lg:col-span-6 lg:px-8 ">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 mb-20 ">
            <div>
              <p>
                <span className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  Contact us at
                </span>

                <a
                  href="#"
                  className="block text-xl font-medium text-gray-900 hover:opacity-75 sm:text-2xl dark:text-white"
                >
                  ReadifyTeam@gmail.com
                </a>
              </p>

              <ul className="mt-8 flex gap-6">
                <li>
                  <a
                    href="#"
                    rel="noreferrer"
                    target="_blank"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    <span className="sr-only">Facebook</span>

                    <svg
                      className="size-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    rel="noreferrer"
                    target="_blank"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    <span className="sr-only">Instagram</span>

                    <svg
                      className="size-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    rel="noreferrer"
                    target="_blank"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    <span className="sr-only">Twitter</span>

                    <svg
                      className="size-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="font-medium text-gray-900 underline dark:text-white">
                  Services
                </p>

                <ul className="mt-3 space-y-4 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                    >
                      Reading Verification
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                    >
                      Certificate or Badge Issuance
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                    >
                      Book Recommendation Engine
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-medium underline text-gray-900 dark:text-white">
                  Group Members
                </p>

                <ul className="mt-3 space-y-4 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                    >
                      Michelangelo Finies
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                    >
                      Jerald Sanchez
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                    >
                      Marily-Anne Lacle
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-400 pt-8 dark:border-gray-800 -mb-8 ">
            <div className="sm:flex sm:items-center sm:justify-between ">
              <ul className="flex flex-wrap gap-4 text-xs ">
                <li>
                  <a
                    href="#"
                    className="text-gray-500 transition hover:opacity-75 dark:text-gray-400"
                  >
                    Terms & Conditions
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-gray-500 transition hover:opacity-75 dark:text-gray-400"
                  >
                    Privacy Policy
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-gray-500 transition hover:opacity-75 dark:text-gray-400"
                  >
                    Cookies
                  </a>
                </li>
              </ul>

              <p className="mt-8 text-xs text-gray-500 sm:mt-0 dark:text-gray-400">
                &copy; 2022. Company Name. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
