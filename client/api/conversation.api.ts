import { api } from "./api";



export const userSendQuery = async (userQuery: string, conversationId: string) => {
    const response = await api.post(`/conversations/${conversationId}/query`, { userQuery });
   
    return response.data.data;
}

//when user navigate to `/c/${conversationId}` conversation and pdf interface load 
// then call this api to get all messages of a conversation and cloudfront signed url of pdf until
// show loading screen in both conversation and pdf interface
// and show pdf in pdf interface and conversation messages in conversation interface using react-markdown 

//  ==============  when user come next time then show all previous (user and ai) messages conversation in conversation interface  ===================== //

export const getConversationById = async (conversationId: string) => {
    const response = await api.get(`/conversations/${conversationId}/messages`);
   
    return response.data.data;
};
 

// get all conversations for sidebar and show in sidebar as conversation list 
// and when user click any conversation in sidebar then  navigate to from home page "/" to router.push(`/c/${data.conversationId}`)
// and if another conversation already open and when user click on another conversation in sidebar then 
// navigate to new conversation page according to that dynamic conversationId - router.push(`/c/${data.conversationId}`)
// and show pdf and conversation messages of new conversation 
 


// show in sidebar
export const getAllConversations = async () => {
    const response = await api.get("/conversations");
    console.log( "getAllConversations response.data.data" , response.data.data);
    return response.data.data;
};


// 1. ================show conversation list with pdf fileName as title in sidebar ================== //

// in sidebar show conversations list with pdf fileName 
// when user login or come next time as loggedin user then fetch all conversations of this user 
// and show in sidebar - conversations list 
// and when user click any conversation in sidebar 
// then  navigate to from home page "/" to router.push(`/c/${data.conversationId}`) 
// and in this page -router.push(`/c/${data.conversationId}`);
// call another api call fetch specific conversation (getConversationDetails backend controller) - api.get(`/conversations/${conversationId}/messages`)
// then  get cloudfrontSignedUrl and ai message , user message 
// through this cloudfrontSignedUrl fetch pdf from aws s3 via cloudfront cdn and show pdf in pdf interface 
// and in conversation interface show ai and user message conversation in conversation interface using react-markdown 


// 2.  ============ when send user query from frontend to backend via chat input ============

// user send message query from conversation interface via chat input and click on send button
// then call the backend api -api.post(`/conversations/${conversationId}/query`, { userQuery });
//  and get steaming assistantMessage from backend using SSE and show in conversation interface using react-markdown 





