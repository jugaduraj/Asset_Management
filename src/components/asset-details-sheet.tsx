'use client';

import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from './ui/sheet';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import TagList from './tag-list';
import type { Asset, AssetType } from '../lib/types';
import { format } from 'date-fns';
import { FileText, Video, Image as ImageIcon, Calendar, FileBox, Tag, Info } from 'lucide-react';
import { Separator } from './ui/separator';

interface AssetDetailsSheetProps {
  asset: Asset | null;
  onOpenChange: (open: boolean) => void;
  onAssetUpdate: (asset: Asset) => void;
  allTags: string[];
}

const AssetPreview = ({ asset }: { asset: Asset }) => {
  const iconProps = { className: 'w-32 h-32 text-muted-foreground' };
  switch (asset.type) {
    case 'image':
      return asset.url ? (
        <Image
          src={asset.url.split('?')[0]}
          alt={asset.name}
          width={400}
          height={300}
          className="w-full h-auto object-contain rounded-lg border"
          data-ai-hint={new URL(asset.url).searchParams.get('data-ai-hint') || ''}
        />
      ) : <ImageIcon {...iconProps} />;
    case 'video':
      return <div className="flex flex-col items-center gap-2"><Video {...iconProps} /><p>Video preview not available.</p></div>;
    case 'document':
       return <div className="flex flex-col items-center gap-2"><FileText {...iconProps} /><p>Document preview not available.</p></div>;
    default:
      return null;
  }
};

export default function AssetDetailsSheet({
  asset,
  onOpenChange,
  onAssetUpdate,
  allTags
}: AssetDetailsSheetProps) {
  if (!asset) return null;
  
  const handleTagsChange = (newTags: string[]) => {
    onAssetUpdate({ ...asset, tags: newTags });
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
     onAssetUpdate({ ...asset, description: e.target.value });
  };

  return (
    <Sheet open={!!asset} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader>
          <SheetTitle className="truncate" title={asset.name}>{asset.name}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto pr-6 -mr-6 space-y-6">
            <div className="flex items-center justify-center p-4 bg-muted rounded-lg aspect-video">
                 <AssetPreview asset={asset} />
            </div>
            
            <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><Info size={16}/> Details</h3>
                <Separator />
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-muted-foreground flex items-center gap-2"><FileBox size={14}/> Size</div>
                    <div>{asset.size}</div>
                    
                    <div className="text-muted-foreground flex items-center gap-2"><Calendar size={14}/> Created</div>
                    <div>{format(new Date(asset.createdAt), 'PPp')}</div>
                </div>

            </div>

             <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><Tag size={16}/> Tags</h3>
                <Separator />
                <TagList tags={asset.tags} onTagsChange={handleTagsChange} availableTags={allTags} />
            </div>

            <div className="space-y-4">
                 <SheetDescription>
                    <h3 className="font-semibold mb-2">Description</h3>
                     <textarea
                       value={asset.description || ''}
                       onChange={handleDescriptionChange}
                       placeholder="Add a description..."
                       className="w-full h-24 p-2 border rounded-md bg-transparent text-sm"
                     />
                 </SheetDescription>
            </div>
        </div>
        <SheetFooter>
          <Button onClick={() => onOpenChange(false)} variant="secondary">Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
