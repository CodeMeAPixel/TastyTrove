'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { recipes } from '@/db/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'
import type z from 'zod'

import { Units, type FileWithPreview } from '@/types/recipes'
import { useUploadThing } from '@/lib/uploadthing'
import { isArrayOfFile } from '@/lib/utils'
import { recipesSchema } from '@/lib/validations/recipes'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AddRecipeAction, generateRecipes } from '@/app/_actions/recipes'
import FileDialog from '../file-dialog'
import { Zoom } from '../zoom-image'
import { difficultyOptions, cookTimeOptions, servingsOptions, cuisineOptions } from '@/config/recipes'
import { categoryEnum } from '@/db/schema'

type Inputs = z.infer<typeof recipesSchema>

export function AddNewRecipe() {
  const [files, setFiles] = useState<FileWithPreview[] | null>(null)
  const { isUploading, startUpload } = useUploadThing('recipeUpload')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('basic')
  
  const form = useForm<Inputs>({
    resolver: zodResolver(recipesSchema),
    defaultValues: {
      name: '',
      author: '',
      description: '',
      category: 'breakfast',
      difficulty: 'easy',
      prepTime: 15,
      cookTime: 30,
      totalTime: 45,
      servings: 4,
      ingredients: [
        {
          ingredient: '',
          quantity: 1,
          units: Units.unit,
        },
      ],
      steps: [''], 
      cuisine: '',
      source: '',
      notes: '',
      isPublished: true,
    },
  })
  
  // Use fieldArray to properly manage dynamic fields
  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients"
  });
  
  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control: form.control,
    name: "steps"
  });

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        const images = isArrayOfFile(data.images)
          ? await startUpload(data.images).then((res) => {
              const formattedImages = res?.map((image) => ({
                id: image.key,
                name: image.name ?? image.key.split('/').pop() ?? 'unknown',
                url: image.ufsUrl,
              }))

              return formattedImages ?? null
            })
          : null

        // Calculate total time if not specified
        if (!data.totalTime) {
          data.totalTime = data.prepTime + (data.cookTime || 0);
        }
        
        // Convert steps from array to string if needed
        const processedSteps = Array.isArray(data.steps) ? data.steps : [data.steps];

        toast.promise(
          AddRecipeAction({
            ...data,
            steps: processedSteps,
            images,
          }),
          {
            loading: data.isPublished ? 'Publishing recipe...' : 'Saving draft...',
            success: () => {
              form.reset();
              setFiles(null);
              router.push('/dashboard/recipes/my-recipes');
              return data.isPublished 
                ? 'Recipe published successfully!' 
                : 'Recipe saved as draft successfully!';
            },
            error: (err: unknown) => {
              if (err instanceof Error) {
                return err.message;
              }
              return 'Something went wrong.';
            },
          },
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Something went wrong.');
        }
      }
    });
  }

  // Simplified add/remove functions that use fieldArray
  const addIngredient = () => {
    appendIngredient({ ingredient: '', quantity: 1, units: Units.unit });
  }
  
  const addStep = () => {
    appendStep('');
  }

  // Add function to validate minimum required fields for a draft
  const validateMinimumDraftRequirements = (data: Inputs) => {
    const errors: string[] = [];
    
    if (!data.name || data.name.trim() === '') {
      errors.push("Recipe name is required, even for drafts");
    }
    
    if (!data.category) {
      errors.push("Category is required");
    }
    
    if (data.ingredients.length === 0 || data.ingredients.every(ing => !ing.ingredient || ing.ingredient.trim() === '')) {
      errors.push("At least one ingredient is required");
    }
    
    return errors;
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-blue-900 dark:bg-blue-950 dark:text-blue-100 border border-blue-200 dark:border-blue-800">
          <svg
            className="h-5 w-5 text-blue-400 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path stroke="currentColor" strokeWidth="2" d="M12 8v4m0 4h.01" />
          </svg>
          <span>
            Need help? See our{' '}
            <a
              href="/faqs"
              className="underline hover:text-pink-accent font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              FAQs & Recipe Guide
            </a>
            .
          </span>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="steps">Steps</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Delicious Chocolate Cake" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of your recipe.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A rich, moist chocolate cake that's perfect for any occasion..."
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Briefly describe your recipe.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(recipes.category.enumValues).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficultyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="prepTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prep Time (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value || '0'))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cookTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cook Time (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value || '0'))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="servings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Servings</FormLabel>
                      <Select onValueChange={v => field.onChange(parseInt(v))} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select servings" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {servingsOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="ingredients" className="space-y-6">
              {ingredientFields.map((field, index) => (
                <div key={field.id} className="flex space-x-2 items-end">
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.ingredient`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Ingredient {index + 1}</FormLabel>
                        <FormControl>
                          <Input placeholder="Flour" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="w-20">
                        <FormLabel>Qty</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} step={0.1} {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value || '0'))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.units`}
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <FormLabel>Unit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(Units).map(([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon"
                    onClick={() => removeIngredient(index)}
                  >
                    X
                  </Button>
                </div>
              ))}
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={addIngredient}
              >
                Add Ingredient
              </Button>
            </TabsContent>
            
            <TabsContent value="steps" className="space-y-6">
              {stepFields.map((field, index) => (
                <div key={field.id} className="flex space-x-2 items-end">
                  <FormField
                    control={form.control}
                    name={`steps.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Step {index + 1}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Mix the ingredients..."
                            className="min-h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon"
                    onClick={() => removeStep(index)}
                  >
                    X
                  </Button>
                </div>
              ))}
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={addStep}
              >
                Add Step
              </Button>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6">
              <FormField
                control={form.control}
                name="cuisine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisine</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cuisine" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cuisineOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <FormControl>
                      <Input placeholder="Family recipe, website URL, cookbook, etc." {...field} />
                    </FormControl>
                    <FormDescription>
                      Where did you get this recipe from?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any special notes or tips for this recipe..."
                        className="min-h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <div>
                        {files && files.length > 0 && (
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            {files.map((file, i) => (
                              <div key={i} className="relative aspect-square rounded-md overflow-hidden">
                                <img src={file.preview} alt={`Recipe image ${i+1}`} className="object-cover w-full h-full" />
                                <Button 
                                  type="button" 
                                  variant="destructive" 
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  onClick={() => {
                                    const newFiles = [...files];
                                    newFiles.splice(i, 1);
                                    setFiles(newFiles.length ? newFiles : null);
                                    
                                    // Clear form value if no files left
                                    if (newFiles.length === 0) {
                                      form.setValue('images', undefined);
                                    }
                                  }}
                                >
                                  X
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <FileDialog
                          setValue={form.setValue}
                          name='images'
                          maxFiles={5}
                          maxSize={1024 * 1024 * 4}
                          files={files}
                          setFiles={setFiles}
                          isUploading={isUploading}
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload images of your recipe (max 5 images).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Publish Recipe</FormLabel>
                      <FormDescription>
                        When checked, your recipe will be visible to others.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            
            <div className="space-x-2">
              <Button 
                type="button"
                variant="secondary"
                onClick={() => {
                  // Set isPublished to false and submit the form
                  const currentData = form.getValues();
                  
                  // Validate minimum requirements for draft
                  const validationErrors = validateMinimumDraftRequirements(currentData);
                  
                  if (validationErrors.length > 0) {
                    validationErrors.forEach(error => toast.error(error));
                    return;
                  }
                  
                  onSubmit({ ...currentData, isPublished: false });
                }}
                disabled={isPending}
              >
                Save as Draft
              </Button>
              
              <Button 
                type="submit" 
                onClick={() => {
                  // Make sure isPublished is true when publishing
                  form.setValue('isPublished', true);
                }}
                disabled={isPending}
              >
                {isPending ? 'Saving...' : 'Publish Recipe'}
              </Button>
            </div>
          </div>
          
          {/* Development-only button */}
          {process.env.NODE_ENV === 'development' ? (
            <Button
              type='button'
              onClick={() => {
                startTransition(async () => {
                  try {
                    await generateRecipes()
                    toast.success('Recipes generated successfully.')
                  } catch (error) {
                    if (error instanceof Error) {
                      toast.error(error.message)
                    }
                  }
                })
              }}
              className='w-fit'
              disabled={isPending}
            >
              {isPending && (
                <Loader2
                  className='mr-2 size-4 animate-spin'
                  aria-hidden='true'
                />
              )}
              Generate Recipes
              <span className='sr-only'>Generate Recipes</span>
            </Button>
          ) : null}
        </form>
      </Form>
    </>
  )
}
