import PropertySearchForm from "@/components/PropertySearchForm";
import Properties from "@/components/Properties";

async function PropertiesPage() {
  return (
    <>
      <section className="py-4 bg-blue-700">
        <div className="flex flex-col items-start px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <PropertySearchForm />
        </div>
      </section>
      <Properties />
    </>
  );
}

export default PropertiesPage;
