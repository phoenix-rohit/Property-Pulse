import connectDB from "@/config/connectDB";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// api/bookmarks/
export async function POST(req) {
  try {
    await connectDB();

    const { propertyId } = await req.json();
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }
    const { userId } = sessionUser;
    // Find user in Database
    const user = await User.findOne({ _id: userId });

    // Check is property is Bookmarked
    let isBookmarked = user.bookmarks.includes(propertyId);

    return new Response(JSON.stringify({ isBookmarked }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    new Response("Something went wrong", { status: 500 });
  }
}
