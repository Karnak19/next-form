// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "My Docs",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          link: "/getting-started",
        },
        {
          label: "Advanced Usage",
          link: "/advanced-usage",
        },
        {
          label: "API Reference",
          link: "/api",
        },
      ],
    }),
  ],
});
