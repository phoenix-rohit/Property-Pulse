"use client";

import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import Message from "./Message";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/messages");
        if (res.status === 200) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);
  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="bg-blue-50">
      <div className="container max-w-6xl py-24 m-auto">
        <div className="px-6 py-8 m-4 mb-4 bg-white border rounded-md shadow-md md:m-0">
          <h1 className="mb-4 text-3xl font-bold">Your Messages</h1>

          <div className="space-y-4">
            {messages.length === 0 ? (
              <p>You have no Messages</p>
            ) : (
              messages.map((message) => (
                <Message key={message._id} message={message} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Messages;
