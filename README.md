# Malloju Sridhara Chary — Cloud Infrastructure & DevOps Portfolio

Single-page portfolio positioned for Cloud / DevOps engineering roles. Dark ops-console
theme with a terminal boot intro, an **interactive AWS architecture diagram** that traces a
request from the internet to a pod on EKS, expandable code samples on each project, and
animated stat counters.

No framework, no build step — three files and a browser.

## Files

| File | What's in it |
|---|---|
| `index.html` | All page structure and copy |
| `styles.css` | Theme tokens, layout, responsive rules |
| `script.js` | Boot intro, hero terminal, architecture trace, counters, code toggles, mobile nav |

## Run locally

Open `index.html` in a browser. Web fonts need a connection; everything else works offline.



## Editing guide

| To change | Edit |
|---|---|
| Projects | `<!-- PROJECT n -->` blocks in `index.html` |
| Project repo links | The `.proj-repo` anchors — currently all point at the GitHub profile. Swap in per-repo URLs when the repos are named. |
| Stat numbers | `data-target` / `data-suffix` on `.kpi-num` in `#metrics` |
| Architecture steps | The `steps` array near the middle of `script.js` — text is HTML, `<strong>` renders |
| Diagram boxes/lines | The inline `<svg>` in `#architecture`. Nodes are `<g id="nN" data-step="N">`; lines are `<path id="lN">` |
| Boot / hero terminal text | `bootLines` and `heroLines` arrays at the top of `script.js` |
| Colors | CSS variables in `:root` at the top of `styles.css` |

## Notes

- Content matches the resume: two roles (OpenKyber, Infosys), three cloud certifications,
  phone `+1 (404) 502-5538`. Keep the two in sync when either changes.
- Every project links to `github.com/sridharchary42`. Point each at its own repo once the
  repos are named — a recruiter who clicks through and finds nothing is worse than no link.
- `prefers-reduced-motion` is respected; all animation is disabled for users who ask for it.
