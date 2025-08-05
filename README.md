# URL Shortener

A modern React-based URL shortening web application built with Vite and Material UI.

## Features

- **Multi-URL Shortening**: Shorten up to 5 URLs at once
- **Custom Validity Periods**: Set expiration times from 15 minutes to 1 month
- **Custom Shortcodes**: Option to create custom alphanumeric shortcodes
- **Click Tracking**: Monitor redirects with timestamp, source, and geo-location data
- **Statistics Dashboard**: View detailed analytics for all shortened URLs
- **Automatic Redirection**: Seamless redirect handling for shortened URLs
- **Responsive Design**: Modern UI built with Material UI components

## Tech Stack

- **Frontend**: React 19, Vite
- **UI Framework**: Material UI (MUI)
- **Routing**: React Router DOM
- **Storage**: LocalStorage
- **Logging**: Custom logging middleware

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd url-shortener
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Creating Short URLs

1. Navigate to the Home page
2. Enter up to 5 long URLs
3. Optionally set custom validity periods (default: 30 minutes)
4. Optionally provide custom shortcodes (auto-generated if not provided)
5. Click "Shorten URLs" to generate shortened links

### Viewing Statistics

1. Navigate to the Statistics page
2. View all created URLs with their:
   - Original and shortened URLs
   - Expiry times and status
   - Click counts and detailed analytics
   - Source information and geo-location data

### URL Redirection

- Shortened URLs follow the format: `http://localhost:3000/{shortcode}`
- Clicking a shortened URL automatically redirects to the original URL
- Each redirect is tracked with timestamp, source, and location data

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── UrlForm.jsx     # URL input form component
│   └── RedirectHandler.jsx # URL redirection handler
├── pages/              # Page components
│   ├── HomePage.jsx    # Main URL shortening page
│   └── StatisticsPage.jsx # Statistics dashboard
├── routes/             # Routing configuration
│   └── AppRouter.jsx   # Main router setup
├── utils/              # Utility functions
│   ├── helpers.js      # Helper functions (validation, formatting)
│   ├── logger.js       # Custom logging middleware
│   └── storage.js      # LocalStorage management
├── App.jsx             # Main app component
└── main.jsx           # Application entry point
```

## Features in Detail

### URL Validation
- Validates URL format (http/https)
- Ensures custom shortcodes are alphanumeric and unique
- Validates validity periods (positive integers)

### Click Tracking
- Records timestamp of each redirect
- Captures referer information
- Generates fake geo-location data (India, USA, UK, etc.)
- Stores user agent information

### Data Persistence
- All data stored in browser's localStorage
- Automatic data persistence across sessions
- Option to clear all data from statistics page

### Custom Logging
- Comprehensive logging of all key actions
- Tracks URL creation, redirection, and validation errors
- Development-friendly console output

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint



## License

This project is open source and available under the [MIT License](LICENSE). 
