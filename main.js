/**
 * @file Main JavaScript file for the Pomodoro & Lo-fi Timer application.
 * @author Gemini
 */

// --- DOM Elements ---
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const modeBtns = document.querySelectorAll('.mode-btn');

const playMusicBtn = document.getElementById('play-music');
const pauseMusicBtn = document.getElementById('pause-music');
const volumeSlider = document.getElementById('volume-slider');

const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const shareBtn = document.getElementById('share');

const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeBtn = document.querySelector('.close-btn');
const saveSettingsBtn = document.getElementById('save-settings');
const pomodoroDurationInput = document.getElementById('pomodoro-duration');
const shortBreakDurationInput = document.getElementById('short-break-duration');
const longBreakDurationInput = document.getElementById('long-break-duration');


// --- Timer State ---
let timer;
let isRunning = false;
let seconds;
let currentMode = 'pomodoro';
const modes = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
};

// --- YouTube Player State ---
let player;
const videoID = 'k3_52SBC66o'; // YouTube Video ID from @resound_37

// --- Function Definitions ---

/**
 * Loads the YouTube Iframe Player API asynchronously.
 * This function is called automatically by the YouTube script tag.
 */
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoID,
        playerVars: {
            'playsinline': 1,
            'autoplay': 0, // Must be 0 for browsers to allow playback
            'controls': 0,
            'disablekb': 1,
            'loop': 1,
            'playlist': videoID, // Required for loop to work
            'modestbranding': 1
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

/**
 * Handles the YouTube player's state changes to toggle play/pause buttons.
 * @param {object} event - The event object from the YouTube API.
 */
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        playMusicBtn.style.display = 'none';
        pauseMusicBtn.style.display = 'block';
    } else {
        playMusicBtn.style.display = 'block';
        pauseMusicBtn.style.display = 'none';
    }
}

/**
 * Fetches a random quote from the Quotable API and updates the UI.
 */
async function fetchQuote() {
    try {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();
        quoteText.textContent = `"${data.content}"`;
        quoteAuthor.textContent = `- ${data.author}`;
    } catch (error) {
        console.error("Error fetching quote:", error);
        quoteText.textContent = '"The secret of getting ahead is getting started.'';
        quoteAuthor.textContent = '- Mark Twain';
    }
}

/**
 * Fetches a new random background image from Unsplash and updates the body background.
 */
function updateBackground() {
    const imageUrl = 'https://source.unsplash.com/random/1920x1080/?nature,landscape,abstract';
    // Use a temporary image to preload before setting as background
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
        document.body.style.backgroundImage = `url(${imageUrl})`;
    };
}

/**
 * Switches the timer to a new mode (pomodoro, shortBreak, longBreak).
 * @param {string} mode - The timer mode to switch to.
 */
function switchMode(mode) {
    currentMode = mode;
    resetTimer();

    modeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
}

/**
 * Updates the timer display with the current time.
 */
function updateTime() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Starts the timer interval.
 */
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        timer = setInterval(() => {
            seconds--;
            updateTime();
            document.title = `${timeDisplay.textContent} - Pomodoro`;
            if (seconds <= 0) {
                clearInterval(timer);
                isRunning = false;
                alert("Time's up!");
                if (currentMode === 'pomodoro') {
                    switchMode('shortBreak');
                } else {
                    switchMode('pomodoro');
                }
            }
        }, 1000);
    }
}

/**
 * Pauses the timer interval.
 */
function pauseTimer() {
    isRunning = false;
    startBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
    clearInterval(timer);
    document.title = "Pomodoro & Lo-fi Timer";
}

/**
 * Resets the timer to the current mode's starting time.
 */
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
    seconds = modes[currentMode];
    updateTime();
    document.title = "Pomodoro & Lo-fi Timer";
}

/**
 * Handles sharing the current quote using the Web Share API or copying to clipboard.
 */
async function shareQuote() {
    const textToShare = `${quoteText.textContent} ${quoteAuthor.textContent}`;
    if (navigator.share) {
        try {
            await navigator.share({ title: 'Quote of the Day', text: textToShare });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        try {
            await navigator.clipboard.writeText(textToShare);
            alert('Quote copied to clipboard!');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    }
}

// --- Event Listeners ---
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
modeBtns.forEach(btn => btn.addEventListener('click', (e) => switchMode(e.target.dataset.mode)));

playMusicBtn.addEventListener('click', () => player.playVideo());
pauseMusicBtn.addEventListener('click', () => player.pauseVideo());
volumeSlider.addEventListener('input', (e) => player.setVolume(e.target.value));
shareBtn.addEventListener('click', shareQuote);

settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == settingsModal) {
        settingsModal.style.display = 'none';
    }
});

saveSettingsBtn.addEventListener('click', () => {
    const newPomodoro = parseInt(pomodoroDurationInput.value, 10);
    const newShortBreak = parseInt(shortBreakDurationInput.value, 10);
    const newLongBreak = parseInt(longBreakDurationInput.value, 10);

    if (newPomodoro > 0 && newShortBreak > 0 && newLongBreak > 0) {
        modes.pomodoro = newPomodoro * 60;
        modes.shortBreak = newShortBreak * 60;
        modes.longBreak = newLongBreak * 60;
        
        settingsModal.style.display = 'none';
        
        // if the current mode is one of the ones that changed, reset the timer
        if (currentMode === 'pomodoro' || currentMode === 'shortBreak' || currentMode === 'longBreak') {
            switchMode(currentMode);
        }
    } else {
        alert("Please enter valid durations (greater than 0).");
    }
});

/**
 * Initializes the application.
 */
function init() {
    pomodoroDurationInput.value = modes.pomodoro / 60;
    shortBreakDurationInput.value = modes.shortBreak / 60;
    longBreakDurationInput.value = modes.longBreak / 60;

    switchMode('pomodoro');
    fetchQuote();
    updateBackground();
    setInterval(updateBackground, 60000); // Change background every minute
}

// Run the app
init();
