import fs from "node:fs";
import path from "node:path";

const rawUrl = process.env.RAPIDLEARN_URL?.trim();

if (!rawUrl) {
  console.error("Missing RAPIDLEARN_URL. Add it under GitHub Settings > Secrets and variables > Actions > Variables.");
  process.exit(1);
}

let siteUrl;
try {
  siteUrl = new URL(rawUrl);
} catch {
  console.error("RAPIDLEARN_URL must be a valid public HTTPS URL.");
  process.exit(1);
}

if (siteUrl.protocol !== "https:") {
  console.error("RAPIDLEARN_URL must use HTTPS.");
  process.exit(1);
}

siteUrl.hash = "";
siteUrl.search = "";

const wrapperDir = path.resolve("android-wrapper");
const wwwDir = path.join(wrapperDir, "www");
fs.mkdirSync(wwwDir, { recursive: true });

const packageJson = {
  name: "rapidlearn-android-wrapper",
  version: "1.0.0",
  private: true,
  description: "Capacitor Android wrapper for RapidLearn"
};

const capacitorConfig = {
  appId: process.env.ANDROID_APP_ID?.trim() || "com.rapidlearn.app",
  appName: "RapidLearn",
  webDir: "www",
  server: {
    url: siteUrl.toString().replace(/\/$/, ""),
    cleartext: false,
    androidScheme: "https"
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "DARK",
      backgroundColor: "#090b13"
    }
  }
};

const fallbackPage = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#090b13">
  <title>RapidLearn</title>
  <style>
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#090b13;color:#f4f4f5;font:16px system-ui,sans-serif;text-align:center}
    main{max-width:360px}h1{margin:0 0 12px;color:#d7a0aa}p{color:#a1a1aa;line-height:1.6}a{display:inline-block;margin-top:12px;padding:12px 20px;border-radius:12px;background:#8f243d;color:white;text-decoration:none;font-weight:600}
  </style>
</head>
<body><main><h1>RapidLearn</h1><p>Connect to the internet to open RapidLearn. Your lessons and live discovery features are available from the online app.</p><a href="${capacitorConfig.server.url}">Open RapidLearn</a></main></body>
</html>`;

fs.writeFileSync(path.join(wrapperDir, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
fs.writeFileSync(path.join(wrapperDir, "capacitor.config.json"), `${JSON.stringify(capacitorConfig, null, 2)}\n`);
fs.writeFileSync(path.join(wwwDir, "index.html"), fallbackPage);

console.log(`Created Capacitor wrapper for ${capacitorConfig.server.url}`);
console.log(`Android application ID: ${capacitorConfig.appId}`);
