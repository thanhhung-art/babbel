import { IMessage } from "./message";
import { IRoom } from "./room";
import { User } from "./user";

export interface IConversaton {
  id: string;
  friendId: string;
  participants: User[];
  messages: IMessage[];
  createdAt: Date;
  updateAt: Date;
}

export interface IChatting {
  id: string;
  userId: string;
  user: User;
  conversationId: string | null;
  conversation: IConversaton | null;
  roomId: string | null;
  room: IRoom | null;
  createdAt: Date;
  updateAt: Date;
}
