require("dotenv").config();
const readline = require("readline");
const fs = require("fs");

const client_id = process.env.CLIENT_ID || "";
const client_secret = process.env.CLIENT_SECRET || "";
const redirectUri =
  process.env.REDIRECT_URI || "http://localhost:8888/callback";

const tokenUrl = "https://accounts.spotify.com/api/token";
const tracksUrl = "https://api.spotify.com/v1/me/tracks";
const scopes = "user-library-read";

function getAuthUrl() {
  const params = new URLSearchParams({
    client_id,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
  });
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

async function getUserAccessToken(authCode) {
  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          client_id + ":" + client_secret
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: redirectUri,
      }),
    });
    const data = await response.json();
    return data.access_token;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function fetchAllTracksAndWriteToFile(accessToken) {
  let nextUrl = tracksUrl;
  let allLines = [];

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (!data.items) break;
    for (const item of data.items) {
      const track = item.track || item;
      const artist =
        track.artists && track.artists.length > 0
          ? track.artists[0].name
          : "Unknown Artist";
      const songName = track.name || "Unknown Song";
      allLines.push(`${artist} - ${songName}`);
    }
    nextUrl = data.next;
  }

  fs.writeFileSync(
    "liked-spotify.json",
    JSON.stringify(allLines, null, 2),
    "utf8"
  );
  console.log("Tracks written locally");
}

async function main() {
  console.log("Go to this URL and authorize the app:");
  console.log(getAuthUrl());

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "Paste the CODE from the redirect URL here: ",
    async (authCode) => {
      rl.close();
      const accessToken = await getUserAccessToken(authCode.trim());
      if (!accessToken) {
        console.error("Failed to get user access token");
        return;
      }
      await fetchAllTracksAndWriteToFile(accessToken);
    }
  );
}

main();
