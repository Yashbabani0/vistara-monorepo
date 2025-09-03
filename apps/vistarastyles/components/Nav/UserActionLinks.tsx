import React from "react";
import AccountIcon from "./AccountIcon";
import CartIcon from "./CartIcon";
import Search from "./Search";
import MobileMenuIcon from "./MobileMenuIcon";

export default function UserActionLinks() {
  return (
    <div className="flex items-center justify-center gap-4 h-10">
      <Search />
      <CartIcon />
      <AccountIcon />
      <MobileMenuIcon />
    </div>
  );
}
