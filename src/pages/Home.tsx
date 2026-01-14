import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useNavigate } from "react-router-dom";

import DentalImg from "../assets/teeth.png";
import BonesImg from "../assets/leg.png";
import DiagnosisImg from "../assets/diagnosis.png";
import CardiologyImg from "../assets/seek.png";
import EyeImg from "../assets/sek2.png";


const HomePage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [availability, setAvailability] = useState('');
  const [experience, setExperience] = useState('');

  const teamMembers = [
    { name: 'John Carter', role: 'CEO & CO-FOUNDER', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
    { name: 'Sophie Moore', role: 'DENTAL SPECIALIST', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
    { name: 'Matt Cannon', role: 'ORTHOPEDIC', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
    { name: 'Andy Smith', role: 'BRAIN SURGEON', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
    { name: 'Lily Woods', role: 'HEART SPECIALIST', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
    { name: 'Patrick Meyer', role: 'EYE SPECIALIST', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop' },
  ];

  const services = [
    {
      title: 'Dental treatments',
      description: 'Comprehensive dental care for all your oral health needs',
      image: DentalImg,
    },
    {
      title: 'Bones treatments',
      description: 'Expert orthopedic care for bone and joint health',
      image: BonesImg,
    },
    {
      title: 'Diagnosis',
      description: 'Advanced diagnostic services for accurate health assessment',
      image: DiagnosisImg,
    },
    {
      title: 'Cardiology',
      description: 'Specialized heart care from experienced cardiologists',
      image: CardiologyImg,
    },
    {
      title: 'Surgery',
      description: 'State-of-the-art surgical procedures with expert surgeons',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop',
    },
    {
      title: 'Eye care',
      description: 'Comprehensive eye care and vision health services',
      image: EyeImg
    },
  ];

  const testimonials = [
    {
      name: 'John Carter',
      role: 'CLO at Google',
      quote: 'An amazing service',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      name: 'Sophie Moore',
      role: 'MD at Facebook',
      quote: 'One of a kind service',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      name: 'Andy Smith',
      role: 'CEO Dot Austere',
      quote: 'The best service',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
  
      <Header/>
     
<section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Delivering Quality Healthcare For A Healthier Tomorrow
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We Are Committed To Delivering World-Class Healthcare With Compassion, Innovation, And Integrity — Ensuring Every Patient And Their Family Receive The Care They Truly Deserve
              </p>
              <div className="flex flex-wrap gap-4">
                <button  onClick={() => navigate("/doctors")} className="px-8 py-4 bg-mediconnect-teal text-black rounded-lg font-semibold hover:bg-mediconnect-green transition-colors">
                  Appointments
                </button>
                <button className="flex items-center space-x-3 px-8 py-4 text-mediconnect-teal hover:text-mediconnect-green transition-colors">
                  <div className="w-12 h-12 bg-mediconnect-teal rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">▶</span>
                  </div>
                  <span className="font-semibold">Watch Video</span>
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
                  <span className="text-sm font-semibold text-mediconnect-teal">24/7 service</span>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Our Professionals</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-mediconnect-green to-mediconnect-teal rounded-full opacity-20 blur-3xl -z-10 transform scale-150"></div>
            </div>
          </div>
        </div>
      </section>

   
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">Find A Doctor</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search By Doctor Name"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mediconnect-teal"
                />
                <button className="px-8 py-3 bg-mediconnect-teal text-white rounded-lg font-semibold hover:bg-mediconnect-green transition-colors">
                  Search By Doctor Name
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <select
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mediconnect-teal"
                >
                  <option value="">Speciality</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="orthopedic">Orthopedic</option>
                  <option value="dental">Dental</option>
                  <option value="surgery">Surgery</option>
                </select>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mediconnect-teal"
                >
                  <option value="">Availability</option>
                  <option value="today">Today</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                </select>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mediconnect-teal"
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


      <section className="py-16 bg-white">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
      Our Impact at a Glance
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="text-center">
        <div className="text-5xl font-bold text-mediconnect-teal mb-2">99%</div>
        <div className="text-gray-700">Customer satisfaction</div>
      </div>

      <div className="text-center">
        <div className="text-5xl font-bold text-mediconnect-teal mb-2">15k</div>
        <div className="text-gray-700">Online Patients</div>
      </div>

      <div className="text-center">
        <div className="text-5xl font-bold text-mediconnect-teal mb-2">12k</div>
        <div className="text-gray-700">Patients Recovered</div>
      </div>

      <div className="text-center">
        <div className="text-5xl font-bold text-mediconnect-teal mb-2">240%</div>
        <div className="text-gray-700">Company growth</div>
      </div>
    </div>
  </div>
</section>



      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                You have lots of reasons to choose us
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Experience seamless healthcare management with our comprehensive platform. Schedule appointments online with ease, connect with top-rated doctors in your area, and manage your health records securely. Our system sends timely reminders for your appointments and medications, ensuring you never miss important healthcare milestones. Enjoy convenient video consultations from the comfort of your home, making quality healthcare accessible whenever you need it.
              </p>
              <button className="px-8 py-4 bg-mediconnect-teal text-white rounded-lg font-semibold hover:bg-mediconnect-green transition-colors">
                Get started
              </button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=500&fit=crop&grayscale"
                alt="Surgical operation"
                className="rounded-lg shadow-2xl"
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
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <a href="#" className="text-mediconnect-teal font-semibold hover:text-mediconnect-green">
                    Learn more →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">Meet our team members</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Our dedicated team of experienced doctors and specialists are committed to providing you with the highest quality healthcare services.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-mediconnect-teal"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    <a href="#" className="w-8 h-8 bg-mediconnect-teal rounded-full flex items-center justify-center text-white hover:bg-mediconnect-green transition-colors">
                      <span className="text-xs">f</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-mediconnect-teal rounded-full flex items-center justify-center text-white hover:bg-mediconnect-green transition-colors">
                      <span className="text-xs">🐦</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-mediconnect-teal rounded-full flex items-center justify-center text-white hover:bg-mediconnect-green transition-colors">
                      <span className="text-xs">📷</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-mediconnect-teal rounded-full flex items-center justify-center text-white hover:bg-mediconnect-green transition-colors">
                      <span className="text-xs">in</span>
                    </a>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-mediconnect-teal font-semibold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

   
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">Testimonial</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Hear from our patients about their experiences with our doctors and healthcare services. Real stories, real care, and trusted results.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                />
                <p className="text-gray-700 text-center mb-4 italic">"{testimonial.quote}"</p>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8 space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-mediconnect-teal"></div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 text-center">
          <p className="text-2xl font-semibold text-gray-700 mb-4">
            Trusted by 50,000+ patients nationwide
          </p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-mediconnect-teal"></div>
            ))}
          </div>
        </div>
      </section>
     <Footer/>
    </div>
  );
};

export default HomePage;