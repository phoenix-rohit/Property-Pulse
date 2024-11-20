"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";

function UnreadMessageCount({ session }) {
  const { count, setCount } = useGlobalContext();

  useEffect(() => {
    if (!session) return;
    async function fetchCount() {
      try {
        const res = await fetch(`/api/messages/unread-count`);
        const data = await res.json();

        if (res.status === 200) {
          setCount(data.count);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchCount();
  }, [session]);

  return (
    count > 0 && (
      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        {count}
      </span>
    )
  );
}

export default UnreadMessageCount;
