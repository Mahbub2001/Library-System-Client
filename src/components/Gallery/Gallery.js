import Image from "next/image";
import React from "react";

function Gallery() {
  return (
    <div>
      <h1 className="text-center text-2xl my-20">Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 justify-center items-center">
        <Image
          className="rounded-lg shadow-2xl"
          src="/lib4.jpg"
          width={300}
          height={300}
        />
        <Image
          className="rounded-lg shadow-2xl"
          src="/lib5.jpg"
          width={300}
          height={300}
        />
        <Image
          className="rounded-lg shadow-2xl"
          src="/lib4.jpg"
          width={300}
          height={300}
        />
        <Image
          className="rounded-lg shadow-2xl"
          src="/lib5.jpg"
          width={300}
          height={300}
        />
        <Image
          className="rounded-lg shadow-2xl"
          src="/lib5.jpg"
          width={300}
          height={300}
        />
        <Image
          className="rounded-lg shadow-2xl"
          src="/lib4.jpg"
          width={300}
          height={300}
        />
        <Image
          className="rounded-lg shadow-2xl"
          src="/lib5.jpg"
          width={300}
          height={300}
        />
        <Image
          className="rounded-lg shadow-2xl"
          src="/lib4.jpg"
          width={300}
          height={300}
        />
      </div>
    </div>
  );
}

export default Gallery;
