import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import OtpForm from "../components/auth/OtpForm";

const OtpPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div
        className="w-full h-64 md:h-80 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80&auto=format&fit=crop')",
        }}
      />

      <main className="flex-1 bg-gray-100">
        <div className="container mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
            Verify Your Email
          </h1>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div className="bg-white rounded-b-3xl rounded-t-lg shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=80&auto=format&fit=crop"
                alt="Doctor consulting"
                className="w-full h-80 object-cover"
              />
            </div>

            <OtpForm />  
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OtpPage;
