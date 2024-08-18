import { useQuery } from "@tanstack/react-query";
import { getConversationChattingQuery } from "../../../lib/react_query/queries";
import { chatting } from "../../../utils/contants";
import Conversation from "./Conversation";

const Conversations = () => {
  const { data, isLoading } = useQuery({
    queryKey: [chatting],
    queryFn: getConversationChattingQuery,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {data &&
        data.map((conversation) => (
          <Conversation conversation={conversation} key={conversation.id} />
        ))}
    </>
  );
};

export default Conversations;
