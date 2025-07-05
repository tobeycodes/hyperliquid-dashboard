"use client";

import { useQuery } from "@tanstack/react-query";
import { Table, Token } from "./table";
import { WsWebData2 } from "@nktkas/hyperliquid";

export const TablePerps = () => {
  const { data, isLoading, isError } = useQuery<WsWebData2, Error, Token[]>({
    queryKey: ["webData2"],
    queryFn: () => {
      throw new Error("WebSocket data not available");
    },
    staleTime: Infinity,
    select: (wsData: WsWebData2) =>
      wsData.assetCtxs.map<Token>((asset, index) => {
        const universe = wsData.meta.universe[index];
        const lastPrice = Number(asset.oraclePx);
        const prevPrice = Number(asset.prevDayPx);
        const change24h = lastPrice - prevPrice;

        return {
          image: `https://app.hyperliquid.xyz/coins/${universe.name}.svg`,
          token: `${universe.name}-USD`,
          type: `${universe.maxLeverage}x`,
          lastPrice,
          change24h,
          change24hPercent: prevPrice !== 0 ? (change24h / prevPrice) * 100 : 0,
          volume24h: Number(asset.dayNtlVlm),
          funding8h: Number(asset.funding) * 8 * 100,
          openInterestOrMarketCap:
            Number(asset.openInterest) * Number(asset.oraclePx),
        };
      }),
  });

  return <Table isError={isError} isLoading={isLoading} data={data ?? []} />;
};
