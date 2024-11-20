import connectDB from "@/config/connectDB";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

// implemented this for deployment
export const dynamic = "force-dynamic";

// PUT /api/message/:id
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 401,
      });
    }

    const { userId } = sessionUser;

    const message = await Message.findById(id);

    if (!message) {
      return new Response(JSON.stringify({ message: "Message not found" }), {
        status: 404,
      });
    }
    // Verify Ownership
    if (message.recipient.toString() !== userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Update message to read/unread depending on the current status
    message.read = !message.read;
    await message.save();

    return new Response(JSON.stringify(message), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 401,
      });
    }

    const { userId } = sessionUser;

    const message = await Message.findById(id);

    if (!message) {
      return new Response(JSON.stringify({ message: "Message not found" }), {
        status: 404,
      });
    }
    // Verify Ownership
    if (message.recipient.toString() !== userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    await message.deleteOne();

    return new Response(JSON.stringify({ message: "Message Deleted" }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
}
