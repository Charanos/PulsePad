"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useMutation } from "convex/react";
import { ImageIcon, X } from "lucide-react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "./ui/skeleton";

interface CoverImageProps {
    url?: string;
    preview?: boolean;
}

export const Cover = ({ url, preview }: CoverImageProps) => {
    const params = useParams();
    const coverImage = useCoverImage();
    const { edgestore } = useEdgeStore();
    const removeImage = useMutation(api.documents.RemoveCoverImage);

    const onRemove = async () => {
        if (url) {
            await edgestore.publicFiles.delete({
                url: url,
            });
        }

        removeImage({
            id: params.documentId as Id<"documents">,
        });
    };

    return (
        <div
            className={cn(
                "relative w-full h-[35vh] group",
                !url && "h-[12vh]",
                url && "bg-muted"
            )}
        >
            {!!url && <Image src={url} fill alt="cover" className="object-cover" />}
            {url && !preview && (
                <div className="flex opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 items-center gap-x-2">
                    <Button
                        variant="outline"
                        className="text-muted-foreground text-xs"
                        size="sm"
                        onClick={() => coverImage.onReplace(url)}
                    >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Change Cover Image
                    </Button>

                    <Button
                        variant="outline"
                        className="text-muted-foreground text-xs"
                        size="sm"
                        onClick={onRemove}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Remove Cover Image
                    </Button>
                </div>
            )}
        </div>
    );
};

Cover.Skeleton = function CoverSkeleton() {
    return <Skeleton className="w-full h-[12vh]" />;
};
