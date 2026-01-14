// // pages/ForgotPassword.tsx
// import { useState } from "react";
// import Header from "../components/layout/Header";
// import Footer from "../components/layout/Footer";
// import doctorImage from "../assets/doc.png"
// import hospitalImage from "../assets/hospital.png"

// // const hospitalImage =
// //   "https://images.unsplash.com/photo-1576765974102-b756026ece4b?w=1200&q=80&auto=format&fit=crop";

// // const doctorImage =
// //   "https://images.unsplash.com/photo-1584466977773-3790e9b97a45?w=800&q=80&auto=format&fit=crop";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email.trim()) return;
//     // TODO: hook this up to backend reset-password endpoint
//     setSubmitted(true);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       <Header />

//       {/* Top hero image */}
//       <div className="w-full h-64 md:h-80 overflow-hidden">
//         <img
//           src={hospitalImage}
//           alt="Hospital building"
//           className="w-full h-full object-cover"
//         />
//       </div>

//       <main className="flex-1 bg-gray-100">
//         <section className="max-w-5xl mx-auto px-6 py-16">
//           <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
//             Find Your Account
//           </h1>

//           <div className="grid md:grid-cols-2 gap-10 items-center bg-white rounded-2xl shadow-xl px-6 py-10 md:px-10">
//             {/* Left: doctor image */}
//             <div className="flex justify-center">
//               <div className="overflow-hidden rounded-3xl shadow-lg w-full max-w-md">
//                 <img
//                   src={doctorImage}
//                   alt="Doctor talking with patient"
//                   className="w-full h-80 object-cover"
//                 />
//               </div>
//             </div>

//             {/* Right: form */}
//             <div className="w-full max-w-md mx-auto">
//               <p className="text-sm text-gray-600 mb-4">
//                 Please enter your email address to search for your account.
//               </p>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="nimisha@email.com"
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mediconnect-teal"
//                 />

//                 <button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-800 transition-colors"
//                 >
//                   Submit
//                 </button>
//               </form>

//               {submitted && (
//                 <p className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
//                   If an account exists for{" "}
//                   <span className="font-semibold">{email}</span>, we&apos;ll send
//                   password reset instructions.
//                 </p>
//               )}
//             </div>
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// }