import { CategoriesClientPage } from "@/components/categories-client-page";
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

export default async function CategoriesPage() {
  const assets = await getAssets();
  return <CategoriesClientPage assets={assets} />;
}
