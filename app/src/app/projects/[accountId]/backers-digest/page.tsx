import { redirect } from "next/navigation";
import { hasBacker } from "~/lib/backers";
import { getBackersDigest } from "~/lib/server/projects";
import { getUserFromSession } from "~/lib/session";
import { type AccountId } from "~/lib/validation/common";
import { BackersDigest } from "./backers-digest";

export default async function BackersDigestPage({
  params: { accountId },
  searchParams: { token },
}: {
  params: { accountId: AccountId };
  searchParams: { token?: string };
}) {
  const user = await getUserFromSession();
  const userOrToken = !!user || !!token;

  if (!userOrToken) {
    return redirect(`/projects/${accountId}/overview`);
  }

  const isBacker = !!user && (await hasBacker(user.accountId));
  const backersDigest = await getBackersDigest(accountId);
  const isOwner = !!user && user.accountId === accountId;
  const isPublished = !!backersDigest.published;
  const hasToken = !!token && token !== "" && token === backersDigest.token;
  const hasPermission = isOwner || (isPublished && (isBacker || hasToken));

  if (!hasPermission) {
    return redirect(`/projects/${accountId}/overview`);
  }

  return <BackersDigest accountId={accountId} />;
}
