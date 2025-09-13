// /src/components/layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // From react-router-dom

// We can define the GitHub SVG icon right here so it's self-contained.
const GitHubIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
    <path 
      fillRule="evenodd" 
      d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.89 1.526 2.338 1.085 2.91.83.091-.645.349-1.085.635-1.334-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.032-2.684-.104-.253-.448-1.27.098-2.647 0 0 .84-.27 2.75 1.025A9.548 9.548 0 0112 6.84a9.553 9.553 0 012.502.336c1.909-1.294 2.748-1.025 2.748-1.025.548 1.377.204 2.394.1 2.647.643.7 1.032 1.593 1.032 2.684 0 3.84-2.338 4.685-4.567 4.935.36.309.678.918.678 1.85 0 1.336-.012 2.414-.012 2.741 0 .268.18.578.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" 
      clipRule="evenodd" 
    />
  </svg>
);


export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Copyright Info */}
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © 2025 SmartTrack. A Project for the Smart India Hackathon.
          </p>
          
          {/* Footer Nav Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/student-login" className="text-sm text-gray-600 hover:text-blue-600 transition">
              Student Login
            </Link>
            <Link to="/faculty-login" className="text-sm text-gray-600 hover:text-blue-600 transition">
              Faculty Login
            </Link>
            
            {/* GitHub Link (Update the href to your project repo) */}
            <a 
              href="https://github.com/your-username/your-repo" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-gray-600 transition"
              title="View project on GitHub"
            >
              <span className="sr-only">GitHub</span>
              <GitHubIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}