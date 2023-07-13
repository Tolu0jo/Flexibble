"use client";
import { ProjectInterface, UserProfile } from "@/common.types";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import ProjectCard from "./ProjectCard";
import FormField from "./FormField";
import { useState } from "react";
import { fetchToken, updateUser } from "@/lib/actions";
import { Token } from "graphql";

type Props = {
  user: UserProfile;
  sessionId: string;
  paramsId: string;
};

const ProfilePage = ({ user, sessionId, paramsId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    description: user?.description || "",
    linkedinUrl: user?.linkedinUrl || "",
  });

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleStateChange = (fieldName: string, value: string) => {
    setForm((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { token } = await fetchToken();
    try {
      await updateUser(form, user?.id, token);
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);
    }
  };
  return (
    <section className="flexCenter flex-col max-w-10xl w-full mx-auto paddings">
      <section className="flexBetween max-lg:flex-col gap-10 w-full">
        <div className="flex items-start flex-col w-full">
          <Image
            src={user?.avatarUrl}
            width={100}
            height={100}
            className="rounded-full"
            alt="user image"
          />
          <p className="text-4xl font-bold mt-10">{user?.name}</p>
          <p className="md:text-5xl text-3xl font-extrabold md:mt-10 mt-5 max-w-lg">
            {user?.description
              ? `${user?.description}`
              : "I’m Software Engineer👋"}
          </p>

          <div className="flex mt-8 gap-5 w-full flex-wrap">
            {isOpen ? (
              <form
                onSubmit={handleSubmit}
                className="flex mt-8 gap-5 w-full flex-wrap"
              >
                <FormField
                  title=""
                  state={form.description}
                  placeholder="Edit bio"
                  setState={(value) => handleStateChange("description", value)}
                />
                <FormField
                  type="url"
                  title=""
                  state={form.linkedinUrl}
                  placeholder="LinkedInUrl"
                  setState={(value) => handleStateChange("linkedinUrl", value)}
                />
                <Button
                  title="Submit"
                  type="submit"
                  leftIcon="/plus.svg"
                  bgColor="bg-green-500 !w-max"
                  textColor="text-black-100"
                />
              </form>
            ) : (
              sessionId === paramsId && (
                <Button
                  title="Edit Profile"
                  leftIcon="/pencile.svg"
                  bgColor="bg-blue-400 !w-max"
                  textColor="text-black-100"
                  handleClick={handleClick}
                />
              )
            )}

            <Link href={`${user?.linkedinUrl}`}>
              <Button
                title="Follow"
                leftIcon="/plus-round.svg"
                bgColor="bg-light-white-400 !w-max"
                textColor="text-black-100"
              />
            </Link>

            <Link href={`mailto:${user?.email}`}>
              <Button title="Hire Me" leftIcon="/email.svg" />
            </Link>
          </div>
        </div>

        {user?.projects?.edges?.length > 0 ? (
          <Image
            src={user?.projects?.edges[0]?.node?.image}
            alt="project image"
            width={739}
            height={554}
            className="rounded-xl object-contain"
          />
        ) : (
          <Image
            src="/profile-post.png"
            width={739}
            height={554}
            alt="project image"
            className="rounded-xl"
          />
        )}
      </section>

      <section className="flexStart flex-col lg:mt-28 mt-16 w-full">
        <p className="w-full text-left text-lg font-semibold">Recent Work</p>

        <div className="profile_projects">
          {user?.projects?.edges?.map(
            ({ node }: { node: ProjectInterface }) => (
              <ProjectCard
                key={`${node?.id}`}
                id={node?.id}
                image={node?.image}
                title={node?.title}
                name={user.name}
                avatarUrl={user.avatarUrl}
                userId={user.id}
              />
            )
          )}
        </div>
      </section>
    </section>
  );
};
export default ProfilePage;
