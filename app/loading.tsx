"use client";

import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-80">
      <div className="text-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-[#4338CA] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <div className="mt-4 text-xl text-[#4338CA] font-medium">
          页面加载中...
        </div>
        <p className="text-gray-600 mt-2">
          请耐心等待，数据正在处理
        </p>
      </div>
    </div>
  );
} 