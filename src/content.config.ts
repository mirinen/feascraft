import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const recipes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/recipes" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    fandom: z.string(),
    category: z.string(),
    image: z.string().optional(),
    prepTime: z.string().optional(),
    cookTime: z.string().optional(),
    servings: z.string().optional(),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    published: z.boolean().default(false),
    ingredients: z.array(z.string()),
  }),
});

export const collections = { recipes };
