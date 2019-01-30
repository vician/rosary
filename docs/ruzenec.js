function mktime() {
	var d = new Date(), r = arguments, i = 0,
		e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear'];
	for (i = 0; i < e.length; i++) {
		if (typeof r[i] === 'undefined') {
			r[i] = d['get' + e[i]]();
			r[i] += (i === 3); // +1 to fix JS months.
		} else {
			r[i] = parseInt(r[i], 10);
			if (isNaN(r[i])) {
				return false;
			}
		}
	}
	r[5] += (r[5] >= 0 ? (r[5] <= 69 ? 2e3 : (r[5] <= 100 ? 1900 : 0)) : 0);
	d.setFullYear(r[5], r[3] - 1, r[4]);
	d.setHours(r[0], r[1], r[2]);
	return (d.getTime() / 1e3 >> 0) - (d.getTime() < 0);
}

function in_seconds(day, month, year) {
	return mktime(1, 0, 0, month, day, year);
}

function convert_to_last_monday(monday, seconds) {
	if (monday != 1) {
		if (monday == 0) {
		monday = 7;
	}
	var monday_diff = in_seconds(monday, 1, 1970);
	seconds -= monday_diff
	}
	return seconds;
}

// Vrati typ ruzence
function get_type(weeks) {
	return (Math.floor( (weeks - 1) / 5 ) % 4) + 1;
}

function get_type_text(type) {
	var types = new Array("radostného", "světla", "bolestného", "slavného");
	type_index = type - 1;

	return types[type_index];
}

function get_type_title(type) {
	var types = new Array("radostný", "světla", "bolestný", "slavný");
	type_index = type - 1;

	return types[type_index];
}

// Vrati kolikaty vikend v typu
function get_week_in_type(weeks) {
	var week_in_type = weeks % 5;
	if (week_in_type == 0) {
		week_in_type = 5;
	}
	return week_in_type;
}

// Vrati cislo desatku
function get_decade(week_in_type, member_sequence) {
	week_in_type = week_in_type * 1;
	member_sequence = member_sequence * 1;
	decade = week_in_type + member_sequence - 1;
	if (decade > 5) {
		decade -= 5;
	}
	return decade;
}

// Kdo urcuje umysl
function get_who_decide(week_in_type) {
	week_in_type = week_in_type * 1;
	var who_decide = 7 - week_in_type;
	if (who_decide > 5) {
		who_decide -= 5;
	}
	return who_decide;
}

// Vrati text desadku
function get_decade_text(type, decade) {
	var type_index = type - 1;
	var decade_index = decade - 1;
	var decades = new Array();
	// Radostny
	decades[0] = new Array(
		"kterého jsi z Ducha svatého počala",
		"s kterým jsi Alžbětu navštívila",
		"kterého jsi v Betlémě porodila",
		"kterého jsi v chrámě obětovala",
		"kterého jsi v chrámě nalezla");
	// Svetla
	decades[1] = new Array(
		"který byl pokřtěn v Jordánu",
		"který zjevil v Káně svou božskou moc",
		"který hlásal Boží království a vyzýval k pokání",
		"který na hoře Proměnění zjevil svou slávu",
		"který ustanovil Eucharistii");
	decades[2] = new Array(
		"který se pro nás krví potil",
		"který byl pro nás bičován",
		"který byl pro nás trním korunován",
		"který pro nás nesl těžký kříž",
		"který byl pro nás ukřižován");
	decades[3] = new Array(
		"který z mrtvých vstal",
		"který na nebe vstoupil",
		"který Ducha svatého seslal",
		"který tě, Panno, do nebe vzal",
		"který tě v nebi korunoval");

	return decades[type_index][decade_index];
}

function get_weeks(sday, smonth, syear) {
	// Get current date
	var time=new Date();
	var tday=time.getDate();
	var tmonth=time.getMonth()+1;
	var tyear=time.getFullYear();
	var tmonday=time.getDay();
	console.log("Today is: "+tday+". "+tmonth+". "+tyear);
	// In seconds
	var today_seconds = in_seconds(tday, tmonth, tyear);
	console.log("in seconds: "+today_seconds);

	today_seconds = convert_to_last_monday(tmonday, today_seconds);

	console.log("monday in seconds: "+today_seconds);

	var one_week = in_seconds(8, 1, 1970);
	console.log("Start is "+sday+". "+smonth+". "+syear)
	var start_seconds = in_seconds(sday, smonth, syear);
	console.log("in seconds: "+start_seconds)

	if(start_seconds > today_seconds) {
		start_seconds -= (one_week * 20);
	}
	console.log("ev. minus: "+start_seconds)

	var different_seconds = today_seconds - start_seconds;
	console.log("different seconds: "+different_seconds+"s");
	var different_weeks = (different_seconds / one_week) + 1;
	console.log("jiz uplynulo: "+different_weeks+" weeks");
	different_weeks = Math.floor(different_weeks);
	console.log("rounded: "+different_weeks+" weeks");
	return different_weeks;
}

function write_element(element, html) {
	document.getElementById(element).innerHTML += html;
}

function draw_table(members, start, element, me=0) {
	members = decodeURIComponent(members)
	if (members.length != 5) {
		members = members.split(",")
		if (members.length != 5) {
			console.log("ERROR: Count of members isn't 5 but is "+members.length+"!!!!");
			return;
		}
	}

	var startarray = start.split("-");
	var weeks = get_weeks(startarray[2],startarray[1],startarray[0]);

	var type = get_type(weeks);
	var type_text = get_type_text(type);
	console.log("type: "+type+" = "+get_type_text(type));
	var week_in_type = get_week_in_type(weeks);
	console.log("week_in_type: "+week_in_type);


	var html = '';
	if (me != 0) {
		var your_decade = get_decade(week_in_type, me);
		console.log("your_decade:", your_decade);
		var your_decade_text = get_decade_text(type, your_decade);
		html += "<div>Tento ("+week_in_type+".) týden se máš modlit <b>"+your_decade+". desátek</b> růžence <b>"+type_text+"</b> <i>\""+your_decade_text+"\"</i></div>";
	} else {
		html += "<div>"+week_in_type+". týden růžence <b>"+type_text+"</b></div>";
	}
	var who_decide = get_who_decide(week_in_type);
	html += "<div>Umýsl určuje "+who_decide+". člen, tedy "+members[who_decide-1]+".</div>";

	html += "<table>";
	html += "<tr><th>člen / týden</th>";
	for (var week = 1; week <= 5; week++) {
		html += "<th";
		if (week_in_type == week) html += " style='color: black;'";
		html += ">";
		if (week_in_type == week) html += "<b>";
		html += week+". týden";
		if (week_in_type == week) html += "</b>";
		html += "</th>"
	}
	html += "</tr>";
	for (var member_sequence = 1; member_sequence <= 5; member_sequence++) {
		html += "<tr>";
		html += "<td";
		if (member_sequence == me) html += " style='border-style: solid; border-color: black; border-width: 1px 0px 1px 0px;'";
		html += ">";
		if (member_sequence == who_decide) html += "<b>";
		html += "<a href='/skupina/?m="+members+"&s="+start+"&i="+member_sequence+"'>";
		html += members[member_sequence-1];
		html += "</a>";
		if (member_sequence == who_decide) html += "</b>";
		html += "</td>";
		for (var week = 1; week <= 5; week++) {
			var decade = get_decade(week, member_sequence);
			var decade_text = get_decade_text(type, decade);
			html += "<td";
			if (week_in_type == week && member_sequence == me) html += " style='border: 1px solid black;'";
			else if (member_sequence == me) html += " style='border-top: 1px solid black; border-bottom: 1px solid black;'";
			else if (week_in_type == week) html += " style='border-left: 1px solid black; border-right: 1px solid black;'";
			html += ">";
			if (member_sequence == me) html += "<b>";
			html += "<a style='display: block;' title='"+decade_text+"'>"+decade+"</a>";
			if (member_sequence == me) html += "</b>";
			html += "</td>"
		}
		html += "</tr>";
	}
	html += "</table>";
	write_element(element,html);
}

function get_individual(start="2017-01-02", element="today") {
	var startarray = start.split("-");
	var weeks = get_weeks(startarray[2],startarray[1],startarray[0]);

	var html = weeks+". týden";

	write_element(element, html);
}

function draw_group() {
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
}

function create_link(memberid,startid,resultid) {
}
