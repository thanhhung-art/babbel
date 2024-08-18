import { IChatting, IConversaton } from "../../types/conversation";
import { User } from "../../types/user";

const apiUrl = import.meta.env.VITE_API_URL;

export async function verifyUser(): Promise<User> {
  return await fetch("http://localhost:3000/api/auth/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => data.user)
    .catch((err) => {
      throw new Error(err.message);
    });
}

export async function search(value: string, type: "user" | "room") {
  const res = await fetch(`${apiUrl}/${type}/search?value=${value}`, {
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

export async function sendFriendRequestQuery(userId: string, friendId: string) {
  const res = await fetch(
    `http://localhost:3000/api/user/friend-request?user_id=${userId}&friend_id=${friendId}`,
    {
      method: "POST",
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

export async function getFriendRequestQuery(
  userId: string
): Promise<{ id: string; name: string; avatar: string | null }[]> {
  const res = await fetch(`${apiUrl}/user/friend-request?user_id=${userId}`, {
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

export async function acceptFriendRequestQuery(
  userId: string,
  friendId: string
) {
  const res = await fetch(
    `${apiUrl}/user/accept-friend-request?user_id=${userId}&friend_id=${friendId}`,
    {
      method: "POST",
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

export async function createRoomQuery(data: { name: string; avatar: string }) {
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

export async function getRoomsJoinedQuery() {
  const res = await fetch(`${apiUrl}/room/joined`, {
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

export async function requestJoinRoomQuery(roomId: string) {
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

export async function addConversationToChatQuery(
  type: "user" | "room",
  id: string
) {
  const res = await fetch(`${apiUrl}/${type}/add-to-chatting?id=${id}`, {
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

export async function getConversationChattingQuery(): Promise<IChatting[]> {
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
