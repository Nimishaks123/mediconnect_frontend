import React from "react";
const Footer: React.FC = () => {
  return (
    <footer className=" text-white px-10 py-10 
     w-full"  style={{ backgroundColor: "#0F4C81" }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h2 className="text-xl font-bold">MediConnect</h2>
          <p className="mt-3 text-sm text-gray-200">
            © 2025 MediConnect. All rights reserved.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-gray-200">
            <li>Features</li>
            <li>Pricing</li>
            <li>API</li>
            <li>Integration</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-200">
            <li>About</li>
            <li>Blog</li>
            <li>Jobs</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Follow us</h3>
          <ul className="space-y-2 text-gray-200">
            <li>LinkedIn</li>
            <li>Instagram</li>
            <li>Twitter (X)</li>
            <li>Facebook</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
