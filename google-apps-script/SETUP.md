# Google Sheets setup (RSVP + Wishes)

Spreadsheet: https://docs.google.com/spreadsheets/d/1T_ULyW5M2r_AajoCElneq8gvtDwQpgVmCRCsMc6sX4o/edit

1. Open the spreadsheet > Extensions > Apps Script.
2. Replace everything in `Code.gs` with the contents of `code.ts` (project root).
3. Select the `setup` function and click Run. Approve the permissions prompt.
   This creates the `RSVP` and `Wishes` sheets with formatted headers.
   (They are also created automatically on the first submission.)
4. Deploy > New deployment > type: Web app.
   - Execute as: Me
   - Who has access: Anyone
5. Copy the Web App URL (ends in `/exec`).
6. Paste it into `DEPLOYED_SCRIPT_URL` in `src/config.ts`,
   or set `VITE_GOOGLE_APPS_SCRIPT_URL` in `.env` / Vercel environment variables.
7. Rebuild / redeploy the site.

Sheets created:
- RSVP: Timestamp | Full Name | Phone | Attendance | Number of Guests | Dietary Notes
- Wishes: Timestamp | Name | Message

If you change `code.ts` later: Deploy > Manage deployments > Edit > Version: New version,
so the same URL keeps working.
