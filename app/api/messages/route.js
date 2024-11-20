import connectDB from "@/config/connectDB";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// POST /api/messages
export async function POST(req, { params }) {
  try {
    await connectDB();
    const { name, email, message, phone, recipient, property } =
      await req.json();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 401,
      });
    }

    const { user } = sessionUser;

    // can not send message to self
    if (user.id === recipient) {
      return new Response(
        JSON.stringify({ message: "Cannot send a message to yourself" }),
        {
          status: 400,
        }
      );
    }

    const newMessage = await Message.create({
      sender: user.id,
      recipient,
      property,
      name,
      phone,
      email,
      body: message,
    });

    return new Response(
      JSON.stringify({ message: "Message Sent" }, { status: 200 })
    );
  } catch (err) {
    console.log(err);
    return new Response("Something went wrong", { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 401,
      });
    }
    const { userId } = sessionUser;
    const readMessages = await Message.find({ recipient: userId, read: true })
      .sort({ createdAt: -1 }) // sort read messages in asc order
      .populate("sender", "username")
      .populate("property", "name");
    const undreadMessages = await Message.find({
      recipient: userId,
      read: false,
    })
      .sort({ createdAt: -1 }) // sort read messages in asc order
      .populate("sender", "username")
      .populate("property", "name");

    const messages = [...undreadMessages, ...readMessages];

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (err) {
    return new Response("Something went wrong", { status: 500 });
  }
}
