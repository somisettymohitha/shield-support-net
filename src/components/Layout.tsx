import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import QuickExitButton from "./QuickExitButton";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <QuickExitButton />
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default Layout;
