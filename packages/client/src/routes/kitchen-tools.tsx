import { createFileRoute } from '@tanstack/react-router'
import KitchenToolsPage from '@/pages/KitchenToolsPage'

export const Route = createFileRoute('/kitchen-tools')({
  component: KitchenToolsPage,
}) 