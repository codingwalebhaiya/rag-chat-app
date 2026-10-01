// app/(marketing)/layout.tsx

import Navbar from "@/components/common/Navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <div className="flex">
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
