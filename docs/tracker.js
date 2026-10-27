// Weekly & Daily Rosary Tracker logic

(function() {
  const STORAGE_KEY = 'ruzenec_weekly_tracker_v1';

  const MYSTERIES = {
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
  };

  let currentWeekOffset = 0;

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {
          settings: { includeLight: false, dailyMode: false },
          weeks: {}
        };
      }
      const data = JSON.parse(raw);
      if (!data.settings) data.settings = { includeLight: false, dailyMode: false };
      if (typeof data.settings.includeLight === 'undefined') data.settings.includeLight = false;
      if (typeof data.settings.dailyMode === 'undefined') data.settings.dailyMode = false;
      if (!data.weeks) data.weeks = {};
      return data;
    } catch (e) {
      console.error('Error loading tracker data:', e);
      return {
        settings: { includeLight: false, dailyMode: false },
        weeks: {}
      };
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

  function getTargetDate(offset) {
    const now = new Date();
    const target = new Date(now.getTime() + offset * 7 * 86400000);
    return target;
  }

  function getWeekInfo(offset) {
    const targetDate = getTargetDate(offset);
    const monday = getMonday(targetDate);
    const sunday = new Date(monday.getTime() + 6 * 86400000);
    const weekKey = getISOWeekKey(monday);

    const formatDate = (dt) => `${dt.getDate()}. ${dt.getMonth() + 1}. ${dt.getFullYear()}`;
    const weekNum = weekKey.split('-W')[1];

    return {
      key: weekKey,
      weekNum: parseInt(weekNum, 10),
      monday: monday,
      sunday: sunday,
      formattedRange: `${formatDate(monday)} – ${formatDate(sunday)}`,
      isCurrent: offset === 0
    };
  }

  function getWeekData(data, weekKey) {
    if (!data.weeks[weekKey]) {
      data.weeks[weekKey] = {};
    }
    return data.weeks[weekKey];
  }

  function ensureKeyArray(weekData, key) {
    if (!Array.isArray(weekData[key]) || weekData[key].length !== 5) {
      weekData[key] = [0, 0, 0, 0, 0];
    }
    return weekData[key];
  }

  /**
   * Structure of rosaries according to mode:
   *
   * 1. Weekly mode (dailyMode = false):
   *    - Radostný (key: 'radostny')
   *    - Světla (key: 'svetla', if includeLight)
   *    - Bolestný (key: 'bolestny')
   *    - Slavný (key: 'slavny')
   *
   * 2. Daily mode (dailyMode = true) according to Church guidance:
   *    With Light (Pope John Paul II, Rosarium Virginis Mariae):
   *    - Pondělí: Radostný (key: 'radostny')
   *    - Úterý:   Bolestný (key: 'bolestny')
   *    - Středa:  Slavný   (key: 'slavny')
   *    - Čtvrtek: Světla   (key: 'svetla')
   *    - Pátek:   Bolestný (key: 'fri_bolestny')
   *    - Sobota:  Radostný (key: 'sat_radostny')
   *    - Neděle:  Slavný   (key: 'sun_slavny')
   *
   *    Without Light (Traditional Church practice):
   *    - Pondělí: Radostný (key: 'radostny')
   *    - Úterý:   Bolestný (key: 'bolestny')
   *    - Středa:  Slavný   (key: 'slavny')
   *    - Čtvrtek: Radostný (key: 'thu_radostny')
   *    - Pátek:   Bolestný (key: 'fri_bolestny')
   *    - Sobota:  Slavný   (key: 'sat_slavny')
   *    - Neděle:  Slavný   (key: 'sun_slavny')
   *
   * In both modes, the first 3 (or 4 with Light) rosaries share the exact
   * same keys ('radostny', 'bolestny', 'slavny', 'svetla'), so switching
   * modes does not remove or alter their data.
   */
  function getRosaryConfig(dailyMode, includeLight) {
    const todayIndex = (new Date().getDay() + 6) % 7; // 0=Mon, ..., 6=Sun

    if (dailyMode) {
      if (includeLight) {
        return [
          { dayName: 'Pondělí', dayIndex: 0, rosaryType: 'radostny', key: 'radostny' },
          { dayName: 'Úterý',   dayIndex: 1, rosaryType: 'bolestny', key: 'bolestny' },
          { dayName: 'Středa',  dayIndex: 2, rosaryType: 'slavny',   key: 'slavny' },
          { dayName: 'Čtvrtek', dayIndex: 3, rosaryType: 'svetla',   key: 'svetla' },
          { dayName: 'Pátek',   dayIndex: 4, rosaryType: 'bolestny', key: 'fri_bolestny' },
          { dayName: 'Sobota',  dayIndex: 5, rosaryType: 'radostny', key: 'sat_radostny' },
          { dayName: 'Neděle',  dayIndex: 6, rosaryType: 'slavny',   key: 'sun_slavny' }
        ].map(item => ({
          ...item,
          title: `${item.dayName}: ${MYSTERIES[item.rosaryType].name}`,
          mysteries: MYSTERIES[item.rosaryType].items,
          isToday: item.dayIndex === todayIndex
        }));
      } else {
        return [
          { dayName: 'Pondělí', dayIndex: 0, rosaryType: 'radostny', key: 'radostny' },
          { dayName: 'Úterý',   dayIndex: 1, rosaryType: 'bolestny', key: 'bolestny' },
          { dayName: 'Středa',  dayIndex: 2, rosaryType: 'slavny',   key: 'slavny' },
          { dayName: 'Čtvrtek', dayIndex: 3, rosaryType: 'radostny', key: 'thu_radostny' },
          { dayName: 'Pátek',   dayIndex: 4, rosaryType: 'bolestny', key: 'fri_bolestny' },
          { dayName: 'Sobota',  dayIndex: 5, rosaryType: 'slavny',   key: 'sat_slavny' },
          { dayName: 'Neděle',  dayIndex: 6, rosaryType: 'slavny',   key: 'sun_slavny' }
        ].map(item => ({
          ...item,
          title: `${item.dayName}: ${MYSTERIES[item.rosaryType].name}`,
          mysteries: MYSTERIES[item.rosaryType].items,
          isToday: item.dayIndex === todayIndex
        }));
      }
    } else {
      const list = [
        { title: MYSTERIES.radostny.name, rosaryType: 'radostny', key: 'radostny', mysteries: MYSTERIES.radostny.items }
      ];
      if (includeLight) {
        list.push({ title: MYSTERIES.svetla.name, rosaryType: 'svetla', key: 'svetla', mysteries: MYSTERIES.svetla.items });
      }
      list.push(
        { title: MYSTERIES.bolestny.name, rosaryType: 'bolestny', key: 'bolestny', mysteries: MYSTERIES.bolestny.items },
        { title: MYSTERIES.slavny.name,   rosaryType: 'slavny',   key: 'slavny',   mysteries: MYSTERIES.slavny.items }
      );
      return list;
    }
  }

  // Global Tracker API
  window.RosaryTracker = {
    setWeekOffset: function(delta) {
      currentWeekOffset += delta;
      this.render();
    },

    resetToToday: function() {
      currentWeekOffset = 0;
      this.render();
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

    clickBead: function(key, decadeIndex, beadNumber) {
      const data = loadData();
      const weekInfo = getWeekInfo(currentWeekOffset);
      const weekData = getWeekData(data, weekInfo.key);
      const counts = ensureKeyArray(weekData, key);
      const currentVal = counts[decadeIndex] || 0;

      if (currentVal === beadNumber) {
        counts[decadeIndex] = beadNumber - 1;
      } else {
        counts[decadeIndex] = beadNumber;
      }
      saveData(data);
      this.render();
    },

    addBead: function(key, decadeIndex, delta) {
      const data = loadData();
      const weekInfo = getWeekInfo(currentWeekOffset);
      const weekData = getWeekData(data, weekInfo.key);
      const counts = ensureKeyArray(weekData, key);
      let currentVal = counts[decadeIndex] || 0;
      currentVal = Math.max(0, Math.min(10, currentVal + delta));
      counts[decadeIndex] = currentVal;
      saveData(data);
      this.render();
    },

    toggleDecade: function(key, decadeIndex) {
      const data = loadData();
      const weekInfo = getWeekInfo(currentWeekOffset);
      const weekData = getWeekData(data, weekInfo.key);
      const counts = ensureKeyArray(weekData, key);
      const currentVal = counts[decadeIndex] || 0;

      if (currentVal >= 10) {
        counts[decadeIndex] = 0;
      } else {
        counts[decadeIndex] = 10;
      }
      saveData(data);
      this.render();
    },

    toggleRosary: function(key) {
      const data = loadData();
      const weekInfo = getWeekInfo(currentWeekOffset);
      const weekData = getWeekData(data, weekInfo.key);
      const counts = ensureKeyArray(weekData, key);
      const allCompleted = counts.every(c => c >= 10);

      if (allCompleted) {
        weekData[key] = [0, 0, 0, 0, 0];
      } else {
        weekData[key] = [10, 10, 10, 10, 10];
      }
      saveData(data);
      this.render();
    },

    resetCurrentWeek: function() {
      const weekInfo = getWeekInfo(currentWeekOffset);
      if (!confirm(`Opravdu chcete vynulovat záznamy pro týden ${weekInfo.weekNum} (${weekInfo.formattedRange})?`)) {
        return;
      }
      const data = loadData();
      data.weeks[weekInfo.key] = {};
      saveData(data);
      this.render();
    },

    render: function() {
      const root = document.getElementById('rosary-tracker-root');
      if (!root) return;

      const data = loadData();
      const weekInfo = getWeekInfo(currentWeekOffset);
      const weekData = getWeekData(data, weekInfo.key);
      const includeLight = !!data.settings.includeLight;
      const dailyMode = !!data.settings.dailyMode;

      const activeRosaries = getRosaryConfig(dailyMode, includeLight);

      // Calculations
      let totalHailMarys = 0;
      let totalDecades = 0;
      let totalRosariesCompleted = 0;
      const targetRosaries = activeRosaries.length;
      const targetDecades = targetRosaries * 5;
      const targetHailMarys = targetDecades * 10;

      activeRosaries.forEach(r => {
        const counts = ensureKeyArray(weekData, r.key);
        let rosaryHailMarys = 0;
        let rosaryDecades = 0;
        counts.forEach(c => {
          rosaryHailMarys += c;
          if (c >= 10) rosaryDecades += 1;
        });
        totalHailMarys += rosaryHailMarys;
        totalDecades += rosaryDecades;
        if (rosaryDecades === 5) {
          totalRosariesCompleted += 1;
        }
      });

      const pct = Math.min(100, Math.round((totalHailMarys / targetHailMarys) * 100)) || 0;
      const isAllComplete = totalHailMarys >= targetHailMarys;

      // Mode description for Church guidelines
      let modeDesc = '';
      if (dailyMode) {
        if (includeLight) {
          modeDesc = '<strong>Režim: Růženec denně s růžencem světla</strong> (7 růženců / 35 desátků) podle apoštolského listu sv. Jana Pavla II. <em>Rosarium Virginis Mariae</em>:<br/>Po: radostný, Út: bolestný, St: slavný, Čt: světla, Pá: bolestný, So: radostný, Ne: slavný.';
        } else {
          modeDesc = '<strong>Režim: Růženec denně – tradiční</strong> (7 růženců / 35 desátků) podle tradiční církevní praxe:<br/>Po: radostný, Út: bolestný, St: slavný, Čt: radostný, Pá: bolestný, So: slavný, Ne: slavný.';
        }
      } else {
        if (includeLight) {
          modeDesc = '<strong>Režim: Týdenní závazek 4 růžence</strong> (20 desátků / 200 Zdrávasů) – radostný, světla, bolestný a slavný růženec kdykoliv během týdne.';
        } else {
          modeDesc = '<strong>Režim: Týdenní závazek 3 klasické růžence</strong> (15 desátků / 150 Zdrávasů) – radostný, bolestný a slavný růženec kdykoliv během týdne.';
        }
      }

      let html = '';

      // 1. Week navigation
      html += `
        <div class="tracker-week-nav">
          <div class="tracker-week-controls">
            <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.setWeekOffset(-1)" title="Předchozí týden">
              ← Předchozí
            </button>
            ${!weekInfo.isCurrent ? `
              <button class="tracker-btn tracker-btn-sm tracker-btn-primary" onclick="RosaryTracker.resetToToday()">
                Tento týden
              </button>
            ` : ''}
            <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.setWeekOffset(1)" title="Následující týden">
              Následující →
            </button>
          </div>
          <div class="tracker-week-title">
            <span class="tracker-week-number">${weekInfo.weekNum}. týden ${weekInfo.isCurrent ? '(aktuální)' : ''}</span>
            <span class="tracker-week-dates">${weekInfo.formattedRange}</span>
          </div>
          <div>
            <button class="tracker-btn tracker-btn-sm tracker-btn-outline-danger" onclick="RosaryTracker.resetCurrentWeek()" title="Vymazat tento týden">
              Vynulovat týden
            </button>
          </div>
        </div>
      `;

      // 2. Summary Card
      html += `
        <div class="tracker-summary-card">
          <div class="tracker-summary-header">
            <h3 class="tracker-summary-title">${dailyMode ? 'Postup týdenního denního růžence' : 'Týdenní postup modlitby'}</h3>
            <span class="tracker-summary-pct">${pct} %</span>
          </div>
          <div class="tracker-progress-track">
            <div class="tracker-progress-fill ${isAllComplete ? 'completed' : ''}" style="width: ${pct}%;"></div>
          </div>
          <div class="tracker-stats-grid">
            <div class="tracker-stat-box">
              <div class="tracker-stat-value">${totalHailMarys} / ${targetHailMarys}</div>
              <div class="tracker-stat-label">Zdrávasů</div>
            </div>
            <div class="tracker-stat-box">
              <div class="tracker-stat-value">${totalDecades} / ${targetDecades}</div>
              <div class="tracker-stat-label">Desátků</div>
            </div>
            <div class="tracker-stat-box">
              <div class="tracker-stat-value">${totalRosariesCompleted} / ${targetRosaries}</div>
              <div class="tracker-stat-label">Celých růženců</div>
            </div>
          </div>
          ${isAllComplete ? `
            <div class="tracker-complete-banner">
              <span>🎉</span>
              <div>
                <strong>${dailyMode ? 'Cíl splněn!' : 'Týdenní závazek splněn!'}</strong> Všechny růžence pro tento týden jsou dokončeny. <em>Deo gratias!</em>
              </div>
            </div>
          ` : ''}
        </div>
      `;

      // 3. Settings Bar (Daily Mode + Light rosary toggles)
      html += `
        <div class="tracker-settings-bar">
          <div class="tracker-settings-group">
            <label class="tracker-toggle-label">
              <input type="checkbox" id="tracker-daily-mode" ${dailyMode ? 'checked' : ''} onchange="RosaryTracker.toggleDailyMode()">
              <span>Růženec denně (1 růženec každý den v týdnu)</span>
            </label>
            <label class="tracker-toggle-label">
              <input type="checkbox" id="tracker-include-light" ${includeLight ? 'checked' : ''} onchange="RosaryTracker.toggleLight()">
              <span>Zahrnout i růženec světla</span>
            </label>
          </div>
          <div class="tracker-settings-desc">
            ${modeDesc}
          </div>
        </div>
      `;

      // 4. Rosary Cards
      activeRosaries.forEach(r => {
        const counts = ensureKeyArray(weekData, r.key);
        let rosaryCount = 0;
        let completedDecadesCount = 0;
        counts.forEach(c => {
          rosaryCount += c;
          if (c >= 10) completedDecadesCount += 1;
        });
        const isRosaryDone = completedDecadesCount === 5;
        const isTodayCard = dailyMode && weekInfo.isCurrent && r.isToday;

        html += `
          <div class="tracker-rosary-card ${isRosaryDone ? 'completed' : ''} ${isTodayCard ? 'today' : ''}">
            <div class="tracker-rosary-header">
              <div class="tracker-rosary-title-wrap">
                <h3 class="tracker-rosary-title">${r.title}</h3>
                ${isTodayCard ? '<span class="tracker-badge tracker-badge-today">Dnes</span>' : ''}
                <span class="tracker-badge ${isRosaryDone ? 'completed' : ''}">
                  ${isRosaryDone ? 'Dokončeno ✓' : `${rosaryCount}/50 Zdrávasů (${completedDecadesCount}/5)`}
                </span>
              </div>
              <div class="tracker-rosary-actions">
                <button class="tracker-btn tracker-btn-sm ${isRosaryDone ? '' : 'tracker-btn-primary'}" onclick="RosaryTracker.toggleRosary('${r.key}')">
                  ${isRosaryDone ? 'Vynulovat růženec' : '✓ Celý růženec'}
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
                  <span class="tracker-decade-number">${dIdx + 1}. desátek</span>
                  <div class="tracker-decade-mystery">„${mystery}“</div>
                </div>
                <div class="tracker-decade-controls">
                  <span class="tracker-decade-counter">${beadCount} / 10</span>
                  <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.addBead('${r.key}', ${dIdx}, -1)" title="Ubrat jeden Zdrávas" ${beadCount === 0 ? 'disabled style="opacity:0.4;cursor:default;"' : ''}>
                    -1
                  </button>
                  <button class="tracker-btn tracker-btn-sm" onclick="RosaryTracker.addBead('${r.key}', ${dIdx}, 1)" title="Přidat jeden Zdrávas" ${beadCount >= 10 ? 'disabled style="opacity:0.4;cursor:default;"' : ''}>
                    +1
                  </button>
                  <button class="tracker-btn tracker-btn-sm ${isDecadeDone ? '' : 'tracker-btn-primary'}" onclick="RosaryTracker.toggleDecade('${r.key}', ${dIdx})" title="Označit celý desátek">
                    ${isDecadeDone ? 'Zrušit' : 'Celý desátek'}
                  </button>
                </div>
              </div>

              <div class="tracker-beads-row" role="group" aria-label="Zdrávasy ${dIdx + 1}. desátku">
          `;

          for (let b = 1; b <= 10; b++) {
            const isActive = b <= beadCount;
            html += `
              <button
                type="button"
                class="tracker-bead ${isActive ? 'active' : ''}"
                onclick="RosaryTracker.clickBead('${r.key}', ${dIdx}, ${b})"
                title="${b}. Zdrávas (${isActive ? 'pomodleno' : 'nepomodleno'})"
                aria-pressed="${isActive ? 'true' : 'false'}"
              >
                ${b}
              </button>
            `;
          }

          html += `
              </div>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

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

  // Support for MkDocs Material instant loading / PJAX
  if (typeof document$ !== 'undefined') {
    document$.subscribe(function() {
      init();
    });
  }
})();
