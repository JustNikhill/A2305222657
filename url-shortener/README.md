🔗 URL Shortener
A modern, user-friendly React-based web application to shorten long URLs, track usage stats, and manage custom expiration times — all built with Vite and Material UI.

✨ Features
Shorten Multiple URLs – Add up to 5 URLs at once

Custom Expiration Times – Set expiry from 15 minutes to 1 month

Custom Shortcodes – Create your own shortcodes or let the app auto-generate them

Click Tracking – Tracks click timestamps, sources, and (mock) geo-location

Analytics Dashboard – See detailed stats for every shortened link

Instant Redirection – Short URLs redirect instantly to the original

Responsive Design – Clean UI optimized for all screen sizes

🛠 Tech Stack
Frontend: React 19, Vite

UI: Material UI (MUI)

Routing: React Router DOM

Storage: Browser localStorage

Middleware: Custom Logging

🚀 Getting Started
Prerequisites
Node.js v16+

npm or yarn

Installation
bash
Copy
Edit
git clone https://github.com/JustNikhill/A2305222657.git
cd url-shortener
npm install
Running the App
bash
Copy
Edit
npm run dev
Open your browser and go to: http://localhost:3000

🧪 How It Works
🔨 Shorten URLs
Go to the Home page

Enter up to 5 long URLs

(Optional) Set custom validity periods (default is 30 minutes)

(Optional) Provide custom shortcodes

Click “Shorten URLs” to generate your links

📊 View Statistics
Navigate to the Statistics page to see:

Original + shortened URLs

Expiry times, status, and click count

Click details: timestamps, sources, and fake geo-locations

🔁 Redirect Logic
Shortened URLs look like:

arduino
Copy
Edit
http://localhost:3000/{shortcode}
When someone visits a short URL:

They’re instantly redirected to the original link

A click record is logged with timestamp, source info, and (mocked) geo-data

📁 Project Structure
bash
Copy
Edit
src/
├── components/          # Reusable UI pieces
│   ├── UrlForm.jsx      # Form for entering URLs
│   └── RedirectHandler.jsx # Handles redirects
├── pages/               # App pages
│   ├── HomePage.jsx     # Main page for shortening
│   └── StatisticsPage.jsx # Analytics dashboard
├── routes/
│   └── AppRouter.jsx    # React Router config
├── utils/
│   ├── helpers.js       # Validation, formatting, etc.
│   ├── logger.js        # Console logging middleware
│   └── storage.js       # LocalStorage utilities
├── App.jsx              # Main app wrapper
└── main.jsx             # Entry point
🔍 Features Explained
✅ URL Validation
Ensures proper format (must start with http:// or https://)

Validates custom shortcodes (alphanumeric, no duplicates)

Ensures valid expiry inputs

📈 Click Tracking
Logs each click with:

Timestamp

Referrer URL

Simulated geo-location (India, USA, UK, etc.)

Browser/user-agent info

💾 Persistent Storage
Everything is saved in localStorage

Data persists across page reloads

Option to clear all saved data via the stats page

🧩 Custom Logging
Developer-friendly logs in the console

Tracks:

URL creation

Redirections

Errors and validations

🧪 Available Scripts
bash
Copy
Edit
npm run dev      # Start development server
npm run build    # Build production-ready version
npm run preview  # Preview production build
npm run lint     # Run ESLint checks
🌍 Browser Support
Chrome ✅

Firefox ✅

Safari ✅

Edge ✅

🤝 Contributing
Fork this repo

Create a new branch for your feature

Make and test your changes

Submit a pull request

📄 License
Released under the MIT License.
