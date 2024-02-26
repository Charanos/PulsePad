"use client";

import { toast } from "sonner";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface MenuProps {
    documentId: Id<"documents">;
}

export const Menu = ({ documentId }: MenuProps) => {
    const router = useRouter();
    const { user } = useUser();
    const archive = useMutation(api.documents.archive);

    const onArchive = () => {
        const promise = archive({ id: documentId });

        toast.promise(promise, {
            success: "Note Moved to Trash",
            loading: "Moving Note to Trash...",
            error: "Failed to Move Note to Trash",
        });

        router.push("/documents");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button size="sm" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-60"
                align="end"
                alignOffset={8}
                forceMount
            >
                <DropdownMenuItem onClick={onArchive}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <div className="text-xs capitalize text-muted-foreground p-2">
                    last edited by: {user?.fullName}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

Menu.Skeleton = function MenuSkeleton() {
    return <Skeleton className="h-7 w-10" />;
};
