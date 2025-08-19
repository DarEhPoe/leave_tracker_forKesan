"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { getNotificationType } from "@/lib/queries/getNotification";

type Props = {
  data: getNotificationType;
};

export default function NotificationDisplay({ data }: Props) {
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Activity Type
              </label>
              <div className="text-lg text-gray-900 dark:text-white">
                {data.activityType || 'N/A'}
              </div>
            </div>
  const router = useRouter();

  if (!data) {
    return (
      <div >
        <button
          className="text-xl mb-4 hover:underline cursor-pointer"
          onClick={() => router.back()}
        >
          ← Back
        </button>
        <div className="text-xl font-semibold text-left mt-2">
          Notification not found
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <button
        className="text-xl mb-4 hover:underline cursor-pointer"
        onClick={() => router.back()}
      >
        ← Back
      </button>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Travel Notification Details
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Full Name
              </label>
              <div className="text-lg text-gray-900 dark:text-white">
                {data.fullName || 'N/A'}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Program
              </label>
              <div className="text-lg text-gray-900 dark:text-white">
                {data.program || 'N/A'}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Travel With
              </label>
              <div className="text-lg text-gray-900 dark:text-white">
                {data.travelWith || 'N/A'}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Leave Date
              </label>
              <div className="text-lg text-gray-900 dark:text-white">
                {data.leaveDate ? new Date(data.leaveDate).toLocaleDateString() : 'N/A'}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Arrival Date
              </label>
              <div className="text-lg text-gray-900 dark:text-white">
                {data.arrivalDate ? new Date(data.arrivalDate).toLocaleDateString() : 'N/A'}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Created On
              </label>
              <div className="text-lg text-gray-900 dark:text-white">
                {data ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Description
          </label>
          <div className="mt-2 p-4 rounded-lg">
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
              {data.description || 'No description provided'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
