import URL from "./URL";
import type { ReturnedUrl } from "@customTypes/ReturnedUrl";

export default function RecentURL({ urls }: { urls: ReturnedUrl[] }) {
  if (urls.length === 0) return null;
  console.log(urls);
  return (
    <section className="bg-primary/20 p-4 min-w-full md:min-w-[800px] rounded-lg">
      <h1>Recently created URLs</h1>
      <div className="flex flex-col">
        {urls.map((u: ReturnedUrl) => (
          <URL url={u} key={u.short_url} />
        ))}
      </div>
    </section>
  );
}
