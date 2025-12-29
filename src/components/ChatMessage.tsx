interface ChatMessageProps {
  text: string;
  type: "user" | "assistant";
}

const ChatMessage = ({ text, type }: ChatMessageProps) => {
  const styling = () => {
    if (type === "assistant") {
      return " rounded-bl-none bg-gray-200 text-gray-900 w-fit text-left";
    } else {
      return " rounded-br-none bg-amber-900 text-white text-right w-fit ml-auto";
    }
  };

  if (type === "assistant") {
    return (
      <div className={`px-3 py-2 rounded-xl w-fit ${styling()}`}>
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    );
  }

  return (
    <div className={`px-3 py-2 rounded-xl w-fit ${styling()}`}>{text}</div>
  );
};

export default ChatMessage;
