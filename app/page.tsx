import QuizCard from "@/components/QuizCard";

export default function Page() {
  return (
    <main className="space-y-6">
      <QuizCard />
      <section className="rounded-xl border border-gray-200 p-4 text-sm dark:border-gray-800">
        <p className="opacity-80">
          Edit <code>data/spanish-to-english.json</code> to add or modify words.
        </p>
      </section>
    </main>
  );
}