'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

interface TagListProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags?: string[];
}

export default function TagList({ tags, onTagsChange, availableTags = [] }: TagListProps) {
  const [inputValue, setInputValue] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = useCallback((tagToAdd: string) => {
    const newTag = tagToAdd.trim();
    if (newTag && !tags.includes(newTag)) {
      onTagsChange([...tags, newTag]);
    }
    setInputValue('');
  }, [tags, onTagsChange]);

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary">
            {tag}
            <button
              type="button"
              className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => handleRemoveTag(tag)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          ref={tagInputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag and press Enter"
        />
        <Button type="button" variant="outline" onClick={() => handleAddTag(inputValue)}>
          Add
        </Button>
      </div>
    </div>
  );
}
