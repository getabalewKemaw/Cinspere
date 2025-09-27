import React, { useState } from "react";
import { Icon } from "@iconify/react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Login = ({ onClose, redirectPath = "/" }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-2 xs:p-4 z-50">
      <div className="bg-dark-100 rounded-2xl shadow-inner shadow-light-100/10 w-full max-w-[90vw] sm:max-w-md p-4 sm:p-6 relative max-h-[80vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-light-100 text-2xl hover:text-light-200"
          aria-label="Close login modal"
        >
          <Icon icon="mdi:close" width="24" height="24" />
        </button>

        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-4">
          <img src="./logo.png" alt="Logo" className="h-8 w-auto" />
          <h4 className="text-gradient text-xl sm:text-2xl font-bold text-center">
            {isSignUp ? "Create Account" : "Sign In to Cinsphere"}
          </h4>
        </div>

        {/* Subtitle */}
        <p className="text-center text-light-200 mb-4 sm:mb-6 text-xs sm:text-sm">
          {isSignUp
            ? "Join Cinsphere, your ultimate movie companion! Sign up now to explore, track, and share your favorite films with a vibrant community of movie enthusiasts. Dive into a world of cinematic adventures today!"
            : "Welcome back to Cinsphere! Sign in to continue your cinematic journey, explore new releases, and connect with fellow movie lovers. Your next favorite film is just a click away!"}
        </p>

        {/* Form: SignUp or SignIn */}
        {isSignUp ? (
          <SignUp onClose={onClose} />
        ) : (
          <SignIn onClose={onClose} redirectPath={redirectPath} />
        )}

        {/* Switch between login/signup */}
        <p className="text-center text-light-200 mt-4 text-xs sm:text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gradient hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>

        {/* Google Auth placeholder */}
        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={() => console.log("Google OAuth placeholder")}
            className="w-full px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:google" width="20" height="20" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
