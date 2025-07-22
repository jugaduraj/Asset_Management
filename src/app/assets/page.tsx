import { AssetsClientPage } from "@/components/assets-client-page";
import { AddAssetSheet } from "@/components/add-asset-sheet";
import { mockAssets } from "@/lib/data";
import type { Asset } from "@/types";

async function getAssets(): Promise<Asset[]> {
  // Simulate fetching data from a database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAssets);
    }, 500); // Simulate network delay
  });
}

export default async function AssetsPage() {
  const assets = await getAssets();
  return <AssetsClientPage initialAssets={assets} />;
}
