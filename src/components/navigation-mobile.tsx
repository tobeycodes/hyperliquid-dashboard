import BarChart from "../../public/icons/bar-chart-04.svg";
import Perps from "../../public/icons/perps.svg";
import Search from "../../public/icons/search-md.svg";
import Wallet from "../../public/icons/wallet-03.svg";
import Gift from "../../public/icons/gift-01.svg";
import Link from "next/link";

export const NavigationMobile = () => (
  <nav className="md:hidden border-t border-Neutral-Elevation-2-border flex justify-center">
    <ul className="flex justify-between w-full px-6 max-w-[390px]">
      <li>
        <Link
          href="#"
          className="flex flex-col items-center gap-1 p-2 text-xs w-14 h-14 text-Neutral-200---Body-text"
        >
          <BarChart className="w-5 h-5" />
          Solana
        </Link>
      </li>
      <li>
        <Link
          href="#"
          className="flex flex-col items-center gap-1 p-2 text-xs w-14 h-14 text-Primary-400---Primary"
        >
          <Perps className="w-5 h-5" />
          Perps
        </Link>
      </li>
      <li>
        <Link
          href="#"
          className="flex flex-col items-center gap-1 p-2 text-xs w-14 h-14 text-Neutral-200---Body-text"
        >
          <Search className="w-5 h-5" />
          Search
        </Link>
      </li>
      <li>
        <Link
          href="#"
          className="flex flex-col items-center gap-1 p-2 text-xs w-14 h-14 text-Neutral-200---Body-text"
        >
          <Wallet className="w-5 h-5" />
          Wallet
        </Link>
      </li>
      <li>
        <Link
          href="#"
          className="flex flex-col items-center gap-1 p-2 text-xs w-14 h-14 text-Neutral-200---Body-text"
        >
          <Gift className="w-5 h-5" />
          Rewards
        </Link>
      </li>
    </ul>
  </nav>
);
