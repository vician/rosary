<div id="table"></div>

<script>
window.onload = function () {
  draw_group();
}
</script>

## Odkaz

První člen: <input type="text" id="member1" value="" onchange="draw_group();"><br/>
Druhý člen: <input type="text" id="member2" value="" onchange="draw_group();"><br/>
Třetí člen: <input type="text" id="member3" value="" onchange="draw_group();"><br/>
Čtvrtý člen: <input type="text" id="member4" value="" onchange="draw_group();"><br/>
Pátý člen: <input type="text" id="member5" value="" onchange="draw_group();"><br/>
<br/>
Začátek (první týden prvního radostného růžence): <input type="text" id="start" value="" onchange="draw_group();">
<br/>
<input type="submit" value="Přepočítat" onclick="draw_group();"><br/>
