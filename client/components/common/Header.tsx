// "use client"

// import { Menu, ArrowBigLeftIcon } from "lucide-react";
// import Link from "next/link";


// const Header = ({ setIsMobileSidebarOpen }: { setIsMobileSidebarOpen: (open: boolean) => void }) => {
//     return (
//           <header className="w-full bg-background/60 backdrop-blur-md border-b border-border/40 sticky top-0 z-30 select-none flex flex-col">
//           <div className="w-full h-14 px-6 flex items-center justify-between border-b border-border/20">
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setIsMobileSidebarOpen(true)}
//                 className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent hover:border-border/60 transition-all md:hidden outline-none focus-visible:ring-1 focus-visible:ring-primary"
//                 aria-label="Open mobile navigation overlay"
//               >
//                 <Menu className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           <div className="w-full px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 bg-secondary/5">
//             <div className="px-3.5 py-1.5 text-xs font-semibold tracking-tight rounded-lg">
//               <Link
//                 className="flex items-center gap-1.5 p-1 border border-border/50 rounded-xl bg-background shadow-2xs max-w-full overflow-x-auto"
//                 href={"/"}
//               >
//                 <ArrowBigLeftIcon className="h-4 w-4" />
//                 <p>back to Home</p>
//               </Link>
//             </div>
//           </div>
//         </header>
//     )
// }

// export default Header;