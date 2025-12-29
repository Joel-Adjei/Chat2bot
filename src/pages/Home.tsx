import { images } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <img
        src={images.bg1}
        alt="Background"
        className="absolute w-full h-full object-cover -z-10"
      />
      <div className="h-screen w-full bg-blue-950/30 text-center flex flex-col justify-center items-center">
        <h2 className="text-4xl md:text-8xl bg-linear-to-l from-sky-300 to-cyan-800 bg-clip-text text-transparent font-extrabold mb-4 ">
          Welcome to Chat2bot
        </h2>
        <p className="mb-8 text-white ">Your AI-powered chatbot application.</p>

        <div>
          <Button
            size="lg"
            onClick={() => {
              navigate("/chat");
            }}
            className="h-12"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
