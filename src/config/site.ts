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
      title: 'Navigation',
      items: [
        {
          title: 'Home',
          href: '/',
          external: false,
        },

        {
          title: 'About Us',
          href: '/about',
          external: false,
        },
        {
          title: 'Blog Posts',
          href: '/blog',
          external: false,
        },
      ],
    },
    {
      title: 'Social',
      items: [
        {
          title: 'Twitter',
          href: 'https://twitter.com/TastyTroveApp',
          external: true,
        },
        {
          title: 'GitHub',
          href: 'https://github.com/TastyTroveApp',
          external: true,
        },
        {
          title: 'Discord',
          href: 'https://discord.gg/Vv2bdC44Ge',
          external: true,
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          title: 'Terms of Service',
          href: '/legal/terms',
          external: false
        },
        {
          title: 'Privacy Policy',
          href: '/legal/privacy',
          external: false
        },
        {
          title: 'Use License',
          href: '/legal/usage',
          external: false
        },
      ]
    }
  ],
  emails: {
    licensing: "licensing@tastytrove.ca",
    contact: "hey@tastytrove.ca",
    support: "support@tastytrove.ca",
    careers: "join@tastytrove.ca",
    legal: "legal@tastytrove.ca",
    dpo: "dpo@tastytrove.ca"
  }
}
