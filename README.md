# Localify - Spotify Liked Songs Downloader

This tool allows you to export your **Spotify liked songs** into YouTube links and download them in MP3 format.\
It automates the entire process in three stages:

1. **Fetch liked tracks from Spotify**
2. **Find corresponding YouTube links**
3. \*\*Download MP3 files with \*\*\`\`

> **Note**: Tested only on **macOS 15.6**.

---

## Requirements

Before running the app, you’ll need:

- [**yt-dlp**](https://github.com/yt-dlp/yt-dlp)\
  Follow the instructions in the official GitHub repo to install.

- **ffmpeg**\
  Required for audio extraction and format conversion. You can install it on macOS using:

  ```bash
  brew install ffmpeg
  ```

- **Node.js** 22.x

---

## Spotify Setup

1. Open the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. **Create a new app**.
3. In your new app:
   - Enable **Web API** access.
   - Copy your **Client ID** and **Client Secret** — you'll need these later.
4. Visit [webhook.site](https://webhook.site) and copy the **unique URL** shown.
5. In your Spotify Developer Dashboard app settings:
   - Add the webhook.site URL to **Redirect URIs**.

---

## Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set environment variables**:

   - Copy `.env.example` to `.env`.
   - Fill in the values:
     ```
     CLIENT_ID=<your Spotify Client ID>
     CLIENT_SECRET=<your Spotify Client Secret>
     REDIRECT_URI=<your webhook.site URL>
     ```

   This ensures your app can authenticate with Spotify.

---

## Commands

There are three main commands you can run:

### 1. Fetch liked tracks from Spotify

```bash
npm run tracks:get-liked
```

- Retrieves **all** your liked tracks from Spotify.
- The script will handle large libraries but this step is usually fast compared to downloading.

### 2. Get YouTube URLs for each track

```bash
npm run tracks:get-urls
```

- Runs [Cypress](https://www.cypress.io/) in E2E mode to search for each Spotify track on YouTube.
- Stores the found YouTube links for later downloading.

### 3. Download MP3 files

```bash
npm run tracks:download
```

- Uses `yt-dlp` to download each collected YouTube link.
- **Timeouts between requests are added here** to avoid hitting YouTube's `429 Too Many Requests` rate limit.
- Saves MP3 files into the `downloaded/` folder.
- You can tweak `yt-dlp` behavior by editing `run-yt-dlp.bash`.

---

## Tips for Best Results

- **Avoid interruptions**: Large Spotify libraries can take hours to process.
- **Customize downloads**:\
  In `run-yt-dlp.bash`, you can:
  - Change audio quality.
  - Select output format (default is MP3).
  - Add `--embed-metadata` for cleaner tagging.
- **Stay within YouTube's fair use**: Download music for personal use only.

