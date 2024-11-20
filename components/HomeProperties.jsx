import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { fetchProperties } from "@/utils/services";

async function HomeProperties() {
  const { properties } = await fetchProperties();

  const recentProperties = properties
    ?.sort(() => Math.random() - Math.random())
    ?.slice(0, 3);

  return (
    <>
      <section className="px-4 py-6">
        <div className="m-auto container-xl lg:container">
          <h2 className="mb-6 text-3xl font-bold text-center text-blue-500">
            Recent Properties
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentProperties === 0 || !recentProperties ? (
              <p>No Properties Found</p>
            ) : (
              recentProperties?.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="max-w-lg px-6 m-auto my-10">
        <Link
          href="/properties"
          className="block px-6 py-4 text-center text-white bg-black rounded-xl hover:bg-gray-700"
        >
          View All Properties
        </Link>
      </section>
    </>
  );
}
export default HomeProperties;
