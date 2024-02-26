"use client";

import { Item } from "./Item";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import UserItems from "./UserItems";
import { TrashBox } from "./TrashBox";
import DocumentList from "./DocumentList";
import { Navbar } from "./DocumentNavbar";
import { useMutation } from "convex/react";
import { useMediaQuery } from "usehooks-ts";
import { api } from "@/convex/_generated/api";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { PopoverContent } from "@radix-ui/react-popover";
import { ElementRef, useEffect, useRef, useState } from "react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
    ChevronsLeft,
    MenuIcon,
    Plus,
    PlusCircle,
    PlusIcon,
    Search,
    Settings,
    Trash,
} from "lucide-react";

const Navigation = () => {
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");

    // convex db api
    const create = useMutation(api.documents.create);

    const params = useParams();
    const router = useRouter();
    const search = useSearch();
    const settings = useSettings();

    const isResizingRef = useRef(false);
    const navBarRef = useRef<ElementRef<"div">>(null);
    const sideBarRef = useRef<ElementRef<"aside">>(null);

    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    useEffect(() => {
        if (isMobile) {
            collapse();
        } else {
            resetWidth();
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            collapse();
        }
    }, [pathname, isMobile]);

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return;
        let newWidth = event.clientX;

        if (newWidth < 240) newWidth = 240;
        if (newWidth > 480) newWidth = 480;

        if (sideBarRef.current && navBarRef.current) {
            sideBarRef.current.style.width = `${newWidth}px`;
            navBarRef.current.style.setProperty("left", `${newWidth}px`);
            navBarRef.current.style.setProperty(
                "width",
                `calc(100% - ${newWidth}px)`
            );
        }
    };

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const resetWidth = () => {
        if (sideBarRef.current && navBarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);

            sideBarRef.current.style.width = isMobile ? "100%" : "240px";
            navBarRef.current.style.setProperty(
                "width",
                isMobile ? "0" : "calc(100% - 240px)"
            );
            navBarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
            setTimeout(() => setIsResetting(false), 300);
        }
    };

    const collapse = () => {
        if (sideBarRef.current && navBarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sideBarRef.current.style.width = "0";
            navBarRef.current.style.setProperty("left", "0");
            navBarRef.current.style.setProperty("width", "100%");

            setTimeout(() => setIsResetting(false), 300);
        }
    };

    const handleCreate = () => {
        const promise = create({ title: "Untitled" }).then((documentId) =>
            router.push(`documents/${documentId}`)
        );

        toast.promise(promise, {
            loading: "Creating a new Note...",
            error: "Failed to Create a New Note",
            success: "Successfully Created a New Note",
        });
    };

    return (
        <>
            <aside
                ref={sideBarRef}
                className={cn(
                    "flex flex-col group/sidebar min-h-[100vh] bg-secondary dark:bg-[#101d2598] overflow-y-auto relative w-60 z-[99999]",
                    isMobile && "w-0",
                    isResetting && "transition-all ease-in-out duration-300"
                )}
            >
                <div
                    role="button"
                    onClick={collapse}
                    className={cn(
                        "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                        isMobile && "opacity-100"
                    )}
                >
                    <ChevronsLeft className="h-6 w-6" />
                </div>

                <div className="">
                    <UserItems />

                    <Item isSearch icon={Search} label="Search" onClick={search.onOpen} />
                    <Item icon={Settings} label="Settings" onClick={settings.onOpen} />
                    <Item onClick={handleCreate} label="New Page" icon={PlusCircle} />
                </div>

                <div className="mt-4">
                    <DocumentList />
                    <Item onClick={handleCreate} icon={Plus} label="Add a New Page" />

                    <Popover>
                        <PopoverTrigger className="w-full mt-4">
                            <Item label="Trash" icon={Trash} />
                        </PopoverTrigger>

                        <PopoverContent
                            className="p-0 w-72 ml-2 bg-slate-100 shadow-md dark:bg-[#1b3c4db6] backdrop-blur-sm"
                            side={isMobile ? "bottom" : "right"}
                        >
                            <TrashBox />
                        </PopoverContent>
                    </Popover>
                </div>

                <div
                    onClick={resetWidth}
                    onMouseDown={handleMouseDown}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                />
            </aside>

            <div
                ref={navBarRef}
                className={cn(
                    "absolute top-0 left-60 w-[10vw)] z-[99999]",
                    isMobile && "left-0 w-full",
                    isResetting && "transition-all ease-in-out duration-300"
                )}
            >
                {!!params.documentId ? (
                    <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
                ) : (
                    <nav className="bg-transparent px-3 py-2 w-full">
                        {isCollapsed && (
                            <MenuIcon
                                onClick={resetWidth}
                                role="button"
                                className="h-6 w-6 text-muted-foreground"
                            />
                        )}
                    </nav>
                )}
            </div>
        </>
    );
};

export default Navigation;
