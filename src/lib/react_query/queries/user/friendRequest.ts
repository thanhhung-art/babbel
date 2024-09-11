import { apiUrl } from "../ApiUrl";

export async function sendFriendRequestQuery(friendId: string) {
  const res = await fetch(
    `${apiUrl}/user/friend-request?friend_id=${friendId}`,
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

  return await res.json();
}

export async function getFriendRequestQuery(): Promise<
  { id: string; name: string; avatar: string | null }[]
> {
  const res = await fetch(`${apiUrl}/user/friend-request`, {
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

export async function getRequestFriendQuery(): Promise<
  { id: string; name: string; avatar: string | null }[]
> {
  const res = await fetch(`${apiUrl}/user/request-friend`, {
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

export async function deleteFriendRequestQuery(requestId: string) {
  const res = await fetch(`${apiUrl}/user/friend-request/${requestId}`, {
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

export async function acceptFriendRequestQuery(friendId: string) {
  const res = await fetch(
    `${apiUrl}/user/accept-friend-request?friend_id=${friendId}`,
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
