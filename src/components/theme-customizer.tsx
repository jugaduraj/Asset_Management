
'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';

export default function ThemeCustomizer() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    // Ensure a theme is set on mount, defaulting to dark.
    if (!theme) {
      setTheme('dark');
    }
  }, [theme, setTheme]);


  return (
    <div className="flex flex-col space-y-4">
       <div className="flex items-center space-x-2">
       <h3 className="text-sm font-medium">Theme</h3>
        <div className="grid grid-cols-2 gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
              className={cn('justify-start')}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                className={cn('justify-start')}
            >
                <Moon className="mr-2 h-4 w-4" />
                Dark
            </Button>
        </div>
       </div>
    </div>
  );
}
