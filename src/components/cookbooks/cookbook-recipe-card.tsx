import Link from "next/link";
import Image from "next/image";
import { Clock, Flame } from "lucide-react";

import { Recipe } from "@/db/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CookbookRecipeCardProps {
  recipe: Recipe;
  notes?: string;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

export function CookbookRecipeCard({ 
  recipe, 
  notes, 
  showRemoveButton = false,
  onRemove 
}: CookbookRecipeCardProps) {
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          {recipe.images && recipe.images.length > 0 ? (
            <Image
              src={recipe.images[0].url}
              alt={recipe.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize">
            {recipe.category}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {recipe.difficulty}
          </Badge>
        </div>
        <h3 className="mt-2 line-clamp-2 text-lg font-medium">{recipe.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {recipe.description}
        </p>
        
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.totalTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        {notes && (
          <div className="mt-2 rounded-lg bg-muted p-2 text-sm">
            <p className="font-medium">Notes:</p>
            <p className="text-muted-foreground">{notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
        </Button>
        {showRemoveButton && (
          <Button 
            variant="outline" 
            className="flex-none text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={onRemove}
          >
            Remove
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
