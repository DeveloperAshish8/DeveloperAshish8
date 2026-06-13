const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();

function getThumbnail(post) {
  const match = post.content?.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : "";
}

async function main() {
  const feed = await parser.parseURL(
    "https://medium.com/feed/@ashish-4"
  );

  const posts = feed.items.slice(0, 3);

  const cards = posts
    .map(
      (post) => `
<td width="33%" align="center">
  <a href="${post.link}">
    <img src="${getThumbnail(post)}" width="250" />
    <br /><br />
    <b>${post.title}</b>
  </a>
</td>`
    )
    .join("\n");

  const html = `
<table>
<tr>
${cards}
</tr>
</table>`;

  const readme = fs.readFileSync("README.md", "utf8");

  const updated = readme.replace(
    /<!-- BLOG-POST-LIST:START -->([\\s\\S]*?)<!-- BLOG-POST-LIST:END -->/,
    `<!-- BLOG-POST-LIST:START -->\n${html}\n<!-- BLOG-POST-LIST:END -->`
  );

  fs.writeFileSync("README.md", updated);
}

main();
