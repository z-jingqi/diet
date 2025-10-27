import { TypographyH1, TypographyLead } from "@/components/ui/typography";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
      <TypographyH1>Your Personal AI Chef</TypographyH1>
      <TypographyLead className="mx-auto max-w-2xl">
        Tell us what ingredients you have, and we&apos;ll generate a delicious recipe
        for you in seconds.
      </TypographyLead>
    </div>
  );
}
