// Weekly & Daily Rosary Tracker logic (Bilingual English & Czech)

(function() {
  const STORAGE_KEY = 'ruzenec_weekly_tracker_v1';

  const I18N = {
    en: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      mysteries: {
        radostny: {
          name: 'Joyful Rosary',
          items: [
            'The Annunciation',
            'The Visitation',
            'The Nativity',
            'The Presentation in the Temple',
            'The Finding in the Temple'
          ]
        },
        svetla: {
          name: 'Luminous Rosary',
          items: [
            'The Baptism of Jesus in the Jordan',
            'The Wedding at Cana',
            'The Proclamation of the Kingdom',
            'The Transfiguration',
            'The Institution of the Eucharist'
          ]
        },
        bolestny: {
          name: 'Sorrowful Rosary',
          items: [
            'The Agony in the Garden',
            'The Scourging at the Pillar',
            'The Crowning with Thorns',
            'The Carrying of the Cross',
            'The Crucifixion and Death of Jesus'
          ]
        },
        slavny: {
          name: 'Glorious Rosary',
          items: [
            'The Resurrection',
            'The Ascension',
            'The Descent of the Holy Spirit',
            'The Assumption of Mary',
            'The Coronation of Mary'
          ]
        }
      },
      prevWeek: '← Previous',
      nextWeek: 'Next →',
      thisWeek: 'This week',
      weekTitle: (num, isCur) => isCur ? `Week ${num} (current)` : `Week ${num}`,
      resetWeekBtn: 'Reset week',
      resetConfirm: (num, range) => `Are you sure you want to reset records for week ${num} (${range})?`,
      summaryDailyTitle: 'Weekly Daily Rosary Progress',
      summaryWeeklyTitle: 'Weekly Prayer Progress',
      hailMarys: 'Hail Marys',
      decades: 'Decades',
      fullRosaries: 'Full Rosaries',
      dailyCompleteBanner: '<strong>Goal achieved!</strong> A rosary prayed for every day of the week (7 rosaries). <em>Deo gratias!</em>',
      weeklyCompleteBanner: '<strong>Weekly commitment fulfilled!</strong> All rosaries for this week are completed. <em>Deo gratias!</em>',
      dailyModeToggle: 'Rosary a day (1 rosary every day of the week)',
      lightToggle: 'Include Luminous Rosary',
      descDailyLight: '<strong>Mode: Rosary a day with Luminous Rosary</strong> (7 rosaries / 35 decades) according to St. John Paul II\'s Apostolic Letter <em>Rosarium Virginis Mariae</em>:<br/>Mon: Joyful, Tue: Sorrowful, Wed: Glorious, Thu: Luminous, Fri: Sorrowful, Sat: Joyful, Sun: Glorious.',
      descDailyTrad: '<strong>Mode: Rosary a day – traditional</strong> (7 rosaries / 35 decades) according to traditional Church practice:<br/>Mon: Joyful, Tue: Sorrowful, Wed: Glorious, Thu: Joyful, Fri: Sorrowful, Sat: Glorious, Sun: Glorious.',
      descWeeklyLight: '<strong>Mode: Weekly commitment of 4 rosaries</strong> (20 decades / 200 Hail Marys) – Joyful, Luminous, Sorrowful, and Glorious rosary anytime during the week.',
      descWeeklyTrad: '<strong>Mode: Weekly commitment of 3 classic rosaries</strong> (15 decades / 150 Hail Marys) – Joyful, Sorrowful, and Glorious rosary anytime during the week.',
      todayBadge: 'Today',
      doneBadge: 'Completed ✓',
      rosaryDoneBtn: 'Reset Rosary',
      rosaryDoBtn: '✓ Full Rosary',
      decadeTitle: (idx) => `Decade ${idx + 1}`,
      decadeDoneBtn: 'Clear',
      decadeDoBtn: 'Full Decade',
      subBeadTitle: 'Subtract one Hail Mary',
      addBeadTitle: 'Add one Hail Mary',
      beadAria: (idx, b, active) => `Hail Mary #${b} (${active ? 'prayed' : 'unprayed'})`,
      // History
      historyTitle: 'Prayer History',
      historyShow: 'Show history',
      historyHide: 'Hide history',
      historyEmpty: 'No previous weeks recorded yet.',
      historyWeekCol: 'Week',
      historyDatesCol: 'Dates',
      historyHailMarysCol: 'Hail Marys',
      historyRosariesCol: 'Rosaries',
      historyPctCol: 'Progress',
      historyJumpBtn: 'View',
      historyGoToWeek: 'Go to week',
      // Export / Import
      dataTitle: 'Data backup',
      exportBtn: '⬇ Export data',
      importBtn: '⬆ Import data',
      importConfirm: 'This will REPLACE all your current prayer data with the imported file. Continue?',
      importSuccess: 'Data imported successfully!',
      importError: 'Could not read the file. Make sure it is a valid rosary tracker export.',
      safariBanner: '⚠️ <strong>Safari tip:</strong> Safari may clear local data after 7 days without a visit. Use <em>Export data</em> to keep a safe backup.',
      // View Modes & Pocket Mode
      viewModeOverview: '📋 Full overview',
      viewModePocket: '📱 Pocket Mode',
      focusModeEnter: '⛶ Fullscreen',
      focusModeExit: '✕ Exit Fullscreen',
      pocketPrayingNow: 'Praying now',
      pocketNextDecadeBtn: 'Next decade (+1)',
      pocketPrevDecade: 'Previous decade',
      pocketDoneAll: 'Week completed! Deo gratias',
      pocketUndo: 'Undo',
      pocketFullDecade: 'Full decade',
      pocketResetDecade: 'Reset decade',
      pocketDecadeLabel: (idx) => `Decade ${idx + 1} of 5`,
      pocketFocusBanner: 'Distraction-free Prayer Mode',
      // Cloud Sync (Firebase BYOB)
      syncTitle: 'Cloud Sync (Firebase Realtime Database)',
      syncDesc: 'Sync your complete rosary tracker — all decades, prayers, history, and settings — in real time across multiple browsers and devices using your own free Firebase Realtime Database.',
      activeModeLabel: 'Sync Status',
      modeLocal: 'Local Mode (Device only)',
      modeConnecting: 'Connecting to Firebase...',
      modeConnected: 'Connected & Live Synced',
      lastSyncLabel: 'Last synced',
      justNow: 'just now',
      configLabel: 'Firebase Web Configuration (JSON)',
      configPlaceholder: '{\n  "apiKey": "...",\n  "authDomain": "...",\n  "databaseURL": "https://your-project-default-rtdb.firebaseio.com",\n  "projectId": "your-project",\n  "storageBucket": "...",\n  "messagingSenderId": "...",\n  "appId": "..."\n}',
      saveConnectBtn: 'Save & Connect',
      disconnectBtn: 'Disconnect / Use Local Mode',
      forceSyncBtn: 'Force Sync Now',
      syncHelp: '<strong>Security Tip:</strong> In <a href="https://console.firebase.google.com/" target="_blank" rel="noopener">Firebase Console</a>, enable <strong>Authentication &gt; Sign-in method &gt; Anonymous</strong>, and set Database Rules to <code>{ "rules": { ".read": "auth != null", ".write": "auth != null" } }</code>. This eliminates the public security warning while syncing seamlessly across your devices without passwords.',
      errorInvalidJson: 'Invalid JSON: Please ensure you paste valid JSON configuration.',
      errorEmptyConfig: 'Please paste your Firebase configuration JSON before connecting.',
    },
    cs: {
      days: ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'],
      mysteries: {
        radostny: {
          name: 'Radostný růženec',
          items: [
            'kterého jsi z Ducha Svatého počala',
            's kterým jsi Alžbětu navštívila',
            'kterého jsi v Betlémě porodila',
            'kterého jsi v chrámě obětovala',
            'kterého jsi v chrámě nalezla'
          ]
        },
        svetla: {
          name: 'Růženec světla',
          items: [
            'který byl pokřtěn v Jordánu',
            'který zjevil v Káně svou božskou moc',
            'který hlásal Boží království a vyzýval k pokání',
            'který na hoře Proměnění zjevil svou slávu',
            'který ustanovil Eucharistii'
          ]
        },
        bolestny: {
          name: 'Bolestný růženec',
          items: [
            'který se pro nás krví potil',
            'který byl pro nás bičován',
            'který byl pro nás trním korunován',
            'který pro nás nesl těžký kříž',
            'který byl pro nás ukřižován'
          ]
        },
        slavny: {
          name: 'Slavný růženec',
          items: [
            'který z mrtvých vstal',
            'který na nebe vstoupil',
            'který Ducha Svatého seslal',
            'který tě, Panno, do nebe vzal',
            'který tě v nebi korunoval'
          ]
        }
      },
      prevWeek: '← Předchozí',
      nextWeek: 'Následující →',
      thisWeek: 'Tento týden',
      weekTitle: (num, isCur) => isCur ? `${num}. týden (aktuální)` : `${num}. týden`,
      resetWeekBtn: 'Vynulovat týden',
      resetConfirm: (num, range) => `Opravdu chcete vynulovat záznamy pro týden ${num} (${range})?`,
      summaryDailyTitle: 'Postup týdenního denního růžence',
      summaryWeeklyTitle: 'Týdenní postup modlitby',
      hailMarys: 'Zdrávasů',
      decades: 'Desátků',
      fullRosaries: 'Celých růženců',
      dailyCompleteBanner: '<strong>Cíl splněn!</strong> Pomodlen růženec na každý den v týdnu (7 růženců). <em>Deo gratias!</em>',
      weeklyCompleteBanner: '<strong>Týdenní závazek splněn!</strong> Všechny růžence pro tento týden jsou dokončeny. <em>Deo gratias!</em>',
      dailyModeToggle: 'Růženec denně (1 růženec každý den v týdnu)',
      lightToggle: 'Zahrnout i růženec světla',
      descDailyLight: '<strong>Režim: Růženec denně s růžencem světla</strong> (7 růženců / 35 desátků) podle apoštolského listu sv. Jana Pavla II. <em>Rosarium Virginis Mariae</em>:<br/>Po: radostný, Út: bolestný, St: slavný, Čt: světla, Pá: bolestný, So: radostný, Ne: slavný.',
      descDailyTrad: '<strong>Režim: Růženec denně – tradiční</strong> (7 růženců / 35 desátků) podle tradiční církevní praxe:<br/>Po: radostný, Út: bolestný, St: slavný, Čt: radostný, Pá: bolestný, So: slavný, Ne: slavný.',
      descWeeklyLight: '<strong>Režim: Týdenní závazek 4 růžence</strong> (20 desátků / 200 Zdrávasů) – radostný, světla, bolestný a slavný růženec kdykoliv během týdne.',
      descWeeklyTrad: '<strong>Režim: Týdenní závazek 3 klasické růžence</strong> (15 desátků / 150 Zdrávasů) – radostný, bolestný a slavný růženec kdykoliv během týdne.',
      todayBadge: 'Dnes',
      doneBadge: 'Dokončeno ✓',
      rosaryDoneBtn: 'Vynulovat růženec',
      rosaryDoBtn: '✓ Celý růženec',
      decadeTitle: (idx) => `${idx + 1}. desátek`,
      decadeDoneBtn: 'Zrušit',
      decadeDoBtn: 'Celý desátek',
      subBeadTitle: 'Ubrat jeden Zdrávas',
      addBeadTitle: 'Přidat jeden Zdrávas',
      beadAria: (idx, b, active) => `${b}. Zdrávas (${active ? 'pomodleno' : 'nepomodleno'})`,
      // History
      historyTitle: 'Historie modlitby',
      historyShow: 'Zobrazit historii',
      historyHide: 'Skrýt historii',
      historyEmpty: 'Žádné předchozí týdny zatím nebyly zaznamenány.',
      historyWeekCol: 'Týden',
      historyDatesCol: 'Datum',
      historyHailMarysCol: 'Zdrávasů',
      historyRosariesCol: 'Růžence',
      historyPctCol: 'Postup',
      historyJumpBtn: 'Zobrazit',
      historyGoToWeek: 'Přejít na týden',
      // Export / Import
      dataTitle: 'Záloha dat',
      exportBtn: '⬇ Exportovat data',
      importBtn: '⬆ Importovat data',
      importConfirm: 'Tato akce NAHRADÍ veškerá aktuální data záznamy ze souboru. Opravdu pokračovat?',
      importSuccess: 'Data byla úspěšně importována!',
      importError: 'Soubor se nepodařilo načíst. Ujistěte se, že jde o platný export z modlitebního záznamníku.',
      safariBanner: '⚠️ <strong>Poznámka pro Safari:</strong> Safari může po 7 dnech bez návštěvy smazat lokální data. Použijte <em>Exportovat data</em> pro zálohu.',
      // View Modes & Pocket Mode
      viewModeOverview: '📋 Kompletní přehled',
      viewModePocket: '📱 Kapesní režim',
      focusModeEnter: '⛶ Celá obrazovka',
      focusModeExit: '✕ Ukončit celou obrazovku',
      pocketPrayingNow: 'Právě se modlíte',
      pocketNextDecadeBtn: 'Další desátek (+1)',
      pocketPrevDecade: 'Předchozí desátek',
      pocketDoneAll: 'Týden dokončen! Deo gratias',
      pocketUndo: 'Ubrat',
      pocketFullDecade: 'Celý desátek',
      pocketResetDecade: 'Vynulovat desátek',
      pocketDecadeLabel: (idx) => `${idx + 1}. desátek z 5`,
      pocketFocusBanner: 'Soustředěný režim modlitby',
      // Cloud Sync (Firebase BYOB)
      syncTitle: 'Cloudová synchronizace (Firebase Realtime Database)',
      syncDesc: 'Synchronizujte celý svůj modlitební záznamník — všechny desátky, modlitby, historii i nastavení — v reálném čase mezi více prohlížeči a zařízeními pomocí vlastní bezplatné databáze Firebase Realtime Database.',
      activeModeLabel: 'Stav synchronizace',
      modeLocal: 'Lokální režim (pouze v tomto zařízení)',
      modeConnecting: 'Připojování k Firebase...',
      modeConnected: 'Připojeno a synchronizováno',
      lastSyncLabel: 'Poslední synchronizace',
      justNow: 'právě teď',
      configLabel: 'Webová konfigurace Firebase (JSON)',
      configPlaceholder: '{\n  "apiKey": "...",\n  "authDomain": "...",\n  "databaseURL": "https://vas-projekt-default-rtdb.firebaseio.com",\n  "projectId": "vas-projekt",\n  "storageBucket": "...",\n  "messagingSenderId": "...",\n  "appId": "..."\n}',
      saveConnectBtn: 'Uložit a připojit',
      disconnectBtn: 'Odpojit / Použít lokální režim',
      forceSyncBtn: 'Synchronizovat nyní',
      syncHelp: '<strong>Tip pro zabezpečení:</strong> Ve <a href="https://console.firebase.google.com/" target="_blank" rel="noopener">Firebase Console</a> povolte <strong>Authentication &gt; Sign-in method &gt; Anonymous</strong> a nastavte pravidla databáze na <code>{ "rules": { ".read": "auth != null", ".write": "auth != null" } }</code>. Tím odstraníte červené bezpečnostní varování a zařízení se budou bezpečně synchronizovat bez nutnosti hesel.',
      errorInvalidJson: 'Neplatný JSON: Ujistěte se, že vkládáte platný formát JSON konfigurace.',
      errorEmptyConfig: 'Před připojením prosím vložte JSON konfiguraci pro Firebase.',
    }
  };

  const FIREBASE_CONFIG_KEY = 'ruzenec_firebase_config';
  const LOCAL_COUNTER_KEY = 'ruzenec_counter';

  let firebaseApp = null;
  let firebaseDb = null;
  let counterRef = null;
  let trackerDataRef = null;
  let connectedRef = null;
  let isFirebaseConfigured = false;
  let isFirebaseConnected = false;
  let currentCounterValue = 0;
  let firebaseErrorMsg = null;
  let syncCardOpen = false;
  let isReceivingRemoteData = false;
  let lastSyncTime = null;

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getLocalCounter() {
    try {
      const val = localStorage.getItem(LOCAL_COUNTER_KEY);
      return val ? parseInt(val, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  }

  function setLocalCounter(val) {
    try {
      localStorage.setItem(LOCAL_COUNTER_KEY, String(val));
    } catch (e) {}
  }

  function formatSyncTime(date) {
    if (!date) return '';
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  function updateCounterDisplay() {
    const liveEl = document.getElementById('tracker-live-counter');
    if (liveEl) liveEl.textContent = currentCounterValue;
    const pocketEl = document.getElementById('tracker-pocket-counter-badge');
    if (pocketEl) pocketEl.textContent = currentCounterValue;
  }

  function updateSyncUI() {
    const lang = getLang();
    const t = I18N[lang] || I18N.en;

    const pillEl = document.getElementById('tracker-sync-status-pill');
    if (pillEl) {
      let modeText = t.modeLocal;
      let modeClass = 'local';
      if (isFirebaseConfigured) {
        if (isFirebaseConnected) {
          modeText = t.modeConnected;
          modeClass = 'connected';
        } else {
          modeText = t.modeConnecting;
          modeClass = 'connecting';
        }
      }
      pillEl.className = 'tracker-sync-pill ' + modeClass;
      pillEl.textContent = modeText;
    }

    const dotEl = document.querySelector('.tracker-sync-status-dot');
    if (dotEl) {
      let dotClass = 'local';
      if (isFirebaseConfigured) {
        dotClass = isFirebaseConnected ? 'connected' : 'connecting';
      }
      dotEl.className = 'tracker-sync-status-dot ' + dotClass;
    }

    const statusTextEl = document.getElementById('tracker-sync-status-text');
    if (statusTextEl) {
      let modeText = t.modeLocal;
      if (isFirebaseConfigured) {
        modeText = isFirebaseConnected ? t.modeConnected : t.modeConnecting;
      }
      statusTextEl.innerHTML = `<strong>${t.activeModeLabel}:</strong> ${modeText}`;
    }

    const timeEl = document.getElementById('tracker-sync-time');
    if (timeEl) {
      if (lastSyncTime) {
        timeEl.textContent = `${t.lastSyncLabel}: ${formatSyncTime(lastSyncTime)}`;
        timeEl.style.display = 'inline-block';
      } else {
        timeEl.style.display = 'none';
      }
    }

    const errEl = document.getElementById('firebase-config-error');
    if (errEl) {
      if (firebaseErrorMsg) {
        errEl.textContent = firebaseErrorMsg;
        errEl.style.display = 'block';
      } else {
        errEl.style.display = 'none';
      }
    }

    const pocketTagEl = document.querySelector('.tracker-pocket-sync-tag');
    if (pocketTagEl) {
      pocketTagEl.className = 'tracker-pocket-sync-tag ' + (isFirebaseConnected ? 'connected' : 'local');
      pocketTagEl.textContent = isFirebaseConnected ? '☁️ Synced' : '💾 Local';
    }
  }

  function handleFirebaseError(err) {
    if (!err) return;
    console.error('Firebase error:', err);
    const msg = err.message || String(err);
    if (msg.includes('PERMISSION_DENIED') || (err.code && String(err.code).includes('PERMISSION_DENIED'))) {
      const isCs = getLang() === 'cs';
      firebaseErrorMsg = isCs
        ? '⚠️ Přístup k Firebase zamítnut (PERMISSION_DENIED). Ujistěte se, že ve Firebase Console máte v sekci Authentication povolenou metodu „Anonymous“ a v Realtime Database pravidla: { "rules": { ".read": "auth != null", ".write": "auth != null" } } (nebo ".read": true, ".write": true).'
        : '⚠️ Firebase permission denied (PERMISSION_DENIED). Make sure in Firebase Console > Authentication you enabled the "Anonymous" sign-in method, and in Realtime Database Rules set: { "rules": { ".read": "auth != null", ".write": "auth != null" } } (or ".read": true, ".write": true).';
    } else {
      firebaseErrorMsg = '⚠️ Firebase: ' + msg;
    }
    updateSyncUI();
  }

  function mergeTrackerData(local, remote) {
    if (!remote || typeof remote !== 'object') return local;
    if (!local || typeof local !== 'object') return remote;

    const merged = {
      settings: {
        includeLight: (typeof remote.settings?.includeLight !== 'undefined')
          ? remote.settings.includeLight
          : !!local.settings?.includeLight,
        dailyMode: (typeof remote.settings?.dailyMode !== 'undefined')
          ? remote.settings.dailyMode
          : !!local.settings?.dailyMode
      },
      weeks: {}
    };

    const allWeekKeys = new Set([
      ...Object.keys(local.weeks || {}),
      ...Object.keys(remote.weeks || {})
    ]);

    allWeekKeys.forEach(function(wKey) {
      const locWeek = (local.weeks && local.weeks[wKey]) || {};
      const remWeek = (remote.weeks && remote.weeks[wKey]) || {};

      const allRosaryKeys = new Set([
        ...Object.keys(locWeek),
        ...Object.keys(remWeek)
      ]);

      merged.weeks[wKey] = {};

      allRosaryKeys.forEach(function(rKey) {
        const locArr = locWeek[rKey];
        const remArr = remWeek[rKey];

        if (Array.isArray(locArr) && Array.isArray(remArr)) {
          merged.weeks[wKey][rKey] = [0, 1, 2, 3, 4].map(function(i) {
            return Math.max(locArr[i] || 0, remArr[i] || 0);
          });
        } else if (Array.isArray(remArr)) {
          merged.weeks[wKey][rKey] = remArr.slice();
        } else if (Array.isArray(locArr)) {
          merged.weeks[wKey][rKey] = locArr.slice();
        }
      });
    });

    return merged;
  }

  function ensureFirebaseScripts(callback) {
    if (typeof firebase !== 'undefined' && firebase.database && firebase.auth) {
      callback();
      return;
    }

    const existing = document.querySelector('script[src*="firebase-app"]');
    if (existing) {
      let attempts = 0;
      const interval = setInterval(function() {
        attempts++;
        if (typeof firebase !== 'undefined' && firebase.database) {
          clearInterval(interval);
          callback();
        } else if (attempts > 50) {
          clearInterval(interval);
          callback();
        }
      }, 100);
      return;
    }

    const s1 = document.createElement('script');
    s1.src = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js';
    s1.onload = function() {
      const sAuth = document.createElement('script');
      sAuth.src = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js';
      sAuth.onload = function() {
        const s2 = document.createElement('script');
        s2.src = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js';
        s2.onload = callback;
        s2.onerror = callback;
        document.head.appendChild(s2);
      };
      sAuth.onerror = function() {
        const s2 = document.createElement('script');
        s2.src = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js';
        s2.onload = callback;
        s2.onerror = callback;
        document.head.appendChild(s2);
      };
      document.head.appendChild(sAuth);
    };
    s1.onerror = callback;
    document.head.appendChild(s1);
  }

  var firebaseSyncInProgress = false;

  function initFirebaseSync(callback) {
    // If already initializing (e.g. MkDocs SPA navigation fired init() again), just queue render
    if (firebaseSyncInProgress) {
      if (callback) {
        var waitForInit = setInterval(function() {
          if (!firebaseSyncInProgress) {
            clearInterval(waitForInit);
            if (callback) callback();
          }
        }, 100);
      }
      return;
    }
    firebaseSyncInProgress = true;

    const savedConfigRaw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (!savedConfigRaw) {
      isFirebaseConfigured = false;
      isFirebaseConnected = false;
      currentCounterValue = getLocalCounter();
      firebaseSyncInProgress = false;
      if (callback) callback();
      return;
    }

    let config;
    try {
      config = JSON.parse(savedConfigRaw);
    } catch (e) {
      console.warn('Saved Firebase config is invalid JSON:', e);
      isFirebaseConfigured = false;
      isFirebaseConnected = false;
      currentCounterValue = getLocalCounter();
      firebaseSyncInProgress = false;
      if (callback) callback();
      return;
    }

    if (!config.databaseURL && config.projectId) {
      config.databaseURL = 'https://' + config.projectId + '-default-rtdb.firebaseio.com';
    }

    isFirebaseConfigured = true;

    ensureFirebaseScripts(function() {
      try {
        if (typeof firebase === 'undefined' || !firebase.initializeApp) {
          throw new Error('Firebase SDK could not be loaded');
        }

        if (trackerDataRef) {
          try { trackerDataRef.off('value'); } catch (e) {}
          trackerDataRef = null;
        }
        if (counterRef) {
          try { counterRef.off('value'); } catch (e) {}
          counterRef = null;
        }
        if (connectedRef) {
          try { connectedRef.off('value'); } catch (e) {}
          connectedRef = null;
        }

        // Reuse an existing app if already initialized (prevents race on MkDocs SPA navigation
        // where document$.subscribe re-runs init() while a prior signInAnonymously is in flight)
        if (firebase.apps && firebase.apps.length > 0) {
          firebaseApp = firebase.app();
        } else {
          firebaseApp = firebase.initializeApp(config);
        }

        function setupDatabaseListeners() {
          firebaseDb = firebase.database();
          trackerDataRef = firebaseDb.ref('tracker_data');
          counterRef = firebaseDb.ref('counter');
          connectedRef = firebaseDb.ref('.info/connected');

          // Real-time connection listener
          connectedRef.on('value', function(snap) {
            isFirebaseConnected = (snap.val() === true);
            updateSyncUI();
          });

          // Real-time tracker data listener: syncs all prayers, beads, weeks across devices!
          trackerDataRef.on('value', function(snapshot) {
            const remoteData = snapshot.val();
            if (remoteData) {
              isReceivingRemoteData = true;
              try {
                const localData = loadData();
                const merged = mergeTrackerData(localData, remoteData);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                lastSyncTime = new Date();
                firebaseErrorMsg = null;
                if (window.RosaryTracker) {
                  window.RosaryTracker.render();
                }
              } finally {
                isReceivingRemoteData = false;
              }
            } else {
              // New database: seed with local tracker data if present
              const localData = loadData();
              if (localData && localData.weeks && Object.keys(localData.weeks).length > 0) {
                trackerDataRef.set(localData);
                lastSyncTime = new Date();
              }
            }
            updateSyncUI();
          }, function(error) {
            handleFirebaseError(error);
          });

          // Real-time counter listener
          counterRef.on('value', function(snapshot) {
            const val = snapshot.val();
            currentCounterValue = (typeof val === 'number') ? val : (parseInt(val, 10) || 0);
            updateCounterDisplay();
          }, function(error) {
            handleFirebaseError(error);
          });

          if (callback) callback();
          firebaseSyncInProgress = false;
        }

        // Sign in anonymously so auth != null rules pass; fall through if auth unavailable
        if (typeof firebase.auth === 'function') {
          var authInstance;
          try {
            authInstance = firebase.auth();
          } catch (authInitErr) {
            console.warn('Firebase Auth init skipped:', authInitErr.message);
            authInstance = null;
          }
          if (authInstance) {
            authInstance.signInAnonymously()
              .then(function() {
                setupDatabaseListeners();
              })
              .catch(function(authErr) {
                // Auth failed (network error, domain not authorized, etc.) — still set up DB
                // The DB will work if rules allow unauthenticated access, or show a PERMISSION_DENIED
                console.warn('Anonymous sign-in skipped:', authErr.code, authErr.message);
                setupDatabaseListeners();
              });
          } else {
            setupDatabaseListeners();
          }
        } else {
          setupDatabaseListeners();
        }

      } catch (err) {
        handleFirebaseError(err);
        isFirebaseConnected = false;
        firebaseSyncInProgress = false;
        if (callback) callback();
      }
    });
  }

  function getLang() {
    if (typeof document !== 'undefined' && document.documentElement) {
      if (document.documentElement.lang === 'cs' || window.location.pathname.startsWith('/cs/')) {
        return 'cs';
      }
    }
    return 'en';
  }

  let currentWeekOffset = 0;
  let historyVisible = false;
  let currentViewMode = 'overview';
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'pocket') {
      currentViewMode = 'pocket';
    } else if (localStorage.getItem('ruzenec_view_mode')) {
      currentViewMode = localStorage.getItem('ruzenec_view_mode');
    }
  } catch (e) {}

  let pocketActiveKey = null;
  let pocketActiveDecade = null;
  let isFocusMode = false;

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { settings: { includeLight: false, dailyMode: false }, weeks: {} };
      }
      const data = JSON.parse(raw);
      if (!data.settings) data.settings = { includeLight: false, dailyMode: false };
      if (typeof data.settings.includeLight === 'undefined') data.settings.includeLight = false;
      if (typeof data.settings.dailyMode === 'undefined') data.settings.dailyMode = false;
      if (!data.weeks) data.weeks = {};
      return data;
    } catch (e) {
      console.error('Error loading tracker data:', e);
      return { settings: { includeLight: false, dailyMode: false }, weeks: {} };
    }
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving tracker data:', e);
    }

    // Push full tracker data to Firebase Realtime Database
    if (firebaseDb && trackerDataRef && !isReceivingRemoteData) {
      try {
        trackerDataRef.set(data, function(err) {
          if (err) {
            handleFirebaseError(err);
          } else {
            lastSyncTime = new Date();
            firebaseErrorMsg = null;
            updateSyncUI();
          }
        });

        // Also atomically increment or update /counter
        if (counterRef && typeof firebase !== 'undefined' && firebase.database && firebase.database.ServerValue) {
          counterRef.set(firebase.database.ServerValue.increment(1));
        }
      } catch (e) {
        handleFirebaseError(e);
      }
    }
  }

  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - (day === 0 ? 6 : day - 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  function getISOWeekKey(d) {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    const weekNumber = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
  }

  function getMondayFromWeekKey(weekKey) {
    const [yearStr, weekStr] = weekKey.split('-W');
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStr, 10);
    // Jan 4 is always in ISO week 1
    const jan4 = new Date(year, 0, 4);
    const dow = (jan4.getDay() + 6) % 7; // 0=Mon
    const startOfWeek1 = new Date(jan4);
    startOfWeek1.setDate(jan4.getDate() - dow);
    const monday = new Date(startOfWeek1);
    monday.setDate(startOfWeek1.getDate() + (week - 1) * 7);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  function formatDate(dt, lang) {
    if (lang === 'cs') {
      return `${dt.getDate()}. ${dt.getMonth() + 1}. ${dt.getFullYear()}`;
    }
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getTargetDate(offset) {
    const now = new Date();
    return new Date(now.getTime() + offset * 7 * 86400000);
  }

  function getWeekInfo(offset, lang) {
    const monday = getMonday(getTargetDate(offset));
    const sunday = new Date(monday.getTime() + 6 * 86400000);
    const weekKey = getISOWeekKey(monday);
    const weekNum = parseInt(weekKey.split('-W')[1], 10);
    return {
      key: weekKey,
      weekNum,
      monday,
      sunday,
      formattedRange: `${formatDate(monday, lang)} – ${formatDate(sunday, lang)}`,
      isCurrent: offset === 0
    };
  }

  function getWeekData(data, weekKey) {
    if (!data.weeks[weekKey]) data.weeks[weekKey] = {};
    return data.weeks[weekKey];
  }

  function ensureKeyArray(weekData, key) {
    if (!Array.isArray(weekData[key]) || weekData[key].length !== 5) {
      weekData[key] = [0, 0, 0, 0, 0];
    }
    return weekData[key];
  }

  // Summarise a week's raw data into {totalHailMarys, totalDecades, completedRosaries}
  // independent of mode — just counts everything stored
  function summariseWeekData(weekData) {
    let totalHailMarys = 0;
    let totalDecades = 0;
    let completedRosaries = 0;
    Object.values(weekData).forEach(arr => {
      if (!Array.isArray(arr)) return;
      let rosaryHM = 0;
      let rosaryDec = 0;
      arr.forEach(c => {
        rosaryHM += c;
        if (c >= 10) rosaryDec++;
      });
      totalHailMarys += rosaryHM;
      totalDecades += rosaryDec;
      if (rosaryDec === 5) completedRosaries++;
    });
    return { totalHailMarys, totalDecades, completedRosaries };
  }

  function getRosaryConfig(dailyMode, includeLight, lang) {
    const t = I18N[lang] || I18N.en;
    const todayIndex = (new Date().getDay() + 6) % 7;

    if (dailyMode) {
      const base = includeLight ? [
        { dayIndex: 0, rosaryType: 'radostny', key: 'radostny' },
        { dayIndex: 1, rosaryType: 'bolestny', key: 'bolestny' },
        { dayIndex: 2, rosaryType: 'slavny',   key: 'slavny' },
        { dayIndex: 3, rosaryType: 'svetla',   key: 'svetla' },
        { dayIndex: 4, rosaryType: 'bolestny', key: 'fri_bolestny' },
        { dayIndex: 5, rosaryType: 'radostny', key: 'sat_radostny' },
        { dayIndex: 6, rosaryType: 'slavny',   key: 'sun_slavny' }
      ] : [
        { dayIndex: 0, rosaryType: 'radostny', key: 'radostny' },
        { dayIndex: 1, rosaryType: 'bolestny', key: 'bolestny' },
        { dayIndex: 2, rosaryType: 'slavny',   key: 'slavny' },
        { dayIndex: 3, rosaryType: 'radostny', key: 'thu_radostny' },
        { dayIndex: 4, rosaryType: 'bolestny', key: 'fri_bolestny' },
        { dayIndex: 5, rosaryType: 'slavny',   key: 'sat_slavny' },
        { dayIndex: 6, rosaryType: 'slavny',   key: 'sun_slavny' }
      ];
      return base.map(item => ({
        ...item,
        dayName: t.days[item.dayIndex],
        title: `${t.days[item.dayIndex]}: ${t.mysteries[item.rosaryType].name}`,
        mysteries: t.mysteries[item.rosaryType].items,
        isToday: item.dayIndex === todayIndex
      }));
    }

    const list = [
      { title: t.mysteries.radostny.name, rosaryType: 'radostny', key: 'radostny', mysteries: t.mysteries.radostny.items }
    ];
    if (includeLight) {
      list.push({ title: t.mysteries.svetla.name, rosaryType: 'svetla', key: 'svetla', mysteries: t.mysteries.svetla.items });
    }
    list.push(
      { title: t.mysteries.bolestny.name, rosaryType: 'bolestny', key: 'bolestny', mysteries: t.mysteries.bolestny.items },
      { title: t.mysteries.slavny.name,   rosaryType: 'slavny',   key: 'slavny',   mysteries: t.mysteries.slavny.items }
    );
    return list;
  }

  // ─── History helpers ───────────────────────────────────────────────────────

  function buildHistoryRows(data, currentWeekKey, lang) {
    const allKeys = Object.keys(data.weeks)
      .filter(k => k !== currentWeekKey && Object.keys(data.weeks[k]).length > 0)
      .sort()
      .reverse(); // most recent first
    return allKeys.map(key => {
      const monday = getMondayFromWeekKey(key);
      const sunday = new Date(monday.getTime() + 6 * 86400000);
      const weekNum = parseInt(key.split('-W')[1], 10);
      const { totalHailMarys, totalDecades, completedRosaries } = summariseWeekData(data.weeks[key]);
      // Target: 50 HMs per completed rosary + remaining HMs; just show raw counts
      return {
        key, weekNum, monday, sunday,
        formattedRange: `${formatDate(monday, lang)} – ${formatDate(sunday, lang)}`,
        totalHailMarys, totalDecades, completedRosaries
      };
    });
  }

  // Convert a stored week key to the offset relative to today, for navigation
  function weekKeyToOffset(weekKey) {
    const monday = getMondayFromWeekKey(weekKey);
    const todayMonday = getMonday(new Date());
    const diffMs = monday.getTime() - todayMonday.getTime();
    return Math.round(diffMs / (7 * 86400000));
  }

  // ─── Pocket Mode resolution ────────────────────────────────────────────────

  function resolvePocketSelection(activeRosaries, weekData) {
    let rosary = activeRosaries.find(r => r.key === pocketActiveKey);
    if (!rosary) {
      if (currentWeekOffset === 0) {
        rosary = activeRosaries.find(r => r.isToday);
      }
      if (!rosary) {
        rosary = activeRosaries.find(r => {
          const counts = ensureKeyArray(weekData, r.key);
          return counts.some(c => c < 10);
        });
      }
      if (!rosary && activeRosaries.length > 0) {
        rosary = activeRosaries[0];
      }
      if (rosary) pocketActiveKey = rosary.key;
    }

    if (rosary) {
      const counts = ensureKeyArray(weekData, rosary.key);
      if (pocketActiveDecade === null || pocketActiveDecade < 0 || pocketActiveDecade > 4) {
        const firstInc = counts.findIndex(c => c < 10);
        pocketActiveDecade = firstInc !== -1 ? firstInc : 0;
      }
    } else {
      pocketActiveDecade = 0;
    }

    return { activeRosary: rosary, activeDecadeIndex: pocketActiveDecade || 0 };
  }

  // ─── Global Tracker API ────────────────────────────────────────────────────

  window.RosaryTracker = {
    setViewMode: function(mode) {
      currentViewMode = mode;
      try {
        localStorage.setItem('ruzenec_view_mode', mode);
      } catch (e) {}
      this.render();
    },

    toggleFocusMode: function() {
      isFocusMode = !isFocusMode;
      if (isFocusMode) {
        document.body.classList.add('tracker-focus-mode');
        try {
          const el = document.documentElement;
          if (el.requestFullscreen) {
            el.requestFullscreen().catch(() => {});
          } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
          }
        } catch (e) {}
      } else {
        document.body.classList.remove('tracker-focus-mode');
        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        } catch (e) {}
      }
      this.render();
    },

    exitFocusMode: function() {
      if (isFocusMode) {
        this.toggleFocusMode();
      }
    },

    pocketSelectRosary: function(key) {
      pocketActiveKey = key;
      const data = loadData();
      const lang = getLang();
      const weekInfo = getWeekInfo(currentWeekOffset, lang);
      const weekData = getWeekData(data, weekInfo.key);
      const counts = ensureKeyArray(weekData, key);
      const firstInc = counts.findIndex(c => c < 10);
      pocketActiveDecade = firstInc !== -1 ? firstInc : 0;
      this.render();
    },

    pocketStepDecade: function(delta) {
      const data = loadData();
      const lang = getLang();
      const weekInfo = getWeekInfo(currentWeekOffset, lang);
      const weekData = getWeekData(data, weekInfo.key);
      const includeLight = !!data.settings.includeLight;
      const dailyMode = !!data.settings.dailyMode;
      const activeRosaries = getRosaryConfig(dailyMode, includeLight, lang);
      const selection = resolvePocketSelection(activeRosaries, weekData);
      if (!selection.activeRosary) return;

      const curRosIdx = activeRosaries.findIndex(r => r.key === selection.activeRosary.key);
      let newDecade = selection.activeDecadeIndex + delta;

      if (newDecade >= 0 && newDecade <= 4) {
        pocketActiveDecade = newDecade;
      } else if (newDecade > 4) {
        const nextRos = activeRosaries[(curRosIdx + 1) % activeRosaries.length];
        pocketActiveKey = nextRos.key;
        pocketActiveDecade = 0;
      } else if (newDecade < 0) {
        const prevRos = activeRosaries[(curRosIdx - 1 + activeRosaries.length) % activeRosaries.length];
        pocketActiveKey = prevRos.key;
        pocketActiveDecade = 4;
      }
      this.render();
    },

    pocketTapMain: function() {
      const data = loadData();
      const lang = getLang();
      const weekInfo = getWeekInfo(currentWeekOffset, lang);
      const weekData = getWeekData(data, weekInfo.key);
      const includeLight = !!data.settings.includeLight;
      const dailyMode = !!data.settings.dailyMode;
      const activeRosaries = getRosaryConfig(dailyMode, includeLight, lang);
      const selection = resolvePocketSelection(activeRosaries, weekData);
      if (!selection.activeRosary) return;

      const rosaryKey = selection.activeRosary.key;
      const dIdx = selection.activeDecadeIndex;
      const counts = ensureKeyArray(weekData, rosaryKey);
      const currentCount = counts[dIdx] || 0;

      if (currentCount < 10) {
        counts[dIdx] = currentCount + 1;
        saveData(data);
        incrementCounter();
        this.render();
      } else {
        // Current decade is already 10! Advance to next decade or next incomplete rosary
        if (dIdx < 4) {
          pocketActiveDecade = dIdx + 1;
          const nextCounts = ensureKeyArray(weekData, rosaryKey);
          nextCounts[pocketActiveDecade] = Math.min(10, (nextCounts[pocketActiveDecade] || 0) + 1);
          saveData(data);
          incrementCounter();
          this.render();
        } else {
          // Look for next incomplete rosary
          const curRosIdx = activeRosaries.findIndex(r => r.key === rosaryKey);
          let foundRosary = null;
          for (let i = 1; i <= activeRosaries.length; i++) {
            const candidate = activeRosaries[(curRosIdx + i) % activeRosaries.length];
            const cCounts = ensureKeyArray(weekData, candidate.key);
            if (cCounts.some(c => c < 10)) {
              foundRosary = candidate;
              break;
            }
          }
          if (foundRosary) {
            pocketActiveKey = foundRosary.key;
            const nextRosCounts = ensureKeyArray(weekData, foundRosary.key);
            const firstInc = nextRosCounts.findIndex(c => c < 10);
            pocketActiveDecade = firstInc !== -1 ? firstInc : 0;
            nextRosCounts[pocketActiveDecade] = Math.min(10, (nextRosCounts[pocketActiveDecade] || 0) + 1);
            saveData(data);
            incrementCounter();
            this.render();
          } else {
            this.render();
          }
        }
      }
    },

    pocketFullDecade: function() {
      const data = loadData();
      const lang = getLang();
      const weekInfo = getWeekInfo(currentWeekOffset, lang);
      const weekData = getWeekData(data, weekInfo.key);
      const includeLight = !!data.settings.includeLight;
      const dailyMode = !!data.settings.dailyMode;
      const activeRosaries = getRosaryConfig(dailyMode, includeLight, lang);
      const selection = resolvePocketSelection(activeRosaries, weekData);
      if (!selection.activeRosary) return;

      const counts = ensureKeyArray(weekData, selection.activeRosary.key);
      const currentCount = counts[selection.activeDecadeIndex] || 0;
      counts[selection.activeDecadeIndex] = currentCount >= 10 ? 0 : 10;
      saveData(data);
      this.render();
    },

    setWeekOffset: function(delta) {
      currentWeekOffset += delta;
      this.render();
    },

    resetToToday: function() {
      currentWeekOffset = 0;
      this.render();
    },

    jumpToWeek: function(weekKey) {
      currentWeekOffset = weekKeyToOffset(weekKey);
      this.render();
      // Scroll to top of tracker
      const root = document.getElementById('rosary-tracker-root');
      if (root) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    toggleLight: function() {
      const data = loadData();
      data.settings.includeLight = !data.settings.includeLight;
      saveData(data);
      this.render();
    },

    toggleDailyMode: function() {
      const data = loadData();
      data.settings.dailyMode = !data.settings.dailyMode;
      saveData(data);
      this.render();
    },

    toggleHistory: function() {
      historyVisible = !historyVisible;
      this.render();
    },

    clickBead: function(key, decadeIndex, beadNumber) {
      pocketActiveKey = key;
      pocketActiveDecade = decadeIndex;
      const data = loadData();
      const lang = getLang();
      const weekInfo = getWeekInfo(currentWeekOffset, lang);
      const weekData = getWeekData(data, weekInfo.key);
      const counts = ensureKeyArray(weekData, key);
      const prevVal = counts[decadeIndex] || 0;
      counts[decadeIndex] = (counts[decadeIndex] === beadNumber) ? beadNumber - 1 : beadNumber;
      if (counts[decadeIndex] > prevVal) {
        incrementCounter();
      }
      saveData(data);
      this.render();
    },

    addBead: function(key, decadeIndex, delta) {
      pocketActiveKey = key;
      pocketActiveDecade = decadeIndex;
      const data = loadData();
      const lang = getLang();
      const weekInfo = getWeekInfo(currentWeekOffset, lang);
      const weekData = getWeekData(data, weekInfo.key);
      const counts = ensureKeyArray(weekData, key);
      const prevVal = counts[decadeIndex] || 0;
      counts[decadeIndex] = Math.max(0, Math.min(10, prevVal + delta));
      if (counts[decadeIndex] > prevVal) {
        incrementCounter();
      }
      saveData(data);
      this.render();
    },

    saveFirebaseConfig: function() {
      const textarea = document.getElementById('firebase-config-input');
      const errorEl = document.getElementById('firebase-config-error');
      const lang = getLang();
      const t = I18N[lang] || I18N.en;

      if (errorEl) {
        errorEl.style.display = 'none';
        errorEl.textContent = '';
      }

      const raw = textarea ? textarea.value.trim() : '';
      if (!raw) {
        if (errorEl) {
          errorEl.textContent = t.errorEmptyConfig;
          errorEl.style.display = 'block';
        }
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = t.errorInvalidJson + ' (' + err.message + ')';
          errorEl.style.display = 'block';
        }
        return;
      }

      if (typeof parsed !== 'object' || parsed === null) {
        if (errorEl) {
          errorEl.textContent = t.errorInvalidJson;
          errorEl.style.display = 'block';
        }
        return;
      }

      try {
        localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(parsed, null, 2));
      } catch (e) {
        if (errorEl) {
          errorEl.textContent = 'Storage error: ' + e.message;
          errorEl.style.display = 'block';
        }
        return;
      }

      const self = this;
      initFirebaseSync(function() {
        self.render();
      });
    },

    forceSyncNow: function() {
      if (!firebaseDb || !trackerDataRef) {
        alert(getLang() === 'cs' ? 'Nejprve se prosím připojte k Firebase.' : 'Please connect to Firebase first.');
        return;
      }
      const localData = loadData();
      trackerDataRef.set(localData, function(err) {
        if (err) {
          handleFirebaseError(err);
        } else {
          lastSyncTime = new Date();
          firebaseErrorMsg = null;
          updateSyncUI();
          alert(getLang() === 'cs' ? 'Synchronizace s Firebase byla úspěšná!' : 'Synced successfully with Firebase!');
        }
      });
    },

    disconnectFirebase: function() {
      try {
        if (trackerDataRef) {
          trackerDataRef.off('value');
          trackerDataRef = null;
        }
        if (counterRef) {
          counterRef.off('value');
          counterRef = null;
        }
        if (connectedRef) {
          connectedRef.off('value');
          connectedRef = null;
        }
        if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
          for (let i = 0; i < firebase.apps.length; i++) {
            try { firebase.apps[i].delete(); } catch (e) {}
          }
        }
      } catch (e) {}

      localStorage.removeItem(FIREBASE_CONFIG_KEY);
      isFirebaseConfigured = false;
      isFirebaseConnected = false;
      firebaseErrorMsg = null;
      lastSyncTime = null;
      currentCounterValue = getLocalCounter();
      this.render();
    },

    handleSyncToggle: function(detailsEl) {
      syncCardOpen = detailsEl ? detailsEl.open : false;
    },

    incrementLiveCounter: function() {
      incrementCounter();
      this.render();
    },

    toggleDecade: function(key, decadeIndex) {
      pocketActiveKey = key;
      pocketActiveDecade = decadeIndex;
      const data = loadData();
      const lang = getLang();
      const weekInfo = getWeekInfo(currentWeekOffset, lang);
      const weekData = getWeekData(data, weekInfo.key);
      const counts = ensureKeyArray(weekData, key);
      counts[decadeIndex] = counts[decadeIndex] >= 10 ? 0 : 10;
      saveData(data);
      this.render();
    },

    toggleRosary: function(key) {
      pocketActiveKey = key;
      pocketActiveDecade = 0;
      const data = loadData();
      const lang = getLang();
      const weekInfo = getWeekInfo(currentWeekOffset, lang);
      const weekData = getWeekData(data, weekInfo.key);
      const counts = ensureKeyArray(weekData, key);
      weekData[key] = counts.every(c => c >= 10) ? [0,0,0,0,0] : [10,10,10,10,10];
      saveData(data);
      this.render();
    },

    resetCurrentWeek: function() {
      const lang = getLang();
      const t = I18N[lang] || I18N.en;
      const weekInfo = getWeekInfo(currentWeekOffset, lang);
      if (!confirm(t.resetConfirm(weekInfo.weekNum, weekInfo.formattedRange))) return;
      const data = loadData();
      data.weeks[weekInfo.key] = {};
      saveData(data);
      this.render();
    },

    exportData: function() {
      const data = loadData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const today = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `rosary_tracker_${today}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    triggerImport: function() {
      const input = document.getElementById('tracker-import-input');
      if (input) input.click();
    },

    handleImport: function(inputEl) {
      const lang = getLang();
      const t = I18N[lang] || I18N.en;
      const file = inputEl.files && inputEl.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          // Basic validation
          if (typeof imported !== 'object' || !imported.weeks) {
            throw new Error('Invalid format');
          }
          if (!confirm(t.importConfirm)) {
            inputEl.value = '';
            return;
          }
          // Ensure settings exist
          if (!imported.settings) imported.settings = { includeLight: false, dailyMode: false };
          saveData(imported);
          alert(t.importSuccess);
          window.RosaryTracker.render();
        } catch (err) {
          alert(t.importError);
        }
        inputEl.value = '';
      };
      reader.readAsText(file);
    },

    render: function() {
      const root = document.getElementById('rosary-tracker-root');
      if (!root) return;

      const lang = getLang();
      const t = I18N[lang] || I18N.en;
      const data = loadData();
      const weekInfo = getWeekInfo(currentWeekOffset, lang);
      const weekData = getWeekData(data, weekInfo.key);
      const includeLight = !!data.settings.includeLight;
      const dailyMode = !!data.settings.dailyMode;
      const activeRosaries = getRosaryConfig(dailyMode, includeLight, lang);

      // Calculations
      let totalHailMarys = 0, totalDecades = 0, totalRosariesCompleted = 0;
      const targetRosaries = activeRosaries.length;
      const targetDecades = targetRosaries * 5;
      const targetHailMarys = targetDecades * 10;

      activeRosaries.forEach(r => {
        const counts = ensureKeyArray(weekData, r.key);
        let hm = 0, dec = 0;
        counts.forEach(c => { hm += c; if (c >= 10) dec++; });
        totalHailMarys += hm;
        totalDecades += dec;
        if (dec === 5) totalRosariesCompleted++;
      });

      const pct = Math.min(100, Math.round((totalHailMarys / targetHailMarys) * 100)) || 0;
      const isAllComplete = totalHailMarys >= targetHailMarys;
      const modeDesc = dailyMode
        ? (includeLight ? t.descDailyLight : t.descDailyTrad)
        : (includeLight ? t.descWeeklyLight : t.descWeeklyTrad);

      // Detect Safari
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      // ── Pocket Card calculation ───────────────────────────────────────────
      const { activeRosary, activeDecadeIndex } = resolvePocketSelection(activeRosaries, weekData);
      let pocketCardHtml = '';
      if (activeRosary) {
        const pCounts = ensureKeyArray(weekData, activeRosary.key);
        const curBeadCount = pCounts[activeDecadeIndex] || 0;
        const isCurDecadeDone = curBeadCount >= 10;
        const curMystery = (activeRosary.mysteries && activeRosary.mysteries[activeDecadeIndex]) || '';

        const selectOptions = activeRosaries.map(r => {
          const rc = ensureKeyArray(weekData, r.key);
          const isDone = rc.every(c => c >= 10);
          const sel = r.key === activeRosary.key ? 'selected' : '';
          return `<option value="${r.key}" ${sel}>${r.title} ${isDone ? '✓' : ''}</option>`;
        }).join('');

        let pocketBeadsHtml = '';
        for (let b = 1; b <= 10; b++) {
          const isActive = b <= curBeadCount;
          pocketBeadsHtml += `<button type="button" class="tracker-bead ${isActive ? 'active' : ''}" onclick="RosaryTracker.clickBead('${activeRosary.key}', ${activeDecadeIndex}, ${b})" title="${t.beadAria(activeDecadeIndex, b, isActive)}" aria-pressed="${isActive}">${b}</button>`;
        }

        let mainBtnText = '';
        let mainBtnBadge = `${curBeadCount} / 10`;
        if (curBeadCount < 10) {
          mainBtnText = lang === 'cs' ? '+1 Zdrávas' : '+1 Hail Mary';
        } else if (isAllComplete) {
          mainBtnText = `🎉 ${t.pocketDoneAll}`;
          mainBtnBadge = `10 / 10 ✓`;
        } else {
          mainBtnText = `▶ ${t.pocketNextDecadeBtn}`;
          mainBtnBadge = `10 / 10 ✓`;
        }

        pocketCardHtml = `
          <div class="tracker-pocket-card">
            <div class="tracker-pocket-header">
              <div class="tracker-pocket-badge-row">
                <span class="tracker-pocket-label">${t.pocketPrayingNow}</span>
                <select class="tracker-pocket-rosary-select" onchange="RosaryTracker.pocketSelectRosary(this.value)">
                  ${selectOptions}
                </select>
              </div>
              <div class="tracker-pocket-sync-tag ${isFirebaseConnected ? 'connected' : 'local'}" title="${isFirebaseConnected ? t.modeConnected : t.modeLocal}">
                ${isFirebaseConnected ? '☁️ ' + (lang === 'cs' ? 'Synchronizováno' : 'Synced') : '💾 ' + (lang === 'cs' ? 'Lokální' : 'Local')}
              </div>
            </div>
            <div class="tracker-pocket-decade-nav">
              <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.pocketStepDecade(-1)" title="${t.pocketPrevDecade}">◀</button>
              <div class="tracker-pocket-decade-title">${t.pocketDecadeLabel(activeDecadeIndex)}</div>
              <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.pocketStepDecade(1)" title="${t.pocketNextDecadeBtn}">▶</button>
            </div>
            ${curMystery ? `<div class="tracker-pocket-mystery">„${curMystery}“</div>` : ''}
            <div class="tracker-pocket-beads-wrap" role="group" aria-label="${t.decadeTitle(activeDecadeIndex)}">
              ${pocketBeadsHtml}
            </div>
            <button class="tracker-pocket-main-btn" onclick="RosaryTracker.pocketTapMain()" type="button">
              <div class="tracker-pocket-main-btn-inner">
                <span class="tracker-pocket-main-btn-text">${mainBtnText}</span>
                <span class="tracker-pocket-main-btn-badge">${mainBtnBadge}</span>
              </div>
            </button>
            <div class="tracker-pocket-sub-actions">
              <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.addBead('${activeRosary.key}', ${activeDecadeIndex}, -1)" ${curBeadCount === 0 ? 'disabled style="opacity:0.4;cursor:default;"' : ''}>-1 ${t.pocketUndo}</button>
              <button class="tracker-btn tracker-btn-sm ${isCurDecadeDone ? '' : 'tracker-btn-primary'}" onclick="RosaryTracker.pocketFullDecade()">${isCurDecadeDone ? t.pocketResetDecade : t.pocketFullDecade}</button>
            </div>
          </div>
        `;
      }

      let html = '';

      // ── Safari banner ─────────────────────────────────────────────────────
      if (isSafari) {
        html += `<div class="tracker-safari-banner">${t.safariBanner}</div>`;
      }

      // ── Focus mode banner ────────────────────────────────────────────────
      if (isFocusMode) {
        html += `
          <div class="tracker-focus-banner">
            <span>🕊️ ${t.pocketFocusBanner}</span>
            <button class="tracker-focus-exit-btn" onclick="RosaryTracker.exitFocusMode()">${t.focusModeExit}</button>
          </div>
        `;
      }

      // ── View Mode & Focus switchers ──────────────────────────────────────
      html += `
        <div class="tracker-view-mode-bar">
          <div class="tracker-view-mode-pills">
            <button class="tracker-pill-btn ${currentViewMode === 'pocket' ? 'active' : ''}" onclick="RosaryTracker.setViewMode('pocket')">${t.viewModePocket}</button>
            <button class="tracker-pill-btn ${currentViewMode === 'overview' ? 'active' : ''}" onclick="RosaryTracker.setViewMode('overview')">${t.viewModeOverview}</button>
          </div>
          <button class="tracker-btn tracker-btn-sm tracker-focus-toggle-btn" onclick="RosaryTracker.toggleFocusMode()">
            ${isFocusMode ? t.focusModeExit : t.focusModeEnter}
          </button>
        </div>
      `;

      // ── Week navigation ──────────────────────────────────────────────────
      html += `
        <div class="tracker-week-nav">
          <div class="tracker-week-controls">
            <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.setWeekOffset(-1)">${t.prevWeek}</button>
            ${!weekInfo.isCurrent ? `<button class="tracker-btn tracker-btn-sm tracker-btn-primary" onclick="RosaryTracker.resetToToday()">${t.thisWeek}</button>` : ''}
            <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.setWeekOffset(1)">${t.nextWeek}</button>
          </div>
          <div class="tracker-week-title">
            <span class="tracker-week-number">${t.weekTitle(weekInfo.weekNum, weekInfo.isCurrent)}</span>
            <span class="tracker-week-dates">${weekInfo.formattedRange}</span>
          </div>
          <div>
            <button class="tracker-btn tracker-btn-sm tracker-btn-outline-danger" onclick="RosaryTracker.resetCurrentWeek()">${t.resetWeekBtn}</button>
          </div>
        </div>
      `;

      // ── Pocket Mode Card (shown in Pocket Mode) ───────────────────────────
      if (currentViewMode === 'pocket') {
        html += pocketCardHtml;
      }

      // ── 3. Summary card ───────────────────────────────────────────────────
      html += `
        <div class="tracker-summary-card">
          <div class="tracker-summary-header">
            <h3 class="tracker-summary-title">${dailyMode ? t.summaryDailyTitle : t.summaryWeeklyTitle}</h3>
            <span class="tracker-summary-pct">${pct} %</span>
          </div>
          <div class="tracker-progress-track">
            <div class="tracker-progress-fill ${isAllComplete ? 'completed' : ''}" style="width: ${pct}%;"></div>
          </div>
          <div class="tracker-stats-grid">
            <div class="tracker-stat-box">
              <div class="tracker-stat-value">${totalHailMarys} / ${targetHailMarys}</div>
              <div class="tracker-stat-label">${t.hailMarys}</div>
            </div>
            <div class="tracker-stat-box">
              <div class="tracker-stat-value">${totalDecades} / ${targetDecades}</div>
              <div class="tracker-stat-label">${t.decades}</div>
            </div>
            <div class="tracker-stat-box">
              <div class="tracker-stat-value">${totalRosariesCompleted} / ${targetRosaries}</div>
              <div class="tracker-stat-label">${t.fullRosaries}</div>
            </div>
          </div>
          ${isAllComplete ? `<div class="tracker-complete-banner"><span>🎉</span><div>${dailyMode ? t.dailyCompleteBanner : t.weeklyCompleteBanner}</div></div>` : ''}
        </div>
      `;

      // ── 4. Settings bar ───────────────────────────────────────────────────
      html += `
        <div class="tracker-settings-bar">
          <div class="tracker-settings-group">
            <label class="tracker-toggle-label">
              <input type="checkbox" id="tracker-daily-mode" ${dailyMode ? 'checked' : ''} onchange="RosaryTracker.toggleDailyMode()">
              <span>${t.dailyModeToggle}</span>
            </label>
            <label class="tracker-toggle-label">
              <input type="checkbox" id="tracker-include-light" ${includeLight ? 'checked' : ''} onchange="RosaryTracker.toggleLight()">
              <span>${t.lightToggle}</span>
            </label>
          </div>
          <div class="tracker-settings-desc">${modeDesc}</div>
        </div>
      `;

      // ── 5. Rosary cards (Full Overview) ───────────────────────────────────
      if (currentViewMode !== 'pocket') {
        activeRosaries.forEach(r => {
          const counts = ensureKeyArray(weekData, r.key);
          let rosaryCount = 0, completedDecadesCount = 0;
          counts.forEach(c => { rosaryCount += c; if (c >= 10) completedDecadesCount++; });
          const isRosaryDone = completedDecadesCount === 5;
          const isTodayCard = dailyMode && weekInfo.isCurrent && r.isToday;

          html += `
            <div class="tracker-rosary-card ${isRosaryDone ? 'completed' : ''} ${isTodayCard ? 'today' : ''}">
              <div class="tracker-rosary-header">
                <div class="tracker-rosary-title-wrap">
                  <h3 class="tracker-rosary-title">${r.title}</h3>
                  ${isTodayCard ? `<span class="tracker-badge tracker-badge-today">${t.todayBadge}</span>` : ''}
                  <span class="tracker-badge ${isRosaryDone ? 'completed' : ''}">
                    ${isRosaryDone ? t.doneBadge : `${rosaryCount}/50 (${completedDecadesCount}/5)`}
                  </span>
                </div>
                <div class="tracker-rosary-actions">
                  <button class="tracker-btn tracker-btn-sm ${isRosaryDone ? '' : 'tracker-btn-primary'}" onclick="RosaryTracker.toggleRosary('${r.key}')">
                    ${isRosaryDone ? t.rosaryDoneBtn : t.rosaryDoBtn}
                  </button>
                </div>
              </div>
              <div class="tracker-decades-list">
          `;

          r.mysteries.forEach((mystery, dIdx) => {
            const beadCount = counts[dIdx] || 0;
            const isDecadeDone = beadCount >= 10;
            html += `
              <div class="tracker-decade-item ${isDecadeDone ? 'completed' : ''}">
                <div class="tracker-decade-header">
                  <div class="tracker-decade-info">
                    <span class="tracker-decade-number">${t.decadeTitle(dIdx)}</span>
                    <div class="tracker-decade-mystery">„${mystery}"</div>
                  </div>
                  <div class="tracker-decade-controls">
                    <span class="tracker-decade-counter">${beadCount} / 10</span>
                    <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.addBead('${r.key}', ${dIdx}, -1)" title="${t.subBeadTitle}" ${beadCount === 0 ? 'disabled style="opacity:0.4;cursor:default;"' : ''}>-1</button>
                    <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.addBead('${r.key}', ${dIdx}, 1)" title="${t.addBeadTitle}" ${beadCount >= 10 ? 'disabled style="opacity:0.4;cursor:default;"' : ''}>+1</button>
                    <button class="tracker-btn tracker-btn-sm ${isDecadeDone ? '' : 'tracker-btn-primary'}" onclick="RosaryTracker.toggleDecade('${r.key}', ${dIdx})">
                      ${isDecadeDone ? t.decadeDoneBtn : t.decadeDoBtn}
                    </button>
                  </div>
                </div>
                <div class="tracker-beads-row" role="group" aria-label="${t.decadeTitle(dIdx)}">
            `;
            for (let b = 1; b <= 10; b++) {
              const isActive = b <= beadCount;
              html += `<button type="button" class="tracker-bead ${isActive ? 'active' : ''}" onclick="RosaryTracker.clickBead('${r.key}', ${dIdx}, ${b})" title="${t.beadAria(dIdx, b, isActive)}" aria-pressed="${isActive}">${b}</button>`;
            }
            html += `</div></div>`;
          });

          html += `</div></div>`;
        });
      }

      // ── 6. History ────────────────────────────────────────────────────────
      const historyRows = buildHistoryRows(data, weekInfo.key, lang);
      html += `
        <div class="tracker-history-section">
          <div class="tracker-history-header" onclick="RosaryTracker.toggleHistory()">
            <span class="tracker-history-title">📅 ${t.historyTitle}</span>
            <span class="tracker-history-toggle-btn tracker-btn tracker-btn-sm">
              ${historyVisible ? t.historyHide : t.historyShow}
              <span class="tracker-history-count">${historyRows.length}</span>
            </span>
          </div>
      `;

      if (historyVisible) {
        if (historyRows.length === 0) {
          html += `<p class="tracker-history-empty">${t.historyEmpty}</p>`;
        } else {
          html += `
            <div class="tracker-history-table-wrap">
              <table class="tracker-history-table">
                <thead>
                  <tr>
                    <th>${t.historyWeekCol}</th>
                    <th>${t.historyDatesCol}</th>
                    <th>${t.historyHailMarysCol}</th>
                    <th>${t.historyRosariesCol}</th>
                    <th>${t.historyPctCol}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
          `;
          historyRows.forEach(row => {
            // Infer target from number of distinct keys stored (5 HMs per decade per rosary)
            const storedKeys = Object.keys(data.weeks[row.key]).filter(k => Array.isArray(data.weeks[row.key][k]));
            const targetHM = storedKeys.length * 50;
            const rowPct = targetHM > 0 ? Math.min(100, Math.round((row.totalHailMarys / targetHM) * 100)) : 0;
            const isComplete = rowPct >= 100;
            html += `
              <tr class="${isComplete ? 'tracker-history-row-complete' : ''}">
                <td><span class="tracker-history-week-badge">${row.weekNum}</span></td>
                <td class="tracker-history-dates">${row.formattedRange}</td>
                <td class="tracker-history-num">${row.totalHailMarys}</td>
                <td class="tracker-history-num">${row.completedRosaries} ${isComplete ? '✅' : ''}</td>
                <td>
                  <div class="tracker-history-mini-bar-wrap">
                    <div class="tracker-history-mini-bar ${isComplete ? 'complete' : ''}" style="width: ${rowPct}%;"></div>
                  </div>
                  <span class="tracker-history-pct">${rowPct}%</span>
                </td>
                <td>
                  <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.jumpToWeek('${row.key}')" title="${t.historyGoToWeek} ${row.weekNum}">
                    ${t.historyJumpBtn}
                  </button>
                </td>
              </tr>
            `;
          });
          html += `</tbody></table></div>`;
        }
      }
      html += `</div>`;

      // ── 7. Export / Import ────────────────────────────────────────────────
      html += `
        <div class="tracker-data-io">
          <span class="tracker-data-io-title">💾 ${t.dataTitle}</span>
          <div class="tracker-data-io-btns">
            <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.exportData()">${t.exportBtn}</button>
            <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.triggerImport()">${t.importBtn}</button>
            <input type="file" id="tracker-import-input" accept=".json,application/json" style="display:none" onchange="RosaryTracker.handleImport(this)">
          </div>
        </div>
      `;

      // ── 8. Cloud Sync (Firebase BYOB) ────────────────────────────────────
      const savedConfig = localStorage.getItem(FIREBASE_CONFIG_KEY) || '';
      let modeText = t.modeLocal;
      let modeClass = 'local';
      if (isFirebaseConfigured) {
        if (isFirebaseConnected) {
          modeText = t.modeConnected;
          modeClass = 'connected';
        } else {
          modeText = t.modeConnecting;
          modeClass = 'connecting';
        }
      }

      html += `
        <details class="tracker-sync-card" ${syncCardOpen ? 'open' : ''} ontoggle="RosaryTracker.handleSyncToggle(this)">
          <summary class="tracker-sync-summary">
            <div class="tracker-sync-summary-title">
              <span>☁️ ${t.syncTitle}</span>
              <span id="tracker-sync-status-pill" class="tracker-sync-pill ${modeClass}">
                ${modeText}
              </span>
            </div>
            <span class="tracker-sync-summary-arrow">▼</span>
          </summary>
          <div class="tracker-sync-content">
            <p class="tracker-sync-desc">${t.syncDesc}</p>
            
            <div class="tracker-sync-status-row">
              <span class="tracker-sync-status-dot ${modeClass}"></span>
              <span class="tracker-sync-status-text" id="tracker-sync-status-text">
                <strong>${t.activeModeLabel}:</strong> ${modeText}
              </span>
              <span id="tracker-sync-time" class="tracker-sync-time-badge" style="${lastSyncTime ? 'display:inline-block;' : 'display:none;'}">
                ${t.lastSyncLabel}: ${lastSyncTime ? formatSyncTime(lastSyncTime) : ''}
              </span>
            </div>

            <div id="firebase-config-error" class="tracker-sync-error" style="${firebaseErrorMsg ? 'display:block;' : 'display:none;'}">${firebaseErrorMsg ? escapeHtml(firebaseErrorMsg) : ''}</div>

            <label for="firebase-config-input" class="tracker-sync-label">${t.configLabel}:</label>
            <textarea id="firebase-config-input" class="tracker-sync-textarea" rows="6" placeholder="${escapeHtml(t.configPlaceholder)}">${savedConfig ? escapeHtml(savedConfig) : ''}</textarea>

            <div class="tracker-sync-actions">
              <button type="button" class="tracker-btn tracker-btn-primary" onclick="RosaryTracker.saveFirebaseConfig()">
                💾 ${t.saveConnectBtn}
              </button>
              ${isFirebaseConfigured ? `
                <button type="button" class="tracker-btn" onclick="RosaryTracker.forceSyncNow()">
                  🔄 ${t.forceSyncBtn}
                </button>
              ` : ''}
              <button type="button" class="tracker-btn tracker-btn-outline-danger" onclick="RosaryTracker.disconnectFirebase()">
                ✕ ${t.disconnectBtn}
              </button>
            </div>
            
            <div class="tracker-sync-help">
              <small>${t.syncHelp}</small>
            </div>
          </div>
        </details>
      `;

      root.innerHTML = html;
    }
  };

  // Initialization
  function init() {
    initFirebaseSync(function() {
      if (document.getElementById('rosary-tracker-root')) {
        window.RosaryTracker.render();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  if (typeof document$ !== 'undefined') {
    document$.subscribe(function() { init(); });
  }

  document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement && isFocusMode) {
      isFocusMode = false;
      document.body.classList.remove('tracker-focus-mode');
      if (window.RosaryTracker) window.RosaryTracker.render();
    }
  });
  document.addEventListener('webkitfullscreenchange', function() {
    if (!document.webkitFullscreenElement && isFocusMode) {
      isFocusMode = false;
      document.body.classList.remove('tracker-focus-mode');
      if (window.RosaryTracker) window.RosaryTracker.render();
    }
  });
})();
