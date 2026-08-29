import { WriterLayout } from "@/components/writer-layout";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WriterLayout>{children}</WriterLayout>;
}
