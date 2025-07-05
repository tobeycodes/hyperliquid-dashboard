"use client";

import { useQuery } from "@tanstack/react-query";
import { SpotMeta, WsWebData2 } from "@nktkas/hyperliquid";
import { Table, Token } from "./table";

const fetchSpotMeta = async () => {
  const response = await fetch("https://api.hyperliquid.xyz/info", {
    method: "POST",
    body: JSON.stringify({ type: "spotMeta" }),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return (await response.json()) as SpotMeta;
};

export const TableSpot = () => {
  const {
    data: spotMeta,
    isLoading: isLoadingSpotMeta,
    isError: isErrorSpotMetaData,
  } = useQuery<SpotMeta>({
    queryKey: ["info", "spotMeta"],
    queryFn: fetchSpotMeta,
  });

  const {
    data: webData2Tokens,
    isLoading: isLoadingWebData2,
    isError: isErrorWebData2,
  } = useQuery<WsWebData2, Error, Token[]>({
    queryKey: ["webData2"],
    queryFn: () => {
      throw new Error("WebSocket data not available");
    },
    staleTime: Infinity,
    select: (wsData) => {
      if (!spotMeta) return [];

      return wsData.spotAssetCtxs
        .filter((asset) => {
          return (
            spotMeta.universe.find(({ name }) => name === asset.coin) &&
            Number(asset.dayNtlVlm) > 10000
          );
        })
        .map<Token | undefined>((asset) => {
          const universe = spotMeta.universe.find(
            ({ name }) => name === asset.coin,
          );
          if (!universe) {
            return undefined;
          }

          const lastPrice = Number(asset.midPx);
          const prevPrice = Number(asset.prevDayPx);
          const change24h = lastPrice - prevPrice;
          const name = spotMeta.tokens[universe.tokens[0]].name;

          return {
            image: `https://app.hyperliquid.xyz/coins/${name}_spot.svg`,
            token: `${name}-${spotMeta.tokens[universe.tokens[1]].name}`,
            type: "SPOT",
            lastPrice,
            change24h,
            change24hPercent:
              prevPrice !== 0 ? (change24h / prevPrice) * 100 : 0,
            volume24h: Number(asset.dayNtlVlm),
            openInterestOrMarketCap:
              Number(asset.circulatingSupply) * Number(asset.markPx),
          };
        })
        .filter((token): token is Token => token !== undefined);
    },
  });

  return (
    <Table
      isError={isErrorSpotMetaData || isErrorWebData2}
      isLoading={isLoadingSpotMeta || isLoadingWebData2}
      data={webData2Tokens ?? []}
    />
  );
};
