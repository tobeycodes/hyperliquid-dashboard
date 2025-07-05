import { Tabs } from "@base-ui-components/react/tabs";
import { TablePerps } from "@/components/table-perps";
import { TableSpot } from "@/components/table-spot";

export default function Home() {
  return (
    <Tabs.Root defaultValue="perps">
      <Tabs.List className="pt-10 pb-3 px-4 flex gap-4 sticky top-0 bg-Color-Background-bg-primary z-2">
        <Tabs.Tab
          value="perps"
          className="py-2 data-[selected]:text-Neutral-000---White text-Neutral-200---Body-text md:text-lg"
        >
          Perps
        </Tabs.Tab>

        <Tabs.Tab
          value="spot"
          className="py-2 data-[selected]:text-Neutral-000---White text-Neutral-200---Body-text md:text-lg"
        >
          Spot
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="perps">
        <TablePerps />
      </Tabs.Panel>

      <Tabs.Panel value="spot">
        <TableSpot />
      </Tabs.Panel>
    </Tabs.Root>
  );
}
