'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Asset, MaintenanceEntry } from '@/lib/types';
import { format } from 'date-fns';

const maintenanceSchema = z.object({
  description: z.string().min(5, 'Description must be at least 5 characters.'),
  cost: z.coerce.number().min(0, 'Cost must be a positive number.'),
});

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

type MaintenanceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  onSaveLog: (assetId: string, log: Omit<MaintenanceEntry, 'id' | 'date'>) => void;
};

export function MaintenanceDialog({ open, onOpenChange, asset, onSaveLog }: MaintenanceDialogProps) {
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: { description: '', cost: 0 },
  });

  if (!asset) return null;

  const onSubmit = (values: MaintenanceFormValues) => {
    onSaveLog(asset.id, { ...values, date: new Date().toISOString() });
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Maintenance Log: {asset.name}</DialogTitle>
          <DialogDescription>View history and log new maintenance for this asset.</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <h3 className="font-semibold">Maintenance History</h3>
          <ScrollArea className="h-40 w-full rounded-md border p-4">
            {asset.maintenanceHistory.length > 0 ? (
              asset.maintenanceHistory.map((log, index) => (
                <div key={log.id}>
                  <div className="text-sm">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{format(new Date(log.date), 'PPP')}</p>
                      <p className="font-mono text-xs">${log.cost.toFixed(2)}</p>
                    </div>
                    <p className="text-muted-foreground">{log.description}</p>
                  </div>
                  {index < asset.maintenanceHistory.length - 1 && <Separator className="my-2" />}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center pt-10">No maintenance history recorded.</p>
            )}
          </ScrollArea>
        </div>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="font-semibold">Log New Maintenance</h3>
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="e.g., Replaced faulty RAM module" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="cost" render={({ field }) => (
                <FormItem><FormLabel>Cost ($)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="e.g., 75.50" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter>
                <Button type="submit">Add Log Entry</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
