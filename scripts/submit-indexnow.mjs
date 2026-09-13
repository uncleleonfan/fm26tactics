// Submit all sitemap URLs to IndexNow (Bing, Yandex, Seznam, Naver...).
// Usage: npm run indexnow  (after a deploy, once the key file is live)
const KEY = process.env.INDEXNOW_KEY || "d61c696d6ab1451ba55fe18177dbf03e";
const HOST = process.env.SITE_HOST || "www.fm26tactics.com";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

async function main() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) {
    console.error(`Failed to fetch sitemap: HTTP ${res.status}`);
    process.exit(1);
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) {
    console.error("No URLs found in sitemap");
    process.exit(1);
  }

  console.log(`Submitting ${urls.length} URLs to IndexNow...`);
  const submit = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    }),
  });

  // 200 = accepted, 202 = accepted (key check pending), 4xx = rejected
  if (submit.ok || submit.status === 202) {
    console.log(`Done (HTTP ${submit.status}).`);
  } else {
    console.error(`Rejected: HTTP ${submit.status} — ${await submit.text()}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
