"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const NAME_KEY = 'tictactoe-player-name';

const NameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(15, "Name can be at most 15 characters."),
});

interface PlayerNameDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string) => Promise<void>;
  isProcessing: boolean;
}

export function PlayerNameDialog({ isOpen, onOpenChange, onConfirm, isProcessing }: PlayerNameDialogProps) {
  const form = useForm<z.infer<typeof NameSchema>>({
    resolver: zodResolver(NameSchema),
    defaultValues: {
      name: "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      const storedName = localStorage.getItem(NAME_KEY) || "";
      form.setValue('name', storedName);
    }
  }, [isOpen, form]);

  const onSubmit = async (data: z.infer<typeof NameSchema>) => {
    localStorage.setItem(NAME_KEY, data.name);
    await onConfirm(data.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter the Arena</DialogTitle>
          <DialogDescription>
            Choose your display name. This will be visible to your opponent.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ada Lovelace" 
                      {...field} 
                      className="h-12 text-lg" 
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Continue
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    