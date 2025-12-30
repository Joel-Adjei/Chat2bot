import { CheckCircleIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
interface ChatMessageProps {
  text: string;
  type: "user" | "assistant";
}

const ChatMessage = ({ text, type }: ChatMessageProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const styling = () => {
    if (type === "assistant") {
      return " rounded-bl-none py-4 px-4 bg-gray-100 text-cyan-900 w-fit text-left";
    } else {
      return " rounded-br-none bg-cyan-900 text-white text-left w-fit ml-auto";
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Message copied to clipboard!");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className={`relative px-3 py-2 rounded-xl w-fit max-w-[80%] ${styling()}`}
    >
      <ReactMarkdown>{text}</ReactMarkdown>
      <button
        onClick={() => handleCopy(text)}
        className={`absolute -bottom-6 ml-2 cursor-pointer hover:text-cyan-600 ${
          type === "user" ? "text-cyan-700 right-0" : "text-gray-500 left-0"
        }`}
      >
        {isCopied ? <CheckCircleIcon size={15} /> : <CopyIcon size={15} />}
      </button>
      {/* <div dangerouslySetInnerHTML={{ __html: text }} /> */}
    </div>
  );

  // return (
  //   <div className={`px-3 py-2 rounded-xl w-fit ${styling()}`}>{text}</div>
  // );
};

export default ChatMessage;
