import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "./config";

export const getOwner = cache(async () => {
  // Read request data first so build-time prerendering stops before auth setup.
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  return session?.user.isOwner === true ? session.user : null;
});

/** Call in every protected page and mutation, not only in the shared layout. */
export async function requireOwner() {
  const owner = await getOwner();
  if (!owner) redirect("/crm/login");
  return owner;
}
