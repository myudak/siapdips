# Privacy Policy

_Last updated: 2025-01-03_

This policy applies to the “Siap Dips” browser extension (Chrome/Edge/Firefox) available in this repository. The extension runs in your browser to enhance SIAP Undip, Undip Learn, Oracle Academy, and related experiences.

## Data the extension accesses
- **Page content on allowed sites**: The extension reads page content on the domains declared in the manifest (e.g., `*.undip.ac.id`, `undip.learnsocial.online`, `academy.oracle.com`) to provide automation and UI helpers. Processing is performed locally in your browser.
- **Browser storage**: Preferences, feature toggles, and cached data (e.g., quiz answers you add, layout settings) are stored using the browser’s extension storage APIs.
- **Todoist (optional)**: If you provide a Todoist API token and project ID, the extension reads assignments from allowed sites and creates/updates tasks in your Todoist account. Tokens and settings are stored locally; requests go directly to `https://api.todoist.com/`.
- **No account creation with the developer**: The extension does not require or create an account with the developer.
- **No analytics/ads**: The extension does not embed analytics SDKs or advertising.

## How data is used
- To render the helper UI, auto-fill/assist with quizzes, manage attendance helpers, and improve job/learning workflows.
- To remember your settings (theme, toggles, Todoist preferences).
- If configured, to sync assignments to Todoist on your behalf.

## Data sharing
- **Not shared with the developer or third parties** beyond the sites you already visit and, if you opt in, Todoist. The extension does not sell or rent data.
- When you enable Todoist sync, the extension sends assignment details (title, due time, links) to your Todoist project via their REST API.

## Data retention and control
- Data stored via extension storage stays on your device until you remove it, reset the extension, or uninstall the extension.
- You can delete stored data by removing the extension or clearing the extension’s storage from the browser.
- Disable features or revoke the Todoist token in the extension settings to stop related processing.

## Permissions rationale
- `activeTab`, `scripting`, `tabs`: inject helper scripts on requested pages you open.
- `storage`, `alarms`, `contextMenus`: save settings, schedule background actions, and provide quick actions.
- `host_permissions`: limited to the domains listed in the manifest to enable in-page helpers; `api.todoist.com` is used only when you enable Todoist sync.

## Security
- Communication with Todoist uses HTTPS.
- Sensitive values (e.g., Todoist tokens) are stored in browser extension storage; no developer server receives them.

## Children
The extension is intended for university/college users and is not directed to children under 13. If you are under 13, do not use the extension.

## Changes to this policy
Updates will be committed to this repository. Material changes will update the “Last updated” date above.

## Contact
If you have privacy questions or requests, please open an issue at the project repository or contact the developer through the listed project channels.
