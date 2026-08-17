import { WriterLayout } from "@/components/writer-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WriterLayout>{children}</WriterLayout>;
}
