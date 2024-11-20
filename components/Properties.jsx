"use client";
import PropertyCard from "@/components/PropertyCard";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import Pagination from "./Pagination";
function Properties() {
  const [properties, setProperties] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalItems, setTotalItems] = useState(0);

  function handlePageChange(newPage) {
    setPage(newPage);
  }

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch(
          `/api/properties?page=${page}&pageSize=${pageSize}`
        );
        const data = await res.json();
        if (res.status === 200) {
          setProperties(data.properties);
          setTotalItems(data.total);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [page, pageSize]);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="px-4 py-6">
      <div className="px-4 py-6 m-auto container-xl lg:container">
        {properties?.length === 0 ? (
          <p>No properties found</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties?.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </section>
  );
}

export default Properties;
