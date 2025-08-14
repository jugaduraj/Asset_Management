'use client';

import { useState, useRef, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';
import { suggestAssetTagsAction } from '../lib/actions';
import type { Asset } from '../lib/types';
import { Loader2, Sparkles, UploadCloud } from 'lucide-react';
import TagList from './tag-list';
import Image from 'next/image';

interface UploadDialogProps {
  onAssetAdd: (asset: Asset) => void;
  allTags: string[];
  children: React.ReactNode;
}

export default function UploadDialog({ onAssetAdd, allTags, children }: UploadDialogProps) {
  const [isOpen, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTags([]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSuggestTags = () => {
    if (!preview || !file?.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Unsupported File',
        description: 'AI tag suggestions are only available for images.',
      });
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('assetDataUri', preview);
      const result = await suggestAssetTagsAction(formData);
      if (result.success && result.tags) {
        setTags(prev => [...new Set([...prev, ...result.tags!])]);
        toast({
            title: 'Tags Suggested!',
            description: 'AI has suggested new tags for your asset.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const newAsset: Asset = {
      id: new Date().toISOString(),
      name: file.name,
      type: file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
        ? 'video'
        : 'document',
      url: preview || '',
      tags,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      createdAt: new Date().toISOString(),
    };

    onAssetAdd(newAsset);
    resetAndClose();
  };
  
  const resetAndClose = () => {
    setFile(null);
    setPreview(null);
    setTags([]);
    setOpen(false);
    if(formRef.current) formRef.current.reset();
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) resetAndClose();
        setOpen(open);
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload New Asset</DialogTitle>
          <DialogDescription>
            Select a file from your local drive to add to your asset library.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="asset-file" className="sr-only">Asset File</Label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-10">
                <div className="text-center">
                    {preview ? (
                        <Image src={preview} alt="File preview" width={200} height={200} className="mx-auto h-24 w-auto rounded-md" />
                    ) : (
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                    )}
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                        htmlFor="asset-file"
                        className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                        >
                        <span>Upload a file</span>
                        <Input id="asset-file" name="file" type="file" className="sr-only" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, PDF, MP4 up to 50MB</p>
                </div>
            </div>
          </div>
          
          {file && (
              <>
               <div>
                    <Label htmlFor="tags">Tags</Label>
                    <TagList tags={tags} onTagsChange={setTags} availableTags={allTags} />
                </div>

                <Button type="button" variant="outline" size="sm" onClick={handleSuggestTags} disabled={isPending || !file.type.startsWith('image/')}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Suggest Tags with AI
                </Button>
              </>
          )}

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={resetAndClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!file}>
              Upload Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
