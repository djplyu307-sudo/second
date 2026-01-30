# Pomodoro & Lo-fi Timer

## Overview

A web-based Pomodoro timer with integrated YouTube music, designed to enhance focus and productivity. The application features a dynamic background that changes every minute and a daily motivational quote.

## Key Features

*   **Pomodoro Timer:**
    *   Switchable modes: Pomodoro (25 min), Short Break (5 min), Long Break (15 min).
    *   Functional controls: Start, Pause, and Reset.
    *   Audio and visual alerts for session completion.
*   **Background Music Player:**
    *   Plays a continuous music mix from a selected YouTube video.
    *   Controls for Play, Pause, and Volume managed via the YouTube Iframe API.
*   **Quote of the Day Card:**
    *   Fetches a new random quote from an external API on page load.
    *   Includes the author's name.
    *   Social media sharing via Web Share API (with clipboard fallback).
*   **Dynamic Visuals:**
    *   The background image automatically updates every 60 seconds, pulling from a high-quality image source (Unsplash).
*   **Design & UX:**
    *   Modern, calming, and visually appealing interface with a "glassmorphism" card design.
    *   Layout optimized to minimize scrolling and fit on a single screen.
    *   Fully responsive for both mobile and desktop viewing.

## Plan (New Implementation)

*   **Remove Monetization:** The premium features banner will be removed from the HTML and CSS.
*   **Implement Dynamic Background:** A JavaScript function will be created to fetch a new random image from Unsplash and set it as the body background. This function will be triggered by a `setInterval` every minute.
*   **Integrate YouTube Player:**
    *   The existing `<audio>` element will be replaced with a `<div>` for the YouTube player.
    *   The YouTube Iframe API will be loaded and used to control a long-form music video for continuous playback.
    *   The music control buttons (Play, Pause, Volume) will be re-wired to the new YouTube player instance.
*   **Optimize Layout:** CSS will be adjusted to ensure all primary content fits on the screen without requiring scrolling, improving the user experience.
*   **Final Review:** All buttons and features will be tested to ensure they are fully functional and operate as expected.
