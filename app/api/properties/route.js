import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/connectDB";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

// TO USE GET we simply name it GET and method will become GET HTTP method
// GET /api/properties
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || 1;
    const pageSize = searchParams.get("pageSize") || 6;

    const skip = (page - 1) * pageSize;

    const total = await Property.countDocuments({});
    const properties = await Property.find({}).skip(skip).limit(pageSize);
    // const properties = await Property.find({});

    return new Response(JSON.stringify({ total, properties }), {
      status: 200,
    });
  } catch (err) {
    return new Response("Error", { status: 500 });
  }
}

// TO GET BODY FROM REQUEST
// We should use await req.json() to get the body.
// const body = await req.json()

export async function POST(req, { params }) {
  try {
    const formData = await req.formData();
    const dataArray = [];

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
      images,
    } = structuredData;

    const newPropertyData = {
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

    // // UPLOAD IMAGES TO CLOUDINARY
    const imageUploadPromises = [];

    for (const image of images) {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);

      // CONVERT the image data to base64
      const imageBase64 = imageData.toString("base64");

      // Make request to upload to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: "propertypulse",
          transformation: [
            { width: 1000, crop: "scale" },
            { quality: "auto:best" },
            { fetch_format: "auto" },
          ],
        }
      );
      imageUploadPromises.push(result.secure_url);
    }

    // wait for all images to Upload
    const uploadedImages = await Promise.all(imageUploadPromises);
    // Add uploaded images to propertyData object
    newPropertyData.images = uploadedImages;

    await connectDB();
    const newProperty = await Property.create(newPropertyData);

    return new Response(JSON.stringify(newProperty._id), { status: 201 });
  } catch (err) {
    return new Response("Failed", { status: 500 });
  }
}
