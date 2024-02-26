import { v } from "convex/values";
import { Id, Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("documents")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorised Action!! ");
        }

        const userId = identity.subject;

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user_parent", (q) =>
                q.eq("userId", userId).eq("parentDocument", args.parentDocument)
            )
            .filter((q) => q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect();

        return documents;
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Permission Denied!! ");
        }

        const userId = identity.subject;

        const document = await ctx.db.insert("documents", {
            userId,
            title: args.title,
            isArchived: false,
            isPublished: false,
            parentDocument: args.parentDocument,
        });

        return document;
    },
});

export const archive = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthenticated Action!! ");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Not Found!!");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorised action!");
        }

        const recursiveArchive = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) =>
                    q.eq("userId", userId).eq("parentDocument", documentId)
                )
                .collect();

            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: true,
                });

                await recursiveArchive(child._id);
            }
        };

        const document = await ctx.db.patch(args.id, {
            isArchived: true,
        });

        recursiveArchive(args.id);

        return document;
    },
});

export const getTrash = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthenticated Action!! ");
        }

        const userId = identity.subject;

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("isArchived"), true))
            .order("desc")
            .collect();

        return documents;
    },
});

export const restore = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not Authenticated!");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Document not Found!!");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized Action!!");
        }

        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) =>
                    q.eq("userId", userId).eq("parentDocument", documentId)
                )
                .collect();

            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false,
                });

                await recursiveRestore(child._id);
            }
        };

        const options: Partial<Doc<"documents">> = {
            isArchived: false,
        };

        if (existingDocument.parentDocument) {
            const parent = await ctx.db.get(existingDocument.parentDocument);

            if (parent?.isArchived) {
                options.parentDocument = undefined;
            }
        }

        const document = await ctx.db.patch(args.id, options);

        recursiveRestore(args.id);

        return document;
    },
});

export const remove = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthenticated Action!! ");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Document not Found!!");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized Action!!");
        }

        const document = await ctx.db.delete(args.id);

        return document;
    },
});

export const getSearch = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthenticated Action!! ");
        }

        const userId = identity.subject;

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect();

        return documents;
    },
});

export const getById = query({
    args: { documentId: v.id("documents") },
    handler: async (ctx, args) => {
        try {
            const identity = await ctx.auth.getUserIdentity();

            // Check if documentId is null or undefined
            if (!args.documentId) {
                throw new Error("Document ID is required.");
            }

            const document = await ctx.db.get(args.documentId);

            if (!document) {
                throw new Error("Document Not Found!");
            }

            if (document.isPublished && !document.isArchived) {
                return document;
            }

            if (!identity) {
                throw new Error("You're Not Authenticated!");
            }

            const userId = identity.subject;

            if (document.userId !== userId) {
                throw new Error("You're Not Authorized to Complete This Action!");
            }

            return document;
        } catch (error) {
            throw new Error(`Failed to retrieve document`);
        }
    },
});

export const update = mutation({
    args: {
        id: v.id("documents"),
        icon: v.optional(v.string()),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthenticated Action!! ");
        }

        const userId = identity.subject;
        const { id, ...rest } = args;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Document not Found!");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorised Access!");
        }

        const document = await ctx.db.patch(args.id, {
            ...rest,
        });

        return document;
    },
});

export const RemoveIcon = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthenticated Action!");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Document Not Found!");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorised Action!");
        }

        const document = await ctx.db.patch(args.id, {
            icon: undefined,
        });

        return document;
    },
});

export const RemoveCoverImage = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthenticated Action!");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Document Not Found!");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorised Action!");
        }

        const document = await ctx.db.patch(args.id, {
            coverImage: undefined,
        });

        return document;
    },
});
