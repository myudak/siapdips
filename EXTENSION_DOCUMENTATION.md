# Siap Dips: Your Campus Companion - Technical Documentation

## Overview

**Extension Name:** Siap Dips: Your Campus Companion
**Version:** 1.4.2
**Target Users:** Students of Universitas Diponegoro (Undip)
**Primary Purpose:** Enhance productivity and user experience on campus academic portals

## Core Features

### 1. Tab Management System
The extension includes an intelligent tab suspender that helps students manage browser memory usage:

- **Automatic Tab Suspension**: Monitors tab activity and suspends tabs that have been inactive for a configurable period
- **Auto-Close Functionality**: Automatically closes tabs that have been suspended for too long
- **Smart Detection**: Skips pinned tabs, tabs with active audio, and tabs with unsaved form data
- **Manual Control**: Right-click context menu for manual tab suspension

### 2. Campus Portal Enhancements

#### SIAP Undip Integration
- **Dark Mode**: Custom dark theme for the academic portal
- **Custom Themes**: Multiple color schemes for personalization
- **Schedule Parser**: Extracts and displays class schedules
- **IPK Tracker**: Monitor academic performance
- **Privacy Features**: Blur personal information (name, NIM, grades)

#### Learning Platform Support
- **Learn Social**: UI improvements and dark mode
- **Moodle**: Enhanced interface and navigation
- **QR Code Scanner**: For attendance systems

### 3. Productivity Tools

#### Form Automation
- **PBM Auto-Fill**: Automatically fill out course evaluation forms
- **Food Truck Registration**: Auto-select location for registration forms
- **Form Protection**: Prevents data loss by detecting unsaved inputs

#### Job Tracking
- Multi-platform job application tracker supporting:
- JobStreet
- Kalibrr
- Glints
- LinkedIn
- Dealls
- And more

## Technical Architecture

### Permission Usage

#### 1. **alarms**
**Location:** `src/background.ts:33-59, 492`

**Purpose:** Implements periodic background tasks for tab management

**How It Works:**
```typescript
// Creates periodic alarm to check tabs every minute
chrome.alarms.create("checkTabs", { periodInMinutes: 1 });

// Listens for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkTabs") {
    TabSuspenderAlarm();
  }
});
```

**Features Enabled:**
- Check tab idle status every minute
- Schedule automatic tab closure
- Persist across browser restarts

---

#### 2. **contextMenus**
**Location:** `src/background.ts:75-84, 510`

**Purpose:** Provides right-click menu shortcuts for tab management

**How It Works:**
```typescript
// Create context menu items
chrome.contextMenus.create({
  id: "suspend-tab",
  title: "💤 Suspend this tab",
  contexts: ["page"]
});

chrome.contextMenus.create({
  id: "close-all-suspend-tab",
  title: "😶‍🌫️ Close all suspended tabs",
  contexts: ["page"]
});
```

**Features Enabled:**
- Manual tab suspension via right-click
- Bulk close all suspended tabs

---

#### 3. **tabs**
**Location:** Used extensively throughout `src/background.ts` and component files

**Purpose:** Core permission enabling most extension functionality

**How It Works:**

**A. Tab Suspension System** (Lines 552-675)
```typescript
async function TabSuspenderAlarm() {
  // Get all tabs
  const tabs = await chrome.tabs.query({});

  for (const tab of tabs) {
    // Skip active, pinned, or audio-playing tabs
    if (tab.active || tab.pinned || tab.audible) continue;

    // Check if tab has been idle beyond threshold
    if (isIdleTooLong(tab)) {
      // Check for unsaved form data
      const hasUnsavedData = await chrome.tabs.sendMessage(tab.id, {
        action: "check-form-data"
      });

      if (!hasUnsavedData) {
        // Suspend the tab
        chrome.tabs.update(tab.id, {
          url: `suspended.html?url=${tab.url}`
        });
      }
    }
  }
}
```

**B. Content Script Injection** (Lines 100-486)
```typescript
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // Inject dark mode CSS
    if (settings.darkMode) {
      chrome.tabs.insertCSS(tabId, { file: "dark-mode.css" });
    }

    // Inject feature scripts based on URL
    if (tab.url.includes("siap.undip.ac.id")) {
      chrome.tabs.executeScript(tabId, { file: "siap-enhancements.js" });
    }
  }
});
```

**C. Form Protection** (Lines 603, 656)
```typescript
// Before suspending, check for unsaved inputs
const response = await chrome.tabs.sendMessage(tabId, {
  action: "check-form-data"
});

if (response && response.hasFormData) {
  // Don't suspend - user has unsaved work
  console.log("Tab has unsaved data, skipping suspension");
  return;
}
```

**Features Enabled:**
- Tab suspension and restoration
- Dynamic CSS and script injection
- Dark mode implementation
- Form data protection
- Schedule parsing
- Auto-fill functionality
- Opening extension pages (settings, job tracker)

---

#### 4. **webRequest** ⚠️
**Status:** DECLARED BUT NOT USED

**Location:** Listed in `manifest-chrome.json` but no implementation found

**Analysis:** This permission is not currently used in the codebase. It should be removed to follow security best practices and reduce permission warnings.

---

#### 5. **webRequestBlocking** ⚠️
**Status:** DECLARED BUT NOT USED

**Location:** Listed in `manifest-chrome.json` but no implementation found

**Analysis:** This permission is not currently used in the codebase. It should be removed to follow security best practices and reduce permission warnings.

---

## Host Permissions

The extension requests access to specific campus-related domains:

- `https://siap.undip.ac.id/*` - Main academic portal
- `https://learn-social.undip.ac.id/*` - Learning management system
- `https://sister.undip.ac.id/*` - Staff information system
- `https://elearning.undip.ac.id/*` - E-learning platform
- And other campus-related domains

These are necessary for injecting custom CSS, scripts, and providing enhanced functionality on campus portals.

## Data Flow

### Tab Suspension Flow
```
1. User configures suspension timeout (e.g., 10 minutes)
2. Chrome alarm triggers every 1 minute
3. Extension queries all tabs
4. For each tab:
   a. Check if idle time > threshold
   b. Skip if: pinned, active, has audio, or whitelisted
   c. Send message to check for unsaved form data
   d. If no unsaved data: redirect to suspended.html
5. User clicks "Restore" on suspended page
6. Tab navigates back to original URL
```

### Content Injection Flow
```
1. User navigates to campus portal
2. chrome.tabs.onUpdated event fires
3. Extension checks URL against known domains
4. If match found:
   a. Inject custom CSS (dark mode, themes)
   b. Inject JavaScript enhancements
   c. Parse page content (schedules, grades)
   d. Apply UI modifications
```

## Privacy & Security

### Data Collection
The extension does NOT:
- Send data to external servers
- Track browsing history
- Access data outside campus domains
- Store sensitive information remotely

### Local Storage Only
All data is stored locally using `chrome.storage.local`:
- User preferences
- Tab suspension state
- Parsed schedules
- Theme settings
- Job tracker data

### Privacy Features
- **Blur Mode**: Hides personal information on shared screens
- **Form Protection**: Prevents accidental data loss
- **No Analytics**: No tracking or telemetry

## Recommendations

### Critical: Remove Unused Permissions
The manifest currently declares `webRequest` and `webRequestBlocking` permissions that are not used anywhere in the code. These should be removed because:

1. **Security Risk**: These permissions can intercept ALL network traffic
2. **User Trust**: Unnecessary permissions trigger privacy warnings
3. **Store Review**: May slow down Chrome Web Store approval
4. **Best Practice**: Follow principle of least privilege

### Action Required
Remove from `manifest-chrome.json`:
```json
"permissions": [
  "alarms",
  "contextMenus",
  "tabs",
  "storage",
  // Remove these:
  // "webRequest",
  // "webRequestBlocking"
]
```

## File Structure

```
siapDipss/
├── src/
│   ├── background.ts          # Main service worker
│   ├── components/            # UI components
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utility functions
│   ├── pages/                 # Extension pages
│   │   ├── settings/          # Settings UI
│   │   ├── suspended/         # Suspended tab page
│   │   └── job-tracker/       # Job tracking UI
│   └── manifest-chrome.json   # Extension manifest
```

## Build Process

The extension uses:
- **TypeScript**: For type-safe code
- **React**: For UI components
- **Vite**: For building
- **Chrome Extension API**: For browser integration

## Version History

- **1.4.2**: Current version
- Features: Tab suspender, dark mode, job tracker, form automation

## Support

For issues or contributions, visit the project repository.

---

**Last Updated:** 2025-11-02
**Maintainer:** [Project Team]
