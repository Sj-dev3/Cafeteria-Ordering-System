import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 Tuck into a Takeaway Today. All rights reserved.</p>
        <div className="mt-4">
          <Link to="/report-issue" className="text-blue-400 hover:text-blue-600">
            Report an Issue
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
