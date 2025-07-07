import LogoutPage from "@/app/components/Logout/Logout";
import { redirect } from "next/navigation";

export default function Logout() {
  <LogoutPage />;
  redirect("/");
}
