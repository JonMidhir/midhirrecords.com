# midhirrecords.com

A single static page for Midhir Records, an extreme music record label based in
Belfast, 2004 – 2009.

Hovering (or keyboard-focusing) one of the four artist links fades in the
artwork for that release as a full-bleed background, darkens it with a vignette,
swaps the black logo for the white one, and shows the release details in the top
left corner.

## How it works

There is no JavaScript. The entire interaction is CSS.

Each artist link carries a modifier class — `artist_link--symbel`,
`artist_link--hexxed`, and so on. Every link has a matching background layer
(`.image--symbel`) and a matching info block (`.release--symbel`), both sitting
at `opacity: 0` by default. A `body:has()` selector correlates the hovered link
with its pair:

```css
body:has(.artist_link--symbel:is(:hover, :focus-visible))
	:is(.image--symbel, .release--symbel) { opacity: 1 }
```

Adding a release means adding three things with the same suffix: the link, the
`.image--*` layer, and the `.release--*` block, plus a one-line `background-image`
rule and an entry in the per-artist selector list at the bottom of `main.css`.

`:has()` needs Chrome 105+, Safari 15.4+ or Firefox 121+. Older browsers get the
page with no hover effects; every link still works.

## Layout

```
index.html                  the whole page
css/main.css                the whole interaction
favicon.ico
CNAME                       custom domain for GitHub Pages
.github/workflows/deploy.yml  build and deploy
assets/images/              artwork used by the site
assets/images/Source/       master files, not deployed
assets/images/logos/
```

Several images in `assets/images/` are unused by the page and kept only as
archive. The deploy workflow publishes an explicit **allowlist** of files rather
than excluding known-bad ones, so anything not named in the `Assemble site` step
never reaches the web. Adding a release means adding its image to that list.

## Local preview

Any static file server will do. The stylesheet and images use absolute paths, so
serve from the repository root:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploying

The site is hosted on GitHub Pages. Pushing to `master` triggers
`.github/workflows/deploy.yml`, which assembles `_site/` from the allowlist,
stamps the revision comment, and publishes. There are no credentials anywhere —
deployment uses the workflow's OIDC token.

To deploy, push. To deploy without a change, run the workflow manually from the
Actions tab (`workflow_dispatch`).

The first line of served HTML records which build is live:

```html
<!-- Revised: 2026-07-28 12:00 UTC | commit: abc1234 | built by GitHub Pages -->
```

In a working copy that line reads `build: local`. If you view source on the live
site and see `build: local`, you are looking at a stale cache or the old S3
bucket, not Pages.

### DNS

Set at 34SP; GitHub Pages serves both apex and `www` over HTTPS.

```
@    A      185.199.108.153
@    A      185.199.109.153
@    A      185.199.110.153
@    A      185.199.111.153
www  CNAME  jonmidhir.github.io.
```

`CNAME` in the repo root holds `www.midhirrecords.com`, so GitHub redirects the
apex to `www`, matching the canonical URL in the Open Graph tags.

### Known outstanding work

- The background images are full-size JPEGs. AVIF or WebP derivatives would cut
  the page weight substantially.
