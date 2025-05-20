import React from "react";

const layout = ({ children }) => {
  return (
    <div className="flex justify-center content-center items-center h-screen bg-blue-100">
      {children}
    </div>
  );
};

export default layout;
