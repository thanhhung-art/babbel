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

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col space-y-4 w-full px-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] px-4">
        <div className="text-center space-y-3">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">
            No conversations yet
          </h3>
          <p className="text-sm text-gray-500">
            Start a new conversation or join a room to chat
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-2 pt-1 pb-0">
        <SearchChatting />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          {data.map((conversation) => (
            <Conversation
              key={conversation.id}
              handleRemoveChatting={handleRemoveChatting}
              conversationId={conversation.conversationId}
              roomId={conversation.roomId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
