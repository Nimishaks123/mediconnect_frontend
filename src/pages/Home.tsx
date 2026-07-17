import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useNavigate } from "react-router-dom";

import DentalImg from "../assets/teeth.png";
import BonesImg from "../assets/leg.png";
import DiagnosisImg from "../assets/diagnosis.png";
import CardiologyImg from "../assets/seek.png";
import EyeImg from "../assets/sek2.png";
import { getPlatformStats } from '../api/homeApi';
import type{ PlatformStats } from '../types/home';
import { getVerifiedDoctors, getDoctorSpecialties } from '../api/doctors';
import { ROUTES } from '../constants/routes';
import defaultDoctor from '../assets/default-doctor.jpeg';

const HomePage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [availability, setAvailability] = useState('');
  const [experience, setExperience] = useState('');
  const [specialtiesList, setSpecialtiesList] = useState<string[]>([]);

  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [featuredDoctors, setFeaturedDoctors] = useState<any[]>([]);

  useEffect(() => {
    document.title = "MediConnect - Expert Healthcare";

    const fetchHomeData = async () => {
      try {
        const statsData = await getPlatformStats();
        setStats(statsData);

        const doctorsRes = await getVerifiedDoctors({ limit: 6 });
        // The API usually returns { data: { doctors: [...] } } or { data: [...] } depending on pagination
        if (doctorsRes.data && doctorsRes.data.data && Array.isArray(doctorsRes.data.data.doctors)) {
          setFeaturedDoctors(doctorsRes.data.data.doctors);
        } else if (doctorsRes.data && Array.isArray(doctorsRes.data.doctors)) {
          setFeaturedDoctors(doctorsRes.data.doctors);
        } else if (doctorsRes.data && Array.isArray(doctorsRes.data)) {
           setFeaturedDoctors(doctorsRes.data);
        }
        
        const specialtiesRes = await getDoctorSpecialties();
        if (specialtiesRes.data && Array.isArray(specialtiesRes.data)) {
          setSpecialtiesList(specialtiesRes.data);
        }
      } catch (error) {
        console.error("Failed to load home data", error);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery && !speciality && !availability && !experience) {
      setSearchError("Please enter at least one search criterion to find doctors.");
      return;
    }

    if (trimmedQuery) {
      if (trimmedQuery.length < 2) {
        setSearchError("Search must be at least 2 characters.");
        return;
      }
      if (!/^[a-zA-Z\s.'-]+$/.test(trimmedQuery)) {
        setSearchError("Only letters, spaces, apostrophes, hyphens, and periods are allowed.");
        return;
      }
    }
    setSearchError('');

    const params = new URLSearchParams();
    if (trimmedQuery) params.append("searchQuery", trimmedQuery);
    if (speciality) params.append("specialty", speciality);
    if (availability) params.append("availability", availability);
    if (experience) params.append("experience", experience);

    navigate(`/doctors?${params.toString()}`);
  };

  const services = [
    {
      title: 'Dental treatments',
      description: 'Comprehensive dental care for all your oral health needs, ensuring a bright and healthy smile.',
      image: DentalImg,
    },
    {
      title: 'Bones treatments',
      description: 'Expert orthopedic care for bone and joint health, helping you stay active and pain-free.',
      image: BonesImg,
    },
    {
      title: 'Diagnosis',
      description: 'Advanced diagnostic services for accurate health assessment and timely treatments.',
      image: DiagnosisImg,
    },
    {
      title: 'Cardiology',
      description: 'Specialized heart care from experienced cardiologists dedicated to your cardiovascular health.',
      image: CardiologyImg,
    },
    {
      title: 'Surgery',
      description: 'State-of-the-art surgical procedures with expert surgeons for safe and effective recovery.',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop',
    },
    {
      title: 'Eye care',
      description: 'Comprehensive eye care and vision health services to protect and improve your sight.',
      image: EyeImg
    },
  ];

  const testimonials = [
    {
      name: 'John Carter',
      role: 'Patient',
      quote: 'Booking an appointment was incredibly easy, and the doctor was very professional and attentive.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      name: 'Sophie Moore',
      role: 'Patient',
      quote: 'The video consultation feature saved me a lot of time. The care provided was top-notch.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      name: 'Andy Smith',
      role: 'Patient',
      quote: 'Highly recommend MediConnect. I found a great specialist in minutes and got my digital prescription securely.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
     
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Health, Expert Care, One Platform.
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Experience world-class healthcare with top specialists. Book appointments securely, consult via video, and manage your health records effortlessly.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate("/doctors")} className="px-8 py-4 bg-mediconnect-green text-white rounded-lg font-semibold hover:opacity-90 transition-colors shadow-lg">
                  Book Appointment
                </button>
                <button onClick={() => navigate("/doctor/onboarding")} className="px-8 py-4 border-2 border-mediconnect-green text-mediconnect-green rounded-lg font-semibold hover:bg-teal-50 transition-colors">
                  Become a Doctor
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=700&fit=crop"
                  alt="Doctor"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-lg shadow-lg">
                  <span className="text-sm font-semibold text-mediconnect-green">Verified Experts</span>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden flex items-center justify-center">
                          <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Top Specialists</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-mediconnect-green to-mediconnect-green rounded-full opacity-20 blur-3xl -z-10 transform scale-150"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">Find A Doctor</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4 mb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (searchError) setSearchError('');
                  }}
                  placeholder="Search By Doctor Name"
                  className={`flex-1 px-4 py-3 border ${searchError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-mediconnect-green'} rounded-lg focus:outline-none focus:ring-2`}
                />
                <button onClick={handleSearch} className="px-8 py-3 bg-mediconnect-green text-white rounded-lg font-semibold hover:opacity-90 transition-colors">
                  Search
                </button>
              </div>
              {searchError && (
                <p className="text-red-500 text-sm mb-4">{searchError}</p>
              )}
              <div className={`grid md:grid-cols-3 gap-4 ${!searchError ? 'mt-4' : ''}`}>
                <select
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mediconnect-green bg-white"
                >
                  <option value="">Speciality</option>
                  {specialtiesList.map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mediconnect-green bg-white"
                >
                  <option value="">Availability</option>
                  <option value="today">Today</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                </select>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mediconnect-green bg-white"
                >
                  <option value="">Experience</option>
                  <option value="1-5">1-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Our Platform at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-mediconnect-green mb-2">
                {stats ? stats.verifiedDoctors : "-"}
              </div>
              <div className="text-gray-700 font-medium">Verified Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-mediconnect-green mb-2">
                {stats ? stats.registeredPatients : "-"}
              </div>
              <div className="text-gray-700 font-medium">Registered Patients</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-mediconnect-green mb-2">
                {stats ? stats.completedAppointments : "-"}
              </div>
              <div className="text-gray-700 font-medium">Completed Appointments</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-mediconnect-green mb-2">
                {stats ? stats.medicalSpecialties : "-"}
              </div>
              <div className="text-gray-700 font-medium">Medical Specialties</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose MediConnect?
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We bring modern healthcare to your fingertips. Book appointments with fully verified doctors, manage payments via an integrated wallet, and access your digital prescriptions easily. 
              </p>
              <ul className="space-y-4 mb-8 text-gray-700">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">✓</div>
                  <strong>Verified Doctors:</strong> Only certified experts join our platform.
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">✓</div>
                  <strong>Secure Appointments:</strong> Fast and reliable online bookings.
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">✓</div>
                  <strong>Wallet Support:</strong> Hassle-free and secure payments.
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">✓</div>
                  <strong>Video Consultation:</strong> Connect with doctors from anywhere.
                </li>
              </ul>
              <button onClick={() => navigate("/doctors")} className="px-8 py-4 bg-mediconnect-green text-white rounded-lg font-semibold hover:opacity-90 transition-colors">
                Explore Doctors
              </button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=500&fit=crop"
                alt="Healthcare platform"
                className="rounded-lg shadow-2xl border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">Services we provide</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            From general check-ups to specialist care and diagnostics — all your healthcare needs in one place
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">Featured Doctors</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Meet our highly rated and trusted medical professionals.
          </p>
          
          {featuredDoctors.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-gray-100">
              <p>No featured doctors available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredDoctors.map((doc, index) => (
                <div 
                  key={index} 
                  onClick={() => navigate(ROUTES.DOCTOR_DETAILS(doc.doctorId))}
                  className="flex flex-col h-full text-center bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative inline-block mb-4">
                    <img
                      src={doc.photo || defaultDoctor}
                      alt={doc.name || "Doctor"}
                      className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-mediconnect-green bg-gray-100"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{doc.name}</h3>
                  <p className="text-mediconnect-green font-semibold mb-2">{doc.specialty}</p>
                  
                  {doc.experience > 0 && (
                    <p className="text-gray-500 text-sm mb-1">{doc.experience} Year{doc.experience > 1 ? 's' : ''} Experience</p>
                  )}
                  
                  {doc.consultationFee > 0 && (
                    <p className="text-gray-700 font-medium text-sm mb-4">₹{doc.consultationFee} Consultation Fee</p>
                  )}
                  
                  <div className="mt-auto pt-4">
                    <button 
                      className="w-full px-4 py-2 border-2 border-mediconnect-green text-mediconnect-green rounded-lg font-semibold group-hover:bg-mediconnect-green hover:bg-mediconnect-green hover:text-white transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">Patient Testimonials</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Real stories and real care. Hear from patients who have experienced our trusted services.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-2 border-mediconnect-green"
                />
                <p className="text-gray-700 text-center mb-6 italic">"{testimonial.quote}"</p>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-mediconnect-green">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Your health deserves expert care.
          </h2>
          <p className="text-xl text-teal-50 mb-10 max-w-2xl mx-auto">
            Find trusted doctors. Book appointments online. Consult from anywhere securely and reliably.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigate("/doctors")} className="px-8 py-4 bg-white text-mediconnect-green rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-xl">
              Book Appointment
            </button>
            <button onClick={() => navigate("/doctor/onboarding")} className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-teal-700 transition-colors">
              Join as Doctor
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;