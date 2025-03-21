import { apiUrl } from "../ApiUrl";
import {
  IRoomJoinedQuery,
  IRoomMemberQuery,
  IRoomSearchQuery,
  IUpdateRoom,
} from "../../../../types/room";

export async function createRoomQuery(data: {
  name: string;
  avatar: string;
  isPublic: boolean;
  description: string;
}) {
  const res = await fetch(`${apiUrl}/room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getRoomsJoinedQuery(): Promise<IRoomJoinedQuery[]> {
  const res = await fetch(`${apiUrl}/user/room-joined`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

export async function requestJoinRoomQuery(roomId: string): Promise<{
  message: string;
  roomId: string;
}> {
  const res = await fetch(`${apiUrl}/room/join/${roomId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function finRoomById(id: string): Promise<{
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  updateAt: string;
}> {
  const res = await fetch(`${apiUrl}/room/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function searchRoomByNameQuery(
  query: string
): Promise<IRoomSearchQuery[]> {
  const res = await fetch(`${apiUrl}/room/search?value=${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getRoomMembersQuery(
  id: string
): Promise<IRoomMemberQuery[]> {
  const res = await fetch(`${apiUrl}/room/members/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getJoinRequestQuery(id: string): Promise<
  {
    id: string;
    userId: string;
    roomId: string;
    createdAt: string;
    udpateAt: string;
    user: { avatar: string; name: string };
  }[]
> {
  const res = await fetch(`${apiUrl}/room/join-request/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function acceptJoinRequestQuery(data: {
  userId: string;
  roomId: string;
}) {
  const res = await fetch(`${apiUrl}/room/accept-join-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function rejectJoinRequestQuery(data: {
  userId: string;
  roomId: string;
}) {
  const res = await fetch(`${apiUrl}/room/reject-join-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function kickUserQuery(data: { userId: string; roomId: string }) {
  const res = await fetch(`${apiUrl}/room/kick`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function banUserQuery(data: { userId: string; roomId: string }) {
  const res = await fetch(`${apiUrl}/room/ban`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getBannedUsersQuery(roomId: string): Promise<
  {
    id: string;
    userId: string;
    roomId: string;
    createdAt: string;
    udpateAt: string;
    user: { avatar: string; name: string };
  }[]
> {
  const res = await fetch(`${apiUrl}/room/banned/${roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function unbanUserQuery(data: { userId: string; roomId: string }) {
  const res = await fetch(`${apiUrl}/room/unban`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function leaveRoomQuery(roomId: string) {
  const res = await fetch(`${apiUrl}/user/leave-room/${roomId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getTotalMembersAmountQuery(roomId: string) {
  const res = await fetch(`${apiUrl}/room/total-member/${roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getTotalJoinRequestAmountQuery(roomId: string) {
  const res = await fetch(`${apiUrl}/room/total-join-request/${roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getTotalBannedUsersAmountQuery(roomId: string) {
  const res = await fetch(`${apiUrl}/room/total-banned/${roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getRoomInfoQuery(roomId: string): Promise<{
  name: string;
  avatar: string;
  isPublic: boolean;
  description: string;
}> {
  const res = await fetch(`${apiUrl}/room/info/${roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function updateRoomQuery(id: string, data: IUpdateRoom) {
  const res = await fetch(`${apiUrl}/room/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function deleteRoomQuery(id: string) {
  const res = await fetch(`${apiUrl}/room/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}
