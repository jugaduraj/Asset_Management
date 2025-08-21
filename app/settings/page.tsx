
'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  UserCircle,
  Loader2,
  ShieldCheck,
  Bell,
  Paintbrush,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useUser } from '@/context/user-context';
import { AppearanceForm } from '@/components/appearance-form';


export default function SettingsPage() {
    const { toast } = useToast();
    const { user, setUser } = useUser();

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar);
    
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

     useEffect(() => {
        setIsLoading(true);
        // Data is now loaded from context, but we can keep the skeleton for a better UX
        setName(user.name);
        setEmail(user.email);
        setAvatarPreview(user.avatar);
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, [user]);


    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else if (file) {
            toast({
                variant: 'destructive',
                title: 'Invalid File Type',
                description: 'Please select an image file.',
            });
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // In a real app, you'd call an API here.
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUser({ name, email, avatar: avatarPreview });
            toast({
                title: 'Profile Updated',
                description: 'Your changes have been saved successfully.',
            });
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: 'Could not save your changes.',
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handlePasswordUpdate = async () => {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({ title: 'Password Updated', description: 'You would be logged out now in a real application.' });
    }
    
    const handlePreferencesSave = async () => {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({ title: 'Preferences Saved', description: 'Your notification settings have been updated.' });
    }

    if (isLoading) {
        return (
            <>
                <header className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Settings</h1>
                </header>
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-20 w-20 rounded-full" />
                                    <Skeleton className="h-10 w-28" />
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                             <Skeleton className="h-10 w-24" />
                        </CardFooter>
                    </Card>
                </div>
            </>
        )
    }

  return (
    <>
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Paintbrush className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details here.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveChanges}>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview} data-ai-hint="user avatar" />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                   <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      className="hidden"
                      accept="image/*"
                  />
                  <Button type="button" variant="outline" onClick={handlePhotoClick}>Change Photo</Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? <><Loader2 className="animate-spin mr-2" /> Saving...</> : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of the application. Changes are saved automatically.</CardDescription>
                </CardHeader>
                <CardContent>
                   <AppearanceForm />
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="security">
            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password here. After changing your password, you will be logged out.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handlePasswordUpdate}>Update Password</Button>
                </CardFooter>
            </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive important updates and summaries via email.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">In-App Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get notified about activities directly within the app.</p>
                    </div>
                     <Switch defaultChecked />
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Asset Updates</Label>
                        <p className="text-sm text-muted-foreground">Notify me when an asset's status changes or warranty is expiring.</p>
                    </div>
                     <Switch defaultChecked />
                </div>
            </CardContent>
             <CardFooter className="border-t px-6 py-4">
                <Button onClick={handlePreferencesSave}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

      </Tabs>
    </>
  );
}
