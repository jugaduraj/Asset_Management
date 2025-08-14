
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {
  UserCircle,
  Palette,
} from 'lucide-react';
import ThemeCustomizer from '../../../components/theme-customizer';

export default function SettingsPage() {
  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                <span>Profile</span>
              </div>
            </CardTitle>
            <CardDescription>
              Manage your profile settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Profile settings will be shown here.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <span>Appearance</span>
              </div>
            </CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeCustomizer />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
