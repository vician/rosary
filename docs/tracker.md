# Weekly Rosary Tracker

This tracker helps you keep track of your weekly commitment to pray the Rosary – either **three classic rosaries** (Joyful, Sorrowful, Glorious = 15 decades / 150 Hail Marys), **four rosaries** including the Luminous Rosary (20 decades / 200 Hail Marys), or in **"Rosary a day"** mode (one rosary every day from Monday to Sunday according to Church guidance).

Your progress is automatically saved in your browser for each calendar week (Monday to Sunday).

---

<div id="rosary-tracker-root">
  <noscript>JavaScript is required to use the Rosary Tracker.</noscript>
</div>

<script>
if (window.RosaryTracker) {
  window.RosaryTracker.render();
}
</script>

---

### Days Distribution & Options

In the tracker header, you can independently configure:

1. **Rosary a day (1 rosary every day of the week):**
   - **With Luminous Rosary** *(following St. John Paul II's Apostolic Letter Rosarium Virginis Mariae)*:
     - **Monday:** Joyful Rosary
     - **Tuesday:** Sorrowful Rosary
     - **Wednesday:** Glorious Rosary
     - **Thursday:** Luminous Rosary
     - **Friday:** Sorrowful Rosary
     - **Saturday:** Joyful Rosary
     - **Sunday:** Glorious Rosary
   - **Without Luminous Rosary** *(following traditional Church practice)*:
     - **Monday:** Joyful Rosary
     - **Tuesday:** Sorrowful Rosary
     - **Wednesday:** Glorious Rosary
     - **Thursday:** Joyful Rosary
     - **Friday:** Sorrowful Rosary
     - **Saturday:** Glorious Rosary
     - **Sunday:** Glorious Rosary

2. **Include Luminous Rosary:**
   - Works independently of the daily mode. In weekly mode, increases your goal from 3 to 4 rosaries (20 decades / 200 Hail Marys). In daily mode, assigns the Luminous Mysteries to Thursday.

*Note:* Toggling between modes **does not remove** recorded prayers – the first 3 (or 4 with Light) rosaries share the same data across all modes.

---

### How to use the tracker?

- **Individual Hail Marys:** Click on any numbered bead (1–10) in a decade to set the count of prayed Hail Marys. Clicking on the last marked bead decreases the count by 1.
- **Quick Buttons:**
  - `+1` / `-1`: Increment or decrement by one Hail Mary.
  - `Full Decade`: Mark all 10 beads at once (or clear the decade).
  - `✓ Full Rosary`: Mark all 5 decades of the rosary at once (50 Hail Marys).
- **Week Navigation:** Use the arrows in the top bar to browse past and future weeks. The *This week* button returns you to the current week at any time.
