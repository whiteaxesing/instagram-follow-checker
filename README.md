# Insta Follow Checker

A browser extension for Chrome and Firefox that shows you who doesn't follow you back on Instagram — and lets you unfollow them directly.

![Extension popup preview](https://i.imgur.com/placeholder.png)

---

## Features

- Scans everyone you follow and detects who doesn't follow you back
- Shows profile picture, username, and full name
- **Unfollow** button next to each user
- Export the full list as a JSON file
- Built-in rate limiting to avoid temporary Instagram blocks

---

## Installation

### Chrome

**Option A — Install from Chrome Web Store** *(coming soon)*

**Option B — Manual install (Developer Mode)**

1. Download the latest `insta-follow-checker-chrome.zip` from the [Releases](https://github.com/whiteaxesing/instagram-follow-checker/releases) page and unzip it
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the unzipped folder

---

### Firefox

**Option A — Install from Firefox Add-ons** *(coming soon)*

**Option B — Manual install**

1. Download the latest `insta-follow-checker-firefox.zip` from the [Releases](https://github.com/whiteaxesing/instagram-follow-checker/releases) page
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on...**
4. Select the `.zip` file directly

> **Note:** Temporary add-ons are removed when Firefox closes. For a permanent install without the Add-ons store, you need [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/) or Firefox Nightly with `xpinstall.signatures.required` set to `false` in `about:config`.

---

## How to use

1. Go to [instagram.com](https://www.instagram.com) and make sure you're logged in
2. Click the extension icon in your browser toolbar
3. Press **Analyze** — a progress bar will show as it scans your following list
4. Users who don't follow you back appear with their profile picture
5. Click **Unfollow** next to any user to unfollow them directly
6. Click **Export** to download the full list as a JSON file

---

## Privacy

This extension runs entirely in your browser. No data is sent to any external server. It uses Instagram's own internal API (the same one the website uses) with your existing session cookies.

---

## For developers — building from source

```bash
git clone https://github.com/whiteaxesing/instagram-follow-checker.git
cd insta-follow-checker
./build.sh
# Output: dist/insta-follow-checker-chrome.zip
#         dist/insta-follow-checker-firefox.zip
```

---

## Disclaimer

This project is not affiliated with or endorsed by Instagram or Meta. Use responsibly and in accordance with [Instagram's Terms of Use](https://help.instagram.com/581066165581870). The extension relies on Instagram's private API, which may change without notice.
