import AboutUs from "@/components/AboutUs/AboutUs";
import Gallery from "@/components/Gallery/Gallery";
import Services from "@/components/Services/Services";
import Videos from "@/components/Videos/Videos";
import Image from "next/image";

export default function Home() {
  return (
    <main className="container mx-auto mb-20">
      <div className="relative">
        <div
          style={{
            backgroundImage: "url('/lib1.avif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "80vh",
            width: "100%",
          }}
        >
          <div className="absolute right-[20%] bottom-[40%] text-center">
            <h1 className="text-2xl">
              Find Exclusive Range Of Books <br /> At Our Library
            </h1>
            <button className="text-xs mt-5 bg-[#835a30] px-7 py-3 rounded-full text-white">
              Equire now
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Services />
      </div>
      <AboutUs />
      <Gallery />
      <Videos />
    </main>
  );
}
