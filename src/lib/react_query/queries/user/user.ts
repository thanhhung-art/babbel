import { IUsersSearchQuery, User } from "../../../../types/user";
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

export async function getConversationInfoQuery(id: string): Promise<{
  id: string;
  createdAt: string;
  updateAt: string;
  participants: {
    id: string;
    email: string;
    avatar: string;
    name: string;
  }[];
}> {
  const res = await fetch(apiUrl + "/user/conversation/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get conversation info");
  }

  return res.json();
}

export async function updateProfileQuery(data: {
  email?: string;
  name?: string;
  avatar?: string;
}): Promise<User> {
  const res = await fetch(apiUrl + "/user/update-profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return res.json();
}

export async function resetPassword(oldPassword: string, newPassword: string) {
  const res = await fetch(apiUrl + "/user/reset-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw { status: res.status, message: errorData.message };
  }

  return res.json();
}

export async function logout() {
  const res = await fetch(apiUrl + "/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to logout");
  }

  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(apiUrl + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message);
  }

  return res.json();
}

export async function registerQuery(
  email: string,
  name: string,
  password: string
) {
  const res = await fetch(apiUrl + "/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message);
  }

  return res.json();
}

export async function searchUsersQuery(
  query: string
): Promise<IUsersSearchQuery[]> {
  const res = await fetch(apiUrl + "/user/search?value=" + query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to search users");
  }

  return res.json();
}
