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
assets/images/              artwork used by the site
assets/images/Source/       master files, not deployed
assets/images/logos/
s3_website.yml.example      copy to s3_website.yml and fill in credentials
```

Several images in `assets/images/` are unused by the page and kept only as
archive. They are listed under `exclude_from_upload` in `s3_website.yml` so they
stay out of the bucket.

## Local preview

Any static file server will do. The stylesheet and images use absolute paths, so
serve from the repository root:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploying

The site is a static S3 website bucket, deployed with the
[s3_website](https://github.com/laurilehmijoki/s3_website) gem:

```sh
cp s3_website.yml.example s3_website.yml   # first time only; fill in credentials
s3_website push
```

`s3_website.yml` holds AWS credentials and is gitignored. Never commit it.

### Known outstanding work

- **The site is served over plain HTTP only.** There is no certificate on the
  bucket, so browsers mark it "Not secure" and the apex domain does not resolve.
  Putting CloudFront with an ACM certificate (or Cloudflare) in front of the
  bucket fixes both.
- The deploy still relies on a long-lived IAM access key. GitHub Actions with
  OIDC would remove the key from local disk entirely.
- The background images are full-size JPEGs. AVIF or WebP derivatives would cut
  the page weight substantially.
