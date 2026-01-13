"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { paths } from "@/config/paths";

import { useTeams } from "../../../../examples/features/teams/api/get-teams";
import { RegisterForm } from "../../../features/auth/components/register-form";

const RegisterPage = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo");

  const [chooseTeam, setChooseTeam] = useState(false);

  const teamsQuery = useTeams({
    queryConfig: {
      enabled: chooseTeam,
    },
  });

  return (
    <RegisterForm
      onSuccess={() =>
        router.replace(
          `${redirectTo ? `${decodeURIComponent(redirectTo)}` : paths.app.dashboard.getHref()}`,
        )
      }
      chooseTeam={chooseTeam}
      setChooseTeam={() => setChooseTeam(!chooseTeam)}
      teams={teamsQuery.data?.data}
    />
  );
};

export default RegisterPage;
