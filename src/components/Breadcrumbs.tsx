import { HomeIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";

const Breadcrumbs = () => {
  const router = useRouter();
  const { asPath } = router;
  const path = asPath.split("/").filter((item) => item !== "");

  return (
    <div className="text-sm breadcrumbs pb-4 lg:pb-8">
      <ul>
        <li>
          <Link href="/" className="text-neutral">
            <HomeIcon className="h-4 w-4" />
          </Link>
        </li>
        {path.map((item, index) => {
          const href = `/${path.slice(0, index + 1).join("/")}`;

          return (
            <li key={index}>
              <Link href={href}>{item.charAt(0).toUpperCase() + item.slice(1)}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
