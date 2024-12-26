/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          dark: '#128C7E',  // Dark green
          light: '#DCF8C6', // Light green for chat bubbles
          hover: '#1EBE56', // Hover state for buttons
        },
        gray: {
          light: '#F0F0F0', // Light gray for backgrounds
          medium: '#D3D3D3', // Medium gray for borders
          dark: '#A9A9A9',   // Dark gray for text
        },
        white: '#FFFFFF', // White for default text or backgrounds
        error: '#FF4C4C', // Error red for alerts
        success: '#28A745', // Success green for notifications
        info: '#17A2B8', // Info blue for messages
      },
    },
  },
  plugins: [],
}
