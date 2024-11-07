import { IMessage } from "./message";

export interface IRoom {
  id: string;
  name: string;
  avatar: string;
  createdAt: Date;
  updateAt: Date;
  members: RoomMember[];
  messages: IMessage[];
  BannedUser: BannedUser[];
  JoinRequest: JoinRequest[];
  RoomAdmin: RoomAdmin[];
}

export interface RoomMember {
  id: string;
  roomId: string;
  userId: string;
  role: string;
  joinedAt: Date;
}

export interface BannedUser {
  id: string;
  userId: string;
  roomId: string;
  bannedAt: Date;
}

export interface JoinRequest {
  id: string;
  userId: string;
  roomId: string;
  createdAt: Date;
  udpateAt: Date;
}

export interface RoomAdmin {
  id: string;
  userId: string;
  roomId: string;
  createdAt: Date;
  udpateAt: Date;
}

export interface IRoomMemberQuery {
  id: string;
  userId: string;
  user: {
    avatar: string;
    name: string;
  };
}

export interface IRoomJoinedQuery {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  updateAt: string;
}

export interface IUpdateRoom {
  name?: string;
  avatar?: string;
  description?: string;
  isPublic?: boolean;
  [key: string]: string | boolean | undefined;
}
