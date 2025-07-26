import { createFileRoute } from '@tanstack/react-router';
import ShoppingListPage from '@/pages/ShoppingListPage';

export const Route = createFileRoute('/shopping-list')({
  component: ShoppingListPage,
  validateSearch: (search: Record<string, unknown>) => {
    // ids: comma separated recipe ids
    return {
      ids: typeof search.ids === 'string' ? search.ids : undefined,
    } as { ids?: string };
  },
}); 