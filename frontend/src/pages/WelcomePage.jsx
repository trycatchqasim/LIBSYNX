import { Link } from "react-router-dom";
import lunaImage from "../assets/Luna Avisa on Behance.jpeg";
import Footer from "../components/Footer";

const ourValues = [
  "Innovation in library technology",
  "Accessibility and ease of use",
  "Responsive customer support",
  "Continuous improvement",
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#E1D7C7] font-Poppins">
      <nav className="bg-[#231C1D] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-xl font-bold">LibSynx</p>

          <div className="space-x-3">
            <Link
              to="/login"
              className="bg-transparent border border-[#E1D7C7] px-5 py-2 rounded-md"
            >
              Login
            </Link>
            <Link to="/signup" className="bg-[#5C4A3E] px-5 py-2 rounded-md">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-12 container mx-auto px-6">
        <div className="flex gap-12 justify-end items-center">
          <div className="space-y-6 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-[#231C1D] leading-tight">
              A special library system
              <br />
              <span className="text-[#5C4A3E] text-center">
                made for book lovers.
              </span>
            </h1>
            <p className="text-lg text-[#5C4A3E] font-medium leading-relaxed text-center">
              Learn, explore, and get lost in stories. LibSynx makes it easy to
              discover new books and manage your reading journey.
            </p>
            <div className="pt-4">
              <Link
                to="/signup"
                className="bg-[#231C1D] text-white px-8 py-3 rounded-md text-lg font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={lunaImage}
              alt="Library with books and cat"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      <div className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-[#231C1D] mb-12">
          What We Offer
        </h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-14 h-14 bg-[#5C4A3E] rounded-lg flex items-center justify-center mb-6">
              <div className="text-white text-xl font-bold">B</div>
            </div>
            <h3 className="text-xl font-semibold text-[#231C1D] mb-3">
              Book Management
            </h3>
            <p className="text-[#5C4A3E]">
              Efficiently catalog, track, and manage your entire book collection
              with our intuitive interface.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-14 h-14 bg-[#F2E2AD] rounded-lg flex items-center justify-center mb-6">
              <div className="text-[#231C1D] text-xl font-bold">M</div>
            </div>
            <h3 className="text-xl font-semibold text-[#231C1D] mb-3">
              Member Management
            </h3>
            <p className="text-[#5C4A3E]">
              Keep track of library members, their borrowing history, and manage
              membership renewals seamlessly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-14 h-14 bg-[#231C1D] rounded-lg flex items-center justify-center mb-6">
              <div className="text-white text-xl font-bold">A</div>
            </div>
            <h3 className="text-xl font-semibold text-[#231C1D] mb-3">
              Advanced Analytics
            </h3>
            <p className="text-[#5C4A3E]">
              Gain insights into library usage patterns with comprehensive
              reports and analytics tools.
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 bg-[#231C1D] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <div className="w-24 h-1 bg-[#F2E2AD] mx-auto"></div>
          </div>

          <div className="flex gap-10">
            <div className="bg-[#231C1D]/90 p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 text-[#F2E2AD]">
                Our Story
              </h3>
              <p className="text-lg mb-6 text-[#E1D7C7]">
                LibSynx was founded with a mission to revolutionize library
                management systems for the digital age. Our team combines
                expertise in library science and cutting-edge technology.
              </p>
              <p className="text-lg text-[#E1D7C7]">
                We believe that libraries are essential community resources, and
                our goal is to provide tools that make library management more
                efficient, allowing librarians to focus on what matters most:
                serving their communities.
              </p>
            </div>

            <div className="bg-[#5C4A3E] p-8 rounded-xl shadow-lg">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-[#F2E2AD]">
                  Our Vision
                </h3>
                <p className="text-lg mb-2 text-[#E1D7C7]">
                  To create the most user-friendly, comprehensive library
                  management system that empowers libraries of all sizes to
                  thrive in the digital era.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 text-[#F2E2AD]">
                  Our Values
                </h3>
                <ul className="flex flex-col gap-3">
                  {ourValues.map((value, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-3 h-3 bg-[#F2E2AD] rounded-full mr-3"></span>
                      <span className="text-[#E1D7C7]">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
