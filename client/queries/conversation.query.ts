import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllConversations, getConversationById, userSendQuery } from "@/api/conversation.api";
import { api } from "@/api/api";


interface Conversation {
    _id: string;
    title: string;
    updatedAt: string;
}

// Hook to Fetch Messages
export const useGetConversationMessages = (conversationId: string) => {
    return useQuery({
        queryKey: ["conversation", conversationId],
        queryFn: () => getConversationById(conversationId),
        enabled: !!conversationId,
    });
};

// Hook to Send Query and Get AI Response
export const useUserQueryAndGetAiMessage = (conversationId: string) => {
    return useMutation({
        mutationFn: ({ userQuery }: { userQuery: string }) => {
            return userSendQuery(userQuery, conversationId);
        },
    });

}

export const useGetConversations = () => {
    return useQuery({
        queryKey: ["conversations"],
        queryFn: () => getAllConversations(),
    });
}

// In conversation.query.ts
export const useDeleteConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (conversationId: string) => {
            const response = await api.delete(`/conversations/${conversationId}`);
            console.log(response);
            return response;

        },
        onSuccess: (_, conversationId) => {
            // Update the conversations list in cache
            queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
                return oldData?.filter(conv => conv._id !== conversationId) || [];
            });

            // Optionally invalidate to refetch
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
};

