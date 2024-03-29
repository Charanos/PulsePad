"use client";

import { ChevronsLeftRight } from "lucide-react";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const UserItems = () => {
    const { user } = useUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div
                    role="button"
                    className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
                >
                    <div className="flex items-center gap-x-2 max-w-[150px]">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.imageUrl} />
                        </Avatar>

                        <span className="capitalize text-start font-medium line-clamp-1">
                            {user?.fullName}
                            &apos;s PulsePad
                        </span>
                    </div>

                    <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-80"
                align="start"
                alignOffset={11}
                forceMount
            >
                <div className="flex flex-col space-y-4 p-2">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                        {user?.emailAddresses[0].emailAddress}
                    </p>

                    <div className="flex items-center gap-x-2">
                        <div className="rounded-md bg-secondary p-1">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={user?.imageUrl} />
                            </Avatar>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm capitalize line-clamp-1">
                                {
                                    user?.fullName
                                }&apos;s pulsePad
                            </p>
                        </div>
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="w-full cursor-pointer text-muted-foreground flex uppercase items-center justify-center font-bold ">
                    <SignOutButton >
                        log out
                    </SignOutButton>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserItems;
