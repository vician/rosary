---
title: Custom Group
---

<div id="table"></div>

<script>
window.onload = function () {
  draw_group();
}
</script>

## Group Settings & Link

1st member: <input type="text" id="member1" value="" onchange="update_group();"><br/>
2nd member: <input type="text" id="member2" value="" onchange="update_group();"><br/>
3rd member: <input type="text" id="member3" value="" onchange="update_group();"><br/>
4th member: <input type="text" id="member4" value="" onchange="update_group();"><br/>
5th member: <input type="text" id="member5" value="" onchange="update_group();"><br/>
<br/>
Start date (Monday of the 1st week of Joyful Rosary): <input type="text" id="start" value="" onchange="update_group();"><br/>
Which member number are you?: <input type="text" id="sequence" value="" onchange="update_group();">
<br/>
<input type="button" class="tracker-btn tracker-btn-primary" value="Recalculate" onclick="update_group();"><br/>
<br/>
Shareable link for your group: <a id="link" href=""></a>
