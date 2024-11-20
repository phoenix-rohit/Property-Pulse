import connectDB from "@/config/connectDB";
import Property from "@/models/Property";

// GET /api/properties/search
export async function GET(req, { params }) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    const propertyType = searchParams.get("propertyType");

    // Match location pattern against database fields
    const locationPattern = new RegExp(location, "i");
    //

    let query = {
      $or: [
        { name: locationPattern },
        { description: locationPattern },
        { "location.address": locationPattern },
        { "location.state": locationPattern },
        { "location.city": locationPattern },
        { "location.pincode": locationPattern },
      ],
    };

    // Only Check for property if its not 'All'
    if (propertyType && propertyType !== "All") {
      const typePattern = new RegExp(propertyType, "i");
      query.type = typePattern;
    }

    const properties = await Property.find(query);

    return new Response(JSON.stringify(properties), { status: 200 });
  } catch (err) {
    return new Response("Something went wrong", { status: 500 });
  }
}
