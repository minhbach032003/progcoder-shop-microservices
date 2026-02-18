"use client";

import React from "react";

// TEMPORARY: Pass-through component to fix "Maximum update depth exceeded" error
// The original Tooltip using Radix UI was causing infinite render loops in Next.js
const Tooltip = ({ children, title, className = "btn btn-dark" }) => {
  return <>{children || <button className={className}>{title}</button>}</>;
};

export default Tooltip;
