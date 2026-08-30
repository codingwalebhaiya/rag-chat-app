import { api } from "./api"
import axios from "axios";

const uploadFileToS3 = async (file: File) => {


    try {

        // 1. Get presigned URL from backend
        const response = await api.post("/files/presigned-url", { fileName: file.name, fileSize: file.size, mimeType: file.type }
        );

        if (!response.data?.data) {
            throw new Error("Invalid response from server");
        }

        const { presignedUrl, s3Key, conversationId } = response.data.data;
        if (!presignedUrl) {
            throw new Error("No presigned URL received");
        }


        // 2. Upload the raw binary file directly to AWS S3
        // Crucial: Use standard axios here, NOT your 'api' instance because we don't want backend cookies sent to AWS
        await axios.put(presignedUrl, file, {
            headers: {
                "Content-Type": file.type,
            },
        });

        // get pdf file from aws s3 via cloudfront cdn for frontend 
                //   const pdfUrl  =  await axios.get(presignedUrl, {
                //         headers: {
                //             "Content-Type": file.type,
                //         },
                //     });


        // 3. Notify the Backend to add the job into Redis/BullMQ for background parsing
        await api.post("/files/file-process", {
            conversationId,
            s3Key,
        });

        // Return the original intent data so the hook can use the conversationId for routing
        return response.data.data;
        
    } catch (error) {
        console.log(error)
        throw error;
    }
}


//  when user upload or select pdf - from new chat buuton from sidebar or upload button from herosection 
// when user select and upload pdf then call backend api - api.post("/files/presigned-url", { fileName: file.name, fileSize: file.size, mimeType: file.type }
// then get presignedurl and upload pdf file to aws s3 through this url 
// wait and when pdf upload successfully then notify the backend via another api call - api.post("/files/file-process", {conversationId, s3Key,});

// and then navigate to router.push(`/c/${data.conversationId}`)  
// and then fetch uploaded pdf file from aws s3 via cloudfront cdn until show loading...  in pdf chat interface 
// and in conversation interface show also loading... and input should be disabled so user can not fill and send query to backend until the PDF is processed in backend worker  ( pdf fetch or stream from aws s3 , load , chunk, embed and store in pinecone)
// and after pdf processing is completed then show conversation interface with welcome ai message for user (for example - ai- hii, satyam . Welcome ) 
// also add some fix common query (mostly 4 in conversation interface) - when user upload pdf then in conversation interface show some  fix query with every pdf upload 
// fix query for example - 1. summerise this pdf file , 2. important points , ... 
// and when user click on any query then this query call backend and get ai message same like user input query 
// ai messages response should be streaming response using SSE 



export {
    uploadFileToS3
}




