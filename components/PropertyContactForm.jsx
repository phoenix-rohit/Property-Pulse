"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";

function PropertyContactForm({ property }) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [wasSubmitted, setWasSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      name,
      email,
      message,
      phone,
      recipient: property.owner,
      property: property._id,
    };

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();

      if (res.status === 200) {
        toast.success("Message send successfully");
        setWasSubmitted(true);
      } else if (res.status === 400 || res.status === 401) {
        toast.error(resData.message);
      } else {
        toast.error(resData.message);
      }
    } catch (err) {
      toast.error("Error sending form");
    } finally {
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="mb-6 text-xl font-bold text-blue-500">
        Contact Property Manager
      </h3>
      {!session ? (
        <p>You must be logged in to send a message</p>
      ) : wasSubmitted ? (
        <p className="mb-4 text-green-500">
          Your message has been sent successfully
        </p>
      ) : (
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="name"
            >
              Name:
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="phone"
            >
              Phone:
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="phone"
              name="phone"
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="message"
            >
              Message:
            </label>
            <textarea
              className="w-full px-3 py-2 text-gray-700 border rounded shadow appearance-none h-44 focus:outline-none focus:shadow-outline"
              id="message"
              name="message"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div>
            <button
              className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <FaPaperPlane className="mr-2" /> Send Message
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PropertyContactForm;
