"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { useState } from "react";
import { toast } from "react-toastify";

function Message({ message }) {
  const [isRead, setIsRead] = useState(message.read);
  const [isDeleted, setIsDeleted] = useState(false);
  const { count, setCount } = useGlobalContext();

  async function handleRead(messageId) {
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
      });
      const data = await res.json();

      if (res.status === 200) {
        setIsRead(data.read);
        setCount((prev) => (isRead ? prev + 1 : prev - 1));

        toast.success(`Marked as ${data.read ? "Read" : "New"}`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  }

  async function handleDelete(messageId) {
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.status === 200) {
        setIsDeleted(true);
        setCount((prev) => prev - 1);

        toast.success("Message Deleted");
      }
    } catch (err) {
      console.log(err);
      toast.error("Message was not deleted");
    }
  }
  if (isDeleted) {
    return null;
  }

  return (
    <div className="relative p-4 bg-white border border-gray-200 rounded-md shadow-md">
      {!isRead && (
        <div className="absolute px-2 py-1 text-white bg-yellow-500 rounded-md top-2 right-2">
          New
        </div>
      )}
      <h2 className="mb-4 text-xl">
        <span className="font-bold">Property Inquiry:</span>{" "}
        {message?.property?.name}
      </h2>
      <p className="text-gray-700">{message.body}</p>

      <ul className="mt-4">
        <li>
          <strong>Name:</strong> {message?.sender?.username}
        </li>

        <li>
          <strong>Reply Email:</strong>{" "}
          <a href={`mailto:${message.email}`} className="text-blue-500">
            {message.email}
          </a>
        </li>
        <li>
          <strong>Reply Phone:</strong>
          <a href={`tel:${message.phone}`} className="text-blue-500">
            {message.phone}
          </a>
        </li>
        <li>
          <strong>Received:</strong>
          {new Date(message.createdAt).toLocaleString()}
        </li>
      </ul>
      <button
        className={`px-3 py-1 mt-4 mr-3 ${
          isRead ? "bg-gray-300 text-black" : "bg-blue-500 text-white"
        }  rounded-md`}
        onClick={() => handleRead(message._id)}
      >
        {isRead ? "Mark as New" : "Mark as read"}
      </button>
      <button
        onClick={() => handleDelete(message._id)}
        className="px-3 py-1 mt-4 text-white bg-red-500 rounded-md"
      >
        Delete
      </button>
    </div>
  );
}

export default Message;
