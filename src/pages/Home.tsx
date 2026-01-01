import { images } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-linear-to-br from-blue-800 to-cyan-950 opacity-90">
      <img
        src={images.bg1}
        alt="Background"
        className="absolute w-full h-full object-cover -z-10 "
      />
      <div className="h-screen w-full bg-linear-to-bl from-sky-950/90 to-cyan-500/40 text-center flex flex-col justify-center items-center">
        <img
          src={images.botTyping}
          alt="Chat2bot Logo"
          className="size-35 md:size-52 rounded-full border-5 border-sky-500 mb-"
        />
        <h2 className="text-4xl md:text-7xl bg-linear-to-l from-sky-100 to-sky-300 bg-clip-text text-transparent font-extrabold mb-4 ">
          Welcome to Chat2bot
        </h2>
        <p className="mb-4 text-white ">Your AI-powered chatbot application.</p>

        <div>
          <Button
            size="lg"
            onClick={() => {
              navigate("/chat");
            }}
            className="h-12 bg-cyan-400 text-sky-950 hover:bg-cyan-300 shadow"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
