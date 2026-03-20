"use client";

import { Eye, Info } from "lucide-react";

interface TestUserIndicatorProps {
  className?: string;
}

const TestUserIndicator = ({ className = "" }: TestUserIndicatorProps) => {
  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-2 flex items-center gap-2 shadow-md rounded-md">
        <Eye className="w-4 h-4" />
        <span className="font-medium">Demo Mode</span>
        <Info className="w-3 h-3 ml-1" />
      </div>
    </div>
  );
};

export default TestUserIndicator;
