"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChevronDown,
    ChevronRight,
    LucideIcon,
    MoreHorizontal,
    Plus,
    Trash,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ItemProps {
    label: string;
    level?: number;
    icon: LucideIcon;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    onClick?: () => void;
    id?: Id<"documents">;
    onExpand?: () => void;
    documentIcon?: string;
}

export const Item = ({
    id,
    label,
    active,
    onClick,
    expanded,
    isSearch,
    onExpand,
    level = 0,
    icon: Icon,
    documentIcon,
}: ItemProps) => {
    const { user } = useUser();
    const router = useRouter();
    const create = useMutation(api.documents.create);
    const archive = useMutation(api.documents.archive);

    const handleExpand = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        onExpand?.();
    };

    const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();

        if (!id) return;

        const promise = archive({ id }).then(() => router.push("/documents"));

        toast.promise(promise, {
            loading: "Moving Note to Trash...",
            error: "Failed to Move Note to Trash.",
            success: "Successfully Moved Note to Trash.",
        });
    };

    const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();

        if (!id) return;

        const promise = create({ title: "Untitled", parentDocument: id }).then(
            (documentId) => {
                if (!expanded) {
                    onExpand?.();
                }
                router.push(`/documents/${documentId}`);
            }
        );
        toast.promise(promise, {
            loading: "Creating a New Note...",
            error: "Failed to Create New Note.",
            success: "Successfully Created a New Note.",
        });
    };

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;

    return (
        <div
            role="button"
            onClick={onClick}
            style={{
                paddingLeft: level ? `${level * 12 + 12}px` : "12px",
            }}
            className={cn(
                "group min-h-[27px flex items-center text-muted-foreground text-sm py-1 pr-3 w-full hover:bg-primary/5 font-medium",
                active && "bg-primary/5 text-primary"
            )}
        >
            {!!id && (
                <div
                    role="button"
                    className="h-full rounded-sm hover:bg-neutral-300"
                    onClick={handleExpand}
                >
                    <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                </div>
            )}
            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
            ) : (
                <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
            )}

            <span className="truncate">{label}</span>

            {isSearch && (
                <kbd className="rounded border bg-muted items-center ml-auto pointer-events-none inline-flex h-5 select-none gap-1 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">CTRL</span>K
                </kbd>
            )}

            {!!id && (
                <div
                    role="button"
                    onClick={onCreate}
                    className="flex items-center ml-auto gap-x-2"
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <div
                                className="opacity-0 h-full rounded-sm group-hover:opacity-100 ml-auto hover:bg-neutral-300 dark:hover:bg-neutral-600"
                                role="button"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                        >
                            <DropdownMenuItem onClick={onArchive}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <div className="capitalize text-sm text-muted-foreground p-2">
                                last edited by: {user?.fullName}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
                        <Plus className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            )}
        </div>
    );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div
            className="flex gap-x-2 py-[3px]"
            style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
        >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    );
};
