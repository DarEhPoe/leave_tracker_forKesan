"use client";

import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  text: string;
};

export default function DisplayText({ text }: Props) {
  const router = useRouter();

  return (
    <div className="p-4">
      <button
        className="text-xl mb-4 hover:underline cursor-pointer"
        onClick={() => router.back()}
      >
        ← Back
      </button>
      <div className="text-xl font-semibold text-left mt-2">
        {text}
      </div>
    </div>
  );
}
