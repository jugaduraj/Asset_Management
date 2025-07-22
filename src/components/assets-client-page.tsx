
"use client";

import { useState } from "react";
import type { Asset } from "@/types";
import { PlusCircle, Download } from "lucide-react";
import Papa from "papaparse";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { getColumns } from "@/components/asset-columns";
import { AddAssetSheet } from "@/components/add-asset-sheet";
import { AssetDetailsSheet } from "@/components/asset-details-sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";


interface AssetsClientPageProps {
  initialAssets: Asset[];
}

export function AssetsClientPage({ initialAssets }: AssetsClientPageProps) {
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [isAddAssetSheetOpen, setIsAddAssetSheetOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);

  const handleAssetAdd = (newAsset: Asset) => {
    setAssets((prev) => [newAsset, ...prev]);
  };
  
  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
  };
  
  const handleDeleteRequest = (assetTag: string) => {
    setAssetToDelete(assetTag);
  };
  
  const handleDeleteConfirm = () => {
    if (assetToDelete) {
      setAssets((prev) => prev.filter((asset) => asset.assetTag !== assetToDelete));
      toast({
        title: "Asset Deleted",
        description: `Successfully deleted asset "${assetToDelete}".`,
      });
      setAssetToDelete(null);
    }
  };

  const handleDownload = () => {
    const csv = Papa.unparse(assets.map(asset => ({
        ...asset,
        history: JSON.stringify(asset.history)
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "assets.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    toast({
      title: "Download Started",
      description: "Your asset data is being downloaded as assets.csv.",
    });
  }

  const columns = getColumns(handleEdit, handleDeleteRequest);

  return (
    <>
      <main className="flex-1 flex flex-col">
        <PageHeader 
          title="Assets"
          description="Browse and manage all company assets."
        >
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
          <Button onClick={() => setIsAddAssetSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Asset
          </Button>
        </PageHeader>
        <div className="flex-1 px-6 md:px-8 pb-8">
           <DataTable columns={columns} data={assets} filterColumn="assetTag" />
        </div>
      </main>

      <AddAssetSheet
        open={isAddAssetSheetOpen}
        onOpenChange={setIsAddAssetSheetOpen}
        onAssetAdd={handleAssetAdd}
      />
      
      <AssetDetailsSheet
        asset={selectedAsset}
        open={!!selectedAsset}
        onOpenChange={() => setSelectedAsset(null)}
       />
       
       <AlertDialog open={!!assetToDelete} onOpenChange={(isOpen) => !isOpen && setAssetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              asset and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAssetToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
