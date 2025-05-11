import { recipes } from '@/db/schema'

import type { MainNavItem } from '@/types/nav'
import { slugify } from '@/lib/utils'

import { recipesCategories } from './recipes'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Tasty Trove',
  description: 'A platform to create, view and share recipes',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  sourceCode: 'https://github.com/CodeMeAPixel/TastyTrove',
  discordUrl: 'https://discord.gg/Vv2bdC44Ge',
  twitterUrl: 'https://twitter.com/CodeMeAPixel',
  MainNavItem: [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Recipes',
      href: '/recipes',
    },
    {
      title: 'Categories',
      href: '/categories',
      items: [
        {
          title: 'All categories',
          href: '/categories',
          description: 'View all categories',
          items: [],
        },
        ...recipesCategories.map((category) => ({
          title: category.title,
          href: `/category/${slugify(category.title)}`,
          description: `View all ${category.title} recipes`,
          items: [],
        })),
      ],
    }
  ] satisfies MainNavItem[],

  recipeNav: recipes.category.enumValues.map((category) => ({
    title: category,
    href: `/recipes/${category}`,
  })),

  footerNav: [
    {
      title: 'Inspiration',
      items: [
        {
          title: 'Skateshop',
          href: 'https://skateshop.sadmn.com',
          external: true,
        },

        {
          title: 'Taxonomy',
          href: 'https://tx.shadcn.com/',
          external: true,
        },
        {
          title: 'shadcn/ui',
          href: 'https://ui.shadcn.com',
          external: true,
        },
      ],
    },

    {
      title: 'Social',
      items: [
        {
          title: 'Twitter',
          href: 'https://twitter.com/CodeMeAPixel',
          external: true,
        },
        {
          title: 'GitHub',
          href: 'https://github.com/CodeMeAPixel',
          external: true,
        },
        {
          title: 'LinkedIn',
          href: 'https://www.linkedin.com/in/CodeMeAPixel',
          external: true,
        },
      ],
    },
  ],
}
