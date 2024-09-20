import { IChatting, IConversaton } from "../../../../types/conversation";
import { User } from "../../../../types/user";
import { apiUrl } from "../ApiUrl";

export async function getFriends(): Promise<User[]> {
  const res = await fetch(`${apiUrl}/user/friends`, {
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

export async function getConversationQuery(
  friendId: string
): Promise<IConversaton> {
  const res = await fetch(
    `${apiUrl}/user/conversation?&friend_id=${friendId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function getConversationsQuery(): Promise<IConversaton[]> {
  const res = await fetch(`${apiUrl}/user/conversations`, {
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

export async function getConversationMessagesQuery(
  type: "user" | "room",
  id: string
) {
  const res = await fetch(`${apiUrl}/${type}/conversation/messages?id=${id}`, {
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

export async function getChattingQuery(): Promise<IChatting[]> {
  const res = await fetch(`${apiUrl}/user/chatting`, {
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

export async function blockUserQuery(userId: string) {
  const res = await fetch(`${apiUrl}/user/block/${userId}`, {
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

export async function unfriendQuery(userId: string) {
  const res = await fetch(`${apiUrl}/user/unfriend/${userId}`, {
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
