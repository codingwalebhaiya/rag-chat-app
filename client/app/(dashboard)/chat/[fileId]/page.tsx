// "use client";

// import { useState } from "react";
// import { FiUpload, FiSend } from "react-icons/fi";

// export default function ChatPdfPage() {
//   const [uploaded, setUploaded] = useState(false);

//   return (
//     <div className="min-h-screen bg-[#131315] text-zinc-100 p-6 lg:p-10">
//       {!uploaded ? (
//         <div className="max-w-5xl mx-auto mt-20 rounded-[2rem] bg-[#1c1b1d] p-10 backdrop-blur-2xl">
//           <h1 className="text-5xl font-bold text-center mb-12">
//             Chat with your PDF
//           </h1>

//           <div className="grid md:grid-cols-2 gap-8">
//             <button
//               onClick={() => setUploaded(true)}
//               className="border border-dashed border-indigo-500 rounded-3xl p-20 flex flex-col items-center gap-4 hover:bg-white/5"
//             >
//               <FiUpload size={34} />
//               <span>Upload PDF</span>
//             </button>

//             <div className="rounded-3xl bg-white/5 p-20 flex items-center justify-center text-zinc-400">
//               Ask anything after upload
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="grid lg:grid-cols-2 gap-6 h-[88vh]">
//           <div className="rounded-[2rem] bg-[#1c1b1d] overflow-hidden">
//             <iframe
//               src="/sample.pdf"
//               className="w-full h-full"
//             />
//           </div>

//           <div className="rounded-[2rem] bg-[#1c1b1d] flex flex-col">
//             <div className="p-6 border-b border-white/5">
//               <h2 className="text-2xl font-semibold">AI Chat</h2>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6 space-y-4">
//               <div className="bg-white/5 rounded-2xl p-4 max-w-[80%]">
//                 Hello, ask about your PDF.
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="flex gap-4">
//                 <input
//                   placeholder="Ask about document..."
//                   className="flex-1 rounded-2xl bg-[#131315] px-5 py-4 outline-none"
//                 />

//                 <button className="bg-indigo-600 px-6 rounded-2xl">
//                   <FiSend />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import api from "@/lib/axios";
import { useState } from "react";
import { FiSend } from "react-icons/fi";

interface ChatPageProps {
  params: {
    fileId: string;
  };
}

export default function ChatPage({
  params,
}: ChatPageProps) {
  const { fileId } = params;

  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);

    const res = await api.post(`/chat/${fileId}`, {
      message,
    })

    console.log(res.data)
    setAnswer(res.data.answer)
    setLoading(false);

  };

  if (loading) {
    return (
      <div className="h-[85vh] flex items-center justify-center">
        <div className="text-2xl font-semibold text-zinc-100">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* PDF Viewer */}
      <section className="rounded-[2rem] bg-[#1c1b1d] overflow-hidden order-1">

        <div className="px-6 py-5 border-b border-white/5">
          <h2 className="text-xl font-semibold text-zinc-100">
            PDF Preview
          </h2>

          <p className="text-sm text-zinc-400 mt-1 truncate">
            File ID: {fileId}
          </p>
        </div>

        <iframe
          src={`/files/${fileId}`}
          className="w-full h-full min-h-[500px]"
        />
      </section>

      {/* Chat */}
      <section className="rounded-[2rem] bg-[#1c1b1d] flex flex-col order-2">

        <div className="px-6 py-5 border-b border-white/5">
          <h2 className="text-xl font-semibold text-zinc-100">
            AI Chat
          </h2>

          <p className="text-sm text-zinc-400 mt-1">
            Ask anything about your PDF
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          <div className="bg-white/5 rounded-3xl p-5 max-w-[85%] text-zinc-200">
            Hello 👋 Ask questions about your uploaded PDF.
          </div>

          <div className="ml-auto bg-indigo-600 rounded-3xl p-5 max-w-[85%]">
            Example user question
          </div>
        </div>

        {/* Input */}
        <div className="p-6 border-t border-white/5">

          <div className="flex gap-4">

            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && handleSend()
              }
              placeholder="Ask about this document..."
              className="flex-1 rounded-2xl bg-[#131315] px-5 py-4 text-zinc-100 outline-none"
            />

            <button
              onClick={handleSend}
              className="bg-indigo-600 px-6 rounded-2xl flex items-center justify-center hover:opacity-90"
            >
              <FiSend size={20} />
            </button>

          </div>
        </div>

        
      </section>
    </div>
  );
}