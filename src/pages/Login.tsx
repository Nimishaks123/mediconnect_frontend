import Header from "../components/layout/Header";
import LoginForm from "../components/auth/LoginForm";
import Footer from "../components/layout/Footer";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 bg-gray-100">
        <LoginForm />
      </main>
      <Footer/>
    </div>
  );
}
