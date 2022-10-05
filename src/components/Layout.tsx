import Navbar from "~/components/Navbar";
import Meta from "~/components/Meta";
import { Toaster, resolveValue } from "react-hot-toast";
import { CheckIcon } from "@heroicons/react/outline";

const Layout = ({ children }: any) => {
  return (
    <div>
      <Meta />
      <Navbar />
      {children}
      <Toaster position="top-right">
        {(t) => (
          <div className="alert shadow-lg glass max-w-fit">
            <div>
              <div>
                <CheckIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold">🎉 Success</h3>
                <div className="text-xs">{resolveValue(t.message, t)}</div>
              </div>
            </div>
          </div>
        )}
      </Toaster>
    </div>
  );
};

export default Layout;
