# Contributor Pages

This folder is a standalone static site for GitHub Pages.

## Local Preview

Open docs/index.html in a browser.

## Replacing Image Placeholders

1. Find each "Infographic Prompt Placeholder" block in docs/index.html.
2. Generate the infographic image from the prompt.
3. Save images in docs/.
4. Replace the placeholder block with an img tag, for example:

<img src="architecture-diagram.png" alt="DeyWeaver analytics architecture" />

## Deploy

Deployment is handled by the workflow in .github/workflows/contributor-pages.yml.
On push to main with changes under docs/, GitHub Pages is updated.
