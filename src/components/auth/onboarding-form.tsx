'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChefHat, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { cuisineOptions, difficultyOptions } from '@/config/recipes'
import { updateUserProfileAction } from '@/app/_actions/users'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'
import { Textarea } from '@/components/ui/textarea'
import { ProfileImageUpload } from '@/components/profile/profile-image-upload'

const onboardingSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50, 'Display name is too long'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  profileImage: z.string().optional(),
  isChef: z.boolean().default(false),
  favoriteCuisines: z.array(z.string()).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
})

export function OnboardingForm() {
  const { user } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      displayName: user?.fullName || user?.username || '',
      bio: '',
      profileImage: user?.imageUrl,
      isChef: false,
      favoriteCuisines: [],
      dietaryRestrictions: [],
    },
  })

  async function onSubmit(values: z.infer<typeof onboardingSchema>) {
    try {
      setIsSubmitting(true)
      
      await updateUserProfileAction({
        displayName: values.displayName,
        bio: values.bio,
        profileImage: values.profileImage,
        isChef: values.isChef,
        preferences: {
          favoriteCuisines: values.favoriteCuisines,
          dietaryRestrictions: values.dietaryRestrictions,
        },
      })
      
      toast.success('Profile updated successfully')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Something went wrong')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const dietaryOptions = [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Gluten-Free', value: 'gluten-free' },
    { label: 'Dairy-Free', value: 'dairy-free' },
    { label: 'Nut-Free', value: 'nut-free' },
    { label: 'Keto', value: 'keto' },
    { label: 'Low-Carb', value: 'low-carb' },
  ]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete your profile</CardTitle>
        <CardDescription>
          Tell us a bit about yourself to get the most out of Tasty Trove
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center">
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <ProfileImageUpload
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself..." 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Share a bit about your cooking style or favorite dishes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isChef"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center gap-1">
                      <ChefHat className="h-4 w-4" />
                      I'm a Chef or Culinary Professional
                    </FormLabel>
                    <FormDescription>
                      This adds a badge to your profile and gives your recipes more visibility
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="favoriteCuisines"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favorite Cuisines</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select cuisines..."
                      selected={field.value || []}
                      options={cuisineOptions}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Select cuisines you enjoy cooking or eating
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dietaryRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preferences</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select dietary preferences..."
                      selected={field.value || []}
                      options={dietaryOptions}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    We'll use this to recommend suitable recipes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Profile
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
