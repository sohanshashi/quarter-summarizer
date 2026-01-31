import { useCallback, useEffect, useState } from "react";

import type { SummaryState } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ApiEndpoints } from "@/lib/constants";

export function SummaryHeader({
  organization,
  username,
  startDate,
  endDate,
  useCustomDates,
  selectedQuarter,
}: SummaryState) {
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const dateLabel = useCustomDates
    ? `${startDate} - ${endDate}`
    : selectedQuarter.label;

  const fetchGithubProfile = useCallback(
    async (signal: AbortSignal) => {
      try {
        const response = await fetch(
          ApiEndpoints.githubPublicProfile(username),
          {
            signal,
          },
        );

        if (!response.ok) {
          return;
        }

        const profileData = await response.json();

        if (profileData.avatar_url) {
          setProfilePictureUrl(profileData.avatar_url);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [username],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchGithubProfile(controller.signal);

    return () => controller.abort();
  }, [fetchGithubProfile]);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">Your Performance Summary</h1>
        {profilePictureUrl && (
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <img
              src={profilePictureUrl}
              alt={`${username}'s profile`}
              className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700"
            />
          </a>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="text-sm px-4 py-2">
          @{username}
        </Badge>
        <Badge variant="outline" className="text-sm px-4 py-2">
          @{organization}
        </Badge>
        <Badge variant="outline" className="text-sm px-4 py-2">
          {dateLabel}
        </Badge>
      </div>
    </div>
  );
}
