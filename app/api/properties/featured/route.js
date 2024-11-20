import connectDB from "@/config/connectDB";
import Property from "@/models/Property";

// GET /api/properties/featured
export async function GET(req) {
  try {
    await connectDB();

    const properties = await Property.find({ is_featured: true });

    return new Response(JSON.stringify(properties), {
      status: 200,
    });
  } catch (err) {
    return new Response("Error", { status: 500 });
  }
}
