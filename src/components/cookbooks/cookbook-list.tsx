import Link from "next/link";
import { Plus } from "lucide-react";

import { Cookbook } from "@/db/schema";
import { CookbookCard } from "@/components/cookbooks/cookbook-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface CookbookListProps {
  cookbooks: Array<Cookbook & { recipeCount: number }>;
  showCreateButton?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function CookbookList({
  cookbooks,
  showCreateButton = true,
  emptyTitle = "No cookbooks yet",
  emptyDescription = "Create your first cookbook to start organizing your favorite recipes."
}: CookbookListProps) {
  if (cookbooks.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={
          showCreateButton ? (
            <Button asChild>
              <Link href="/cookbooks/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Cookbook
              </Link>
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {showCreateButton && (
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/cookbooks/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Cookbook
            </Link>
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cookbooks.map((cookbook) => (
          <CookbookCard
            key={cookbook.id}
            cookbook={cookbook}
            recipeCount={cookbook.recipeCount}
          />
        ))}
      </div>
    </div>
  );
}
