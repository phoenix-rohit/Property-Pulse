import connectDB from "@/config/connectDB";
import Property from "@/models/Property";

// GET /api/properties/user/:userId
export async function GET(req, { params }) {
  try {
    await connectDB();
    const userId = params.userId;

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    const properties = await Property.find({ owner: userId });
    return new Response(JSON.stringify(properties), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Error", { status: 500 });
  }
}
