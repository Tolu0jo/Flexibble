import React from "react";
import { getUserProjects } from "@/lib/actions";
import { UserProfile } from "@/common.types";
import ProfilePage from "@/components/ProfilePage";
import { getCurrentUser } from "@/lib/session";

type Props = {
  params: {
    id: string;
  };
};

const UserProfile = async ({ params }: Props) => {
  const session = await getCurrentUser();

  const result = (await getUserProjects(params.id, 100)) as {
    user: UserProfile;
  };
  if (!result?.user) {
    return <p className="no-result-text"> Failed to fetch user info</p>;
  }
  return (
    <ProfilePage
      user={result?.user}
      sessionId={session?.user?.id}
      paramsId={params.id}
    />
  );
};

export default UserProfile;
