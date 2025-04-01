import { useEffect, useState } from "react";

import type { ReturnedUrl } from "@customTypes/ReturnedUrl";
import RecentURL from "@components/RecentURL";
import URLForm from "@components/URLForm";
import getLatestUrls from "src/helpers/getLatestUrls";

export default function App() {
  const [urls, setUrls] = useState<ReturnedUrl[]>([]);

  useEffect(() => {
    getLatestUrls()
      .then((urls) => setUrls(urls))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="flex justify-center items-center flex-col gap-4 p-4">
      <URLForm urls={urls} setUrls={setUrls} />
      <RecentURL urls={urls} />
    </section>
  );
}
