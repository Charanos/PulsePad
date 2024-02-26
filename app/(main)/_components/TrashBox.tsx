"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/spinner";
import { Id } from "@/convex/_generated/dataModel";
import { Search, Trash, Undo } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/modals/ConfirmModal";

export const TrashBox = () => {
    const router = useRouter();
    const params = useParams();
    const remove = useMutation(api.documents.remove);
    const documents = useQuery(api.documents.getTrash);
    const restore = useMutation(api.documents.restore);

    const [search, setSearch] = useState("");

    const filteredDocuments = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    const onRestore = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId: Id<"documents">
    ) => {
        event.stopPropagation();
        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restoring Note...",
            error: "Failed to Restore Note!! 😢",
            success: "Note Successfully Restored 👌",
        });
    };

    const onRemove = (documentId: Id<"documents">) => {
        const promise = remove({ id: documentId });

        toast.promise(promise, {
            loading: "Deleting Note...",
            error: "Failed to Delete Note!! 🤷‍♀️ ",
            success: "Note Successfully Deleted 🗑",
        });

        if (params.documentId === documentId) {
            router.push("/documents");
        }
    };

    if (documents === undefined) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <div className="text-sm">
                <div className="flex items-center gap-x-2 p-2">
                    <Search className="h-4 w-4" />
                    <Input
                        className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                        placeholder="Filter By Page Title"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="mt-2 px-1 pb-1">
                    <p className="hidden last:block uppercase text-sm text-muted-foreground pb-2 text-center">
                        no document found!
                    </p>

                    {filteredDocuments?.map((document) => (
                        <div
                            className="text-sm rounded-sm w-full flex items-center justify-between text-primary hover:bg-primary/5"
                            key={document._id}
                            role="button"
                            onClick={() => onClick(document._id)}
                        >
                            <span className="truncate pl-2">{document.title}</span>

                            <div className="flex items-center">
                                <div
                                    className="p-2 rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                    role="button"
                                    onClick={(e) => onRestore(e, document._id)}
                                >
                                    <Undo className="h-4 w-4 text-muted-foreground" />
                                </div>

                                <ConfirmModal onConfirm={() => onRemove(document._id)}>
                                    <div
                                        className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                        role="button"
                                    >
                                        <Trash className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </ConfirmModal>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
