import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
      <Image src="/logo.png" alt="Logo" width={100} height={100} />
    </div>
  );
}
