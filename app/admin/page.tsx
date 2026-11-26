import { redirect } from "next/navigation";
import { getUser, isAdmin } from "@/lib/auth";
export default async function A() { redirect(isAdmin(await getUser()) ? "/admin/projects" : "/?denied=1"); }
