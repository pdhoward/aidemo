"use client"
import BeginButton from "@/components/begin-button"
import Image from "next/image";

//export const runtime = 'edge'

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-10 bg-black">
      <Image
        width={512}
        height={512}
        src="https://res.cloudinary.com/stratmachine/image/upload/v1683911844/altitude80/a80_logo_black_rgajpd.png"
        alt="Modern AI Platform"
        className="w-48"
      />
      <h1 className="text-white">
        <BeginButton />
      </h1>
    </div>
  );
}
