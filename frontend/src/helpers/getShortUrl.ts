import type { ReturnedUrl } from "@customTypes/ReturnedUrl";

export default async function getShortUrl(url: string): Promise<ReturnedUrl> {
  try {
    const res = await fetch(`http://localhost:8080/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        original_url: url,
      }),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
    return Promise.reject();
  }
}
