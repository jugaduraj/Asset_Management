'use client';

import Image from 'next/image';
import { FileText, Video, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { Asset } from '../lib/types';
import { cn } from '../lib/utils';

interface AssetCardProps {
  asset: Asset;
  onSelect: () => void;
}

const AssetIcon = ({ type }: { type: Asset['type'] }) => {
  const iconProps = { className: 'w-16 h-16 text-muted-foreground' };
  switch (type) {
    case 'video':
      return <Video {...iconProps} />;
    case 'document':
      return <FileText {...iconProps} />;
    case 'image':
    default:
      return <ImageIcon {...iconProps} />;
  }
};

export default function AssetCard({ asset, onSelect }: AssetCardProps) {
  return (
    <Card
      onClick={onSelect}
      className="cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-200 flex flex-col h-full"
    >
      <CardHeader className="p-0">
        <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
          {asset.type === 'image' && asset.url ? (
            <Image
              src={asset.url.split('?')[0]} // Remove query params for next/image
              alt={asset.name}
              width={300}
              height={200}
              className="w-full h-full object-cover"
              data-ai-hint={new URL(asset.url).searchParams.get('data-ai-hint') || ''}
            />
          ) : (
            <AssetIcon type={asset.type} />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-base font-semibold leading-tight truncate" title={asset.name}>
          {asset.name}
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex flex-wrap gap-1">
          {asset.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
          {asset.tags.length > 3 && (
            <Badge variant="outline">+{asset.tags.length - 3}</Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
