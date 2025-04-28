import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-8 shadow-sm">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        {/* Left side: copyright */}
        <p className="text-gray-600 text-sm mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} FYP Management System. All rights
          reserved.
        </p>

        {/* Right side: social icons */}
        <div className="flex space-x-4">
          <a
            href="#"
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <i className="fab fa-github"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
