<div id="table"></div>

<script>
window.onload = function () {
	var search = window.location.search;
	var params = new Array();
	if (search.length != 0) {
		search = search.substring(1);
		var searches = search.split("&");
		for (index = 0; index < searches.length; ++index) {
				var values = searches[index].split("=");
				name = values[0]
				value = values[1]
				console.log(name+" = "+value)
				params[name] = value;
		}
	}
	if (search.length == 0 || params["m"] == undefined || params["s"] == undefined) {
		params["m"] = "Adam,Eva,Petr,Pavel,Veronika"
		params["s"] = "2010-01-01"
		params["i"] = Math.floor(Math.random() * 5 + 1);
		console.log("Generated member: "+params["i"])
	}

	draw_table(params["m"], params["s"], "table", params["i"])
  /*var members = new Array(
    "Hanka",
    "Markéta",
    "Lukáš",
    "Frencis",
    "Vendy"
    )
  var me = 2;
  var start = "2010-07-26";

  draw_table(members, start, "table", me);*/
}
</script>
