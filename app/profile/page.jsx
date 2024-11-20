"use client";
import profileDefault from "@/assets/images/profile.png";
import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ProfilePage() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const profileImage = session?.user?.image;
  const profileName = session?.user?.name;
  const profileEmail = session?.user?.email;

  useEffect(() => {
    async function fetchUserProperties(userId) {
      if (!userId) {
        return;
      }
      try {
        const res = await fetch(`/api/properties/user/${userId}`);
        if (res.status === 200) {
          const data = await res.json();
          setProperties(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    // Fetch user properties when session is available
    if (session?.user?.id) {
      fetchUserProperties(session.user.id);
    }
  }, [session]);

  async function handleDeleteProperty(propertyId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });
      if (res.status === 200) {
        // Remove the property from state;
        const updateProperties = properties.filter(
          (property) => property._id !== propertyId
        );
        setProperties(updateProperties);
        toast.success("Property Deleted");
      } else {
        toast.error("Failed to delete property");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete property");
    }
  }

  return (
    <section className="bg-blue-50">
      <div className="container py-24 m-auto">
        <div className="px-6 py-8 m-4 mb-4 bg-white border rounded-md shadow-md md:m-0">
          <h1 className="mb-4 text-3xl font-bold">Your Profile</h1>
          <div className="flex flex-col md:flex-row">
            <div className="mx-20 mt-10 md:w-1/4">
              <div className="mb-4">
                <Image
                  className="w-32 h-32 mx-auto rounded-full md:h-48 md:w-48 md:mx-0"
                  src={profileImage || profileDefault}
                  width={200}
                  height={200}
                  alt="User"
                />
              </div>

              <h2 className="mb-4 text-2xl">
                <span className="block font-bold">Name: </span> {profileName}
              </h2>
              <h2 className="text-2xl">
                <span className="block font-bold">Email: </span> {profileEmail}
              </h2>
            </div>

            <div className="md:w-3/4 md:pl-4">
              <h2 className="mb-4 text-xl font-semibold">Your Listings</h2>
              {!loading && properties === 0 && <p>No Property Listed </p>}
              {loading ? (
                <Spinner loading={loading} />
              ) : (
                properties.map((property) => (
                  <div key={property._id} className="mb-10">
                    <Link href={`/properties/${property._id}`}>
                      <Image
                        className="object-cover w-full h-32 rounded-md"
                        src={property.images[0]}
                        width={400}
                        height={0}
                        priority={true}
                        alt={property.name}
                      />
                    </Link>
                    <div className="mt-2">
                      <p className="text-lg font-semibold">{property.name}</p>
                      <p className="text-gray-600">
                        Address: {property.location.address}{" "}
                        {property.location.state}
                      </p>
                    </div>
                    <div className="mt-2">
                      <Link
                        href={`/properties/${property._id}/edit`}
                        className="px-3 py-3 mr-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        className="px-3 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                        type="button"
                        onClick={() => handleDeleteProperty(property._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
