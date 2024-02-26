"use client";

import { Button } from "./ui/button";
import { IconPicker } from "./IconPicker";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ImageIcon, Smile, X } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { ElementRef, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";

interface ToolbarProps {
    initialData: Doc<"documents">;
    preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {

    const coverImage = useCoverImage()
    const update = useMutation(api.documents.update);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<ElementRef<"textarea">>(null);
    const [value, setValue] = useState(initialData.title);
    const removeIcon = useMutation(api.documents.RemoveIcon)

    const enableInput = () => {
        if (preview) return;

        setIsEditing(true);
        setTimeout(() => {
            setValue(initialData.title);
            inputRef.current?.focus();
        }, 0);
    };

    const disableInput = () => setIsEditing(false);

    const onInput = (value: string) => {
        setValue(value);
        update({
            id: initialData._id,
            title: value || "Untitled",
        });
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault;
            disableInput();
        }
    };

    const onIconSelect = (icon: string) => {
        update({
            icon,
            id: initialData._id
        })
    }

    const onRemoveIcon = () => {
        removeIcon({
            id: initialData._id
        })
    }

    return (
        <div className="relative pl-[54px] group">
            {!!initialData.icon && !preview && (
                <div className="flex items-center gap-x-2 group/icon pt-6">
                    <IconPicker onChange={onIconSelect}>
                        <p className="text-6xl hover:opacity-75 transition">
                            {initialData.icon}
                        </p>
                    </IconPicker>

                    <Button
                        size="icon"
                        variant="outline"
                        onClick={onRemoveIcon}
                        className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-sm"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {!!initialData.icon && preview && (
                <p className="pt-6 text-6xl">{initialData.icon}</p>
            )}

            <div className="flex opacity-0 group-hover:opacity-100 items-center gap-x-1 py-4">
                {!initialData.icon && !preview && (
                    <IconPicker asChild onChange={onIconSelect}>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-muted-foreground text-xs"
                        >
                            <Smile className="h-4 w-4 mr-2" /> Add Icon
                        </Button>
                    </IconPicker>
                )}

                {!initialData.coverImage && !preview && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={coverImage.onOpen}
                        className="text-muted-foreground text-xs"
                    >
                        <ImageIcon className="h-4 m-4 mr-2" />
                        Add Cover Image
                    </Button>
                )}
            </div>

            {isEditing && !preview ? (
                <TextareaAutosize
                    value={value}
                    ref={inputRef}
                    onBlur={disableInput}
                    onKeyDown={onKeyDown}
                    onChange={(e) => onInput(e.target.value)}
                    className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
                />
            ) : (
                <div onClick={enableInput} className="pb-[11.5px] text-5xl font-semibold break-words outline-none  text-[#3f3f3f] dark:text-[#cfcfcf]">
                    {initialData.title}
                </div>
            )}
        </div>
    );
};
