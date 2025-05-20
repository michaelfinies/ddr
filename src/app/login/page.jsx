// Page.jsx (or page.js in Next.js /app)
import React from "react";
import { LoginForm } from "@/components/login-form";
import "./login.css";

export default function Page() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="area absolute z-0 w-full h-full overflow-hidden">
        <ul className="circles">
          {[...Array(10)].map((_, index) => (
            <li key={index} className="flex items-center justify-center">
              <img
                width="50"
                height="50"
                src="https://img.icons8.com/ios-filled/50/book.png"
                alt="book"
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <LoginForm />
      </div>
    </div>
  );
}
