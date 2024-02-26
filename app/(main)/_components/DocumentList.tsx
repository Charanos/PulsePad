"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Item } from "./Item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
    level?: number;
    data?: Doc<"documents">[];
    parentDocumentId?: Id<"documents">;
}

const DocumentList = ({ level = 0, parentDocumentId }: DocumentListProps) => {
    const params = useParams();
    const router = useRouter();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const onExpand = (documentId: string) => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId],
        }));
    };

    const documents = useQuery(api.documents.getSidebar, {
        parentDocument: parentDocumentId,
    });

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    if (documents === undefined) {
        return (
            <>
                <Item.Skeleton level={level} />

                {level === 0 && (
                    <>
                        <Item.Skeleton level={level} />
                        <Item.Skeleton level={level} />
                    </>
                )}
            </>
        );
    }

    return (
        <>
            <p
                style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
                className={cn(
                    "hidden text-sm font-medium text-muted-foreground/80",
                    expanded && "last:block",
                    level === 0 && "hidden"
                )}
            >
            </p>
            {
                documents.map((document) => (
                    <div key={document._id}>
                        <Item
                            level={level}
                            icon={FileIcon}
                            id={document._id}
                            label={document.title}
                            documentIcon={document.icon}
                            expanded={expanded[document._id]}
                            onExpand={() => onExpand(document._id)}
                            onClick={() => onRedirect(document._id)}
                            active={params.documentId === document._id}
                        />
                        {
                            expanded[document._id] && (
                                <DocumentList
                                    level={level + 1}
                                    parentDocumentId={document._id}
                                />
                            )
                        }

                    </div>
                ))
            }

        </>
    );
};

export default DocumentList;
