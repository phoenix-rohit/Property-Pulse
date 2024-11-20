"use client";

import { useEffect, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

function SavedPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setIsloading] = useState(true);

  useEffect(() => {
    async function fetchSavedProperties() {
      try {
        const res = await fetch("/api/bookmarks");
        if (res.status === 200) {
          const data = await res.json();
          setProperties(data);
        } else {
          console.log(res.statusText);
          toast.error("Failed to fetch saved Porperties");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch saved Porperties");
      } finally {
        setIsloading(false);
      }
    }
    fetchSavedProperties();
  }, []);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="px-4 py-6">
      <h1 className="mb-4 text-2xl font-medium text-blue-500">
        Saved Properties
      </h1>
      <div className="px-4 py-6 m-auto container-xl lg:container">
        {properties?.length === 0 ? (
          <p>No Saved properties</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties?.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default SavedPropertiesPage;
