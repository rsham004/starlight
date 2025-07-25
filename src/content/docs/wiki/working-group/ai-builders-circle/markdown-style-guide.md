---
title: Markdown Style Guide
description: "AI Builders Circle documentation"
published: true
date: 2025-07-05T04:05:52.540Z
tags: 
editor: markdown
dateCreated: 2025-07-05T04:05:52.540Z
---


# 📝 Markdown Style Guide

This guide will help you write clear, consistent content for the Product Foundry Wiki using Markdown.

Whether you're editing a single sentence or creating an entire guide — follow these tips to keep things clean and useful.

---

## 🧱 Basic Formatting

| Format | Markdown | Output |
|--------|----------|--------|
| **Bold** | `**bold**` | **bold** |
| *Italic* | `*italic*` | *italic* |
| `Inline code` | `` `code` `` | `code` |
| Block code | <pre>```\ncode block\n```</pre> | ```
code block
``` |
| [Links](#) | `[text](url)` | [text](url) |
| Images | `![Alt text](url)` | ![Alt text](url) |

---

## 🧭 Structure & Headings

Use headings to break your page into logical sections. This helps with readability and navigation.

```markdown
# Main Title (H1)
## Section (H2)
### Subsection (H3)
```

✅ **Do**:
- Use one `# H1` per page (usually the title).
- Keep headings short and meaningful.
- Use consistent title case: `# How to Use the Tool`, not `# how to use the tool`.

---

## ✅ Lists

Use lists to structure points clearly.

**Bulleted list**:
```markdown
- First item
- Second item
  - Nested item
```

**Numbered list**:
```markdown
1. Do this
2. Then this
3. Finally this
```

---

## 📦 Callouts & Notes

Use **bold headers** and emojis to signal tips or warnings:

```markdown
> 💡 **Tip**: You can use AI to speed this up.
> ⚠️ **Note**: This tool changes often — double check the docs.
```

---

## 📚 Code & Examples

For multi-line examples, use code blocks:

```bash
npx create-react-app my-app
cd my-app
npm start
```

Mention the language for syntax highlighting (`bash`, `python`, `js`, etc).

---

## 🧩 Internal Linking

Link to other wiki pages like this:

```markdown
[Contribute to the Wiki](./contributing)
[Getting Started Guide](./getting-started)
```

Use relative links (`./`) so they work across the site.

---

## 🧼 Style & Tone

- Write in a friendly, confident voice — like you're explaining it to a smart peer.
- Avoid jargon unless you're explaining it.
- Break things into steps and use short paragraphs.
- Use real-world examples whenever possible.
- Prefer clarity over cleverness.

---

## 🙏 Before You Submit

- Did you proofread?
- Is the structure clear?
- Does your contribution connect to related pages?
- If it's a new tool or method, did you explain the **why**, not just the **how**?

---

Thanks for keeping our wiki awesome. Every improvement makes the knowledge clearer and more accessible.

— The Product Foundry Team
