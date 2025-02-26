import { FriendRequest, Friends } from "./friend";
import { IMessage } from "./message";
import { RoomMember, BannedUser, JoinRequest, RoomAdmin } from "./room";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: Date;
  updateAt: Date;
  rooms: RoomMember[];
  messages: IMessage[];
  friends: Friends[];
  friendOf: Friends[];
  BannedUser: BannedUser[];
  JoinRequest: JoinRequest[];
  FriendRequest: FriendRequest[];
  RequestFriend: FriendRequest[];
  RoomAdmin: RoomAdmin[];
}

export interface IUsersSearchQuery {
  id: string;
  email: string;
  avatar: string;
  createdAt: string;
  updateAt: string;
  name: string;
}