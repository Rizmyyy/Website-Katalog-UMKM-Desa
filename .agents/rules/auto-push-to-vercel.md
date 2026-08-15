---
description: Ensure the agent automatically pushes code changes to GitHub for Vercel deployment.
---

# Rule: Auto Push to Vercel

1. **Default Behavior:** Whenever you successfully complete code modifications, bug fixes, or feature implementations, you MUST automatically commit and push the changes to GitHub (`git add . ; git commit -m "..." ; git push`) so that they trigger a Vercel deployment.
2. **Do Not Ask for Permission:** Do not ask the user "Do you want me to push this to Vercel?" — just do it automatically as the final step of your task execution.
3. **Exception:** The ONLY time you should NOT push to GitHub is if the user's prompt explicitly states to test or implement the changes "hanya di localhost" (only in localhost) or explicitly forbids pushing.
