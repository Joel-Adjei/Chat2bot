import UserChat from "@/components/ChatMessage";
import useMessageStore from "@/store/messageStore";
import { BotIcon, LoaderCircle, PlusCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import useAxios from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { images } from "@/assets/assets";

const Chatbox = () => {
  const [input, setInput] = useState<string>("");
  const { messages, addMessage, clearMessages } = useMessageStore();
  const axios = useAxios();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.post("", {
          model: import.meta.env.VITE_OPENAPI_MODEL,
          messages: messages,
          //   reasoning: { enabled: true },
        });
        const botMessage = response.data.choices[0].message;
        addMessage({ role: "assistant", content: botMessage.content });
        return botMessage;
      } catch (error) {
        toast.error("Failed to fetch response from the server.");
        throw new Error("Failed to fetch response from the server.");
      }
    },
  });

  const handleSend = async () => {
    if (input.trim() === "") {
      toast.info("Please enter a message before sending.");
      return;
    }
    setInput("");

    // Add user message
    addMessage({ role: "user", content: input });
    await mutateAsync();
    setInput("");
  };

  useEffect(() => {
    window.scrollTo(0, 80);
  }, [messages]);

  return (
    <div className="">
      <div className="h-dvh w-full relatives flex flex-col bg-white">
        <div className="w-full top-0 bg-blue-50 border-b border-cyan-600 py-2 flex justify-between items-center gap-2 px-4">
          <NavLink to={"/"}>
            <div className="flex items-center">
              <img
                src={images.botImg}
                alt="Logo"
                className="h-8 rounded-full border border-cyan-600 ml-2 mr-2"
              />
              <h3 className="text-lg text-sky-800 font-semibold">Chat2bot</h3>
            </div>
          </NavLink>

          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => clearMessages()}
              className="ml-auto"
            >
              New Chat
              <PlusCircle className="ml-2" size={16} />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-5 space-y-5 overflow-y-auto pb-35">
          {/* <UserChat text="Hello! How can I assist you today?" type="user" /> */}
          {messages.map((msg, index) => (
            <UserChat key={index} text={msg.content} type={msg.role} />
          ))}

          {isPending && (
            <div className="text-left text-sm italic text-gray-500 px-3 py-2 rounded-xl">
              <LoaderCircle
                className="inline-block mr-2 animate-spin"
                size={16}
              />
              Chat2 is typing...
            </div>
          )}
        </div>

        {messages.length === 0 && !isPending && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-500">
            <p className="text-4xl mb-4">Start a new conversation!</p>
            <BotIcon className="mx-auto mb-2" size={48} />
            <p>Ask me anything about your data.</p>
          </div>
        )}

        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-[90%] ">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full min-h-30 max-h-60 border-2 bg-gray-50 border-gray-300 px-3 py-2 rounded-2xl"
            placeholder="Type your message..."
            rows={4}
            disabled={isPending}
          />

          <Button
            onClick={handleSend}
            disabled={isPending}
            className="fixed z-20 size-10 right-4 bottom-4 text-white flex items-center justify-center rounded-full"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
