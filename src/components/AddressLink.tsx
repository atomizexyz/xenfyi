import { Chain } from "wagmi";
import Link from "next/link";
import { DuplicateIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { useCopyToClipboard } from "usehooks-ts";

interface AddressLinkProps {
  name: string;
  address: string;
  chain: Chain;
}

const AddressLink = (props: AddressLinkProps) => {
  const [_, copy] = useCopyToClipboard();

  return (
    <div className="flex flex-col lg:flex-row space-x-2">
      <span>{props.name}</span>
      <code>{props.address}</code>
      <div className="flex flex-row space-x-8 lg:space-x-2">
        <button
          className="btn btn-square btn-xs glass"
          onClick={() => copy(props.address)}
        >
          <DuplicateIcon className="w-5 h-5" />
        </button>
        <Link
          href={`${props.chain?.blockExplorers?.default.url}/address/${props.address}`}
        >
          <a className="btn btn-square btn-xs glass">
            <ExternalLinkIcon className="w-5 h-5" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default AddressLink;
