import React from "react";
import Menu from "./Menu";
import Footer from "./Footer";

interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Menu />
    <main className="grow container mx-auto px-4 py-8">{children}</main>
    <Footer />
  </div>
);
