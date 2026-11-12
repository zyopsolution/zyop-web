# ZYOP Solution — website

Official single-page website for **ZYOP Solution**, an independent digital studio for brand identity, web design, and software.

The site is built as a static site for GitHub Pages, using **Bootstrap 5.3** for layout and components, with a custom brand layer in `assets/css/styles.css`.

## Structure

```
index.html                  Main page (content, SEO metadata, JSON-LD)
404.html                    Branded not-found page
assets/css/styles.css       Brand theme and custom components
assets/js/main.js           Navigation, reveal animations, form, clipboard
assets/image/               Logo, favicons, app icons, Open Graph cover
robots.txt                  Crawler rules
sitemap.xml                 XML sitemap
site.webmanifest            PWA / home-screen metadata
CNAME                       GitHub Pages custom domain
```

## Local preview

No build step is required. Open `index.html` directly, or serve the folder locally:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Editing

- **Brand colours and type** live in the `:root` block at the top of `assets/css/styles.css`.
- **Content** lives directly in `index.html`.
- **Contact form** opens the visitor's email app with a pre-filled draft addressed to `azamayop@zyopsolution.com`. There is no backend.
- **SEO metadata** (title, description, canonical, Open Graph, Twitter, JSON-LD) is in the `<head>` of `index.html`. Update the canonical URL and image URLs if the domain changes.

## SEO checklist

- Unique title and meta description
- Canonical URL and `hreflang`
- Open Graph and Twitter card metadata
- `ProfessionalService`, `WebSite`, `WebPage`, and `FAQPage` structured data
- Semantic headings and one `h1`
- Descriptive image alt text
- `robots.txt` and `sitemap.xml`
- Mobile-responsive layout and accessible focus states

After deploying, submit `https://www.zyopsolution.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
