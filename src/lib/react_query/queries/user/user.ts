import { User } from "../../../../types/user";
import { apiUrl } from "../ApiUrl";

export async function verifyUser(): Promise<User> {
  const res = await fetch(apiUrl + "/auth/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to verify user");
  }

  return res.json();
}

export async function removeChattingConveration(id: string) {
  const res = await fetch(apiUrl + "/user/chatting/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to remove conversation");
  }

  return res.json();
}

export async function checkRoomAdminQuery(
  id: string
): Promise<{ isAdmin: boolean }> {
  const res = await fetch(apiUrl + "/user/check-admin/" + id, {
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
