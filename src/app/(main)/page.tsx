import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-extrabold tracking-tight mb-4">
        Your Personal AI Chef
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Tell us what ingredients you have, and we'll generate a delicious recipe for you in seconds.
      </p>
    </div>
  );
}
