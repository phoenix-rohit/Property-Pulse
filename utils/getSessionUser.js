import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOptions";

export async function getSessionUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return null;
    }

    return {
      user: session.user,
      userId: session.user.id,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
}
