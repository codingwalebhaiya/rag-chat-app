import { create } from "zustand";

interface conversationState {
    selectedConversation: string | null;
    setSelectedConversation: (id: string) => void;
    clearSelectedConversation: () => void;

}

export const useConversationStore = create<conversationState>((set) => ({
    selectedConversation: null,
    setSelectedConversation: (id: string) => set({ selectedConversation: id }),
    clearSelectedConversation: () => set({ selectedConversation: null }),
}));