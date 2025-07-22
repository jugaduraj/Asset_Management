import { ReportsClientPage } from "@/components/reports-client-page";
import { mockAssets } from "@/lib/data";
import type { Asset } from "@/types";

// Simulate fetching data from a database
async function getAssets(): Promise<Asset[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAssets);
    }, 200); // Simulate network delay
  });
}

export default async function ReportsPage() {
  const assets = await getAssets();
  return <ReportsClientPage assets={assets} />;
}
