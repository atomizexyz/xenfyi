import { Chain } from "wagmi";
import Link from "next/link";
import { DuplicateIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { useCopyToClipboard } from "usehooks-ts";
import { truncatedAddress } from "~/lib/helpers";
import toast from "react-hot-toast";
import { useTranslation } from "next-i18next";

interface AddressLinkProps {
  name: string;
  address: string;
  chain: Chain;
}

const AddressLink = (props: AddressLinkProps) => {
  const { t } = useTranslation("common");

  const [_, copy] = useCopyToClipboard();

  return (
    <div className="flex flex-col lg:flex-row space-x-2 text-neutral">
      <span>{props.name}</span>
      <code>{props.address}</code>
      <div className="flex flex-row space-x-8 lg:space-x-2">
        <button
          className="btn btn-square btn-xs glass text-neutral"
          onClick={() => {
            copy(props.address);
            toast.success(
              <div>
                <pre>{truncatedAddress(props.address)}</pre>
                {t("toast.copied-to-clipboard")}
              </div>
            );
          }}
        >
          <DuplicateIcon className="w-5 h-5" />
        </button>
        <Link
          href={`${props.chain?.blockExplorers?.default.url}/address/${props.address}`}
        >
          <a
            target="_blank"
            className="btn btn-square btn-xs glass text-neutral"
          >
            <ExternalLinkIcon className="w-5 h-5" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default AddressLink;
