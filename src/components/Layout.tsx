import { Navbar } from "~/components/nav/Navbar";
import Meta from "~/components/Meta";
import { BottomNav } from "~/components/nav/BottomNav";
import { Toaster, resolveValue } from "react-hot-toast";
import { CheckIcon } from "@heroicons/react/outline";
import Footer from "./nav/Footer";
import { useState, useEffect } from "react";
import { XENProvider } from "~/contexts/XENContext";
import { useTranslation } from "next-i18next";

const Layout = ({ children }: any) => {
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <XENProvider>
      <div className="pb-24 lg:pb-0">
        <Meta />
        <Navbar />
        {children}
        <Toaster position="top-right">
          {(toast) => (
            <div className="alert shadow-lg glass max-w-fit text-neutral">
              <div>
                <div>
                  <CheckIcon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral">🎉 {t("success")}</h3>
                  <div className="text-xs text-neutral">
                    {resolveValue(toast.message, toast)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Toaster>
        <Footer />
        <BottomNav />
      </div>
    </XENProvider>
  );
};

export default Layout;
