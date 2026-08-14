import { toast } from '@/hooks/use-toast';

export function notify(title: string, description?: string) {
  toast({ title, description });
}

export function notifySuccess(title: string, description?: string) {
  toast({ title, description, variant: 'default' });
}

export function notifyError(title: string, description?: string) {
  toast({ title, description, variant: 'destructive' });
}
