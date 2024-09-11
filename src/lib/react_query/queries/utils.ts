import { apiUrl } from "./ApiUrl";

export async function search(
  value: string,
  type: "user" | "room",
  status: "friend" | "unfriend" | "joined" | "unjoined"
) {
  const res = await fetch(
    `${apiUrl}/${type}/search?value=${value}&status=${status}`,
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
