import { type SidebarNavItem } from '@/types/nav'

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      items: [
        {
          title: 'Account',
          href: '/dashboard/account',
          icon: 'user',
          items: [],
        },

        {
          title: 'Recipes',
          href: '/dashboard/recipes/my-recipes',
          icon: 'book',
          items: [],
        },

        {
          title: 'Cookbooks',
          href: '/dashboard/cookbooks/my-cookbooks',
          icon: 'book',
          disabled: true,
          items: [],
        },

        {
          title: 'Billing',
          href: '/dashboard/billing',
          icon: 'creditCard',
          disabled: true,
          items: [],
        },
      ],
    },
  ],
}
