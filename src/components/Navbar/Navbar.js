"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { AuthContext } from "../../app/context/auth";
import { useRouter } from "next/navigation";

function Navbar() {
  const { user,logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    logout()
      .then((result) => {
        router.push("/auth/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <header className="mt-5 inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
        <div className="px-4">
          <div className="flex items-center justify-between">
            <div className="flex shrink-0">
              <Link aria-current="page" className="flex items-center" href="/">
                <img className="h-7 w-auto" src="/home.png" alt="" />
                <p className="sr-only">Library</p>
              </Link>
            </div>
            <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
              <Link
                className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                href="/"
              >
                Home
              </Link>
              <Link
                className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                href="/categories"
              >
                Categories
              </Link>
              <Link
                className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                href="/books"
              >
                Books
              </Link>
              {user && (
                <Link
                  className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              )}
            </div>
            <div className="flex items-center justify-end gap-3">
              {user ? (
                <button  onClick={handleLogout} className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    className="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                    href="/auth/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                    href="/auth/register"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
