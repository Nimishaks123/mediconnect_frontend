import BgImage from "../assets/bg.jpeg";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SignUpForm from "../components/auth/SignUpForm";

const SignUp = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BgImage})` }}
        ></div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          <SignUpForm />  
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUp;
