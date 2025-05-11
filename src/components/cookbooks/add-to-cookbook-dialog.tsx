import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";

import { Cookbook, Recipe } from "@/db/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface AddToCookbookDialogProps {
  recipe: Recipe;
  userCookbooks: Cookbook[];
  recipeInCookbooks?: number[];
  addToCookbook: (cookbookId: number, recipeId: number, notes?: string) => Promise<void>;
  removeFromCookbook?: (cookbookId: number, recipeId: number) => Promise<void>;
  trigger?: React.ReactNode;
}

export function AddToCookbookDialog({
  recipe,
  userCookbooks,
  recipeInCookbooks = [],
  addToCookbook,
  removeFromCookbook,
  trigger,
}: AddToCookbookDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCookbook, setSelectedCookbook] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCookbooks = userCookbooks.filter((cookbook) =>
    cookbook.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddOrRemove = async (cookbookId: number) => {
    setIsSubmitting(true);
    
    try {
      const isInCookbook = recipeInCookbooks.includes(cookbookId);
      
      if (isInCookbook && removeFromCookbook) {
        await removeFromCookbook(cookbookId, recipe.id);
        toast.success("Recipe removed from cookbook");
      } else {
        if (selectedCookbook === cookbookId) {
          await addToCookbook(cookbookId, recipe.id, notes);
          toast.success("Recipe added to cookbook with notes");
        } else {
          await addToCookbook(cookbookId, recipe.id);
          toast.success("Recipe added to cookbook");
        }
      }
      
      router.refresh();
      setSelectedCookbook(null);
      setNotes("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update cookbook");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCookbook = () => {
    router.push("/cookbooks/new");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> Add to Cookbook
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add to Cookbook</DialogTitle>
          <DialogDescription>
            Select a cookbook to add this recipe to or create a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <Input
            placeholder="Search cookbooks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />

          {filteredCookbooks.length > 0 ? (
            <ScrollArea className="h-[300px] rounded-md border">
              <div className="p-4 space-y-2">
                {filteredCookbooks.map((cookbook) => (
                  <div key={cookbook.id}>
                    <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                      <div 
                        className="flex-1 cursor-pointer" 
                        onClick={() => {
                          if (selectedCookbook === cookbook.id) {
                            setSelectedCookbook(null);
                          } else {
                            setSelectedCookbook(cookbook.id);
                            setNotes("");
                          }
                        }}
                      >
                        <h3 className="font-medium">{cookbook.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {cookbook.description || "No description"}
                        </p>
                      </div>
                      <Button
                        variant={recipeInCookbooks.includes(cookbook.id) ? "default" : "outline"}
                        size="sm"
                        className="ml-2"
                        onClick={() => handleAddOrRemove(cookbook.id)}
                        disabled={isSubmitting}
                      >
                        {recipeInCookbooks.includes(cookbook.id) ? (
                          <>
                            <Check className="mr-1 h-4 w-4" /> Added
                          </>
                        ) : (
                          "Add"
                        )}
                      </Button>
                    </div>
                    
                    {selectedCookbook === cookbook.id && (
                      <div className="mt-2 p-2 bg-muted rounded-md">
                        <Textarea
                          placeholder="Add notes about this recipe in your cookbook (optional)"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <Button 
                          className="mt-2" 
                          size="sm"
                          onClick={() => handleAddOrRemove(cookbook.id)}
                          disabled={isSubmitting}
                        >
                          Save with Notes
                        </Button>
                      </div>
                    )}
                    
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex h-[100px] items-center justify-center rounded-md border">
              <p className="text-muted-foreground">No cookbooks found</p>
            </div>
          )}

          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleCreateCookbook}
          >
            <Plus className="mr-1 h-4 w-4" /> Create New Cookbook
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
