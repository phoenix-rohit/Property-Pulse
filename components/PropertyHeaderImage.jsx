import Image from "next/image";

function PropertyHeaderImage({ image }) {
  return (
    <section>
      <div className="m-auto container-xl">
        <div className="grid grid-cols-1">
          <Image
            src={image}
            alt=""
            className="object-cover h-[400px] w-full"
            width={0}
            height={0}
            sizes="100vw"
            priority={true}
          />
        </div>
      </div>
    </section>
  );
}

export default PropertyHeaderImage;
