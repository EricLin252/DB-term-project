var nav_state = null;
var county = ["臺北市", "新北市", "桃園市", "臺中市", "臺南市", "高雄市", "新竹市"];
var township = ["北區", "東區", "香山區"];
var street = ["世界路", "中正路", "中山路", "中央路"];
var data = [
	{
		county: "新竹市",
		township: "北區",
		street: "中央路",
		injury: "死亡1, 受傷0",
		serious: "A1",
		situation: "公營客運-大客車 / 行人-人",
		longitude: "120.969152",
		latitude: "24.805852"
	},
];

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

	setCounty();
	setTownship();
	setStreet();

	$("#pos_page select").change(function(){
		$("#pos_tmp").text(
			$("#find_county").val() + $("#find_township").val() + $("#find_street").val() + " " + $("#find_detail").val()
		);
	});

	$("#pos_page input").change(function(){
		$("#pos_tmp").text(
			$("#find_county").val() + $("#find_township").val() + $("#find_street").val() + $("#find_detail").val()
		);
	});

	$("#time_page input").change(function(){
		var time_v = matchdate($("#start_t").val(), $("#end_t").val(), $(this).attr("id"));
		$("#start_t").val(time_v[0]);
		$("#end_t").val(time_v[1]);
		if(time_v[0] != "") $("#time_tmp").text(time_v[0] + " ~ " + time_v[1]);
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

	$("#find_reset").click(function(){
		$("#pos_page select").prop("selectedIndex", 0);
		$("#pos_page input").val("");
		$("#time_page input").val("");
		$("#serious_page input").prop("checked", true);
		$("#find_page .tmp").text("");
		$("#serious_tmp").text("A1, A2, A3");
	});

	$("#find_submit").click(function(){
		var sql = "", record = "";
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
	});

	var Tstr_v = getTimeStr(new Date());
	$("#upload_date").val(Tstr_v[0]);
	$("#upload_time").val(Tstr_v[1]);

	$("#upload_reset").click(function(){
		$("#upload_page select").prop("selectedIndex", 0);
		$("#upload_page input").val("");
		Tstr_v = getTimeStr(new Date());
		$("#upload_date").val(Tstr_v[0]);
		$("#upload_time").val(Tstr_v[1]);
		$("#upload_serious").prop("selectedIndex", 2);
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
	$("#find_county").html("<option value=''>請選擇縣市</option>");
	for(var i = 0; i < county.length; i++){
		$("#find_county").append("<option value='" + county[i] + "'>" + county[i] + "</option>");
		$("#upload_county").append("<option value='" + county[i] + "'>" + county[i] + "</option>");
	}
	$("#find_county").prop("selectedIndex", 0);
	$("#upload_county").prop("selectedIndex", 0);
}

function setTownship(){
	$("#find_township").html("<option value=''>請選擇鄉鎮市區</option>");
	for(var i = 0; i < township.length; i++){
		$("#find_township").append("<option value='" + township[i] + "'>" + township[i] + "</option>");
		$("#upload_township").append("<option value='" + township[i] + "'>" + township[i] + "</option>");
	}
	$("#find_township").prop("selectedIndex", 0);
	$("#upload_township").prop("selectedIndex", 0);
}

function setStreet(){
	$("#find_street").html("<option value=''>請選擇街道名稱</option>");
	for(var i = 0; i < street.length; i++){
		$("#find_street").append("<option value='" + street[i] + "'>" + street[i] + "</option>");
		$("#upload_street").append("<option value='" + street[i] + "'>" + street[i] + "</option>");
	}
	$("#find_street").prop("selectedIndex", 0);
	$("#upload_street").prop("selectedIndex", 0);
}
