import { WriterLayout } from "@/components/writer-layout";

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WriterLayout>{children}</WriterLayout>;
}
