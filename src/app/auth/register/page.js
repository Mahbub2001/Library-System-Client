"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      address: "",
      gender: "",
    },
  });

  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data) => {
    const formData = { ...data };
    setLoading(true);
    // console.log(image1)
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/account/register/",
        formData
      );
      // console.log(response.data);
      if (response.status === 200) {
        toast.success("Check your mail for confirmation");
        router.push("/auth/login");
      } else {
        toast.error("Registration failed, please try again");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/reg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <div className="container mx-auto ">
        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-indigo-600 my-10">
            Register Here
          </h1>
          <div className="sm:mx-auto sm:w-full sm:max-w-md backdrop-filter backdrop-blur-3xl">
            <div className=" py-8 px-4 shadow-2xl border sm:rounded-lg sm:px-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {loading && (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                    <p className="ml-4">Submitting...</p>
                  </div>
                )}
                {step === 1 && (
                  <div>
                    <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900">
                      Step 1: Personal Information
                    </h2>
                    <div className="space-y-4">
                      <div className="">
                        <label
                          htmlFor="first_name"
                          className="placeholder-red-900 block text-sm font-medium text-gray-700"
                        >
                          First Name
                        </label>
                        <input
                          id="first_name"
                          type="text"
                          {...register("first_name", {
                            required: "First Name is required",
                          })}
                          className={`focus:bg-transparent mt-1 border-b-1 bg-transparent block w-full  border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 ${
                            errors.first_name ? "border-red-600" : ""
                          }`}
                          placeholder="First Name"
                        />
                        {errors.first_name && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.first_name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="last_name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Last Name
                        </label>
                        <input
                          id="last_name"
                          type="text"
                          {...register("last_name", {
                            required: "Last Name is required",
                          })}
                          className={`border-b-1 bg-transparent mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 ${
                            errors.last_name ? "border-red-600" : ""
                          }`}
                          placeholder="Last Name"
                        />
                        {errors.last_name && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.last_name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="phone_number"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </label>
                        <input
                          id="phone_number"
                          type="tel"
                          {...register("phone_number")}
                          className="border-1 bg-transparent mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                          placeholder="Phone Number"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Address
                        </label>
                        <textarea
                          id="address"
                          {...register("address")}
                          className="border-b-1 bg-transparent mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                          placeholder="Address"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="gender"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Gender
                        </label>
                        <select
                          id="gender"
                          {...register("gender", {
                            required: "Please select a gender",
                          })}
                          className="border-b-1 bg-transparent mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.gender.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900">
                      Step 2: Account Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="username"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Username
                        </label>
                        <input
                          id="username"
                          type="text"
                          {...register("username", {
                            required: "Username is required",
                          })}
                          className={`border-b-1 bg-transparent mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 ${
                            errors.username ? "border-red-600" : ""
                          }`}
                          placeholder="Username"
                        />
                        {errors.username && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.username.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                          })}
                          className={`border-b-1 bg-transparent mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 ${
                            errors.email ? "border-red-600" : ""
                          }`}
                          placeholder="Email"
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <input
                          id="password"
                          type="password"
                          {...register("password", {
                            required: "Password is required",
                          })}
                          className={`border-b-1 bg-transparent mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 ${
                            errors.password ? "border-red-600" : ""
                          }`}
                          placeholder="Password"
                        />
                        {errors.password && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="confirm_password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Confirm Password
                        </label>
                        <input
                          id="confirm_password"
                          type="password"
                          {...register("confirm_password", {
                            validate: (value) =>
                              value === getValues("password") ||
                              "The passwords do not match",
                          })}
                          className={`border-b-1 bg-transparent mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 ${
                            errors.confirm_password ? "border-red-600" : ""
                          }`}
                          placeholder="Confirm Password"
                        />
                        {errors.confirm_password && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.confirm_password.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between gap-2">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-300 text-base font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                      >
                        Previous
                      </button>
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
