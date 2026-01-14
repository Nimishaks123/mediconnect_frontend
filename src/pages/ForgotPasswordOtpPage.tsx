import OtpForm from "../components/forgot/OtpForm";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function ForgotPasswordOtpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 bg-gray-100 py-20">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-4">Verify OTP</h2>
          <p className="text-gray-600 text-center mb-6">
            Enter the 6-digit OTP sent to your email.
          </p>

          <OtpForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
