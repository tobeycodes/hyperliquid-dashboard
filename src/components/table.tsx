"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import ChevronDown from "../../public/icons/chevron-down.svg";
import { twMerge } from "tailwind-merge";
import { formatCurrency } from "@coingecko/cryptoformat";
import Image from "next/image";

export type Token = {
  image: string;
  token: string;
  type: string;
  lastPrice: number;
  change24h: number;
  change24hPercent: number;
  volume24h: number;
  funding8h?: number;
  openInterestOrMarketCap: number;
};

interface TableProps {
  isLoading: boolean;
  isError: boolean;
  data: Token[];
}

export function Table({ isLoading, isError, data }: TableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrollLeft(scrollRef.current.scrollLeft);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);

      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const columnHelper = createColumnHelper<Token>();

  const columns = [
    columnHelper.accessor(
      (row) => ({ image: row.image, token: row.token, type: row.type }),
      {
        id: "token",
        cell: (info) => {
          const { image, token, type } = info.getValue();

          if (scrollLeft > 0) {
            return (
              <span
                className="py-0.5 px-1.5 text-[6px] rounded-sm border border-Neutral-Elevation-3 bg-Neutral-Elevation-1 overflow-hidden text-ellipsis text-center h-11 relative top-1"
                style={{
                  writingMode: "sideways-lr",
                }}
              >
                {token}
              </span>
            );
          }

          return (
            <span className="flex gap-3 items-center">
              <Image
                className="size-9 bg-white rounded-full shrink-0"
                src={image}
                alt={token}
                width={36}
                height={36}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://app.hyperliquid.xyz/coins/missing.svg";
                }}
              />
              <span className="flex gap-1 items-center">
                <span className="font-medium">{token}</span>
                <span className="bg-Neutral-Elevation-2-border py-0.5 px-1 rounded-sm text-Neutral-200---Body-text text-xs">
                  {type}
                </span>
              </span>
            </span>
          );
        },
        header: () => "Token",
      },
    ),
    columnHelper.accessor("lastPrice", {
      header: () => "Last Price",
      cell: (info) => formatCurrency(info.getValue(), "USD"),
    }),
    columnHelper.accessor(
      (row) => ({
        change24h: row.change24h,
        change24hPercent: row.change24hPercent,
      }),
      {
        id: "change",
        cell: (info) => {
          const { change24h, change24hPercent } = info.getValue();
          const isPositive = change24h >= 0;
          const className = isPositive
            ? `text-Primary-400---Primary`
            : `text-Alert-400---Primary`;
          return (
            <span className={className}>
              {formatCurrency(change24h, "USD", "en", true)} /{" "}
              {change24hPercent.toFixed(2)}%
            </span>
          );
        },
        header: () => "24h Change",
      },
    ),
    columnHelper.accessor("volume24h", {
      header: () => "24h Volume",
      cell: (info) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(info.getValue()),
    }),
    columnHelper.accessor("funding8h", {
      header: "8h Funding",
      cell: (info) => {
        const value = info.getValue();
        return value ? value.toFixed(4) + "%" : "–";
      },
    }),
    columnHelper.accessor("openInterestOrMarketCap", {
      header: "Open Interest / Market Cap",
      cell: (info) =>
        info.getValue() > 0
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(info.getValue())
          : "–",
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: "lastPrice",
          desc: true,
        },
      ],
    },
  });

  return (
    <div
      className="pb-10 overflow-x-auto md:overflow-x-visible"
      ref={scrollRef}
    >
      <table className="table-fixed min-w-full border-collapse">
        <thead className="sticky top-0 bg-Color-Background-bg-primary md:top-[96px] z-1">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={twMerge(
                    "p-3 text-xs text-Neutral-300---Tertiary-text text-left whitespace-nowrap",
                    index === 0 &&
                      "sticky left-0 pl-4 bg-Color-Background-bg-primary",
                    scrollLeft > 0 && index === 1 && "pl-10",
                  )}
                >
                  {header.isPlaceholder ? null : (
                    <button
                      className={twMerge(
                        "flex items-center gap-0.5",
                        header.column.getCanSort() &&
                          "cursor-pointer select-none",
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      title={(() => {
                        if (!header.column.getCanSort()) {
                          return undefined;
                        }

                        const sortOrder = header.column.getNextSortingOrder();
                        if (sortOrder === "asc") {
                          return "Sort ascending";
                        }
                        if (sortOrder === "desc") {
                          return "Sort descending";
                        }

                        return "Clear sort";
                      })()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      {header.column.getIsSorted() ? (
                        <ChevronDown
                          className={twMerge(
                            "size-3 transition-transform duration-200",
                            header.column.getIsSorted() === "asc" &&
                              "rotate-180",
                          )}
                        />
                      ) : null}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {isLoading
            ? Array.from({ length: 25 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  {Array.from({ length: 6 }).map((_, cellIndex) => (
                    <td
                      key={`skeleton-cell-${cellIndex}`}
                      className={twMerge(
                        "p-3 whitespace-nowrap text-sm border-t border-Neutral-Elevation-2-border h-[62px]",
                        cellIndex === 0 &&
                          "sticky left-0 pl-4 bg-Color-Background-bg-primary",
                      )}
                    >
                      {cellIndex === 0 ? (
                        <span className="flex gap-3 items-center">
                          <div className="size-9 bg-gray-700 rounded-full shrink-0 animate-pulse"></div>
                          <span className="flex gap-1 items-center">
                            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 w-8 bg-gray-700 rounded animate-pulse"></div>
                          </span>
                        </span>
                      ) : (
                        <div className="h-4 bg-gray-700 rounded animate-pulse w-full max-w-[80px]"></div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            : table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, index) => (
                    <td
                      key={cell.id}
                      className={twMerge(
                        "p-3 whitespace-nowrap text-sm border-t border-Neutral-Elevation-2-border h-[62px]",
                        index === 0 &&
                          "sticky left-0 pl-4 bg-Color-Background-bg-primary",
                        scrollLeft > 0 && index === 0 && "px-4 py-0",
                        scrollLeft > 0 && index === 1 && "pl-10",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>

      {isError ? (
        <div className="flex items-center justify-center pt-10">
          <div className="text-center">
            <div className="text-Alert-400---Primary text-lg mb-2">
              Error loading data
            </div>
            <div className="text-Neutral-300---Tertiary-text text-sm">
              Please try again later
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
