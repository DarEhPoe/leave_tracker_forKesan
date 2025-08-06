"use client";

import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Animated Logo Loader */}
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="relative flex items-center justify-center">
            {/* Rotating Circle */}
            <div className="absolute w-32 h-32 border-8 border-t-transparent border-blue-500 border-solid rounded-full animate-spin-slow" />
            {/* Logo with bounce */}
            <Image
              src="/images/logo.png"
              alt="Loading"
              width={80}
              height={80}
              className="mx-auto animate-bounce-slow drop-shadow-lg z-10"
            />
          </div>
          <span className="mt-8 text-white text-xl font-semibold tracking-wide animate-pulse">
            Loading, please wait...
          </span>
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-16px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
