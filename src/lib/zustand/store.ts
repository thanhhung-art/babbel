import { create } from "zustand";
import { IConversaton } from "../../types/conversation";
import { IRoom } from "../../types/room";

type MyStoreState = {
  isOpenSidebarRight: boolean;
  onlineFriends: string[];
  currentConversation: { id: string; friendId: string } | null;
  conversations: (IConversaton | IRoom)[];
  currentFriendId: string;
  currentRoomId: string;
  currentConversationId: string;
};

type MyStoreActions = {
  toggleSidebarRight: () => void;
  setOnlineFriends: (onlineFriends: string[]) => void;
  setCurrentConversation: (conversation: {
    id: string;
    friendId: string;
  }) => void;
  setConversations: (conversation: IConversaton) => void;
  setCurrentFriendId: (friendId: string) => void;
  setCurrentRoomId: (roomId: string) => void;
  setCurrentConversationId: (conversationId: string) => void;
};

const useAppStore = create<MyStoreState & MyStoreActions>((set) => ({
  isOpenSidebarRight: false,
  onlineFriends: [],
  currentConversation: null,
  conversations: [],
  currentFriendId: "",
  currentRoomId: "",
  currentConversationId: "",
  toggleSidebarRight: () =>
    set((state) => ({ isOpenSidebarRight: !state.isOpenSidebarRight })),
  setOnlineFriends: (onlineFriends) => set({ onlineFriends }),
  setCurrentConversation: (currentConversation) => set({ currentConversation }),
  setConversations: (conversation) => set({ conversations: [conversation] }),
  setCurrentFriendId: (currentFriendId) => set({ currentFriendId }),
  setCurrentRoomId: (currentRoomId) => set({ currentRoomId }),
  setCurrentConversationId: (currentConversationId) =>
    set({ currentConversationId }),
}));

export default useAppStore;
