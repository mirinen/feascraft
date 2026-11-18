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
    photoX: z.number().min(0).max(100).default(50),
    photoY: z.number().min(0).max(100).default(50),
    prepTime: z.string().optional(),
    cookTime: z.string().optional(),
    servings: z.string().optional(),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    published: z.boolean().default(false),
    videoUrl: z.url().optional(),
    introduction: z.string().nullish(),
    ingredients: z.array(z.string()),
  }),
});

const cookingLog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/cooking-log" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    fandom: z.string(),
    category: z.string(),
    image: z.string().optional(),
    photoX: z.number().min(0).max(100).default(50),
    photoY: z.number().min(0).max(100).default(50),
    date: z.coerce.date(),
    published: z.boolean().default(false),
    cookbook: z.string().optional(),
    cookbookUrl: z.url().optional(),
    videoUrl: z.url().optional(),
  }),
});

export const collections = { recipes, cookingLog };
