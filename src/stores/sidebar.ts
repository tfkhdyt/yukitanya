import { create } from 'zustand';

type SidebarStore = {
	isOpen: boolean;
	toggle: () => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
	isOpen: false,
	toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
