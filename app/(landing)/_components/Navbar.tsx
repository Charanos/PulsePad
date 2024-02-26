"use client";

import Logo from "./Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle } from "@/components/mode-toggle";
import { SignInButton, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const scrolled = useScrollTop();

    return (
        <div
            className={cn(
                "z-50 bg-background dark:bg-[#16222ac0] fixed top-0 flex items-center w-full p-6",
                scrolled && "border-b shadow-sm bg-opacity-95 backdrop-blur-lg"
            )}
        >
            <Logo />

            <div className="flex items-center justify-between font-bold w-full gap-x-2 md:ml-auto md:justify-end uppercase">
                {isLoading && <Spinner />}
                {!isAuthenticated && !isLoading && (
                    <>
                        <SignInButton mode="modal">
                            <Button variant="ghost" size="sm">
                                Login
                            </Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                            <Button variant="secondary" size="sm">
                                Get PulsePad Free
                            </Button>
                        </SignInButton>
                    </>
                )}
                {isAuthenticated && !isLoading && (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/documents">Enter PulsePad</Link>
                        </Button>

                        <UserButton afterSignOutUrl="/" />
                    </>
                )}
                <ModeToggle />
            </div>
        </div>
    );
};

export default Navbar;
