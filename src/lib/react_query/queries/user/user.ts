import { User } from "../../../../types/user";
import { apiUrl } from "../ApiUrl";

export async function verifyUser(): Promise<User> {
  return await fetch(apiUrl + "/auth/user", {
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
