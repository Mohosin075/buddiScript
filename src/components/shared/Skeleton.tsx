/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface SkeletonProps {
  className?: string;
  as?: "div" | "span" | "button" | "p" | "li" | string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "", as = "div" }) => {
  const Component: any = as;
  return (
    <Component className={`bg-gray-200 rounded animate-pulse ${className}`} />
  );
};

export default Skeleton;
