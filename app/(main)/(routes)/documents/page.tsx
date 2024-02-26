"use client";

import Image from "next/image";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

const DocumentsPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const create = useMutation(api.documents.create);

    const onCreate = () => {
        const promise = create({
            title: "Untitled",
        }).then((documentId) => router.push(`/documents/${documentId}`));

        toast.promise(promise, {
            loading: "Creating a New Note...",
            error: "Failed to Create a New Note",
            success: "Successfully Created a New Note",
        });
    };

    return (
        <div className="min-h-[100vh] flex items-center justify-center flex-col space-y-4">
            <Image
                src="/empty.png"
                alt="Empty"
                width="300"
                height="300"
                className="dark:hidden"
            />
            <Image
                src="/empty-dark.png"
                alt="Empty"
                width="300"
                height="300"
                className="hidden dark:block"
            />

            <h2 className="capitalize font-semibold text-lg">
                welcome to {user?.firstName}&apos;s pulsePad
            </h2>

            <Button
                className="uppercase dark:bg-[#0f0c29] text-white"
                onClick={onCreate}
            >
                <PlusCircle className=" h-4 w-4 mr-2" />
                create a note
            </Button>
        </div>
    );
};

export default DocumentsPage;
