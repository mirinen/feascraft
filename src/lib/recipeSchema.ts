import type { CollectionEntry } from "astro:content";
import { decodeHTML } from "entities";
import { ELEMENT_NODE, TEXT_NODE, parse, type Node } from "ultrahtml";

function durationMinutes(value = "") {
  const match = /^(?:(\d+)\s*(?:hours?|hrs?|h)\s*)?(?:(\d+)\s*(?:minutes?|mins?|m))?$/i.exec(value.trim());
  if (!match || (!match[1] && !match[2])) return undefined;
  return Number(match[1] || 0) * 60 + Number(match[2] || 0);
}

function plainText(node: Node): string {
  if (node.type === TEXT_NODE) return decodeHTML(node.value);
  if (node.type !== ELEMENT_NODE) return "";
  if (node.name === "br") return " ";
  const content = node.children.map(plainText).join("");
  return ["p", "li"].includes(node.name) ? content + " " : content;
}

function cookingSteps(html: string) {
  const body: { children: Node[] } = parse(html);
  const blocks = body.children.filter(node => node.type === ELEMENT_NODE);
  const start = blocks.findIndex(node =>
    /^h[1-6]$/.test(node.name) && /^(instructions|directions|method|steps)\s*:?$/i.test(plainText(node).trim())
  );
  const steps: string[] = [];
  for (const node of blocks.slice(start + 1)) {
    if (start >= 0 && /^h[1-6]$/.test(node.name) && node.name <= blocks[start].name) break;
    if (node.name === "ol" || (start >= 0 && node.name === "ul")) {
      for (const item of node.children) {
        if (item.type === ELEMENT_NODE && item.name === "li") steps.push(plainText(item));
      }
    } else if (start >= 0 && node.name === "p") {
      steps.push(plainText(node));
    }
  }
  return steps.map(text => text.replace(/\s+/g, " ").trim()).filter(Boolean)
    .map(text => ({ "@type": "HowToStep", text }));
}

export function recipeSchema(recipe: CollectionEntry<"recipes">, pageUrl: URL) {
  const { data } = recipe;
  const prep = durationMinutes(data.prepTime);
  const cook = durationMinutes(data.cookTime);
  const steps = cookingSteps(recipe.rendered?.html ?? "");
  const image = data.image && URL.canParse(data.image, pageUrl) ? new URL(data.image, pageUrl) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    url: pageUrl.href,
    name: data.title,
    description: data.description,
    image: image?.href,
    author: { "@type": "Person", name: "Miri", url: new URL("/#about", pageUrl).href },
    datePublished: data.date.toISOString().slice(0, 10),
    recipeCategory: data.category,
    keywords: data.fandom,
    recipeYield: data.servings?.trim().replace(/^(\d+)\s+servings?$/i, "$1"),
    prepTime: prep === undefined ? undefined : `PT${prep}M`,
    cookTime: cook === undefined ? undefined : `PT${cook}M`,
    totalTime: prep === undefined || cook === undefined ? undefined : `PT${prep + cook}M`,
    recipeIngredient: data.ingredients,
    recipeInstructions: steps.length ? steps : undefined,
  };
}
