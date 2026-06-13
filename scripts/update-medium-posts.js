const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();

function getThumbnail(post) {
const content = post["content:encoded"] || post.content || "";

const match = content.match(/<img[^>]+src="([^"]+)"/i);

return match
? match[1]
: "https://via.placeholder.com/220x120?text=Medium";
}

async function main() {
const feed = await parser.parseURL(
"https://medium.com/feed/@ashish-4"
);

console.log("Posts found:", feed.items.length);
console.log(
"Latest posts:",
feed.items.slice(0, 3).map((p) => p.title)
);

const posts = feed.items.slice(0, 3);

const cards = posts
.map(
(post) => `

<td align="center" width="33%">
  <a href="${post.link}">
    <img
      src="${getThumbnail(post)}"
      width="220"
      alt="${post.title}"
    />
    <br /><br />
    <b>${post.title}</b>
  </a>
</td>`
    )
    .join("");

const html = `

<table>
<tr>
${cards}
</tr>
</table>`;

const readme = fs.readFileSync("README.md", "utf8");

const updated = readme.replace(
/<!-- BLOG-POST-LIST:START -->([\s\S]*?)<!-- BLOG-POST-LIST:END -->/,
`<!-- BLOG-POST-LIST:START -->\n${html}\n<!-- BLOG-POST-LIST:END -->`
);

console.log("README changed:", readme !== updated);

fs.writeFileSync("README.md", updated);

console.log("README updated successfully.");
}

main().catch((err) => {
console.error(err);
process.exit(1);
});
