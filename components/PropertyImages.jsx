import Image from "next/image";
import { Gallery, Item } from "react-photoswipe-gallery";

function PropertyImages({ images }) {
  return (
    <Gallery>
      <section className="p-4 bg-blue-50">
        <div className="container mx-auto">
          {images?.length === 1 ? (
            <Item
              original={images[0]}
              thumbnail={images[0]}
              width="1000"
              height="600"
            >
              {({ ref, open }) => (
                <Image
                  ref={ref}
                  onClick={open}
                  src={images[0]}
                  alt="property-image"
                  className="object-cover h-[400px] w-full mx-auto rounded-xl"
                  width={1800}
                  height={400}
                  priority={true}
                />
              )}
            </Item>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {images?.map((image, idx) => (
                <div
                  key={idx}
                  className={`${
                    images?.length === 3 && idx === 2
                      ? "col-span-2"
                      : "col-span-1"
                  }`}
                >
                  <Item
                    original={image}
                    thumbnail={image}
                    width="1000"
                    height="600"
                  >
                    {({ ref, open }) => (
                      <Image
                        src={image}
                        ref={ref}
                        onClick={open}
                        alt="property-image"
                        className="object-cover h-[400px] w-full rounded-xl cursor-pointer"
                        width={0}
                        height={0}
                        sizes="100vw"
                        priority={true}
                      />
                    )}
                  </Item>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Gallery>
  );
}

export default PropertyImages;
