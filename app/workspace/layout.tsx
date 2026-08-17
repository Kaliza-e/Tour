import { WriterLayout } from "@/components/writer-layout";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WriterLayout>{children}</WriterLayout>;
}
