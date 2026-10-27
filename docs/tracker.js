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
    }
  };

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

  // ─── Global Tracker API ────────────────────────────────────────────────────

  window.RosaryTracker = {
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
      const data = loadData();
      const lang = getLang();
      const weekInfo = getWeekInfo(currentWeekOffset, lang);
      const weekData = getWeekData(data, weekInfo.key);
      const counts = ensureKeyArray(weekData, key);
      counts[decadeIndex] = (counts[decadeIndex] === beadNumber) ? beadNumber - 1 : beadNumber;
      saveData(data);
      this.render();
    },

    addBead: function(key, decadeIndex, delta) {
      const data = loadData();
      const lang = getLang();
      const weekInfo = getWeekInfo(currentWeekOffset, lang);
      const weekData = getWeekData(data, weekInfo.key);
      const counts = ensureKeyArray(weekData, key);
      counts[decadeIndex] = Math.max(0, Math.min(10, (counts[decadeIndex] || 0) + delta));
      saveData(data);
      this.render();
    },

    toggleDecade: function(key, decadeIndex) {
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

      let html = '';

      // ── 1. Safari banner ─────────────────────────────────────────────────
      if (isSafari) {
        html += `<div class="tracker-safari-banner">${t.safariBanner}</div>`;
      }

      // ── 2. Week navigation ────────────────────────────────────────────────
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

      // ── 5. Rosary cards ───────────────────────────────────────────────────
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

      root.innerHTML = html;
    }
  };

  // Initialization
  function init() {
    if (document.getElementById('rosary-tracker-root')) {
      window.RosaryTracker.render();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  if (typeof document$ !== 'undefined') {
    document$.subscribe(function() { init(); });
  }
})();
