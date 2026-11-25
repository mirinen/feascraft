# Feastcraft with Miri

The source for [feastcraftwithmiri.com](https://feastcraftwithmiri.com).

## Local development

```sh
npm install
npm run dev
```

## Editing recipes and cooking logs on GitHub

Open a Markdown file in [Original Recipes](src/data/recipes) or [Cooking Log](src/data/cooking-log) and click the pencil to edit it. To add a new entry, copy one from the same folder and give the new file its own name. Set `published: true` when it is ready.

Original recipes include the ingredients and instructions. Cooking log entries from published cookbooks include your notes and the book credit.

### Adding photos

Upload the photos to [public/images/recipes](public/images/recipes) using **Add file → Upload files**. The `image` field sets the cover photo. For extra photos, add a `gallery` list between the opening and closing `---` lines of the Markdown file. Use your uploaded filenames in place of the examples.

```yaml
image: /images/recipes/buttered-gnocchi.jpg
gallery:
  - src: /images/recipes/gnocchi-in-pan.jpg
    alt: Gnocchi browning in a frying pan
    caption: I turn them once the undersides are golden.
  - src: /images/recipes/gnocchi-with-peas.jpg
    alt: Gnocchi tossed with peas and chopped sage
```

Each photo needs a short visual description in `alt`. Captions are optional. The photos appear below the recipe or cooking notes in the order listed. Omit `gallery` for a post with only a cover photo.
