import { redirect } from "next/navigation";

export default function LegacyAddPlaceRedirect() {
  redirect("/dashboard/add-place");
}
