import BackgroundSVG from "~/components/BackgroundSVG";
import Navbar from "~/components/Navbar";
import Meta from "~/components/Meta";
const Layout = ({ children }: any) => {
  return (
    <div>
      <Meta />
      <div className="absolute top-0 left-0 -z-10">
        <BackgroundSVG />
      </div>
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
