import connectDB from "@/config/connectDB";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/properties/:id
export async function GET(req, { params }) {
  try {
    await connectDB();
    const property = await Property.findById(params.id);
    if (!property) return new Response("Property Not Found", { status: 404 });

    return new Response(JSON.stringify(property), { status: 200 });
  } catch (err) {
    return new Response("Failed to Fetch the data ..", { status: 500 });
  }
}

// DELETE /api/properties/:id
export async function DELETE(req, { params }) {
  try {
    const { id: propertyId } = params;
    const sessionUser = await getSessionUser();

    // CHECK for Session
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;
    await connectDB();

    const property = await Property.findById(propertyId);

    if (!property) return new Response("Property Not Found", { status: 404 });

    if (property.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    await property.deleteOne();

    return new Response("Data Deleted", { status: 200 });
  } catch (err) {
    return new Response("Failed to Fetch the data", { status: 500 });
  }
}

// PUT /api/properties/:id
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const formData = await req.formData();
    const dataArray = [];
    const { id } = params;

    // Extract data from FormData into an array
    for (const [name, value] of formData.entries()) {
      dataArray.push({ name, value });
    }

    const structuredData = {};

    // Helper function to set nested properties
    function setNestedProperty(obj, path, value) {
      // separates object and array
      // ex:-location[address] to => ['location', 'address'] so that we can check take out
      const keys = path.replace(/\[(\w+)\]/g, ".$1").split(".");
      keys.reduce((acc, key, idx) => {
        if (idx === keys.length - 1) {
          acc[key] = value;
        } else {
          // checks if its an array or an object
          acc[key] = acc[key] || (isNaN(keys[idx + 1]) ? {} : []);
        }
        return acc[key];
      }, obj);
    }

    // Loop through extracted array to structure data
    dataArray.forEach(({ name, value }) => {
      // Handle files separately if needed (e.g., for cloud storage)
      setNestedProperty(structuredData, name, value);
    });

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;

    const {
      type,
      name,
      description,
      location,
      beds,
      baths,
      square_feet,
      amenities,
      rates,
      seller_info,
    } = structuredData;

    // GET property to update
    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return new Response("Property doesnt exist", { status: 404 });
    }

    // VERIFY ownership
    if (existingProperty.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const updatedPropertyData = {
      name,
      type,
      amenities,
      description,
      location,
      beds,
      baths,
      square_feet,
      rates,
      seller_info,
      owner: userId,
    };

    // UPDATE Property in Database
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updatedPropertyData
    );

    return new Response(JSON.stringify(updatedProperty), { status: 200 });
  } catch (err) {
    return new Response("Failed", { status: 500 });
  }
}
