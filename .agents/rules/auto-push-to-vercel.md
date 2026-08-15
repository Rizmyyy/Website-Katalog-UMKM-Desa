# Auto Push to Vercel (Git)

Whenever code changes are made, tested, and finalized, the agent MUST automatically commit and push those changes to the remote Git repository (GitHub). 

This is required because the live website is hosted on Vercel, which relies on new commits to the `main` branch to trigger deployments. The agent should never leave changes only in the local working directory if the user intends for them to be live.

**Expected Workflow:**
1. Make the necessary code changes.
2. Run `git add .` (or specify the files).
3. Run `git commit -m "<descriptive message>"`.
4. Run `git push`.
