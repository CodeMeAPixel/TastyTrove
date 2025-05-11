import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

import { Cookbook } from "@/db/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

interface CookbookCardProps {
  cookbook: Cookbook;
  recipeCount?: number;
}

export function CookbookCard({ cookbook, recipeCount = 0 }: CookbookCardProps) {
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          {cookbook.coverImage ? (
            <Image
              src={cookbook.coverImage}
              alt={cookbook.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No cover image</span>
            </div>
          )}
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="line-clamp-2">{cookbook.name}</CardTitle>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {cookbook.description || "No description provided"}
        </p>
        <div className="mt-2 flex items-center text-xs text-muted-foreground">
          <span>
            {recipeCount} {recipeCount === 1 ? "recipe" : "recipes"} • Created{" "}
            {format(new Date(cookbook.createdAt), "MMM d, yyyy")}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" variant="outline">
          <Link href={`/cookbooks/${cookbook.id}`}>View Cookbook</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
