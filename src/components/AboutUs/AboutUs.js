import Image from "next/image";
import React from "react";

function AboutUs() {
  return (
    <div className="mt-10">
      <div className="text-center flex flex-col md:flex-row justify-center items-center gap-28">
        <div>
          <h1 className="mb-8 text-2xl">About Us</h1>
          <p>
            Learning is a lifetime journey. To make this journey enjoyable, we,
            Noble Library, situated at Malad West, Mumbai, Maharashtra, provide
            an extensive list of books that you will find informative and
            mind-changing all at once. Reading is the best way to pass time and
            what better way than to borrow/purchase books from our library and
            liberate your mind altogether. We provide a safe, comfortable and
            friendly environment that enables learning and advancement of
            knowledge, and promotes discovery and scholarship. Sit down with a
            cup of coffee and unwind at our book store with a book of your
            choice!
          </p>
        </div>
        <div>
          <img src="/lib3.jpg" alt="library"   />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
