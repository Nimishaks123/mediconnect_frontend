import EmailForm from "../components/forgot/EmailForm";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import hospitalImage from "../assets/hospital.png";

export default function ForgotPasswordEmailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="w-full h-64 overflow-hidden">
        <img src={hospitalImage} className="w-full h-full object-cover" />
      </div>

      <main className="flex-1 bg-gray-100 py-16">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-4">Find Your Account</h2>
          <p className="text-gray-600 text-center mb-6">
            Enter your registered email to reset your password.
          </p>

          <EmailForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
