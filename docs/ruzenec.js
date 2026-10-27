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
		seconds -= monday_diff;
	}
	return seconds;
}

function get_current_lang() {
	if (typeof document !== 'undefined' && document.documentElement) {
		if (document.documentElement.lang === 'cs' || window.location.pathname.startsWith('/cs/')) {
			return 'cs';
		}
	}
	return 'en';
}

// Vrati typ ruzence (1: Radostny, 2: Svetla, 3: Bolestny, 4: Slavny)
function get_type(weeks) {
	return (Math.floor( (weeks - 1) / 5 ) % 4) + 1;
}

function get_type_text(type) {
	var lang = get_current_lang();
	var type_index = type - 1;
	if (lang === 'cs') {
		var types = new Array("radostného", "světla", "bolestného", "slavného");
		return types[type_index];
	} else {
		var types = new Array("Joyful", "Luminous", "Sorrowful", "Glorious");
		return types[type_index];
	}
}

function get_type_title(type) {
	var lang = get_current_lang();
	var type_index = type - 1;
	if (lang === 'cs') {
		var types = new Array("radostný", "světla", "bolestný", "slavný");
		return types[type_index];
	} else {
		var types = new Array("Joyful Rosary", "Luminous Rosary", "Sorrowful Rosary", "Glorious Rosary");
		return types[type_index];
	}
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
	var decade = week_in_type + member_sequence - 1;
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
	var lang = get_current_lang();
	var type_index = type - 1;
	var decade_index = decade - 1;

	if (lang === 'cs') {
		var decades = [
			// Radostny
			[
				"kterého jsi z Ducha svatého počala",
				"s kterým jsi Alžbětu navštívila",
				"kterého jsi v Betlémě porodila",
				"kterého jsi v chrámě obětovala",
				"kterého jsi v chrámě nalezla"
			],
			// Svetla
			[
				"který byl pokřtěn v Jordánu",
				"který zjevil v Káně svou božskou moc",
				"který hlásal Boží království a vyzýval k pokání",
				"který na hoře Proměnění zjevil svou slávu",
				"který ustanovil Eucharistii"
			],
			// Bolestny
			[
				"který se pro nás krví potil",
				"který byl pro nás bičován",
				"který byl pro nás trním korunován",
				"který pro nás nesl těžký kříž",
				"který byl pro nás ukřižován"
			],
			// Slavny
			[
				"který z mrtvých vstal",
				"který na nebe vstoupil",
				"který Ducha svatého seslal",
				"který tě, Panno, do nebe vzal",
				"který tě v nebi korunoval"
			]
		];
		return decades[type_index][decade_index];
	} else {
		var decades = [
			// Joyful
			[
				"The Annunciation",
				"The Visitation",
				"The Nativity",
				"The Presentation in the Temple",
				"The Finding in the Temple"
			],
			// Luminous
			[
				"The Baptism of Jesus in the Jordan",
				"The Wedding at Cana",
				"The Proclamation of the Kingdom",
				"The Transfiguration",
				"The Institution of the Eucharist"
			],
			// Sorrowful
			[
				"The Agony in the Garden",
				"The Scourging at the Pillar",
				"The Crowning with Thorns",
				"The Carrying of the Cross",
				"The Crucifixion and Death of Jesus"
			],
			// Glorious
			[
				"The Resurrection",
				"The Ascension",
				"The Descent of the Holy Spirit",
				"The Assumption of Mary",
				"The Coronation of Mary"
			]
		];
		return decades[type_index][decade_index];
	}
}

function get_weeks(sday, smonth, syear) {
	var time = new Date();
	var tday = time.getDate();
	var tmonth = time.getMonth() + 1;
	var tyear = time.getFullYear();
	var tmonday = time.getDay();

	var today_seconds = in_seconds(tday, tmonth, tyear);
	today_seconds = convert_to_last_monday(tmonday, today_seconds);

	var one_week = in_seconds(8, 1, 1970);
	var start_seconds = in_seconds(sday, smonth, syear);

	if (start_seconds > today_seconds) {
		start_seconds -= (one_week * 20);
	}

	var different_seconds = today_seconds - start_seconds;
	var different_weeks = (different_seconds / one_week) + 1;
	different_weeks = Math.floor(different_weeks);
	return different_weeks;
}

function write_element(element, html) {
	var el = document.getElementById(element);
	if (el) el.innerHTML = html;
}

function draw_table(members, start, element, me) {
	if (typeof me === 'undefined') me = 0;
	var lang = get_current_lang();
	members = decodeURIComponent(members);
	if (typeof members === 'string') {
		members = members.split(",");
		if (members.length != 5) {
			console.log("ERROR: Count of members isn't 5 but is " + members.length + "!");
			return;
		}
	}

	var startarray = start.split("-");
	var weeks = get_weeks(startarray[2], startarray[1], startarray[0]);

	var type = get_type(weeks);
	var type_text = get_type_text(type);
	var week_in_type = get_week_in_type(weeks);

	var html = '';
	var groupUrl = window.location.pathname.includes('group')
		? window.location.pathname
		: (window.location.pathname.replace(/\/$/, '') + (lang === 'cs' ? '/group/' : '/group/'));

	if (lang === 'cs') {
		if (me != 0) {
			var your_decade = get_decade(week_in_type, me);
			var your_decade_text = get_decade_text(type, your_decade);
			html += "<div style='margin-bottom:0.5rem;'>Tento ("+week_in_type+".) týden se máš modlit <b>"+your_decade+". desátek</b> růžence <b>"+type_text+"</b> <i>\""+your_decade_text+"\"</i></div>";
		} else {
			html += "<div style='margin-bottom:0.5rem;'>"+week_in_type+". týden růžence <b>"+type_text+"</b></div>";
		}
		var who_decide = get_who_decide(week_in_type);
		html += "<div style='margin-bottom:1rem;'>Úmysl určuje "+who_decide+". člen, tedy <strong>"+members[who_decide-1]+"</strong>.</div>";
	} else {
		if (me != 0) {
			var your_decade = get_decade(week_in_type, me);
			var your_decade_text = get_decade_text(type, your_decade);
			html += "<div style='margin-bottom:0.5rem;'>This (week "+week_in_type+") you are assigned to pray the <b>decade #"+your_decade+"</b> of the <b>"+type_text+" Rosary</b>: <i>\""+your_decade_text+"\"</i></div>";
		} else {
			html += "<div style='margin-bottom:0.5rem;'>Week "+week_in_type+" of the <b>"+type_text+" Rosary</b></div>";
		}
		var who_decide = get_who_decide(week_in_type);
		html += "<div style='margin-bottom:1rem;'>The prayer intention is set by member #"+who_decide+": <strong>"+members[who_decide-1]+"</strong>.</div>";
	}

	html += "<table class='md-typeset__table' style='width:100%;'>";
	html += "<thead><tr><th>" + (lang === 'cs' ? "Člen / týden" : "Member / Week") + "</th>";
	for (var week = 1; week <= 5; week++) {
		html += "<th";
		if (week_in_type == week) html += " style='font-weight: bold;'";
		html += ">";
		html += (lang === 'cs' ? (week + ". týden") : ("Week " + week));
		html += "</th>";
	}
	html += "</tr></thead><tbody>";

	for (var member_sequence = 1; member_sequence <= 5; member_sequence++) {
		var isMe = (member_sequence == me);
		var isLeader = (member_sequence == who_decide);

		html += "<tr" + (isMe ? " style='background: rgba(30, 64, 175, 0.08);'" : "") + ">";
		html += "<td>";
		if (isLeader) html += "<strong>";
		html += "<a href='" + groupUrl + "?m=" + encodeURIComponent(members.join(',')) + "&s=" + start + "&i=" + member_sequence + "'>";
		html += members[member_sequence - 1];
		html += "</a>";
		if (isLeader) html += "</strong>";
		html += "</td>";

		for (var week = 1; week <= 5; week++) {
			var decade = get_decade(week, member_sequence);
			var decade_text = get_decade_text(type, decade);
			var isCurrentCell = (week_in_type == week && isMe);

			html += "<td style='text-align: center;" + (isCurrentCell ? " font-weight: bold; background: rgba(30, 64, 175, 0.2);" : "") + "'>";
			html += "<span title=\"" + decade_text + "\" style='cursor: help;'>" + decade + "</span>";
			html += "</td>";
		}
		html += "</tr>";
	}
	html += "</tbody></table>";

	write_element(element, html);
}

function update_group() {
	var m1 = document.getElementById('member1') ? document.getElementById('member1').value : '';
	var m2 = document.getElementById('member2') ? document.getElementById('member2').value : '';
	var m3 = document.getElementById('member3') ? document.getElementById('member3').value : '';
	var m4 = document.getElementById('member4') ? document.getElementById('member4').value : '';
	var m5 = document.getElementById('member5') ? document.getElementById('member5').value : '';
	var s = document.getElementById('start') ? document.getElementById('start').value : '';
	var i = document.getElementById('sequence') ? document.getElementById('sequence').value : '';

	var params = {};
	params["m"] = [m1, m2, m3, m4, m5].join(',');
	params["s"] = s;
	params["i"] = i;

	window.location.hash = "#m=" + encodeURIComponent(params["m"]) + "&s=" + params["s"] + "&i=" + params["i"];
	draw_group(params);
}

function update_link(params) {
	var linkEl = document.getElementById("link");
	if (!linkEl) return;
	var port = window.location.port !== "" ? ":" + window.location.port : "";
	var url = window.location.protocol + "//" + window.location.hostname + port + window.location.pathname + "?m=" + encodeURIComponent(params["m"]) + "&s=" + params["s"] + "&i=" + params["i"];
	linkEl.innerHTML = url;
	linkEl.href = url;
}

function update_form(params) {
	var members = (params["m"] || "").split(',');
	if (document.getElementById('member1') && members[0]) document.getElementById('member1').value = decodeURIComponent(members[0]);
	if (document.getElementById('member2') && members[1]) document.getElementById('member2').value = decodeURIComponent(members[1]);
	if (document.getElementById('member3') && members[2]) document.getElementById('member3').value = decodeURIComponent(members[2]);
	if (document.getElementById('member4') && members[3]) document.getElementById('member4').value = decodeURIComponent(members[3]);
	if (document.getElementById('member5') && members[4]) document.getElementById('member5').value = decodeURIComponent(members[4]);
	if (document.getElementById('start') && params["s"]) document.getElementById('start').value = params["s"];
	if (document.getElementById('sequence') && params["i"]) document.getElementById('sequence').value = params["i"];

	draw_table(params["m"], params["s"], "table", params["i"]);
}

function draw_group(params) {
	var search = window.location.search;
	var hash = window.location.hash;
	if (hash !== "") {
		search = hash;
	}
	if (!params) {
		params = {};
		if (search.length !== 0) {
			search = search.substring(1).replace(/&amp;/g, '&');
			var searches = search.split("&");
			for (var idx = 0; idx < searches.length; ++idx) {
				var values = searches[idx].split("=");
				params[values[0]] = values[1];
			}
		}
		if (search.length === 0 || !params["m"] || !params["s"]) {
			var lang = get_current_lang();
			params["m"] = lang === 'cs' ? "Adam,Eva,Petr,Pavel,Veronika" : "Adam,Eve,Peter,Paul,Veronica";
			params["s"] = new Date().toISOString().slice(0, 10);
			params["i"] = Math.floor(Math.random() * 5 + 1);
		}
		update_form(params);
	}
	update_link(params);
	draw_table(params["m"], params["s"], "table", params["i"]);
}
