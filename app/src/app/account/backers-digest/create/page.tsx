"use client";

import { redirect } from "next/navigation";
import { useFieldArray } from "react-hook-form";
import { z } from "zod";
import { FileInput } from "~/components/inputs/file";
import { NumberInput } from "~/components/inputs/number";
import { SocialProfilesInput } from "~/components/inputs/socials";
import { TextInput } from "~/components/inputs/text";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { updateFields, useZodForm } from "~/hooks/form";
import {
  useBackersDigest,
  useProject,
  usePublishBackersDigest,
  useUpdateBackersDigest,
} from "~/hooks/projects";
import { linktreeSchema } from "~/lib/validation/fetching";
import { useUser } from "~/stores/global";
import XIcon from "~/components/icons/x.svg";
import PlusCircleIcon from "~/components/icons/plus-circle.svg";
import TargetIcon from "~/components/icons/target-04.svg";
import { ImageInput } from "~/components/inputs/image";
import { useEffect } from "react";
import { Badge } from "~/components/ui/badge";
import { ProgressDialog } from "~/components/progress-dialog";
import { cn } from "~/lib/utils";

const schema = z.object({
  location: z.string().min(3).max(50).optional(),
  company_size: z.coerce.string(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  email: z.string().email().optional(),
  calendly_link: z.string().optional(),
  linktree: linktreeSchema.nullable(),
  traction: z.array(z.tuple([z.string(), z.string()])).optional(),
  founders: z
    .array(z.record(z.string(), z.string().or(linktreeSchema)))
    .optional(),
  pitch: z.string().optional(),
  demo: z.string().optional(),
  demo_video: z.string().optional(),
  announcement: z.string().optional(),
});

export default function BackersDigestForm() {
  const user = useUser();
  const form = useZodForm(schema, {
    defaultValues: {
      traction: [["", ""]],
      founders: [{}],
    },
  });
  const { data, status } = useProject(user?.accountId ?? "");
  const { data: backersDigest } = useBackersDigest(user?.accountId ?? "");
  const traction = useFieldArray({
    control: form.control,
    name: "traction",
  });
  const founders = useFieldArray({
    control: form.control,
    name: "founders",
  });
  const aboutCompleted = (
    (Number(form.watch("location") !== "") +
      Number(form.watch("company_size") !== "") +
      Number(form.watch("website") !== "") +
      Number(form.watch("linkedin") !== "") +
      Number(form.watch("twitter") !== "") +
      Number(form.watch("email") !== "") +
      Number(form.watch("calendly_link") !== "") +
      Number(Object.keys(form.watch("linktree") ?? {}).length > 0)) /
    8.0
  ).toLocaleString("en", {
    style: "percent",
  });
  const presentationCompleted =
    Number((form.watch("demo") ?? "") !== "") +
    Number((form.watch("pitch") ?? "") !== "") +
    Number((form.watch("demo_video") ?? "") !== "");
  const [progress, saveBackerDigest] = useUpdateBackersDigest();
  const [publishProgress, publishBackerDigest] = usePublishBackersDigest();

  useEffect(() => {
    if (data ?? backersDigest) {
      updateFields(form, schema, {
        location: backersDigest?.location ?? data?.geo ?? "",
        company_size: backersDigest?.company_size ?? data?.company_size ?? "",
        website:
          backersDigest?.website ??
          data?.website ??
          data?.linktree?.website ??
          "",
        linkedin: backersDigest?.linkedin ?? data?.linktree?.linkedin ?? "",
        twitter: backersDigest?.twitter ?? data?.linktree?.twitter ?? "",
        linktree: backersDigest?.linktree ?? data?.linktree ?? {},
        demo: backersDigest?.demo ?? data?.demo ?? "",
        pitch: backersDigest?.pitch ?? data?.deck ?? "",
        ...(backersDigest?.email ? { email: backersDigest.email } : {}),
        ...(backersDigest?.calendly_link
          ? { calendly_link: backersDigest.calendly_link }
          : {}),
        ...(backersDigest?.demo_video
          ? { demo_video: backersDigest.demo_video }
          : {}),
        ...(backersDigest?.announcement
          ? { announcement: backersDigest.announcement }
          : {}),
        ...(backersDigest?.traction
          ? { traction: Object.entries(backersDigest.traction) }
          : {}),
        founders:
          backersDigest?.founders ??
          data?.founders.map((account_id) => ({ account_id })) ??
          [],
      });
    }
  }, [form, data, backersDigest]);

  if (!user || (!data && status !== "loading")) {
    return redirect("/login");
  }

  const buttons = (
    <div className="flex flex-row items-start justify-end gap-4">
      <Button
        variant="outline"
        type="button"
        // onClick={() => {}}
        className="flex flex-row items-center justify-center gap-2"
      >
        Preview
      </Button>
      <ProgressDialog
        progress={progress.value}
        title="Saving backers digest"
        description={progress.label}
        disabled={!form.formState.isValid}
        triggerText="Save"
        ctaLink="#"
        ctaText="View"
      />
      <ProgressDialog
        progress={publishProgress.value}
        title="Publishing backers digest"
        description={publishProgress.label}
        disabled={!form.formState.isValid}
        triggerText="Publish"
        ctaLink={`/projects/${user.accountId}/backers-digest`}
        ctaText="View"
        onClick={() => {
          publishBackerDigest.mutate({ accountId: user.accountId });
        }}
      />
    </div>
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(({ traction, ...data }) => {
          saveBackerDigest.mutate({
            accountId: user.accountId,
            digest: {
              ...data,
              ...(traction
                ? {
                  traction: Object.fromEntries(traction),
                }
                : {}),
            },
          });
        })}
      >
        <div className="flex flex-row items-start justify-start gap-4">
          <div className="flex flex-grow flex-col gap-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <TargetIcon className="h-10 w-10 text-error" />
              <h1 className="text-2xl font-bold">Backers digest</h1>
              <Badge
                variant="outline"
                className={cn(
                  "rounded border-orange-400 border-opacity-90 bg-orange-50 text-orange-700 mix-blend-multiply",
                  {
                    "border-primary bg-primary-light text-primary":
                      backersDigest?.published,
                  }
                )}
              >
                {backersDigest?.published ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>
          {buttons}
        </div>
        <div className="flex flex-row items-start justify-start gap-4">
          <div className="flex flex-grow flex-col gap-2 rounded-2xl border border-ui-elements-light p-10 pt-8">
            <TextInput
              control={form.control}
              name="location"
              defaultValue=""
              label="Location"
            />
            <NumberInput
              control={form.control}
              name="company_size"
              defaultValue=""
              label="Compnany size"
            />
            <TextInput
              control={form.control}
              name="website"
              defaultValue=""
              label="Website"
            />
            <TextInput
              control={form.control}
              name="linkedin"
              defaultValue=""
              label="LinkedIn"
            />
            <TextInput
              control={form.control}
              name="twitter"
              defaultValue=""
              label="X (ex. Twitter)"
            />
            <TextInput
              control={form.control}
              name="email"
              defaultValue=""
              label="Contact email"
            />
            <TextInput
              control={form.control}
              name="calendly_link"
              defaultValue=""
              label="Calendly link"
            />
            <SocialProfilesInput
              control={form.control}
              name="linktree"
              defaultValue={backersDigest?.linktree ?? data?.linktree ?? {}}
              label="Social profiles"
            />
          </div>
          <div className="flex w-1/5 flex-col gap-3">
            <h4 className="text-xl font-bold">About</h4>
            <h5 className="text-sm text-ui-elements-gray">
              Completed: {aboutCompleted}
            </h5>
            <p className="tex-sm text-ui-elements-dark">
              Add more info about your startup
            </p>
          </div>
        </div>
        <div className="flex flex-row items-start justify-start gap-4">
          <div className="flex flex-grow flex-col gap-2 rounded-2xl border border-ui-elements-light p-10 pt-8">
            <div className="flex w-full flex-col items-start justify-start gap-6">
              {founders.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative flex w-full flex-col items-stretch justify-start gap-3"
                >
                  <Button
                    variant="destructive"
                    type="button"
                    className="absolute right-0 top-0 flex w-1/12 flex-row items-center justify-center border-none"
                    onClick={() => founders.remove(index)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                  <ImageInput
                    control={form.control}
                    name={`founders.${index}.image` as const}
                    defaultValue=""
                    label="Photo"
                    setCid={(cid) =>
                      form.setValue(`founders.${index}.image`, cid)
                    }
                    cid={
                      form.watch(`founders.${index}.image` as const) as string
                    }
                  />
                  <TextInput
                    control={form.control}
                    name={`founders.${index}.first_name` as const}
                    defaultValue=""
                    label="First name"
                  />
                  <TextInput
                    control={form.control}
                    name={`founders.${index}.last_name` as const}
                    defaultValue=""
                    label="Last name"
                  />
                  <TextInput
                    control={form.control}
                    name={`founders.${index}.account_id` as const}
                    defaultValue=""
                    label="Account ID"
                  />
                  <SocialProfilesInput
                    control={form.control}
                    name={`founders.${index}.socials` as const}
                    defaultValue={{}}
                    label="Social profiles"
                  />
                </div>
              ))}
              <div className="flex w-full flex-row items-start justify-end">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => founders.append({}, { shouldFocus: true })}
                  className="flex flex-row items-center justify-center gap-2"
                >
                  <PlusCircleIcon className="h-4 w-4" />
                  Add founder
                </Button>
              </div>
            </div>
          </div>
          <div className="flex w-1/5 flex-col gap-3">
            <h4 className="text-xl font-bold">Founders</h4>
            <h5 className="text-sm text-ui-elements-gray"></h5>
            <p className="text-sm text-ui-elements-dark">
              Add at least one founder. Every project has to have an individual
              face!
            </p>
          </div>
        </div>
        <div className="flex flex-row items-start justify-start gap-4">
          <div className="flex flex-grow flex-col gap-2 rounded-2xl border border-ui-elements-light p-10 pt-8">
            <div className="flex flex-row items-center justify-between gap-2">
              <h6 className="flex-grow text-sm font-bold">Metric name</h6>
              <h6 className="w-1/3 text-sm font-bold">Value</h6>
            </div>
            {traction.fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-row items-center justify-between gap-2"
              >
                <div className="flex-grow">
                  <Input
                    {...form.register(`traction.${index}.0` as const)}
                    type="text"
                  />
                </div>
                <div className="w-1/4">
                  <Input
                    {...form.register(`traction.${index}.1` as const)}
                    type="text"
                  />
                </div>
                <Button
                  variant="destructive"
                  type="button"
                  className="flex w-1/12 flex-row items-center justify-center border-none"
                  onClick={() => traction.remove(index)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex w-full flex-row items-start justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  traction.append([["", ""]], { shouldFocus: true })
                }
                className="flex flex-row items-center justify-center gap-2"
              >
                <PlusCircleIcon className="h-4 w-4" />
                Add metric
              </Button>
            </div>
          </div>
          <div className="flex w-1/5 flex-col gap-3">
            <h4 className="text-xl font-bold">Traction metrics</h4>
            <h5 className="text-sm text-ui-elements-gray"></h5>
          </div>
        </div>
        <div className="flex flex-row items-start justify-start gap-4">
          <div className="flex flex-grow flex-col gap-6 rounded-2xl border border-ui-elements-light p-10 pt-8">
            <div className="rounded-xl border border-accent-disabled px-6 py-4">
              <FileInput
                control={form.control}
                name="demo"
                label="Demo day pitch"
              />
            </div>
            <div className="rounded-xl border border-accent-disabled px-6 py-4">
              <FileInput
                control={form.control}
                name="pitch"
                label="Pitch deck"
              />
            </div>
            <div className="flex flex-col items-stretch justify-start gap-6 rounded-xl border border-accent-disabled px-6 py-4">
              <h6 className="text-sm font-bold">Product demo video</h6>
              <TextInput
                control={form.control}
                name="demo_video"
                defaultValue=""
                label="Paste a link"
              />
            </div>
          </div>
          <div className="flex w-1/5 flex-col gap-3">
            <h4 className="text-xl font-bold">Presentation</h4>
            <h5 className="text-sm text-ui-elements-gray">
              Uploaded: {presentationCompleted}/3
            </h5>
          </div>
        </div>
        <div className="flex flex-row items-start justify-start gap-4">
          <div className="flex flex-grow flex-col gap-6 rounded-2xl border border-ui-elements-light p-10 pt-8">
            <TextInput
              control={form.control}
              name="announcement"
              defaultValue=""
              label="Public announcement link"
            />
          </div>
          <div className="flex w-1/5 flex-col gap-3">
            <h4 className="text-xl font-bold">Media coverage</h4>
            <h5 className="text-sm text-ui-elements-gray">(optional)</h5>
            <p className="text-sm text-ui-elements-dark">
              Add here any articles or press releases you have been apart of
            </p>
          </div>
        </div>
        {buttons}
      </form>
    </Form>
  );
}