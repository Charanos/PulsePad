"use client";

import { redirect } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@/components/spinner";
import Navigation from "./_components/Navigation";
import { SearchCommand } from "@/components/search-command";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { isLoading, isAuthenticated } = useConvexAuth();

    if (isLoading) {
        return (
            <div className="w-full min-h-[100vh] flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return redirect("/");
    }

    return (
        <div className="min-h-[100vh] w-full flex dark:bg-gradient-to-bl from-[#06161f] to-[#00101FC5]">
            <Navigation />

            <main className="flex-1 h-full overflow-y-auto">
                <SearchCommand />
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
