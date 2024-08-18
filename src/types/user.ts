import { FriendRequest, Friends } from "./friend";
import { Message } from "./message";
import { RoomMember, BannedUser, JoinRequest, RoomAdmin } from "./room";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: Date;
  updateAt: Date;
  rooms: RoomMember[];
  messages: Message[];
  friends: Friends[];
  friendOf: Friends[];
  BannedUser: BannedUser[];
  JoinRequest: JoinRequest[];
  FriendRequest: FriendRequest[];
  RequestFriend: FriendRequest[];
  RoomAdmin: RoomAdmin[];
}
