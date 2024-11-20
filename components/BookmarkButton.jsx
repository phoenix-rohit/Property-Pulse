"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
function BookmarkButton({ property }) {
  const [isBookmarked, setIsBookmarked] = useState(null);
  const [loading, setIsloading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      setIsloading(false);
      return;
    }
    async function checkBookmarkStatus() {
      try {
        const res = await fetch(`/api/bookmarks/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyId: property._id,
          }),
        });

        if (res.status === 200) {
          const data = await res.json();

          setIsBookmarked(data.isBookmarked);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsloading(false);
      }
    }

    checkBookmarkStatus();
  }, [property._id, userId]);

  async function handleClick() {
    if (!userId) {
      toast.error("You need to sign in to bookmark a property");
      return;
    }
    try {
      const res = await fetch(`/api/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property._id,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();

        toast.success(data.message);
        setIsBookmarked(data.isBookmarked);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  }

  if (loading)
    return (
      <button
        className={`flex items-center justify-center w-full px-4 py-2 font-bold text-white  rounded-full bg-white`}
      >
        <FaBookmark className="mr-2" /> <ClipLoader color="#3b82f6" />
      </button>
    );

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center justify-center w-full px-4 py-2 font-bold text-white  rounded-full ${
          isBookmarked
            ? `hover:bg-red-600 bg-red-500`
            : `hover:bg-blue-600 bg-blue-500`
        } `}
      >
        <FaBookmark className="mr-2" />
        {isBookmarked ? "Remove Bookmark" : "Bookmark Property"}
      </button>
    </>
  );
}

export default BookmarkButton;
