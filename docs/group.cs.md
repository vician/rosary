---
title: Vlastní skupina
---

<div id="table"></div>

<script>
window.onload = function () {
  draw_group();
}
</script>

## Odkaz

První člen: <input type="text" id="member1" value="" onchange="update_group();"><br/>
Druhý člen: <input type="text" id="member2" value="" onchange="update_group();"><br/>
Třetí člen: <input type="text" id="member3" value="" onchange="update_group();"><br/>
Čtvrtý člen: <input type="text" id="member4" value="" onchange="update_group();"><br/>
Pátý člen: <input type="text" id="member5" value="" onchange="update_group();"><br/>
<br/>
Začátek (první týden prvního radostného růžence): <input type="text" id="start" value="" onchange="update_group();"><br/>
Kolikátý člen jsi ty?: <input type="text" id="sequence" value="" onchange="update_group();">
<br/>
<input type="button" class="tracker-btn tracker-btn-primary" value="Přepočítat" onclick="update_group();"><br/>
<br/>
Odkaz pro sdílení: <a id="link" href=""></a>
