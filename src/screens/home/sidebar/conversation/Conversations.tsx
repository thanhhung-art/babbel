import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatting } from "../../../../utils/contants";
import Conversation from "./Conversation";
import { getChattingQuery } from "../../../../lib/react_query/queries/user/friend";
import { removeChattingConveration } from "../../../../lib/react_query/queries/user/user";
import SearchChatting from "../../../../components/search/SearchChatting";

const Conversations = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: [chatting],
    queryFn: getChattingQuery,
  });

  const removeChattingMutation = useMutation({
    mutationFn: (id: string) => removeChattingConveration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [chatting] });
    },
  });

  const handleRemoveChatting = (id: string) => {
    removeChattingMutation.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;

  if (data?.length === 0)
    return (
      <h3 className="text-center mt-4 text-slate-600">No conversations</h3>
    );

  return (
    <div>
      <SearchChatting />
      {data &&
        data.map((conversation) => (
          <Conversation
            key={conversation.id}
            handleRemoveChatting={handleRemoveChatting}
            conversationId={conversation.conversationId}
            roomId={conversation.roomId}
          />
        ))}
    </div>
  );
};

export default Conversations;
