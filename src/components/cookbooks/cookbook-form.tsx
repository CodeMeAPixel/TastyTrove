import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { Cookbook } from "@/db/schema";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  coverImage: z.string().optional(),
  isPublic: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface CookbookFormProps {
  initialData?: Partial<Cookbook>;
  onSubmit: (data: FormValues) => Promise<void>;
  isLoading?: boolean;
}

export function CookbookForm({ initialData, onSubmit, isLoading = false }: CookbookFormProps) {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<string | undefined>(
    initialData?.coverImage
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      coverImage: initialData?.coverImage || "",
      isPublic: initialData?.isPublic ?? true,
    },
  });

  const handleImageUpload = (url?: string) => {
    setCoverImage(url);
    form.setValue("coverImage", url || "");
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      await onSubmit(data);
      toast.success(initialData ? "Cookbook updated" : "Cookbook created");
      router.push("/cookbooks");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <ImageUpload 
                  value={coverImage} 
                  onChange={handleImageUpload}
                  maxFiles={1}
                />
              </FormControl>
              <FormDescription>
                Upload a cover image for your cookbook
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Favorite Recipes" {...field} />
              </FormControl>
              <FormDescription>
                Give your cookbook a name that describes its content
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
                  placeholder="A collection of my favorite dinner recipes..."
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormDescription>
                Describe what kind of recipes are in this cookbook
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public Cookbook</FormLabel>
                <FormDescription>
                  Make this cookbook visible to other users
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : (initialData ? "Update" : "Create")} Cookbook
          </Button>
        </div>
      </form>
    </Form>
  );
}
