"use client";

import { Menu } from "./Menu";
import { Title } from "./Title";
import { Banner } from "./Banner";
import { Publish } from "./Publish";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
    const params = useParams();

    const document = useQuery(api.documents.getById, {
        documentId: params.documentId as Id<"documents">,
    });

    if (document === undefined) {
        return (
            <nav className="flex items-center justify-between px-3 py-2 bg-background dark:bg-[#101d25e3]  w-full">
                <Title.Skeleton />

                <div className="flex items-center gap-x-2">
                    <Menu.Skeleton />
                </div>
            </nav>
        );
    }

    if (document === null) {
        return null;
    }

    return (
        <>
            <nav className="flex items-center gap-x-4 px-3 py-2 bg-background dark:bg-[#101d25e1] dark:backdrop-blur-sm w-full">
                {isCollapsed && (
                    <MenuIcon
                        role="button"
                        onClick={onResetWidth}
                        className="h-6 w-6 text-muted-foreground"
                    />
                )}

                <div className="flex items-center justify-between w-full">
                    <Title initialData={document} />

                    <div className="flex items-center gap-x-2">
                        <Publish initialData={document} />

                        <Menu documentId={document._id} />
                    </div>
                </div>
            </nav>

            {document.isArchived && <Banner documentId={document._id} />}
        </>
    );
};
