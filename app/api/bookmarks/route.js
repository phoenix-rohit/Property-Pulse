import connectDB from "@/config/connectDB";
import Property from "@/models/Property";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
// Not Working Fix
export const dynamic = "force-dynamic";

// GET /api/bookmarks
export async function GET(req) {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }
    const { userId } = sessionUser;

    // Find user in Database
    const user = await User.findOne({ _id: userId });

    // Get users bookmarks from properties
    const bookmarks = await Property.find({ _id: { $in: user.bookmarks } });

    return new Response(JSON.stringify(bookmarks), { status: 200 });
  } catch (err) {
    return new Response("Something went wrong", { status: 500 });
  }
}

// POST api/bookmarks
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
    let message;

    // false
    if (!isBookmarked) {
      user.bookmarks.push(propertyId);
      message = "Bookmarked added successfully";
      isBookmarked = true;
    } else {
      user.bookmarks.pull(propertyId);
      message = "Bookmark removed successfully";
      isBookmarked = false;
    }

    await user.save();

    return new Response(JSON.stringify({ message, isBookmarked }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    new Response("Something went wrong", { status: 500 });
  }
}
