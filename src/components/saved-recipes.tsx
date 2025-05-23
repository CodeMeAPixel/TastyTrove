'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Recipe } from '@/db/schema'
import { FileWarning, ImageIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { DeleteSavedRecipeAction } from '@/app/_actions/save'

import { AspectRatio } from './ui/aspect-ratio'
import { Button, buttonVariants } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'

type SavedRecipesProps = {
  savedRecipes: Recipe[]
}

export const SavedRecipes = ({ savedRecipes }: SavedRecipesProps) => {
  const [isPending, startTransition] = useTransition()
  return (
    <div>
      {savedRecipes.length > 0 ? (
        <div className='my-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {savedRecipes.map((recipe) => (
            <Card key={recipe.id} className='flex flex-col'>
              <AspectRatio ratio={16 / 9} className={cn('relative size-full')}>
                {recipe?.images?.length ? (
                  <Image
                    src={
                      recipe.images[0]?.url ??
                      '/images/product-placeholder.webp'
                    }
                    alt={recipe.images[0]?.name ?? recipe.name}
                    className='object-cover'
                    sizes='(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw'
                    fill
                    priority
                  />
                ) : (
                  <div
                    aria-label='Placeholder'
                    role='img'
                    aria-roledescription='placeholder'
                    className='bg-secondary flex size-full items-center justify-center'
                  >
                    <ImageIcon
                      className='text-muted-foreground size-9'
                      aria-hidden='true'
                    />
                  </div>
                )}
              </AspectRatio>

              <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{recipe.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <div className='flex justify-end gap-4'>
                  <Button
                    variant='destructive'
                    onClick={() => {
                      startTransition(async () => {
                        await DeleteSavedRecipeAction({
                          recipeId: recipe.id,
                        })
                      })
                    }}
                    disabled={isPending}
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card
          role='alert'
          aria-live='assertive'
          aria-atomic='true'
          className={cn('m-auto grid w-full max-w-lg place-items-center')}
        >
          <CardHeader>
            <div className='bg-muted grid size-20 place-items-center rounded-full'>
              <FileWarning className='text-muted-foreground size-12' />
            </div>
          </CardHeader>
          <CardContent className='flex flex-col items-center justify-center space-y-2.5 text-center'>
            <CardTitle className='text-2xl'>
              {' '}
              You have no recipes yet.
            </CardTitle>
            <CardDescription className='line-clamp-4'>
              Create a recipe to get started.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <div className='flex justify-end'>
              <Link href={`/recipes`} className={cn(buttonVariants())}>
                View all recipes
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
