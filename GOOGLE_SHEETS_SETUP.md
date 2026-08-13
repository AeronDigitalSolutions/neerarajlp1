# Google Sheets lead connection

The receiver is configured for this spreadsheet:

`1k31fFO4Zx2vd5m2S4VVekMdYu-cPKTZk_MCt5klnDok`

## Deploy the receiver

1. Open the Google Sheet.
2. Select **Extensions > Apps Script**.
3. Delete the example code in `Code.gs`.
4. Paste the complete contents of `google-apps-script.gs`.
5. Click **Save**.
6. Select **Deploy > New deployment**.
7. Next to **Select type**, click the gear and choose **Web app**.
8. Set **Execute as** to **Me**.
9. Set **Who has access** to **Anyone**.
10. Click **Deploy** and complete Google's authorization screens.
11. Copy the Web app URL ending in `/exec`.

Send that `/exec` URL back to Codex. The landing-page forms can then be
connected and verified with a test row.

The script creates a `Leads` tab and its column headings automatically on the
first successful submission.
