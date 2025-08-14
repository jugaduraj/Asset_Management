'use client';

import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Plus } from 'lucide-react';

interface TagListProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags?: string[];
}

export default function TagList({ tags, onTagsChange, availableTags = [] }: TagListProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (inputValue && !tags.includes(inputValue)) {
      onTagsChange([...tags, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge key={tag} variant="default" className="text-sm py-1 pl-3 pr-1 flex items-center gap-1">
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="rounded-full hover:bg-primary-foreground/20 p-0.5"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddTag()}
          placeholder="Add a new tag..."
          list="available-tags"
        />
        {availableTags.length > 0 && (
             <datalist id="available-tags">
             {availableTags.filter(t => !tags.includes(t)).map(tag => (
               <option key={tag} value={tag} />
             ))}
           </datalist>
        )}
        <Button type="button" size="icon" onClick={handleAddTag} variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
