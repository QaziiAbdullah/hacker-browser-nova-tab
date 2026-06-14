(() => {
  // ── Constants ───────────────────────────────────────
  const DEF_SETTINGS = {
    name: '', heading: 'SPIDER BROWSER',
    clockFormat: '12', searchEngine: 'google',
    tempUnit: 'C', theme: 'aurora', seconds: false,
    robotSkin: 'hacker', bgOpacity: 1,
  };
  const DEF_LINKS = [
    { icon: '🔍', name: 'Google',     url: 'https://www.google.com' },
    { icon: '🦆', name: 'DuckDuckGo', url: 'https://duckduckgo.com' },
    { icon: '🔵', name: 'Edge',       url: 'https://www.microsoft.com/en-us/edge' },
    { icon: '🦊', name: 'Firefox',    url: 'https://www.mozilla.org/firefox' },
    { icon: '🧅', name: 'Tor',        url: 'https://www.torproject.org' },
    { icon: '📧', name: 'Gmail',      url: 'https://mail.google.com' },
    { icon: '🐙', name: 'GitHub',     url: 'https://github.com' },
  ];
  const QUOTES = [
    { t: '"The secret of getting ahead is getting started."', a: 'Mark Twain' },
    { t: '"It does not matter how slowly you go as long as you do not stop."', a: 'Confucius' },
    { t: '"In the middle of every difficulty lies opportunity."', a: 'Albert Einstein' },
    { t: '"The future belongs to those who believe in the beauty of their dreams."', a: 'Eleanor Roosevelt' },
    { t: '"Success is not final; failure is not fatal: it is the courage to continue that counts."', a: 'Winston Churchill' },
    { t: '"Believe you can and you\'re halfway there."', a: 'Theodore Roosevelt' },
    { t: '"Your time is limited, so don\'t waste it living someone else\'s life."', a: 'Steve Jobs' },
    { t: '"The only way to do great work is to love what you do."', a: 'Steve Jobs' },
    { t: '"The mind is everything. What you think you become."', a: 'Buddha' },
    { t: '"Spread love everywhere you go."', a: 'Mother Teresa' },
    { t: '"You miss 100% of the shots you don\'t take."', a: 'Wayne Gretzky' },
    { t: '"Whether you think you can or you think you can\'t, you\'re right."', a: 'Henry Ford' },
    { t: '"It always seems impossible until it\'s done."', a: 'Nelson Mandela' },
    { t: '"The journey of a thousand miles begins with one step."', a: 'Lao Tzu' },
    { t: '"Life is what happens when you\'re busy making other plans."', a: 'John Lennon' },
    { t: '"An unexamined life is not worth living."', a: 'Socrates' },
    { t: '"Get busy living or get busy dying."', a: 'Stephen King' },
    { t: '"In order to be irreplaceable, one must always be different."', a: 'Coco Chanel' },
  ];
  const WMO = {
    0:  ['☀️','Clear sky'],        1: ['🌤️','Mainly clear'],
    2:  ['⛅','Partly cloudy'],    3: ['☁️','Overcast'],
    45: ['🌫️','Foggy'],           48: ['🌫️','Icy fog'],
    51: ['🌦️','Light drizzle'],   53: ['🌦️','Drizzle'],    55: ['🌧️','Heavy drizzle'],
    61: ['🌧️','Slight rain'],     63: ['🌧️','Rain'],        65: ['🌧️','Heavy rain'],
    71: ['❄️','Slight snow'],     73: ['❄️','Snow'],         75: ['❄️','Heavy snow'],
    77: ['🌨️','Snow grains'],
    80: ['🌦️','Rain showers'],    81: ['🌧️','Showers'],     82: ['⛈️','Violent showers'],
    85: ['🌨️','Snow showers'],    86: ['🌨️','Heavy snow showers'],
    95: ['⛈️','Thunderstorm'],    96: ['⛈️','Thunderstorm+hail'], 99: ['⛈️','Heavy thunderstorm'],
  };

  // Google Apps grid data
  const GOOGLE_APPS = [
    { name: 'Search',    icon: '🔍', bg: '#4285F4', url: 'https://www.google.com' },
    { name: 'Gmail',     icon: '✉️',  bg: '#EA4335', url: 'https://mail.google.com' },
    { name: 'Maps',      icon: '🗺️',  bg: '#34A853', url: 'https://maps.google.com' },
    { name: 'YouTube',   icon: '▶️',  bg: '#FF0000', url: 'https://youtube.com' },
    { name: 'Drive',     icon: '💾',  bg: '#0F9D58', url: 'https://drive.google.com' },
    { name: 'Calendar',  icon: '📅',  bg: '#1976D2', url: 'https://calendar.google.com' },
    { name: 'Translate', icon: '🌐',  bg: '#00BCD4', url: 'https://translate.google.com' },
    { name: 'Photos',    icon: '📸',  bg: '#9C27B0', url: 'https://photos.google.com' },
    { name: 'Meet',      icon: '📹',  bg: '#00897B', url: 'https://meet.google.com' },
    { name: 'Docs',      icon: '📄',  bg: '#1565C0', url: 'https://docs.google.com' },
    { name: 'Sheets',    icon: '📊',  bg: '#2E7D32', url: 'https://sheets.google.com' },
    { name: 'News',      icon: '📰',  bg: '#F4511E', url: 'https://news.google.com' },
  ];

  // Search engines + browser shortcuts
  const ENGINE_OPTIONS = [
    { key: 'google',     name: 'Google',     icon: '🔍', search: q => `https://www.google.com/search?q=${encodeURIComponent(q)}` },
    { key: 'duckduckgo', name: 'DuckDuckGo', icon: '🦆', search: q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}` },
    { key: 'bing',       name: 'Bing',       icon: '🔵', search: q => `https://www.bing.com/search?q=${encodeURIComponent(q)}` },
    { key: 'brave',      name: 'Brave',      icon: '🦁', search: q => `https://search.brave.com/search?q=${encodeURIComponent(q)}` },
    { key: 'firefox',    name: 'Firefox',    icon: '🦊', search: q => `https://www.google.com/search?q=${encodeURIComponent(q)}` },
    { key: 'opera',      name: 'Opera',      icon: '🔴', search: q => `https://www.google.com/search?q=${encodeURIComponent(q)}` },
    { key: 'perplexity', name: 'Perplexity', icon: '✨', search: q => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}` },
    { key: 'chatgpt',    name: 'ChatGPT',    icon: '🤖', search: q => `https://chatgpt.com/?q=${encodeURIComponent(q)}` },
    { key: 'tor',        name: 'Tor Anon',   icon: '🧅', search: q => `https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion.ly/?q=${encodeURIComponent(q)}`, anon: true },
    { key: 'yandex',     name: 'Yandex',     icon: '🔶', search: q => `https://yandex.com/search/?text=${encodeURIComponent(q)}` },
  ];

  // Hacker typewriter phrases
  const MOTIVATIONAL_PHRASES = [
    'YOUR POTENTIAL IS LIMITLESS — START NOW',
    'CODE YOUR DREAMS. SHIP YOUR DESTINY.',
    'EVERY EXPERT WAS ONCE A BEGINNER',
    'DISCIPLINE IS THE BRIDGE BETWEEN GOALS AND ACHIEVEMENT',
    'THE BEST TIME TO START WAS YESTERDAY. THE NEXT BEST IS NOW.',
    'GREAT THINGS NEVER CAME FROM COMFORT ZONES',
    'PUSH HARDER THAN YESTERDAY IF YOU WANT A DIFFERENT TOMORROW',
    'YOUR ONLY LIMIT IS YOUR MIND',
    'FOCUS. EXECUTE. DOMINATE.',
    'SUCCESS IS THE SUM OF SMALL EFFORTS REPEATED DAILY',
    'BUILD SOMETHING THE WORLD HAS NEVER SEEN',
    'STOP WAITING FOR PERFECT — SHIP IT',
    'YOU ARE ONE DECISION AWAY FROM A COMPLETELY DIFFERENT LIFE',
    'DREAM BIG. WORK HARD. STAY HUMBLE.',
    'THE HARDER YOU WORK, THE LUCKIER YOU GET',
    'DON\'T STOP WHEN YOU\'RE TIRED — STOP WHEN YOU\'RE DONE',
    'TURN YOUR OBSTACLES INTO OPPORTUNITIES',
    'MAKE TODAY SO AWESOME THAT YESTERDAY IS JEALOUS',
    'ONE DAY OR DAY ONE — YOU DECIDE',
    'INNOVATE. ITERATE. DOMINATE.',
  ];

  const HACKER_PHRASES = [
    'INITIALIZING SECURE SHELL...',
    'SCANNING NETWORK PERIMETER...',
    'ENCRYPTING DATA STREAM AES-256...',
    'ACCESSING MAINFRAME DATABASE...',
    'BYPASSING FIREWALL PROTOCOLS...',
    'ESTABLISHING ENCRYPTED VPN TUNNEL...',
    'DECRYPTING CIPHER TEXT [RSA-4096]...',
    'RUNNING SYSTEM DIAGNOSTICS... OK',
    'MONITORING NETWORK TRAFFIC ANOMALIES...',
    'COMPILING KERNEL MODULE v5.15.0...',
    'TRACING ROUTE TO TARGET SERVER...',
    'DECODING BINARY SEQUENCE 01100011...',
    'AUTHENTICATION SUCCESSFUL ✓',
    'UPLOADING TO SECURE CLOUD SERVER...',
    'SYSTEM STATUS: ALL SYSTEMS NOMINAL',
    'LAUNCHING EXPLOIT FRAMEWORK...',
    'PRIVILEGE ESCALATION COMPLETE...',
    'WIPING FORENSIC TRACES...',
    'EXFILTRATING ENCRYPTED PAYLOAD...',
    'CONNECTION SECURED — STAY ANONYMOUS',
  ];

  // Robot SVG skins
  const ROBOTS = {
    hacker: {
      name: 'Hacker', color: '#00ff88', dot: '#00ff88',
      svg: `<svg class="robot-svg" viewBox="0 0 80 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="40" y1="6" x2="40" y2="16" stroke="#00ff88" stroke-width="2.5" stroke-linecap="round"/>
        <circle class="r-ant" cx="40" cy="5" r="5" fill="#00ff88"/>
        <rect x="6" y="16" width="68" height="48" rx="12" stroke="#00ff88" stroke-width="2" fill="rgba(0,255,136,0.04)"/>
        <rect x="13" y="24" width="24" height="22" rx="5" fill="rgba(0,0,0,0.45)" stroke="#00ff88" stroke-width="1.5"/>
        <rect x="43" y="24" width="24" height="22" rx="5" fill="rgba(0,0,0,0.45)" stroke="#00ff88" stroke-width="1.5"/>
        <g class="r-eye r-el"><rect x="17" y="28" width="16" height="14" rx="4" fill="#00ff88"/><rect class="r-pl" x="22" y="32" width="5" height="5" rx="1.5" fill="#001a0d"/></g>
        <g class="r-eye r-er"><rect x="47" y="28" width="16" height="14" rx="4" fill="#00ff88"/><rect class="r-pr" x="52" y="32" width="5" height="5" rx="1.5" fill="#001a0d"/></g>
        <rect x="15" y="52" width="50" height="8" rx="3" fill="rgba(0,255,136,0.08)" stroke="#00ff88" stroke-width="1.5"/>
        <rect x="18" y="54" width="8" height="4" rx="1.5" fill="#00ff88"/>
        <rect x="29" y="54" width="8" height="4" rx="1.5" fill="#00ff88" opacity="0.4"/>
        <rect x="40" y="54" width="8" height="4" rx="1.5" fill="#00ff88"/>
        <rect x="51" y="54" width="8" height="4" rx="1.5" fill="#00ff88" opacity="0.7"/>
        <circle cx="6" cy="33" r="4" fill="rgba(0,255,136,0.28)" stroke="#00ff88" stroke-width="1.5"/>
        <circle cx="74" cy="33" r="4" fill="rgba(0,255,136,0.28)" stroke="#00ff88" stroke-width="1.5"/>
        <circle cx="6" cy="50" r="4" fill="rgba(0,255,136,0.28)" stroke="#00ff88" stroke-width="1.5"/>
        <circle cx="74" cy="50" r="4" fill="rgba(0,255,136,0.28)" stroke="#00ff88" stroke-width="1.5"/>
      </svg>`,
    },
    terminator: {
      name: 'Terminator', color: '#ff3300', dot: '#ff3300',
      svg: `<svg class="robot-svg" viewBox="0 0 80 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="40" y1="2" x2="40" y2="14" stroke="#ff3300" stroke-width="2" stroke-linecap="round"/>
        <line x1="30" y1="9" x2="40" y2="2" stroke="#ff3300" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="50" y1="9" x2="40" y2="2" stroke="#ff3300" stroke-width="1.5" stroke-linecap="round"/>
        <circle class="r-ant" cx="40" cy="2" r="3" fill="#ff3300"/>
        <rect x="4" y="14" width="72" height="50" rx="4" stroke="#ff3300" stroke-width="2" fill="rgba(255,51,0,0.05)"/>
        <line x1="4" y1="26" x2="76" y2="26" stroke="#ff3300" stroke-width="1" opacity="0.35"/>
        <rect x="10" y="20" width="26" height="16" rx="2" fill="rgba(0,0,0,0.55)" stroke="#ff3300" stroke-width="1.5"/>
        <rect x="44" y="20" width="26" height="16" rx="2" fill="rgba(0,0,0,0.55)" stroke="#ff3300" stroke-width="1.5"/>
        <g class="r-eye r-el"><rect x="14" y="24" width="18" height="8" rx="1" fill="#ff3300"/><rect class="r-pl" x="19" y="26" width="7" height="4" rx="0.5" fill="#400000"/></g>
        <g class="r-eye r-er"><rect x="48" y="24" width="18" height="8" rx="1" fill="#ff3300"/><rect class="r-pr" x="53" y="26" width="7" height="4" rx="0.5" fill="#400000"/></g>
        <rect x="36" y="40" width="8" height="5" rx="1" fill="#ff3300" opacity="0.45"/>
        <rect x="10" y="46" width="60" height="13" rx="3" fill="rgba(255,51,0,0.08)" stroke="#ff3300" stroke-width="1.5"/>
        <line x1="10" y1="50" x2="70" y2="50" stroke="#ff3300" stroke-width="0.7" opacity="0.4"/>
        <line x1="10" y1="54" x2="70" y2="54" stroke="#ff3300" stroke-width="0.7" opacity="0.4"/>
        <rect x="14" y="47.5" width="5" height="4" rx="0.5" fill="#ff3300" opacity="0.8"/>
        <rect x="23" y="47.5" width="5" height="4" rx="0.5" fill="#ff3300"/>
        <rect x="32" y="47.5" width="5" height="4" rx="0.5" fill="#ff3300" opacity="0.55"/>
        <rect x="41" y="47.5" width="5" height="4" rx="0.5" fill="#ff3300"/>
        <rect x="50" y="47.5" width="5" height="4" rx="0.5" fill="#ff3300" opacity="0.8"/>
        <rect x="0" y="28" width="7" height="18" rx="2" fill="rgba(255,51,0,0.1)" stroke="#ff3300" stroke-width="1.2"/>
        <rect x="73" y="28" width="7" height="18" rx="2" fill="rgba(255,51,0,0.1)" stroke="#ff3300" stroke-width="1.2"/>
      </svg>`,
    },
    nexus: {
      name: 'Nexus', color: '#00ccff', dot: '#00ccff',
      svg: `<svg class="robot-svg" viewBox="0 0 80 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="40" y1="4" x2="40" y2="14" stroke="#00ccff" stroke-width="2" stroke-linecap="round"/>
        <ellipse class="r-ant" cx="40" cy="3" rx="6" ry="4" fill="#00ccff"/>
        <rect x="8" y="14" width="64" height="50" rx="24" stroke="#00ccff" stroke-width="2" fill="rgba(0,204,255,0.05)"/>
        <rect x="12" y="23" width="56" height="20" rx="10" fill="rgba(0,0,0,0.5)" stroke="#00ccff" stroke-width="1.5"/>
        <g class="r-eye r-el"><circle cx="28" cy="33" r="8" fill="#00ccff"/><circle class="r-pl" cx="30" cy="34" r="3" fill="#002030"/></g>
        <g class="r-eye r-er"><circle cx="52" cy="33" r="8" fill="#00ccff"/><circle class="r-pr" cx="54" cy="34" r="3" fill="#002030"/></g>
        <path d="M22 52 Q40 64 58 52" stroke="#00ccff" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <circle cx="40" cy="52" r="2" fill="#00ccff" opacity="0.5"/>
        <circle cx="18" cy="45" r="4.5" fill="#00ccff" opacity="0.3" stroke="#00ccff" stroke-width="1"/>
        <circle cx="62" cy="45" r="4.5" fill="#00ccff" opacity="0.3" stroke="#00ccff" stroke-width="1"/>
      </svg>`,
    },
    phantom: {
      name: 'Phantom', color: '#bb00ff', dot: '#bb00ff',
      svg: `<svg class="robot-svg" viewBox="0 0 80 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="26" y1="6" x2="26" y2="16" stroke="#bb00ff" stroke-width="2" stroke-linecap="round"/>
        <circle class="r-ant" cx="26" cy="5" r="4.5" fill="#bb00ff"/>
        <line x1="54" y1="6" x2="54" y2="16" stroke="#bb00ff" stroke-width="2" stroke-linecap="round"/>
        <circle cx="54" cy="5" r="4.5" fill="#bb00ff" opacity="0.55"/>
        <rect x="10" y="16" width="60" height="50" rx="8" stroke="#bb00ff" stroke-width="2" fill="rgba(187,0,255,0.04)"/>
        <rect x="15" y="25" width="20" height="11" rx="5.5" fill="rgba(0,0,0,0.5)" stroke="#bb00ff" stroke-width="1.5"/>
        <rect x="45" y="25" width="20" height="11" rx="5.5" fill="rgba(0,0,0,0.5)" stroke="#bb00ff" stroke-width="1.5"/>
        <g class="r-eye r-el"><rect x="19" y="28" width="12" height="5" rx="2.5" fill="#bb00ff"/><rect class="r-pl" x="21.5" y="29" width="5" height="3" rx="1.5" fill="#180026"/></g>
        <g class="r-eye r-er"><rect x="49" y="28" width="12" height="5" rx="2.5" fill="#bb00ff"/><rect class="r-pr" x="51.5" y="29" width="5" height="3" rx="1.5" fill="#180026"/></g>
        <rect x="28" y="40" width="24" height="16" rx="3" fill="rgba(187,0,255,0.1)" stroke="#bb00ff" stroke-width="1"/>
        <line x1="28" y1="44.5" x2="52" y2="44.5" stroke="#bb00ff" stroke-width="0.8" opacity="0.5"/>
        <line x1="28" y1="49" x2="52" y2="49" stroke="#bb00ff" stroke-width="0.8" opacity="0.5"/>
        <line x1="36" y1="40" x2="36" y2="56" stroke="#bb00ff" stroke-width="0.8" opacity="0.5"/>
        <line x1="44" y1="40" x2="44" y2="56" stroke="#bb00ff" stroke-width="0.8" opacity="0.5"/>
        <rect x="10" y="35" width="6" height="2" rx="1" fill="#bb00ff" opacity="0.5"/>
        <rect x="10" y="39" width="6" height="2" rx="1" fill="#bb00ff" opacity="0.5"/>
        <rect x="10" y="43" width="6" height="2" rx="1" fill="#bb00ff" opacity="0.5"/>
        <rect x="64" y="35" width="6" height="2" rx="1" fill="#bb00ff" opacity="0.5"/>
        <rect x="64" y="39" width="6" height="2" rx="1" fill="#bb00ff" opacity="0.5"/>
        <rect x="64" y="43" width="6" height="2" rx="1" fill="#bb00ff" opacity="0.5"/>
      </svg>`,
    },
    ninja: {
      name: 'Ninja', color: '#dd0022', dot: '#dd0022',
      svg: `<svg class="robot-svg" viewBox="0 0 80 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="40,1 28,14 52,14" fill="rgba(221,0,34,0.5)" stroke="#dd0022" stroke-width="1.2"/>
        <circle class="r-ant" cx="40" cy="2" r="3.5" fill="#dd0022"/>
        <rect x="8" y="14" width="64" height="50" rx="3" stroke="#dd0022" stroke-width="2" fill="rgba(18,0,4,0.8)"/>
        <rect x="8" y="14" width="64" height="27" rx="3" fill="rgba(0,0,0,0.75)" stroke="#dd0022" stroke-width="1.5"/>
        <g class="r-eye r-el"><rect x="12" y="23" width="24" height="4" rx="2" fill="#dd0022"/><rect class="r-pl" x="18" y="23.5" width="10" height="3" rx="1.5" fill="#300005"/></g>
        <g class="r-eye r-er"><rect x="44" y="23" width="24" height="4" rx="2" fill="#dd0022"/><rect class="r-pr" x="50" y="23.5" width="10" height="3" rx="1.5" fill="#300005"/></g>
        <rect x="12" y="30" width="56" height="2" rx="1" fill="#dd0022" opacity="0.3"/>
        <polygon points="0,22 8,18 8,34 0,30" fill="rgba(10,0,2,0.8)" stroke="#dd0022" stroke-width="1.2"/>
        <polygon points="80,22 72,18 72,34 80,30" fill="rgba(10,0,2,0.8)" stroke="#dd0022" stroke-width="1.2"/>
        <line x1="40" y1="41" x2="40" y2="64" stroke="#dd0022" stroke-width="1" opacity="0.4"/>
        <line x1="8" y1="50" x2="72" y2="50" stroke="#dd0022" stroke-width="0.8" opacity="0.3"/>
        <rect x="18" y="54" width="16" height="8" rx="2" fill="rgba(221,0,34,0.08)" stroke="#dd0022" stroke-width="1"/>
        <rect x="46" y="54" width="16" height="8" rx="2" fill="rgba(221,0,34,0.08)" stroke="#dd0022" stroke-width="1"/>
        <circle cx="40" cy="44" r="4" fill="rgba(221,0,34,0.12)" stroke="#dd0022" stroke-width="1.2"/>
        <circle cx="40" cy="44" r="1.5" fill="#dd0022" opacity="0.85"/>
      </svg>`,
    },
    titan: {
      name: 'Titan', color: '#ffaa00', dot: '#ffaa00',
      svg: `<svg class="robot-svg" viewBox="0 0 80 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="34" y="1" width="12" height="14" rx="1" fill="rgba(255,170,0,0.4)" stroke="#ffaa00" stroke-width="1.5"/>
        <circle class="r-ant" cx="40" cy="1" r="4" fill="#ffaa00"/>
        <rect x="2" y="15" width="76" height="52" rx="2" stroke="#ffaa00" stroke-width="2.5" fill="rgba(20,10,0,0.85)"/>
        <line x1="2" y1="30" x2="78" y2="30" stroke="#ffaa00" stroke-width="1.5" opacity="0.25"/>
        <rect x="8" y="18" width="26" height="20" rx="2" fill="rgba(0,0,0,0.6)" stroke="#ffaa00" stroke-width="2"/>
        <rect x="46" y="18" width="26" height="20" rx="2" fill="rgba(0,0,0,0.6)" stroke="#ffaa00" stroke-width="2"/>
        <g class="r-eye r-el"><rect x="12" y="22" width="18" height="12" rx="1" fill="#ffaa00"/><rect class="r-pl" x="16" y="25" width="8" height="6" rx="0.5" fill="#2a1500"/></g>
        <g class="r-eye r-er"><rect x="50" y="22" width="18" height="12" rx="1" fill="#ffaa00"/><rect class="r-pr" x="54" y="25" width="8" height="6" rx="0.5" fill="#2a1500"/></g>
        <rect x="8" y="42" width="64" height="20" rx="2" fill="rgba(255,170,0,0.06)" stroke="#ffaa00" stroke-width="1.5"/>
        <circle cx="20" cy="52" r="5" fill="rgba(255,170,0,0.12)" stroke="#ffaa00" stroke-width="1.5"/>
        <circle cx="40" cy="52" r="5" fill="rgba(255,170,0,0.12)" stroke="#ffaa00" stroke-width="1.5"/>
        <circle cx="60" cy="52" r="5" fill="rgba(255,170,0,0.12)" stroke="#ffaa00" stroke-width="1.5"/>
        <circle cx="20" cy="52" r="2" fill="#ffaa00" opacity="0.7"/>
        <circle cx="40" cy="52" r="2" fill="#ffaa00"/>
        <circle cx="60" cy="52" r="2" fill="#ffaa00" opacity="0.5"/>
        <rect x="0" y="25" width="5" height="24" rx="1" fill="rgba(20,10,0,0.8)" stroke="#ffaa00" stroke-width="1.8"/>
        <rect x="75" y="25" width="5" height="24" rx="1" fill="rgba(20,10,0,0.8)" stroke="#ffaa00" stroke-width="1.8"/>
        <line x1="0" y1="32" x2="5" y2="32" stroke="#ffaa00" stroke-width="1" opacity="0.5"/>
        <line x1="75" y1="32" x2="80" y2="32" stroke="#ffaa00" stroke-width="1" opacity="0.5"/>
        <line x1="0" y1="38" x2="5" y2="38" stroke="#ffaa00" stroke-width="1" opacity="0.5"/>
        <line x1="75" y1="38" x2="80" y2="38" stroke="#ffaa00" stroke-width="1" opacity="0.5"/>
      </svg>`,
    },
    ghost: {
      name: 'Ghost', color: '#aaccff', dot: '#aaccff',
      svg: `<svg class="robot-svg" viewBox="0 0 80 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="40" y1="3" x2="40" y2="14" stroke="#aaccff" stroke-width="1.5" stroke-dasharray="2,2" stroke-linecap="round"/>
        <circle class="r-ant" cx="40" cy="3" r="4" fill="none" stroke="#aaccff" stroke-width="1.5"/>
        <circle cx="40" cy="3" r="1.5" fill="#aaccff" opacity="0.5"/>
        <rect x="10" y="14" width="60" height="50" rx="16" stroke="#aaccff" stroke-width="1.5" stroke-dasharray="3,3" fill="rgba(170,204,255,0.03)"/>
        <rect x="16" y="22" width="20" height="18" rx="9" fill="none" stroke="#aaccff" stroke-width="1.5"/>
        <rect x="44" y="22" width="20" height="18" rx="9" fill="none" stroke="#aaccff" stroke-width="1.5"/>
        <g class="r-eye r-el"><circle cx="26" cy="31" r="5" fill="rgba(170,204,255,0.15)"/><circle cx="26" cy="31" r="5" fill="none" stroke="#aaccff" stroke-width="1.2"/><circle class="r-pl" cx="27.5" cy="31" r="2.5" fill="#aaccff" opacity="0.85"/></g>
        <g class="r-eye r-er"><circle cx="54" cy="31" r="5" fill="rgba(170,204,255,0.15)"/><circle cx="54" cy="31" r="5" fill="none" stroke="#aaccff" stroke-width="1.2"/><circle class="r-pr" cx="55.5" cy="31" r="2.5" fill="#aaccff" opacity="0.85"/></g>
        <path d="M26 50 Q40 58 54 50" stroke="#aaccff" stroke-width="1.5" stroke-linecap="round" fill="none" stroke-dasharray="2,2"/>
        <circle cx="40" cy="50" r="1.5" fill="#aaccff" opacity="0.4"/>
        <circle cx="18" cy="44" r="3" fill="none" stroke="#aaccff" stroke-width="1" opacity="0.4"/>
        <circle cx="62" cy="44" r="3" fill="none" stroke="#aaccff" stroke-width="1" opacity="0.4"/>
        <circle cx="18" cy="44" r="1" fill="#aaccff" opacity="0.3"/>
        <circle cx="62" cy="44" r="1" fill="#aaccff" opacity="0.3"/>
        <line x1="30" y1="14" x2="26" y2="22" stroke="#aaccff" stroke-width="0.8" opacity="0.3"/>
        <line x1="50" y1="14" x2="54" y2="22" stroke="#aaccff" stroke-width="0.8" opacity="0.3"/>
      </svg>`,
    },
    virus: {
      name: 'Virus', color: '#77ff00', dot: '#77ff00',
      svg: `<svg class="robot-svg" viewBox="0 0 80 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="32" y1="5" x2="28" y2="15" stroke="#77ff00" stroke-width="2" stroke-linecap="round"/>
        <circle class="r-ant" cx="32" cy="4" r="4" fill="#77ff00"/>
        <line x1="55" y1="8" x2="52" y2="15" stroke="#77ff00" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        <circle cx="56" cy="7" r="3" fill="#77ff00" opacity="0.45"/>
        <polygon points="8,15 72,15 76,65 4,65" stroke="#77ff00" stroke-width="1.8" fill="rgba(30,60,0,0.5)"/>
        <line x1="8" y1="30" x2="72" y2="28" stroke="#77ff00" stroke-width="0.8" opacity="0.3"/>
        <line x1="10" y1="45" x2="70" y2="48" stroke="#77ff00" stroke-width="0.8" opacity="0.2"/>
        <rect x="12" y="18" width="22" height="18" rx="4" fill="rgba(0,0,0,0.55)" stroke="#77ff00" stroke-width="1.8"/>
        <rect x="40" y="19" width="24" height="16" rx="3" fill="rgba(0,0,0,0.55)" stroke="#77ff00" stroke-width="1.2" opacity="0.7"/>
        <g class="r-eye r-el"><rect x="15" y="22" width="16" height="10" rx="3" fill="#77ff00"/><rect class="r-pl" x="19" y="24" width="6" height="6" rx="2" fill="#0d1a00"/></g>
        <g class="r-eye r-er"><rect x="43" y="22" width="18" height="9" rx="2" fill="#77ff00" opacity="0.7"/><rect class="r-pr" x="47" y="24" width="8" height="5" rx="1.5" fill="#0d1a00"/></g>
        <rect x="22" y="40" width="36" height="15" rx="2" fill="rgba(119,255,0,0.07)" stroke="#77ff00" stroke-width="1.2"/>
        <line x1="22" y1="47" x2="58" y2="47" stroke="#77ff00" stroke-width="0.8" opacity="0.4"/>
        <rect x="25" y="43" width="5" height="3" rx="1" fill="#77ff00" opacity="0.8"/>
        <rect x="34" y="43" width="7" height="3" rx="1" fill="#77ff00" opacity="0.4"/>
        <rect x="45" y="43" width="4" height="3" rx="1" fill="#77ff00" opacity="0.9"/>
        <rect x="25" y="49" width="9" height="3" rx="1" fill="#77ff00" opacity="0.5"/>
        <rect x="38" y="49" width="5" height="3" rx="1" fill="#77ff00" opacity="0.7"/>
        <rect x="47" y="49" width="8" height="3" rx="1" fill="#77ff00" opacity="0.3"/>
        <line x1="58" y1="20" x2="68" y2="15" stroke="#77ff00" stroke-width="1" opacity="0.35" stroke-dasharray="2,1"/>
        <line x1="10" y1="52" x2="5" y2="57" stroke="#77ff00" stroke-width="1" opacity="0.3" stroke-dasharray="2,1"/>
      </svg>`,
    },
  };

  let settings = { ...DEF_SETTINGS };
  let links    = [...DEF_LINKS];

  // ── Persistence ─────────────────────────────────────
  function load() {
    try { Object.assign(settings, JSON.parse(localStorage.getItem('nt_settings') || '{}')); } catch {}
    try { const l = JSON.parse(localStorage.getItem('nt_links')); if (Array.isArray(l)) links = l; } catch {}
  }
  function save() {
    localStorage.setItem('nt_settings', JSON.stringify(settings));
    localStorage.setItem('nt_links',    JSON.stringify(links));
  }

  // ── Clock ────────────────────────────────────────────
  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = new Date();
    const h24  = now.getHours();
    const min  = now.getMinutes();
    const sec  = now.getSeconds();
    const is12 = settings.clockFormat === '12';
    const h    = is12 ? (h24 % 12 || 12) : h24;
    const ampm = is12 ? (h24 < 12 ? 'AM' : 'PM') : '';

    const digEl = document.getElementById('clockDigits');
    const amEl  = document.getElementById('clockAmpm');
    const secEl = document.getElementById('clockSec');
    if (digEl) digEl.textContent = `${pad(h)}:${pad(min)}`;
    if (amEl)  { amEl.textContent = ampm; amEl.style.display = ampm ? '' : 'none'; }
    if (secEl) secEl.textContent = settings.seconds ? `:${pad(sec)}` : '';

    const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dateEl = document.getElementById('dateDisplay');
    if (dateEl) dateEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    const name = settings.name ? `, ${settings.name}` : '';
    let greet;
    if (h24 < 5)       greet = `GOOD NIGHT${name.toUpperCase()}`;
    else if (h24 < 12) greet = `GOOD MORNING${name.toUpperCase()}`;
    else if (h24 < 17) greet = `GOOD AFTERNOON${name.toUpperCase()}`;
    else if (h24 < 21) greet = `GOOD EVENING${name.toUpperCase()}`;
    else               greet = `GOOD NIGHT${name.toUpperCase()}`;
    const greetEl = document.getElementById('greeting');
    if (greetEl) greetEl.textContent = greet;
  }

  // ── Search ───────────────────────────────────────────
  function getSearchUrl(q) {
    const eng = ENGINE_OPTIONS.find(e => e.key === settings.searchEngine) || ENGINE_OPTIONS[0];
    return eng.search(q);
  }

  function setupSearch() {
    const form  = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    form?.addEventListener('submit', e => {
      e.preventDefault();
      const q = input?.value.trim();
      if (!q) return;
      window.location.href = getSearchUrl(q);
    });
  }

  // ── Engine pills ─────────────────────────────────────
  function renderEnginePills() {
    const container = document.getElementById('enginePills');
    if (!container) return;
    container.innerHTML = '';
    ENGINE_OPTIONS.forEach(eng => {
      const btn = document.createElement('button');
      btn.className = 'engine-pill' + (eng.key === settings.searchEngine ? ' active' : '');
      btn.innerHTML = `<span class="ep-icon">${eng.icon}</span>${eng.name}`;
      btn.title = `Search with ${eng.name}`;
      btn.addEventListener('click', () => {
        settings.searchEngine = eng.key; save();
        container.querySelectorAll('.engine-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.dispatchEvent(new Event('engine-changed'));
        const defEng = document.getElementById('defaultEngine');
        if (defEng) defEng.value = eng.key;
      });
      container.appendChild(btn);
    });
  }

  // ── Hacker Voice (Web Speech API) ───────────────────
  let speechReady = false;
  let pendingSpeech = null;

  function speakHacker(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);

    function doSpeak() {
      const voices = window.speechSynthesis.getVoices();
      // Prefer deep/robotic voices
      const preferred = ['Google UK English Male', 'Microsoft David', 'Daniel', 'Alex', 'Fred'];
      let voice = null;
      for (const name of preferred) {
        voice = voices.find(v => v.name.includes(name));
        if (voice) break;
      }
      if (!voice) voice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male'));
      if (!voice) voice = voices.find(v => v.lang.startsWith('en'));
      if (voice) utter.voice = voice;

      utter.pitch  = 0.45;   // very low = robotic
      utter.rate   = 0.82;   // slightly slow = menacing
      utter.volume = 1;
      window.speechSynthesis.speak(utter);
    }

    // voices may not be loaded yet on first load
    if (window.speechSynthesis.getVoices().length > 0) {
      doSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => { doSpeak(); window.speechSynthesis.onvoiceschanged = null; };
    }
  }

  function hackerWelcome() {
    if (localStorage.getItem('nt_welcomed')) return;
    localStorage.setItem('nt_welcomed', '1');
    const name = settings.name || 'Hacker';
    setTimeout(() => speakHacker(`Welcome to ${name}`), 600);
  }

  // ── Hacker typewriter strip ──────────────────────────
  function startTypewriter() {
    const el = document.getElementById('hackerStrip');
    if (!el) return;
    let pi = Math.floor(Math.random() * HACKER_PHRASES.length);
    let ci = 0;
    let typing = true;

    function step() {
      const phrase = HACKER_PHRASES[pi];
      if (typing) {
        el.textContent = phrase.substring(0, ci++);
        if (ci <= phrase.length) {
          setTimeout(step, 42 + Math.random() * 35);
        } else {
          typing = false;
          setTimeout(step, 2200);
        }
      } else {
        // Fade strip out
        const strip = el.closest('.hacker-strip');
        if (strip) strip.style.opacity = '0';
        setTimeout(() => {
          pi = (pi + 1) % HACKER_PHRASES.length;
          ci = 0; typing = true;
          el.textContent = '';
          if (strip) strip.style.opacity = '1';
          setTimeout(step, 180);
        }, 500);
      }
    }
    step();
  }

  // ── Motivational strip typewriter ───────────────────
  function startMotivationalStrip() {
    const el = document.getElementById('motivText');
    if (!el) return;
    let pi = Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length);
    let ci = 0;
    let typing = true;

    function step() {
      const phrase = MOTIVATIONAL_PHRASES[pi];
      if (typing) {
        el.textContent = phrase.substring(0, ci++);
        if (ci <= phrase.length) {
          setTimeout(step, 38 + Math.random() * 30);
        } else {
          typing = false;
          setTimeout(step, 2800);
        }
      } else {
        const strip = el.closest('.motiv-strip');
        if (strip) strip.style.opacity = '0';
        setTimeout(() => {
          pi = (pi + 1) % MOTIVATIONAL_PHRASES.length;
          ci = 0; typing = true;
          el.textContent = '';
          if (strip) strip.style.opacity = '1';
          setTimeout(step, 200);
        }, 500);
      }
    }
    step();
  }

  // ── Robot skins ──────────────────────────────────────
  function renderRobot(skin) {
    const wrap = document.getElementById('robotWrap');
    if (!wrap) return;
    const r = ROBOTS[skin] || ROBOTS.hacker;
    wrap.innerHTML = r.svg;
    wrap.style.filter = `drop-shadow(0 0 10px ${r.color}AA)`;
  }

  function renderRobotSkins() {
    const container = document.getElementById('robotSkins');
    if (!container) return;
    container.innerHTML = '';
    Object.entries(ROBOTS).forEach(([key, robot]) => {
      const dot = document.createElement('button');
      dot.className = 'rskin-dot' + (key === settings.robotSkin ? ' active' : '');
      dot.style.background = robot.dot;
      dot.title = robot.name;
      dot.setAttribute('aria-label', `${robot.name} robot`);
      dot.addEventListener('click', () => {
        settings.robotSkin = key; save();
        renderRobot(key);
        container.querySelectorAll('.rskin-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      });
      container.appendChild(dot);
    });
  }

  // ── Google Apps Popup ────────────────────────────────────
  function setupAppsPopup() {
    const btn   = document.getElementById('appsBtn');
    const popup = document.getElementById('appsPopup');
    const grid  = document.getElementById('appsGrid');
    if (!btn || !popup || !grid) return;

    // Build title
    const title = document.createElement('div');
    title.className = 'apps-popup-title'; title.textContent = 'Google Apps';
    popup.insertBefore(title, grid);

    // Build grid items
    GOOGLE_APPS.forEach(app => {
      const a = document.createElement('a');
      a.className = 'app-item'; a.href = app.url; a.target = '_blank'; a.rel = 'noopener';
      const iconWrap = document.createElement('div');
      iconWrap.className = 'app-icon-wrap';
      iconWrap.style.background = app.bg + '22';
      iconWrap.style.boxShadow = `0 0 0 1px ${app.bg}44`;
      iconWrap.textContent = app.icon;
      const name = document.createElement('span');
      name.className = 'app-name'; name.textContent = app.name;
      a.appendChild(iconWrap); a.appendChild(name);
      grid.appendChild(a);
    });

    function positionPopup() {
      const r = btn.getBoundingClientRect();
      const popW = 318;
      let left = r.right - popW;
      if (left < 8) left = 8;
      if (left + popW > window.innerWidth - 8) left = window.innerWidth - popW - 8;
      popup.style.left = `${left}px`;
      popup.style.top  = `${r.bottom + 8}px`;
    }

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const opening = !popup.classList.contains('open');
      popup.classList.toggle('open');
      if (opening) positionPopup();
    });

    document.addEventListener('click', e => {
      if (!popup.contains(e.target) && e.target !== btn) {
        popup.classList.remove('open');
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') popup.classList.remove('open');
    });
  }

  // ── Quick Links ──────────────────────────────────────
  function renderLinks() {
    const container = document.getElementById('quickLinks');
    if (!container) return;
    container.innerHTML = '';
    links.forEach((l, i) => {
      const a = document.createElement('a');
      a.className = 'ql-card'; a.href = l.url; a.title = l.name;
      const icon = document.createElement('span');
      icon.className = 'ql-icon'; icon.textContent = l.icon || '🌐';
      const name = document.createElement('span');
      name.className = 'ql-name'; name.textContent = l.name;
      const rm = document.createElement('button');
      rm.className = 'ql-remove'; rm.textContent = '×'; rm.title = 'Remove';
      rm.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        links.splice(i, 1); save(); renderLinks();
      });
      a.appendChild(icon); a.appendChild(name); a.appendChild(rm);
      container.appendChild(a);
    });
    const add = document.createElement('div');
    add.className = 'ql-card ql-add'; add.title = 'Add link';
    add.setAttribute('role','button'); add.setAttribute('tabindex','0');
    add.innerHTML = '<span class="ql-icon" style="border-style:dashed;font-size:1.5rem;color:rgba(255,255,255,0.4)">+</span><span class="ql-name">Add</span>';
    add.addEventListener('click', openModal);
    add.addEventListener('keydown', e => e.key === 'Enter' && openModal());
    container.appendChild(add);
  }

  // ── Bookmarks bar ────────────────────────────────────
  function loadBookmarks() {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.getTree(tree => {
        const bar   = tree?.[0]?.children?.[0]?.children || [];
        const other = tree?.[0]?.children?.[1]?.children || [];
        renderBookmarksBar(bar, other);
      });
    }
  }

  function faviconUrl(url) {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=16`; } catch { return ''; }
  }

  function renderBookmarksBar(items, otherItems) {
    const bar = document.getElementById('bookmarksBar');
    if (!bar) return;
    bar.innerHTML = '';
    if (!items || !items.length) return;

    // Render each bookmarks bar item
    items.forEach(item => {
      if (item.url) {
        const a = document.createElement('a');
        a.className = 'bm-item';
        a.href = item.url; a.title = item.title || item.url;
        const fav = faviconUrl(item.url);
        if (fav) {
          const img = document.createElement('img');
          img.className = 'bm-favicon'; img.src = fav;
          img.onerror = () => img.remove();
          a.appendChild(img);
        }
        const span = document.createElement('span');
        span.className = 'bm-label';
        try { span.textContent = item.title || new URL(item.url).hostname; } catch { span.textContent = item.title; }
        a.appendChild(span);
        bar.appendChild(a);
      } else if (item.children) {
        const btn = document.createElement('button');
        btn.className = 'bm-item bm-folder'; btn.title = item.title;
        btn.innerHTML = `<span style="flex-shrink:0">📁</span><span class="bm-label">${item.title || 'Folder'}</span>`;
        btn.addEventListener('click', e => { e.stopPropagation(); openFolderDropdown(btn, item.children); });
        bar.appendChild(btn);
      }
    });

    // "All Bookmarks" button at the right end
    if (otherItems && otherItems.length) {
      const sep = document.createElement('span');
      sep.style.cssText = 'width:1px;height:14px;background:rgba(255,255,255,0.12);margin:0 4px;flex-shrink:0;align-self:center';
      bar.appendChild(sep);
      const allBtn = document.createElement('button');
      allBtn.className = 'bm-item bm-folder';
      allBtn.title = 'All Bookmarks';
      allBtn.innerHTML = '<span style="flex-shrink:0">📚</span><span class="bm-label">All Bookmarks</span>';
      allBtn.addEventListener('click', e => { e.stopPropagation(); openFolderDropdown(allBtn, otherItems); });
      bar.appendChild(allBtn);
    }
  }

  function openFolderDropdown(el, children, isNested) {
    if (!isNested) document.querySelectorAll('.bm-dropdown').forEach(d => d.remove());
    if (!children || !children.length) return;

    const rect = el.getBoundingClientRect();
    const dd = document.createElement('div');
    dd.className = 'bm-dropdown';

    let hasItems = false;
    children.forEach(child => {
      if (child.url) {
        const a = document.createElement('a');
        a.href = child.url; a.title = child.title || child.url;
        const fav = faviconUrl(child.url);
        if (fav) {
          const img = document.createElement('img');
          img.className = 'bm-favicon'; img.src = fav;
          img.onerror = () => img.remove();
          a.appendChild(img);
        }
        const span = document.createElement('span');
        span.className = 'bm-label';
        try { span.textContent = child.title || new URL(child.url).hostname; } catch { span.textContent = child.title; }
        a.appendChild(span);
        dd.appendChild(a);
        hasItems = true;
      } else if (child.children) {
        const btn = document.createElement('button');
        btn.className = 'bm-folder-dd';
        btn.innerHTML = `<span>📁</span><span class="bm-label">${child.title || 'Folder'}</span>`;
        btn.addEventListener('click', e => {
          e.stopPropagation();
          document.querySelectorAll('.bm-nested').forEach(d => d.remove());
          openFolderDropdown(btn, child.children, true);
        });
        dd.appendChild(btn);
        hasItems = true;
      }
    });

    if (!hasItems) return;

    dd.style.position = 'fixed';
    dd.style.zIndex   = '9999';
    dd.style.minWidth = '200px';

    if (isNested) {
      dd.classList.add('bm-nested');
      dd.style.left = `${rect.right + 2}px`;
      dd.style.top  = `${rect.top}px`;
    } else {
      dd.style.left = `${rect.left}px`;
      dd.style.top  = `${rect.bottom + 4}px`;
    }

    document.body.appendChild(dd);

    // Clamp to viewport
    requestAnimationFrame(() => {
      const r = dd.getBoundingClientRect();
      if (r.right  > window.innerWidth  - 4) dd.style.left = `${Math.max(4, window.innerWidth  - r.width  - 4)}px`;
      if (r.bottom > window.innerHeight - 4) dd.style.top  = `${Math.max(4, window.innerHeight - r.height - 4)}px`;
    });

    function outside(e) {
      if (!dd.contains(e.target) && e.target !== el) {
        dd.remove();
        document.removeEventListener('click', outside);
      }
    }
    setTimeout(() => document.addEventListener('click', outside), 10);
  }

  // ── Weather ──────────────────────────────────────────
  function setupWeather() {
    const cached = (() => {
      try {
        const c = JSON.parse(localStorage.getItem('nt_weather') || 'null');
        if (c && Date.now() - c.ts < 30 * 60 * 1000) return c.d;
      } catch {}
      return null;
    })();
    if (cached) { applyWeather(cached); return; }

    if (!navigator.geolocation) { setWeatherMsg('Location N/A', '📍 --'); return; }

    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const { latitude: lat, longitude: lon } = pos.coords;
        const unit = settings.tempUnit === 'F' ? 'fahrenheit' : 'celsius';
        const [wx, geo] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=${unit}`).then(r => r.json()),
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
            headers: { 'User-Agent': 'HackerBrowser-NovaTab/3.0' }
          }).then(r => r.json()),
        ]);
        const city    = geo.address?.city || geo.address?.town || geo.address?.village || geo.address?.suburb || geo.address?.county || '';
        const country = geo.address?.country_code?.toUpperCase() || '';
        const d = {
          temp: Math.round(wx.current.temperature_2m),
          unit: settings.tempUnit,
          code: wx.current.weather_code,
          location: [city, country].filter(Boolean).join(', ') || 'Unknown',
        };
        localStorage.setItem('nt_weather', JSON.stringify({ d, ts: Date.now() }));
        applyWeather(d);
      } catch { setWeatherMsg('Weather unavailable', '📍 --'); }
    }, () => setWeatherMsg('Allow location', '📍 Denied'),
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  }

  function setWeatherMsg(desc, loc) {
    const d = document.getElementById('weatherDesc');
    const l = document.getElementById('weatherLoc');
    if (d) d.textContent = desc;
    if (l) l.textContent = loc;
  }

  function applyWeather(d) {
    const [icon, desc] = WMO[d.code] || ['🌡️', 'Unknown'];
    const iEl = document.getElementById('weatherIcon');
    const tEl = document.getElementById('weatherTemp');
    const dEl = document.getElementById('weatherDesc');
    const lEl = document.getElementById('weatherLoc');
    if (iEl) iEl.textContent = icon;
    if (tEl) tEl.textContent = `${d.temp}°${d.unit}`;
    if (dEl) dEl.textContent = desc;
    if (lEl) lEl.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${d.location}`;
  }

  // ── Quote ────────────────────────────────────────────
  function showQuote() {
    const today = new Date();
    const idx = (today.getDate() * 7 + today.getMonth() * 31) % QUOTES.length;
    const q = QUOTES[idx];
    const tEl = document.getElementById('quoteText');
    const aEl = document.getElementById('quoteAuthor');
    if (tEl) tEl.textContent = q.t;
    if (aEl) aEl.textContent = `— ${q.a}`;
  }

  // ── Theme selector ───────────────────────────────────
  function applyBgOpacity(val) {
    const c = document.getElementById('bgCanvas');
    if (c) c.style.opacity = val;
  }

  function applyBgImage(dataUrl) {
    const wrap = document.getElementById('app') || document.body;
    if (dataUrl) {
      wrap.style.backgroundImage = `url(${dataUrl})`;
      wrap.style.backgroundSize = 'cover';
      wrap.style.backgroundPosition = 'center';
      wrap.style.backgroundRepeat = 'no-repeat';
    } else {
      wrap.style.backgroundImage = '';
    }
    const clearBtn = document.getElementById('bgClearBtn');
    const label    = document.getElementById('bgPickLabel');
    if (clearBtn) clearBtn.hidden = !dataUrl;
    if (label)    label.classList.toggle('has-image', !!dataUrl);
  }

  function setupOpacitySlider() {
    const slider   = document.getElementById('bgOpacitySlider');
    const fileInput = document.getElementById('bgImageInput');
    const clearBtn  = document.getElementById('bgClearBtn');

    // Apply saved opacity
    if (slider) {
      slider.value = settings.bgOpacity ?? 1;
      applyBgOpacity(slider.value);
      slider.addEventListener('input', () => {
        settings.bgOpacity = parseFloat(slider.value);
        save();
        applyBgOpacity(slider.value);
      });
    }

    // Apply saved background image
    const savedBg = localStorage.getItem('nt_bg');
    if (savedBg) applyBgImage(savedBg);

    // File picker
    if (fileInput) {
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          localStorage.setItem('nt_bg', dataUrl);
          applyBgImage(dataUrl);
        };
        reader.readAsDataURL(file);
      });
    }

    // Clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        localStorage.removeItem('nt_bg');
        applyBgImage(null);
        if (fileInput) fileInput.value = '';
      });
    }
  }

  function renderThemeDots() {
    const container = document.getElementById('themeDots');
    if (!container) return;
    container.innerHTML = '';
    Object.entries(ThemeEngine.THEMES).forEach(([key, theme]) => {
      const wrap = document.createElement('div');
      wrap.className = 'theme-dot-wrap';
      const dot = document.createElement('button');
      dot.className = 'theme-dot' + (key === settings.theme ? ' active' : '');
      dot.title = theme.name;
      dot.style.backgroundImage = theme.dot;
      dot.setAttribute('aria-label', `${theme.name} theme`);
      dot.addEventListener('click', () => {
        settings.theme = key; save();
        ThemeEngine.setTheme(key);
        document.documentElement.style.setProperty('--accent', ThemeEngine.getAccent());
        container.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      });
      const tip = document.createElement('span');
      tip.className = 'dot-tip'; tip.textContent = theme.name;
      wrap.appendChild(dot); wrap.appendChild(tip);
      container.appendChild(wrap);
    });
  }

  // ── Editable heading ─────────────────────────────────
  function setupEditableHeading() {
    const el = document.getElementById('hackerText');
    if (!el) return;
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
    });
    el.addEventListener('blur', () => {
      const text = el.textContent.replace(/[\r\n]/g, '').trim().toUpperCase() || 'HACKER BROWSER';
      el.textContent = text;
      settings.heading = text;
      save();
      const hi = document.getElementById('headingInput');
      if (hi) hi.value = text;
    });
    el.addEventListener('paste', e => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text').replace(/[\r\n]/g,'').trim().toUpperCase();
      document.execCommand('insertText', false, text);
    });
  }

  // ── Settings panel ───────────────────────────────────
  function setupSettingsPanel() {
    const panel = document.getElementById('settingsPanel');
    document.getElementById('settingsToggle')?.addEventListener('click', () => panel?.classList.add('open'));
    document.getElementById('settingsClose')?.addEventListener('click',  () => panel?.classList.remove('open'));

    const headingInput = document.getElementById('headingInput');
    if (headingInput) {
      headingInput.value = settings.heading || 'HACKER BROWSER';
      headingInput.addEventListener('input', () => {
        settings.heading = headingInput.value.trim() || 'HACKER BROWSER';
        const el = document.getElementById('hackerText');
        if (el) el.textContent = settings.heading;
        save();
      });
    }

    const nameInput = document.getElementById('nameInput');
    if (nameInput) {
      nameInput.value = settings.name;
      nameInput.addEventListener('input', () => { settings.name = nameInput.value.trim(); save(); });
    }

    const makeToggle = (aId, bId, key) => {
      const a = document.getElementById(aId);
      const b = document.getElementById(bId);
      if (!a || !b) return;
      const val = String(settings[key]);
      if (a.dataset.val === val) { a.classList.add('active'); b.classList.remove('active'); }
      else                       { b.classList.add('active'); a.classList.remove('active'); }
      [a, b].forEach(btn => btn.addEventListener('click', () => {
        const v = btn.dataset.val;
        settings[key] = v === 'on' ? true : v === 'off' ? false : v;
        save();
        a.classList.toggle('active', a === btn);
        b.classList.toggle('active', b === btn);
        if (key === 'tempUnit') { localStorage.removeItem('nt_weather'); setupWeather(); }
      }));
    };
    makeToggle('fmt12','fmt24','clockFormat');
    makeToggle('tempC','tempF','tempUnit');
    makeToggle('secOn','secOff','seconds');

    const defEng = document.getElementById('defaultEngine');
    if (defEng) {
      defEng.value = settings.searchEngine;
      defEng.addEventListener('change', () => {
        settings.searchEngine = defEng.value;
        save();
        renderEnginePills();
      });
    }
  }

  // ── Modal ────────────────────────────────────────────
  function openModal() {
    const overlay = document.getElementById('overlay');
    overlay?.classList.add('open');
    ['linkIcon','linkName','linkUrl'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    document.getElementById('linkName')?.focus();
  }
  function closeModal() { document.getElementById('overlay')?.classList.remove('open'); }

  function setupModal() {
    document.getElementById('modalCancel')?.addEventListener('click', closeModal);
    document.getElementById('overlay')?.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.getElementById('modalAdd')?.addEventListener('click', () => {
      const icon = document.getElementById('linkIcon')?.value.trim() || '🌐';
      const name = document.getElementById('linkName')?.value.trim();
      let   url  = document.getElementById('linkUrl')?.value.trim();
      if (!name || !url) return;
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      links.push({ icon, name, url }); save(); renderLinks(); closeModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  // ── Tor anonymous mode notice ─────────────────────────
  function setupTorMode() {
    const torBanner = document.getElementById('torBanner');
    const torClose  = document.getElementById('torBannerClose');
    if (!torBanner) return;
    // Show banner when Tor engine is active
    function checkTor() {
      const eng = ENGINE_OPTIONS.find(e => e.key === settings.searchEngine);
      torBanner.hidden = !(eng && eng.anon);
    }
    checkTor();
    document.addEventListener('engine-changed', checkTor);
    torClose?.addEventListener('click', () => { torBanner.hidden = true; });
  }

  // ── First-time setup wizard ───────────────────────────
  function maybeShowSetup() {
    if (localStorage.getItem('nt_setup_done')) return;
    const wizard = document.getElementById('setupWizard');
    if (!wizard) return;
    wizard.classList.add('open');

    // Step navigation
    let step = 0;
    const steps = wizard.querySelectorAll('.wiz-step');
    function goStep(n) {
      steps.forEach((s, i) => s.hidden = i !== n);
      step = n;
    }
    goStep(0);

    // Step 1 → name
    wizard.querySelector('#wizNext1')?.addEventListener('click', () => {
      const val = wizard.querySelector('#wizName')?.value.trim();
      if (val) { settings.name = val; save(); }
      goStep(1);
    });

    // Step 2 → theme pick (already handled by dots)
    wizard.querySelectorAll('.wiz-theme-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        wizard.querySelectorAll('.wiz-theme-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        settings.theme = dot.dataset.theme; save();
        ThemeEngine.setTheme(settings.theme);
        document.documentElement.style.setProperty('--accent', ThemeEngine.getAccent());
      });
    });
    wizard.querySelector('#wizNext2')?.addEventListener('click', () => goStep(2));

    // Step 3 → add login links (Gmail, personal, etc.)
    wizard.querySelector('#wizAddLink')?.addEventListener('click', () => {
      const name = wizard.querySelector('#wizLinkName')?.value.trim();
      let   url  = wizard.querySelector('#wizLinkUrl')?.value.trim();
      if (!name || !url) return;
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      links.push({ icon: '🔗', name, url }); save(); renderLinks();
      if (wizard.querySelector('#wizLinkName')) wizard.querySelector('#wizLinkName').value = '';
      if (wizard.querySelector('#wizLinkUrl'))  wizard.querySelector('#wizLinkUrl').value  = '';
    });
    wizard.querySelector('#wizFinish')?.addEventListener('click', () => {
      localStorage.setItem('nt_setup_done', '1');
      wizard.classList.remove('open');
      hackerWelcome();
    });
  }

  // ── Init ─────────────────────────────────────────────
  function init() {
    load();

    const hackerTextEl = document.getElementById('hackerText');
    if (hackerTextEl) hackerTextEl.textContent = settings.heading || 'SPIDER BROWSER';

    ThemeEngine.init(document.getElementById('bgCanvas'));
    ThemeEngine.setTheme(settings.theme);
    ThemeEngine.start();
    document.documentElement.style.setProperty('--accent', ThemeEngine.getAccent());

    renderRobot(settings.robotSkin || 'hacker');
    renderRobotSkins();
    tick();
    setInterval(tick, 1000);
    showQuote();
    renderLinks();
    renderThemeDots();
    setupOpacitySlider();
    renderEnginePills();
    setupSearch();
    setupWeather();
    setupSettingsPanel();
    setupEditableHeading();
    setupModal();
    setupAppsPopup();
    loadBookmarks();
    startTypewriter();
    startMotivationalStrip();
    setupTorMode();
    maybeShowSetup();
    if (localStorage.getItem('nt_setup_done')) hackerWelcome();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
