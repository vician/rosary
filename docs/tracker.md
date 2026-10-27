# Weekly & Daily Rosary Tracker

This tracker helps you keep track of your commitment to pray the Rosary. It is specially designed for:

- **The Rosary Confraternity (*Confraternitas Sanctissimi Rosarii*):** Members of this worldwide Dominican confraternity commit to praying all 15 traditional decades (Joyful, Sorrowful, Glorious = 150 Hail Marys), or all 20 decades including the Luminous mysteries (200 Hail Marys), throughout the course of each week.
- **A Rosary a Day:** Praying one complete rosary each day, arranged according to the liturgical weekdays recommended by the Catholic Church.
- **Personal Devotion:** Anyone desiring to build constancy, keep track of daily prayers, and deepen their spiritual life.

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
   - Works independently of the daily mode. In weekly mode (such as for the Rosary Confraternity), it increases your weekly goal from 3 to 4 rosaries (20 decades / 200 Hail Marys). In daily mode, it assigns the Luminous Mysteries to Thursday.

*Note:* Toggling between modes **does not remove** recorded prayers – the first 3 (or 4 with Light) rosaries share the same data across all modes.

---

### How to use the tracker?

- **Individual Hail Marys:** Click on any numbered bead (1–10) in a decade to set the count of prayed Hail Marys. Clicking on the last marked bead decreases the count by 1.
- **Quick Buttons:**
  - `+1` / `-1`: Increment or decrement by one Hail Mary.
  - `Full Decade`: Mark all 10 beads at once (or clear the decade).
  - `✓ Full Rosary`: Mark all 5 decades of the rosary at once (50 Hail Marys).
- **Week Navigation:** Use the arrows in the top bar to browse past and future weeks. The *This week* button returns you to the current week at any time.
- **Prayer History:** Expand the *Prayer History* section below to view your completed rosaries across past weeks and quickly jump back to any previous week.
- **Data Backup:** Use the *Export data* button to download a backup file of your prayers, and *Import data* to restore it on any device.
