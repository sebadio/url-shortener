import type { ReturnedUrl } from "@customTypes/ReturnedUrl";

export default function URL({ url }: { url: ReturnedUrl }) {
  const { original_url, short_url } = url;
  console.log(short_url);
  return (
    <>
      <div className="flex flex-col bg-primary/10 my-2 px-2 py-4 rounded">
        <a
          referrerPolicy="no-referrer"
          target="_blank"
          className="font-bold hover:text-primary hover:underline hover:decoration-2 transition-all"
          href={short_url}
        >
          {short_url}
        </a>

        <small>{original_url.replace(/(http)(s)?(:\/\/)(www.)?/, "").slice(0, 62)}</small>
      </div>
    </>
  );
}
