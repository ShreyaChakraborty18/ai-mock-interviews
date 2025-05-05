import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  // Placeholder for feedback data. Initially set to `null`.
  const feedback = userId && id ? await getFeedbackByInterviewId({ interviewId: id, userId }) : null;
  //type -> type of interview (Technical, Behavioral, etc.)
  //mixed type -> mixed interview (Technical + Behavioral)

  // /mix/: A regular expression that looks for the word "mix".
  // g: Global flag, searches the entire string.
  // i: Case-insensitive flag, matches "mix", "MIX", "Mix", etc.
  // .test(type): Checks if the type string contains the word "mix".
  // ternary(?)  "Mixed" : type: If .test(type) is true, normalizedType is set to "Mixed". Otherwise, it keeps the original type.
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  //* 1.feedback?.createdAt:
  // Uses optional chaining (?.) to safely access the createdAt property of feedback.
  // If feedback is null or undefined, it skips accessing createdAt and moves to the next value.

  //* || createdAt:
  // If feedback?.createdAt is undefined or null, it falls back to createdAt (a prop passed to the component).

  //* || Date.now():
  // If both feedback?.createdAt and createdAt are undefined or null, it falls back to the current date and time (Date.now()).

  //* dayjs():
  // Converts the resolved date value into a Day.js object for formatting.

  //* .format("MMM D, YYYY"):
  // Formats the date into a readable string in the format: Month Day, Year.
  // Example: "Apr 18, 2025".
  // This is useful for displaying dates in a user-friendly format.

  //* Purpose:
  // This code ensures that a valid date is always formatted and displayed, prioritizing:
  // feedback?.createdAt (if available),
  // createdAt (if provided),
  // The current date (Date.now()) as a fallback.
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
            <p className="badge-text">{normalizedType}</p>
          </div>

          <Image
            src={getRandomInterviewCover()}
            alt="cover image"
            width={90}
            height={90}
            className="rounded-full object-fit size-[90px]"
          />
          <h3 className="mt-5 capitalize">{role} Interview</h3>
          <div className="flex flex-row gap-2 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                alt="calendar"
                width={22}
                height={22}
              />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" alt="star" width={22} height={22} />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't taken the interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary">
            <Link
              href={
                feedback
                  ? `/interview/${id}/feedback`
                  : `/interview/${id}`
              }
            >
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
