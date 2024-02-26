"use client";

import { toast } from "sonner";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { ConfirmModal } from '@/components/modals/ConfirmModal'

interface BannerProps {
    documentId: Id<"documents">;
}

export const Banner = ({ documentId }: BannerProps) => {
    const router = useRouter();
    const remove = useMutation(api.documents.remove);
    const restore = useMutation(api.documents.restore);

    const onRemove = () => {
        const promise = remove({ id: documentId })

        toast.promise(promise, {
            success: "Note Deleted!",
            loading: "Deleting Note...",
            error: "Failed to Delete Note.",
        });
        router.push("/documents");
    };

    const onRestore = () => {
        const promise = restore({ id: documentId });

        toast.promise(promise, {
            success: "Note Restored!",
            loading: "Resoring Note...",
            error: "Failed to Restore Note.",
        });
    };

    return (
        <div className="w-full bg-rose-500/55 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
            <p className="capitalize">
                This page is currently in the trash
            </p>

            <Button size='sm' onClick={onRestore} variant='outline' className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal">
                Restore page?
            </Button>

            <ConfirmModal onConfirm={onRemove}>
                <Button size='sm' variant='outline' className="border-red-600 bg-red-400 hover:bg-red-400/35 text-white hover:text-white p-1 px-2 h-auto font-normal">
                    Delete Permanently?
                </Button>
            </ConfirmModal>
        </div>
    )
};
