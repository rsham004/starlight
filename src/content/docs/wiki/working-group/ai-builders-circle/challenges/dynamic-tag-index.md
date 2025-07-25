---
title: <00D> Dynamic Tags
description: "AI Builders Circle documentation"
published: true
date: 2025-07-05T04:37:58.163Z
tags: foundational, proposed
editor: markdown
dateCreated: 2025-07-05T04:37:58.163Z
---


# 🧪 Challenge: Dynamic Tag Index via GraphQL in Wiki.js

---

## ðŸ·ï¸ Tier: 2 – Deep Build

---

## 🧠 Problem Statement

Right now, Wiki.js does not natively allow us to **dynamically display a list of pages by tag within a wiki page**. While tags can be searched via the UI, we want to surface tag-based page lists *in context* — such as on the Challenge Library overview or in topical hubs like “AI Agentsâ€ or “Prompt Patterns.â€

---

## 🎯 Goal

Build a reusable way to **dynamically display all pages with a given tag** using Wiki.js’s GraphQL API and embed it within a page using a custom widget, block, or script.

---

## ✅ Success Criteria

- A snippet or script that queries the Wiki.js GraphQL API for pages matching a specific tag
- Embeddable in any page via custom HTML/JS block or widget
- Renders a list of links (`<ul><li><a href=...>Page Title</a></li></ul>`) to pages with the matching tag
- Configurable by tag (either hardcoded per snippet or editable via page metadata)
- Works with self-hosted Wiki.js v2.x

---

## 🛠️ Tech Stack & Inputs

- Wiki.js GraphQL API: [`/graphql`](https://docs.requarks.io/dev/api)
- JavaScript (vanilla or embedded widget)
- Optional: serverless function to proxy calls (if CORS becomes an issue)

---

## 📦 Suggested Architecture

```plaintext
[Page HTML block]
   ↓
[JS script] → GraphQL API call → fetch all pages with matching tag
   ↓
[Render HTML list] → display inline in wiki page
```

Example GraphQL query:

```graphql
{
  pages(tags: ["deep-builds"]) {
    title
    path
  }
}
```

---

## 💬 Discussion Prompts

- Should the tag be passed via metadata or set inside the script?
- Should this be generalized into a reusable widget library?
- How will we handle pagination or rate limits if the page set grows large?
- Should we support multiple tags or tag *sets*?

---

## 🧠 Why This Matters

This feature will:
- Make the wiki *feel alive* and context-aware
- Reduce the need for manual tag index pages
- Showcase Wiki.js as a powerful, extensible platform for internal knowledge systems

---

## 📞 Related Pages

- [Challenge Library Overview](./challenge-library)
- [Contribution & IP Protocol](./contribution-ip)
- [The Foundry Operating System v2.1](./foundry-os)

---

## 🖐️ Interested in taking this on?

Drop a message in `#builders-circle` or tag a lead to join the next sprint working group!





