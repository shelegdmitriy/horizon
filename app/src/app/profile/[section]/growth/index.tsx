"use client";
import { type GrowthProgram } from "~/lib/validation/growth-programs";
import GrowthProgramCard from "./growth-program-card";
import { useGrowthPrograms } from "~/lib/growth-programs";

export default function GrowthPrograms() {
  const { data: growthPrograms } = useGrowthPrograms();

  return (
    <div>
      <div className="mb-4 text-3xl font-bold text-black">Growth Programs</div>
      <div className="text-sm font-normal text-gray-900">
        Crypto ipsum bitcoin ethereum dogecoin litecoin. Ethereum kadena
        polkadot ICON BitTorrent. Crypto ipsum bitcoin ethereum dogecoin
        litecoin. Ethereum kadena polkadot ICON BitTorrent.
      </div>
      <div className="mt-6 flex flex-row flex-wrap items-stretch justify-start gap-8">
        {growthPrograms.map((growthProgram) => (
          <GrowthProgramCard program={growthProgram} />
        ))}
      </div>
    </div>
  );
}