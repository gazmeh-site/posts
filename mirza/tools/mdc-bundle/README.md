# mdc-bundle

Build-time-only Node tool that produces a single vendored, offline browser
bundle (`posts/mirza/public/mdc-parser.bundle.js`) which parses MDC syntax
(the Markdown-with-components format used by Nuxt Content v3 / `@nuxtjs/mdc`)
into HTML, entirely client-side, for `posts/mirza/public/mirza-editor.html`.

`mirza-editor.html` runs offline inside a sandboxed
`iframe[sandbox="allow-scripts allow-same-origin"]` with no network access,
so it cannot load `@nuxtjs/mdc` (a full Nuxt module, ~200KB+ of deps
including Shiki syntax highlighting themes/langs, `@nuxt/kit`, etc.) or fetch
anything at runtime. Instead this tool bundles the much smaller
remark-level MDC parser (`remark-mdc`, the same package `@nuxtjs/mdc` uses
internally for its markdown-to-AST step) with a minimal `unified` pipeline
into one self-contained IIFE script that gets committed to `public/` and
loaded like any other static asset.

This directory is **not** a runtime dependency of the Python/Chainlit
project (`posts/mirza/`) — it's only needed when you edit `entry.js` and
need to regenerate the bundle. Node/npm are not required to run `mirza`
itself.

## Rebuilding the bundle

```bash
cd posts/mirza/tools/mdc-bundle
npm install
npm run build
```

This runs esbuild and writes/overwrites
`posts/mirza/public/mdc-parser.bundle.js`.

To sanity-check the parsing logic (mdast -> hast handlers for MDC
container/leaf/text components) directly under Node, without bundling:

```bash
npm test   # runs test.mjs, prints HTML for a set of MDC fixtures
```

## How it works

`entry.js` builds a `unified()` pipeline:
`remark-parse -> remark-gfm -> remark-mdc -> remark-rehype -> rehype-stringify`.

`remark-mdc` parses MDC syntax into three custom mdast node types
(`containerComponent`, `leafComponent`, `textComponent`) that have no
built-in `mdast-util-to-hast` handler. `entry.js` supplies custom
`remark-rehype` `handlers` that map each of these straight onto an HTML
element named after the component (`node.name`) with `node.attributes` as
its HTML attributes — e.g. `::card-group` -> `<card-group>`,
`::card{title="Docs"}` -> `<card title="Docs">`. See the comments in
`entry.js` for details, and the top-level report in the commit/PR this was
built for regarding exact tag/attribute shapes, unknown-component handling,
and known caveats (e.g. code-fence bracket labels like `[install.sh]` are
dropped by remark-mdc and not preserved as an attribute).

`npm run build` bundles it with esbuild for the browser:

```bash
esbuild entry.js --bundle --format=iife --global-name=MirzaMdc --platform=browser --outfile=../../public/mdc-parser.bundle.js
```

exposing `window.MirzaMdc.parse(markdownString) -> htmlString` once the
script tag loads.
