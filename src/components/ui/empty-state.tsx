import Image from "next/image";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  imageUrl?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  imageUrl,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      {Icon && <Icon className="h-12 w-12 text-muted-foreground" />}
      {imageUrl && (
        <div className="relative mb-4 h-40 w-40">
          <Image
            src={imageUrl}
            alt="Empty state illustration"
            fill
            className="object-contain"
          />
        </div>
      )}
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
