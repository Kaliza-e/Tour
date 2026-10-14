import { redirect } from "next/navigation";

export default function GetPublishedPage() {
  redirect("/researcher?action=submit");
}
