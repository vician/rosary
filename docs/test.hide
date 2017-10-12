<div id="ruzenectest"></div>

<script>
window.onload = function () {
  for(var rtype = 1; rtype <= 4; rtype++) {
    document.getElementById('ruzenectest').innerHTML += '<h2>'+rtype+". ruzenec - "+get_type_text(rtype)+"</h2>";
    for (var week_in_type = 1; week_in_type <= 5; week_in_type++) {
      document.getElementById('ruzenectest').innerHTML += '<h3>'+week_in_type+". tyden</h3>";
      for (var member = 1; member <= 5; member++){
        decade = get_decade(week_in_type, member);
        decade_text = get_decade_text(rtype, decade);
        document.getElementById('ruzenectest').innerHTML += '<h4>'+member+'. clen - '+decade+". desatek: "+decade_text+"</h4>";
      }
    }
  }
}
</script>
