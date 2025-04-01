import type { ReturnedUrl } from "@customTypes/ReturnedUrl";
import getLatestUrls from "src/helpers/getLatestUrls";
import getShortUrl from "src/helpers/getShortUrl";
import React from "react";

export default function URLForm({
  urls,
  setUrls,
}: {
  urls: ReturnedUrl[];
  setUrls: React.Dispatch<React.SetStateAction<ReturnedUrl[]>>;
}) {
  async function submitForm(formData: FormData): Promise<void> {
    const originalUrl: string = formData.get("original_url")?.toString().trim()!;

    if (!originalUrl) {
      alert("Please provide a valid url");
      return;
    }

    try {
      getShortUrl(originalUrl).then((linkBundle) => {
        getLatestUrls().then((res) => setUrls(res));
        navigator.clipboard.writeText(linkBundle.short_url);
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form className="flex flex-col min-w-full md:min-w-[800px]" action={submitForm}>
      <div className="my-8 w-full">
        <label htmlFor="original_url" className="font-medium">
          URL To shorten:{" "}
        </label>
        <input
          className="bg-primary/20 p-2 py-4 font-semibold text-lg rounded w-full"
          type="text"
          name="original_url"
          id="original_url"
          placeholder="place the url to shorten here"
          required
        />
      </div>

      <button
        className="bg-secondary rounded-md p-4 transition-all hover:bg-primary hover:text-bgColor font-bold"
        type="submit"
      >
        Shorten it!
      </button>
    </form>
  );
}
