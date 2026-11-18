import { getCollection } from "astro:content";

export async function getCookingEntries() {
  const [recipes, notes] = await Promise.all([
    getCollection("recipes", ({ data }) => data.published),
    getCollection("cookingLog", ({ data }) => data.published),
  ]);

  return [...recipes, ...notes]
    .map((post) => {
      const isRecipe = post.collection === "recipes";
      return {
        ...post.data,
        slug: post.id,
        href: `/${isRecipe ? "recipes" : "cooking-log"}/${post.id}/`,
        linkLabel: isRecipe ? "Get the recipe" : "Read my notes",
      };
    })
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());
}
