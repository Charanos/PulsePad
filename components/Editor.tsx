"use client";

import "@blocknote/react/style.css";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
import { BlockNoteEditor } from "@blocknote/core";
import {
    useBlockNote,
    BlockNoteView,
    darkDefaultTheme,
} from "@blocknote/react";

interface EditorProps {
    editable?: boolean;
    initialContent?: string;
    onChange: (value: string) => void;
}

const Editor = ({ onChange, editable, initialContent }: EditorProps) => {
    const { resolvedTheme } = useTheme();

    const { edgestore } = useEdgeStore();
    const handleUpload = async (file: File) => {
        const response = await edgestore.publicFiles.upload({
            file,
        });

        return response.url;
    };

    const editor: BlockNoteEditor = useBlockNote({
        editable,
        uploadFile: handleUpload,
        initialContent: initialContent ? JSON.parse(initialContent) : undefined,
        onEditorContentChange: (editor) => {
            onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
        },
    });

    return (
        <div>
            <BlockNoteView
                editor={editor}
                theme={resolvedTheme === "dark" ? "dark" : "light"}
            />
        </div>
    );
};

export default Editor;
