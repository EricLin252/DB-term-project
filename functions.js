var nav_state = null, use_group = false;

$(document).ready(function(){
	$("#list_btn").click(function(){
		$("#list").toggle("slide");
		chstate(null);
	});

	$("#list_btn").toggle(
		function(){
			$(this).css("background-image", "url('listbtn_T.png')");
		},
		function(){
			$(this).css("background-image", "url('listbtn_F.png')");
		}
	);

	$(".nav_btn").click(function(){
		chstate($(this).attr("id"));
	});

	$(".dropdown_btn").toggle(
		function(){
			$(this).css({"background-color":"darkslategray", "color":"whitesmoke", "border":"none"});
			var s = $(this).text();
			s = s.split(" ");
			$(this).text(s[0] + " ▲");
			s = $(this).attr("id");
			$("#" + s + "_page").slideDown();
		},
		function(){
			$(this).css({"background-color":"transparent", "color":"black", "border":"solid 1px gray"});
			var s = $(this).text();
			s = s.split(" ");
			$(this).text(s[0] + " ▼");
			s = $(this).attr("id");
			$("#" + s + "_page").slideUp();
		}
	);

	$(".window select").focus(function(){
		$(this).attr("size", "10");
	});

	$(".window select").blur(function(){
		$(this).removeAttr("size");
	});

	$(".window select").change(function(){
		$(this).blur();
	});

	setCounty();

	$("#pos_page select, #pos_page input").change(function(){
		if($(this).attr("id") == "find_county"){
			if($(this).val() == ""){
				$("#find_township").prop({"selectedIndex": 0, "disabled": true});
				$("#find_street").prop({"selectedIndex": 0, "disabled": true});
				$("#find_detail").val("");
				$("#find_detail").prop("disabled", true);
			}
			else{
				$("#find_township").prop("disabled", false);
				setTownship("find", $(this).val());
			}
		}
		else if($(this).attr("id") == "find_township"){
			if($(this).val() == ""){
				$("#find_street").prop({"selectedIndex": 0, "disabled": true});
				$("#find_detail").val("");
				$("#find_detail").prop("disabled", true);
			}
			else{
				$("#find_street").prop("disabled", false);
				setStreet("find", $("#find_county").val(), $(this).val());
			}
		}
		else if($(this).attr("id") == "find_street"){
			if($(this).val() == ""){
				$("#find_detail").val("");
				$("#find_detail").prop("disabled", true);
			}
			else{
				$("#find_detail").prop("disabled", false);
			}
		}
		$("#pos_tmp").text(
			$("#find_county").val() + $("#find_township").val() + $("#find_street").val() + " " + $("#find_detail").val()
		);
	});

	$("#time_page input").change(function(){
		var time_v = matchdate($("#start_t").val(), $("#end_t").val(), $(this).attr("id"));
		$("#start_t").val(time_v[0]);
		$("#end_t").val(time_v[1]);
		if(time_v[0] != "") $("#time_tmp").text(time_v[0] + " ~ " + time_v[1]);
	});

	$("#t_reset").click(function(){
		$("#start_t").val("");
		$("#end_t").val("");
		$("#time_tmp").text("");
	});

	$("#serious_page input").change(function(){
		var tmp = "";
		var input_v = $("#serious_page input:checkbox:checked").get();
		for(var i = 0; i < input_v.length; i++){
			if(tmp != "") tmp += ", ";
			tmp += input_v[i].value;
		}

		if(tmp != "") $("#serious_tmp").text(tmp);
		else $(this).prop("checked", true);
	});

	$("#group_toggle").toggle(
		function(){
			$("#group_hr").slideDown();
			$("#group_find").slideDown();
			$(this).text("搜尋事故");
			$("#find").text("事故統計");
			use_group = true;
		},
		function(){
			$("#group_hr").slideUp();
			$("#group_find").slideUp();
			$(this).text("事故統計");
			$("#find").text("搜尋事故");
			use_group = false;
		}
	);

	$("#group_find button").click(function(){
		if($(this).val() == ""){
			$(this).css({"background-color":"darkslategray", "color":"whitesmoke", "border":"none"});
			$(this).val($(this).text());
			var new_val = $(this).val();
			$(this).parent().children().each(function(){
				if($(this).val() != new_val){
					$(this).css({"background-color":"transparent", "color":"black", "border":"solid 1px gray"});
					$(this).val("");
				}
			});
		}
		else{
			$(this).css({"background-color":"transparent", "color":"black", "border":"solid 1px gray"});
			$(this).val("");
		}
	});

	$("#find_reset").click(function(){
		$("#pos_page select").prop("selectedIndex", 0);
		$("#pos_page input").val("");
		$("#time_page input").val("");
		$("#serious_page input").prop("checked", true);
		$("#find_page .tmp").text("");
		$("#serious_tmp").text("A1, A2");

		$("#find_township").prop({"selectedIndex": 0, "disabled": true});
		$("#find_street").prop({"selectedIndex": 0, "disabled": true});
		$("#find_detail").prop("disabled", true);

		$("#group_find button").each(function(){
			if($(this).val() != ""){
				$(this).css({"background-color":"transparent", "color":"black", "border":"solid 1px gray"});
				$(this).val("");
			}
		});
	});

	$("#find_submit").click(function(){
		var sql = "", record = "";
		if(use_group){
			var pos_arr = [$("#find_county").val(), $("#find_township").val(), $("#find_street").val()];
			var g_pos_arr = [$("#group_county").val(), $("#group_township").val(), $("#group_street").val()];
			var pos_group_arr = ["county", "township", "street"];
			pos_arr.forEach(element => {
				if(element != "") pos_group_arr.splice(0, 1);
			});
			for(var i = 2; i >= 0; i--){
				if(g_pos_arr[i] != "") break;
				pos_group_arr.splice(-1, 1);
			}

			var start_t_arr = $("#start_t").val().split("-"), end_t_arr = $("#end_t").val().split("-");
			var g_time_arr = [$("#group_year").val(), $("#group_month").val(), $("#group_date").val()];
			var time_group_arr = ["year", "month", "date"];
			var time_group = "";
			for(var i = 0; i < 3; i++){
				if(g_time_arr[i] != ""){
					time_group = time_group_arr[i];
					break;
				}
			}
			if(start_t_arr.length == 3 && start_t_arr[0] == end_t_arr[0]){
				if(time_group == "year") time_group = "";
				else{
					if(start_t_arr[1] == end_t_arr[1]){
						if(time_group == "month") time_group = "";
						else{
							if(start_t_arr[2] == end_t_arr[2] && time_group == "date") time_group = "";
						}
					}
				}
			}
		}
		/*
		else{
			if($("#pos_tmp").text() == "" && $("#time_tmp").text() == "") sql = "條件過少，無法搜尋";
			else{
				if($("#pos_tmp").text() != ""){
					sql += $("#pos_tmp").text();
					record += $("#pos_tmp").text();
				}
				if($("#time_tmp").text() != ""){
					if(sql != ""){
						sql += "<br>";
						record += "/";
					}
					sql += $("#time_tmp").text();
					record += $("#time_tmp").text();
				}
				if($("#serious_tmp").text() != "A1, A2, A3"){
					sql += "<br>" + $("#serious_tmp").text();
					record += "/" + $("#serious_tmp").text();
				}
			}
			$("#sql").html(sql);
			if(record != ""){
				$("#history_page p").hide();
				$("#history_page").append("<button class='record'>" + record + "</button>");
				$("#history_page .record").last().click(function(){
					var record = $(this).text();
					record = record.split("/");
					$("#sql").html("");
					for(var i = 0; i < record.length; i++){
						if(i != 0) $("#sql").append("<br>");
						$("#sql").append(record[i]);
					}
					$("#list").toggle("slide");
					chstate(null);
					$("#result_detail").hide();
				});
			}
			$("#list").toggle("slide");
			chstate(null);
			$("#result").show();
			$("#result_detail").hide();
		}
		*/
	});

	var Tstr_v = getTimeStr(new Date());
	$("#upload_date").val(Tstr_v[0]);
	$("#upload_time").val(Tstr_v[1]);

	$("#upload_page select, #pos_page input").change(function(){
		if($(this).attr("id") == "upload_county"){
			if($(this).val() == ""){
				$("#upload_township").prop({"selectedIndex": 0, "disabled": true});
				$("#upload_street").prop({"selectedIndex": 0, "disabled": true});
				$("#upload_detail").val("");
				$("#upload_detail").prop("disabled", true);
			}
			else{
				$("#upload_township").prop("disabled", false);
				setTownship("upload", $(this).val());
			}
		}
		else if($(this).attr("id") == "upload_township"){
			if($(this).val() == ""){
				$("#upload_street").prop({"selectedIndex": 0, "disabled": true});
				$("#upload_detail").val("");
				$("#upload_detail").prop("disabled", true);
			}
			else{
				$("#upload_street").prop("disabled", false);
				setStreet("upload", $("#upload_county").val(), $(this).val());
			}
		}
		else if($(this).attr("id") == "upload_street"){
			if($(this).val() == ""){
				$("#upload_detail").val("");
				$("#upload_detail").prop("disabled", true);
			}
			else{
				$("#upload_detail").prop("disabled", false);
			}
		}
	});

	$("#upload_reset").click(function(){
		$("#upload_page select").prop("selectedIndex", 0);
		$("#upload_page input").val("");
		Tstr_v = getTimeStr(new Date());
		$("#upload_date").val(Tstr_v[0]);
		$("#upload_time").val(Tstr_v[1]);
		$("#upload_serious").prop("selectedIndex", 0);

		$("#upload_township").prop({"selectedIndex": 0, "disabled": true});
		$("#upload_street").prop({"selectedIndex": 0, "disabled": true});
		$("#upload_detail").prop("disabled", true);
	});

	$("#upload_submit").click(function(){
		var sql = "<p>新增</p>", record = "";
		sql += $("#upload_county").val() + $("#upload_township").val() + $("#upload_street").val();
		record += $("#upload_county").val() + $("#upload_township").val() + $("#upload_street").val();
		if($("#upload_detail").val() != ""){
			sql += $("#upload_detail").val();
			record += $("#upload_detail").val();
		}
		sql += "<br>";
		record += "/";
		sql += $("#upload_date").val() + " " + $("#upload_time").val();
		record += $("#upload_date").val() + " " + $("#upload_time").val();
		sql += "<br>";
		record += "/";
		sql += $("#upload_serious").val();
		record += $("#upload_serious").val();
		$("#sql").html(sql);
		
		$("#my_upload_page p").hide();
		$("#my_upload_page").append("<button class='record'>" + record + "</button>");
		$("#my_upload_page .record").last().click(function(){
			record = $(this).text();
			record = record.split("/");
			$("#sql").html("");
			for(var i = 0; i < record.length; i++){
				if(i != 0) $("#sql").append("<br>");
				$("#sql").append(record[i]);
			}
			$("#list").toggle("slide");
			chstate(null);
			$("#result_detail").hide();
		});

		$("#list").toggle("slide");
		chstate(null);
	});

	$(".sql_result").click(function(){
		$("#sql").html($(this).text());
		$("#result").hide();
		$("#result_detail").show();
	});

	$("#upload_file").change(function(){
		if($(this).val() != "") $("#upload_file_submit").show();
	});

	$("#upload_file_submit").click(function(){
		$("#upload_video").html("~感謝你的貢獻~");
	});
});

function chstate(next){
	if(nav_state != next){
		if(nav_state){
			$("#" + nav_state).css({"background-color":"transparent", "color":"black"});
			$("#" + nav_state + "_page").slideUp();
		}
		if(next){
			$("#" + next).css({"background-color":"darkslategrey", "color":"whitesmoke"});
			$("#" + next + "_page").slideDown();
		}
		nav_state = next;
	}
}

function matchdate(start_t, end_t, mode){
	if(start_t == "") return [end_t, end_t];
	if(end_t == "") return [start_t, start_t];

	var start_v = start_t.split("-");
	var end_v = end_t.split("-");
	var i = 3;
	while(i--){
		start_v[i] = parseInt(start_v[i]);
		end_v[i] = parseInt(end_v[i]);
	}

	if(start_v[0] < end_v[0]) return [start_t, end_t];
	if(start_v[0] == end_v[0] && start_v[1] < end_v[1]) return [start_t, end_t];
	if(start_v[0] == end_v[0] && start_v[1] == end_v[1] && start_v[2] < end_v[2]) return [start_t, end_t];
	
	if(mode == "start_t") return [start_t, start_t];
	else return [end_t, end_t];
}

function getTimeStr(D){
	var YY = D.getFullYear(), MM = D.getMonth(), DD = D.getDate();
	var hh = D.getHours(), mm = D.getMinutes(), ss = D.getSeconds();

	MM += 1;
	MM = "" + Math.floor(MM/10) + MM%10;
	DD = "" + Math.floor(DD/10) + DD%10;
	hh = "" + Math.floor(hh/10) + hh%10;
	mm = "" + Math.floor(mm/10) + mm%10;
	ss = "" + Math.floor(ss/10) + ss%10;

	return [YY+"-"+MM+"-"+DD, hh+":"+mm+":"+ss];
}

function setCounty(){
	var county = [];
	$("#find_county").html("<option value=''>請選擇縣市</option>");
	$("#upload_county").html("<option value=''>請選擇縣市</option>");
	$.ajax({
		url: "ajax/ajax.php",
		async: false,
		data: ({ mode: "county" }),
		type: "POST",
		cache: false,
		success: function(response){
			console.log(response);
			county = response.split(" ");
		},
		error: function(xhr, status, error) {
			var err = eval("(" + xhr.responseText + ")");
			alert(error);
		}
	});
	for(var i = 0; i < county.length; i++){
		$("#find_county").append("<option value='" + county[i] + "'>" + county[i] + "</option>");
		$("#upload_county").append("<option value='" + county[i] + "'>" + county[i] + "</option>");
	}
	$("#find_county").prop("selectedIndex", 0);
	$("#upload_county").prop("selectedIndex", 0);
}

function setTownship(mode, county){
	var township = [];
	var target = "#" + mode + "_township";
	$(target).html("<option value=''>請選擇鄉鎮市區</option>");
	$.ajax({
		url: "ajax/ajax.php",
		async: false,
		data: ({ mode: "township", county: county }),
		type: "POST",
		cache: false,
		success: function(response){
			console.log(response);
			township = response.split(" ");
		},
		error: function(xhr, status, error) {
			var err = eval("(" + xhr.responseText + ")");
			alert(error);
		}
	});
	for(var i = 0; i < township.length; i++){
		$(target).append("<option value='" + township[i] + "'>" + township[i] + "</option>");
	}
	$(target).prop("selectedIndex", 0);
}

function setStreet(mode, county, township){
	var street = [];
	var target = "#" + mode + "_street";
	$(target).html("<option value=''>請選擇街道名稱</option>");
	$.ajax({
		url: "ajax/ajax.php",
		async: false,
		data: ({ mode: "street", county: county, township: township }),
		type: "POST",
		cache: false,
		success: function(response){
			console.log(response);
			street = response.split(" ");
		},
		error: function(xhr, status, error) {
			var err = eval("(" + xhr.responseText + ")");
			alert(error);
		}
	});
	for(var i = 0; i < street.length; i++){
		$(target).append("<option value='" + street[i] + "'>" + street[i] + "</option>");
	}
	$(target).prop("selectedIndex", 0);
}

function checkGroup(id, value){
	if(id == "group_county"){
		if(value == ""){
			$("#group_township").css({"background-color":"transparent", "color":"black", "border":"solid 1px gray"});
			$("#group_township").val("");
			$("#group_street").css({"background-color":"transparent", "color":"black", "border":"solid 1px gray"});
			$("#group_street").val("");
		}
	}
	else if(id == "group_township"){
		if(value == ""){
			$("#group_street").css({"background-color":"transparent", "color":"black", "border":"solid 1px gray"});
			$("#group_street").val("");
		}
		else{
			$("#group_county").css({"background-color":"darkslategray", "color":"whitesmoke", "border":"none"});
			$("#group_county").val($("#group_county").text());
		}
	}
	else if(id == "group_street"){
		if(value != ""){
			$("#group_county").css({"background-color":"darkslategray", "color":"whitesmoke", "border":"none"});
			$("#group_county").val($("#group_county").text());
			$("#group_township").css({"background-color":"darkslategray", "color":"whitesmoke", "border":"none"});
			$("#group_township").val($("#group_township").text());
		}
	}
}
