import { recipes, type Recipe } from '@/db/schema'

import { Icons } from '@/components/icons'

export const sortOptions = [
  { label: 'Date: Old to new', value: 'createdAt.asc' },
  {
    label: 'Date: New to old',
    value: 'createdAt.desc',
  },
  { label: 'Top recipes: Best first', value: 'rating.desc' },
  {
    label: 'Alphabetical: A to Z',
    value: 'name.asc',
  },
  {
    label: 'Alphabetical: Z to A',
    value: 'name.desc',
  },
] satisfies { label: string; value: string }[]

export const recipesCategories = [
  ...(recipes.category.enumValues.map((category) => ({
    title: category,
    slug: category.toLocaleLowerCase(),
    icon: Icons[category],
    description: `All ${category} recipes`,
  })) satisfies {
    title: Recipe['category']
    slug: string
    icon: React.FC
    description: string
  }[]),
]

export const difficultyOptions = [
  {
    label: 'Easy',
    value: 'easy',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'Hard',
    value: 'hard',
  },
]

export const cookTimeOptions = [
  {
    label: 'Quick (< 15 min)',
    value: '15',
  },
  {
    label: 'Medium (15-30 min)',
    value: '30',
  },
  {
    label: 'Long (30-60 min)',
    value: '60',
  },
  {
    label: 'Very Long (> 60 min)',
    value: '61',
  },
]

export const servingsOptions = [
  { label: '1 serving', value: '1' },
  { label: '2 servings', value: '2' },
  { label: '4 servings', value: '4' },
  { label: '6 servings', value: '6' },
  { label: '8+ servings', value: '8' },
]

export const prepTimeOptions = [
  {
    label: 'Quick (< 10 min)',
    value: '10',
  },
  {
    label: 'Medium (10-20 min)',
    value: '20',
  },
  {
    label: 'Long (> 20 min)',
    value: '21',
  },
]

// Common cuisines for filtering
export const cuisineOptions = [
  { label: 'Italian', value: 'Italian' },
  { label: 'Mexican', value: 'Mexican' },
  { label: 'Chinese', value: 'Chinese' },
  { label: 'Indian', value: 'Indian' },
  { label: 'Japanese', value: 'Japanese' },
  { label: 'French', value: 'French' },
  { label: 'Mediterranean', value: 'Mediterranean' },
  { label: 'Thai', value: 'Thai' },
  { label: 'American', value: 'American' },
  { label: 'Greek', value: 'Greek' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'Korean', value: 'Korean' },
  { label: 'Middle Eastern', value: 'Middle Eastern' },
  { label: 'Vietnamese', value: 'Vietnamese' },
  { label: 'Caribbean', value: 'Caribbean' },
]
