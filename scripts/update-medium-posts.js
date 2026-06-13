const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();

async function main() {
  const feed = await parser.parseURL(
    "https://medium.com/feed/@ashish-4"
  );

  const posts = feed.items
    .slice(0, 5)
    .map((post) => `- [${post.title}](${post.link})`)
    .join("\n");

  const readme = fs.readFileSync("README.md", "utf8");

  const updated = readme.replace(
    /<!-- BLOG-POST-LIST:START -->([\s\S]*?)<!-- BLOG-POST-LIST:END -->/,
    `<!-- BLOG-POST-LIST:START -->\n${posts}\n<!-- BLOG-POST-LIST:END -->`
  );

  fs.writeFileSync("README.md", updated);
}

main();
