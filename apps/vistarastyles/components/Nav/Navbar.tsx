import React from "react";
import UserActionLinks from "./UserActionLinks";
import Logo from "./Logo";
import PcMenu from "./PcMenu";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow">
      <div className="flex items-center justify-between p-4 py-6 max-w-7xl mx-auto">
        <PcMenu />
        <Logo />
        <UserActionLinks />
      </div>
    </nav>
  );
}
