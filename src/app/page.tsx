import { DashboardClientPage } from "@/components/dashboard-client-page";
import { mockAssets } from "@/lib/data";
import type { Asset } from "@/types";

// Simulate fetching data from a database
async function getAssets(): Promise<Asset[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAssets);
    }, 500); // Simulate network delay
  });
}

export default async function DashboardPage() {
  const assets = await getAssets();
  return <DashboardClientPage initialAssets={assets} />;
}
