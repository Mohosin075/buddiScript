import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface IProps {
  children: ReactNode;
}
const CommonLayout = ({ children }: IProps) => {
  return (
     <div className=" min-h-screen flex flex-col">
      <Navbar />
     <div className="grow-1">{children}</div>
    </div>
  );
};

export default CommonLayout;
