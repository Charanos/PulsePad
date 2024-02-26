import { create } from 'zustand'

type SearchStore = {
    isOpen: boolean;
    onOpen: () => void;
    toggle: () => void;
    onClose: () => void;
}

export const useSearch = create<SearchStore>((set, get) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    toggle: () => set({ isOpen: !get().isOpen })
}))