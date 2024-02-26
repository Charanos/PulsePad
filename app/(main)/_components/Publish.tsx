"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrigin } from "@/hooks/use-origin";
import { Doc } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe } from "lucide-react";

interface PublishProps {
    initialData: Doc<"documents">;
}

export const Publish = ({ initialData }: PublishProps) => {
    const origin = useOrigin();

    const update = useMutation(api.documents.update);

    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const url = `${origin}/preview/${initialData._id}`;

    const onPublish = () => {
        setIsSubmitting(true);

        const promise = update({
            isPublished: true,
            id: initialData._id,
        }).finally(() => setIsSubmitting(false));

        toast.promise(promise, {
            loading: "Publishing Note...",
            error: "Failed to Publish Note!",
            success: "Successfully Published Note!",
        });
    };

    const onUnPublish = () => {
        setIsSubmitting(true);

        const promise = update({
            isPublished: false,
            id: initialData._id,
        }).finally(() => setIsSubmitting(false));

        toast.promise(promise, {
            loading: "Unpublishing Note...",
            error: "Failed to Unpublish Note!",
            success: "Successfully Unpublished Note!",
        });
    };

    const onCopy = () => {
        navigator.clipboard.writeText(url);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                    Publish
                    {initialData.isPublished && (
                        <Globe className="text-sky-500 w-4 h-4 ml-2" />
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
                {initialData.isPublished ? (
                    <div className=" space-y-4 ">
                        <div className="flex items-center gap-x-2">
                            <Globe className="h-4 w-4 animate-pulse text-sky-500" />

                            <p className="text-sm capitalize text-center font-medium">this note is already published</p>
                        </div>

                        <div className="flex items-center">
                            <input value={url} className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate" disabled />

                            <Button onClick={onCopy} disabled={copied} className="h-8 rounded-l-none">
                                {
                                    copied ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )
                                }
                            </Button>
                        </div>

                        <Button size='sm' onClick={onUnPublish} disabled={isSubmitting} className="uppercase w-full text-sm">
                            Unpublish
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-2 capitalize">
                            pulish this note
                        </p>

                        <span className="text-xs text-muted-foreground mb-4 uppercase">
                            share your work with others
                        </span>

                        <Button disabled={isSubmitting} onClick={onPublish} size='sm' className="uppercase w-full text-xs">
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};
