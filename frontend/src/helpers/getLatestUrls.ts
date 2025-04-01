import type { ReturnedUrl } from "@customTypes/ReturnedUrl";

export default async function getLatestUrls(): Promise<ReturnedUrl[]> {
  try {
    const res = await fetch("http://localhost:8080/stats/latest");
    const data = (await res.json()) as ReturnedUrl[];
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
