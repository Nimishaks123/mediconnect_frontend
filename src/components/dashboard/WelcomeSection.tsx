import { useAppSelector } from "../../store/hooks";

const WelcomeSection = () => {
  const user = useAppSelector(
    (state) => state.auth.user
  );

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good Morning";
    }

    if (hour < 18) {
      return "Good Afternoon";
    }

    return "Good Evening";
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold">
          Welcome back, {user?.name} !
          
        </h1>

        <p className="text-gray-500 mt-2">
          Here’s your healthcare overview
        </p>
      </div>

      <div className="text-right">
        <p className="text-gray-700 font-medium">
          {getGreeting()}
        </p>

        <p className="text-gray-500 text-sm">
          {new Date().toDateString()}
        </p>
      </div>
    </div>
  );
};

export default WelcomeSection;