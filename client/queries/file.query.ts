import { uploadFileToS3 } from "@/api/file.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner";


const useUploadFile = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationKey: ["file"], // Important: Used for global loading tracking
        mutationFn: uploadFileToS3,
        onSuccess: (data) => {

            queryClient.invalidateQueries({
                queryKey: ["conversations"],
            });

            toast.success("File uploaded! Processing...");

            // after pdf upload to aws s3 and get 200k response from s3 and call another api for backgroud task then navigate to the conversation page `/c/${data.conversationId}`
            router.push(`/c/${data.conversationId}`);
        },
        onError: (error) => {
            console.log(error)
            toast.error("Failed to upload file");
        },
    })
}



export {
    useUploadFile
}