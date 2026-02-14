import { notFound } from "next/navigation";
import { getChainConfig, chainConfigs } from "@/config/chains";
import { ChainDashboard } from "@/components/dashboard/chain-dashboard";

export function generateStaticParams() {
  return chainConfigs.map((c) => ({ chain: c.slug }));
}

export default async function ChainDashboardPage({
  params,
}: {
  params: Promise<{ chain: string }>;
}) {
  const { chain } = await params;
  const config = getChainConfig(chain);

  if (!config) {
    notFound();
  }

  return <ChainDashboard chainSlug={chain} />;
}
