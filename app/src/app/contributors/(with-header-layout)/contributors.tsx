"use client";

import React from "react";
import { Contributor } from "../card";
import { Button } from "~/components/ui/button";
import { usePaginatedContributors } from "~/hooks/contributors";

export function Contributors() {
  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    usePaginatedContributors();

  return (
    <>
      <ul className="flex flex-row flex-wrap items-stretch justify-start gap-2">
        {status === "success" &&
          data.pages.map(({ items }, i) => (
            <React.Fragment key={i}>
              {items.map((item) => (
                <li
                  key={item.toString()}
                  className="w-full md:w-[calc((100%-.5rem)*.5)] lg:w-[calc((100%-1rem)*.33)] 2xl:w-[calc((100%-1.5rem)*.25)]"
                >
                  <Contributor accountId={item} />
                </li>
              ))}
            </React.Fragment>
          ))}
      </ul>
      {isFetchingNextPage && <span className="animate-pulse">Loading</span>}
      {hasNextPage && (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <Button variant="outline" type="button" onClick={() => fetchNextPage()}>
          Load more
        </Button>
      )}
    </>
  );
}