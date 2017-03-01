// Author: Nadim Jahangir (nadim.jahangir@vitrox.com)
// Date: March 26, 2014


// JS: Using this to store the global LSC states as the drawing is based on the DOM state in Nadim's implementation
var lscState = [];


function chDescComp(a, b) { return b.ch - a.ch; }

function ascComp(a, b) { return a - b; }

function prioAscComp(a, b) { return a.prio - b.prio; }

function getActivePC() {
	var $pcTabsList = $('#pcTabsDiv');
	return $pcTabsList.find('.active').index();
}


function getStartingVisID(pcID) {
	var prevCount = 0;
	$('#visLstDiv' + pcID).prevAll().each(function() {
		prevCount += $(this).children().length;
	});
	return prevCount;
}

function getStartingIndex(pcID, property) {
	var prevCount = 0;
	for (var i = 0; i < pcID; ++i) {
		prevCount += lscState[i][property];
	}
	return prevCount;
}




function init() {
	reset();
}


function reset() {
	$('#addVisBtn').attr('disabled', true);
	$('#addPCBtn').attr('disabled', false);
	$('#pcTabsDiv').empty();
	$('#pcLstDiv').empty();
  $('#comStart').val(5);
  settings.lsc.idxStart = 5;
  $('#com10Msg').css('display', 'none');
	resetDiagram();
	$('#resetBtn').attr('disabled', true);
}


function comStartChange() {
  var pcID = getActivePC();
  settings.lsc.idxStart = $('#comStart').val();
  config(pcID);
}

function handleTypeCh(pcID, visID) {
	
	if ($('#v' + visID + 'typ').val() == 'CurDrv') {
		$('#v' + visID + 'ch').val('7');
		$('#v' + visID + 'ch').attr('disabled', true);
	} else {
		$('#v' + visID + 'ch').attr('disabled', false);
	}
	handleChChange(visID);
	
	//var numVis = $('#visLstDiv' + pcID).children().length;
	//var visStart = getStartingVisID(pcID);
	/*var numCurDrv = 0;
	for (var i = 0; i < numVis; i++) {
		$('#v' + i + 'typ').attr('disabled', false);
	}
	for (var i = visStart; i < visStart + numVis; i++) {
		if ($('#v' + i + 'typ').val() == 'CurDrv') {
			//numCurDrv++;
			$('#v' + i + 'ch').attr('disabled', true);
			$('#v' + i + 'ch').val('7');
		} else $('#v' + i + 'ch').attr('disabled', false);
		handleChChange(i);
	}
	if (numCurDrv == 3) {
		for (var i = 0; i < numVis; i++) {
			if (numCurDrv == 3 && $('#v' + i + 'typ').val() == 'ULSC') $('#v' + i + 'typ').attr('disabled', true);
		}
	}*/
}


function handlePCChange(tab) {
	resetDiagram();
	var pcID = tab.index();
	
	$('#pcTabsDiv').children().each(function(i) {
		if (i == pcID) $(this).addClass('active');
		else $(this).removeClass('active');
	});
	$('#pcLstDiv').children().each(function(i) {
		if (i == pcID) $(this).show();
		else $(this).hide();
	});
  
	
	$('#addVisBtn').attr('disabled', $('#visLstDiv' + pcID).children().length == settings.vision.maxCount);
	
	config(pcID);
}

function addPC() {
	resetDiagram();
	
	var $pcTabsList = $('#pcTabsDiv');
	var $pcLstDiv = $('#pcLstDiv');
	var pcID = $pcTabsList.children().length;
  var $comStart = $('<select onchange="handleChStart()"></select>');
	var tabID = 'visLstDiv' + pcID;
	var $tab = $('<li></li>');
	var $tabTitle = $('<div class="tabTitle">PC ' + (pcID + 1) + '</div>');
	var $closeBtn = $('<i class="fa fa-times tabClose"></i>');
	var $content = $('<div id="' + tabID + '"></div>');
	
	$tab.append($tabTitle);
	$tab.append($closeBtn);
  
  for (var i = 0; i < 10; ++i) {
    $comStart.append('<option value="' + (i + 1) + '">' + (i + 1) + '</option>');
  }
  
	
	$pcTabsList.append($tab);
	$pcLstDiv.append($content);
	
	$pcLstDiv.children().not($content).each(function() {
		$(this).hide();
	});
	$pcTabsList.children().not($tab).each(function() {
		$(this).removeClass('active');
	});
	
	
	// Add an entry to the lscState variable
	lscState[pcID] = {
		ulscCount: 0,
		curDrvCount: 0,
		numLSC: 0,
		bridgeCount: 0
	};
	
	
	$tab.addClass('active');
	
	
	$tabTitle.on('click', function() {
		handlePCChange($tab);
	});
	$closeBtn.on('click', function() {
		removePC($tab);
	});
	
	$('#resetBtn').attr('disabled', false);
	$('#addVisBtn').attr('disabled', false);
	if (pcID == settings.pc.maxCount - 1) $('#addPCBtn').attr('disabled', true);
}


function addVis() {
	resetDiagram();
	var pcID = getActivePC();
	if (pcID < 0) return;
	
	
	var visLstDiv = $('#visLstDiv' + pcID);
	var i = visLstDiv.children().length + getStartingVisID(pcID);
	
	var html = 
"<div class='vis' id='v" + i + "div'>\
	<label class='vislabel' id='v" + i + "lbl'>" + 'Vision' + (i + 1) + "</label>\
	<select onchange='config(" + pcID + ")' id='v" + i + "sel'></select>\
	<label>LSC type</label>\
	<select onchange='handleTypeCh(" + pcID + ", " + i + ")' id='v" + i + "typ'>\
		<option value='ULSC'>ULSC</option>\
		<option value='CurDrv'>CurDrv</option>\
	</select>\
	<label class='vislabel'>Channel(s)</label>\
	<input type='number' min='1' max='7' step='1' value='1' onclick='this.select()' id='v" + i + "ch'/>\
	<label class='vislabel'>Trigger</label>\
	<select id='v" + i + "tr' onchange='config(" + pcID + ")'>\
		<option value='b'>Bridge</option>\
		<option value='d'>Direct</option>\
	</select>\
	<button onclick='removeVis(" + i + ")'><i class='fa fa-times'></button>\
</div>";
	
	visLstDiv.append(html);
	var sel = $('#v' + i + 'sel');
	for (var j = 0; j < settings.vision.types.length; j++) {
		sel.append("<option value='" + settings.vision.types[j] + "'>" + settings.vision.types[j] + "</option>");
	}
	
	//if (i == settings.vision.maxCount - 1) $('#addVisBtn').attr('disabled', true);
	if (visLstDiv.children().length == settings.vision.maxCount) $('#addVisBtn').attr('disabled', true);
	$('#v' + i + 'ch').on('input', chChange);
	
	
	for (var i = pcID + 1; i <= visLstDiv.siblings().length; ++i) {
		fixVisList(i);
	}
	
	config(pcID);
}


function chChange() {
	var id = $(this).attr('id');
	var i = parseInt(id.substring(1, id.indexOf('ch')));
	handleChChange(i);
}

function handleChChange(i) {
	var ch = parseInt($('#v' + i + 'ch').val());
	
	if (Number.isNaN(ch) || ch < 1) {
		ch = 1;
		$('#v' + i + 'ch').val('1');
		
	} else if (ch > 7) {
		ch = 7;
		$('#v' + i + 'ch').val('7');
	}
	
	var tr = $('#v' + i + 'tr');
	if (ch > settings.bridge.capacity) {
		tr.val('d');
		tr.attr('disabled', true);
		
	} else {
		tr.attr('disabled', false);
		if (settings.vision.cat.bridge.indexOf(ch) >= 0) tr.val('b');
		else if (settings.vision.cat.direct.indexOf(ch) >= 0) tr.val('d');
		
	}
	
	config(getActivePC());
}

function removePC(tab) {
	resetDiagram();
	
	var pcID = tab.index();
	
	var $pcTabsDiv = $('#pcTabsDiv');
	$pcTabsDiv.children()[pcID].remove();
	$('#visLstDiv' + pcID).remove();
	
	
	$('#addPCBtn').attr('disabled', false);
	if ($pcTabsDiv.children().length == 0) {
		$('#resetBtn').attr('disabled', true);
		$('#addVisBtn').attr('disabled', true);
		return;
	}
	
	var nextActive = Math.max(0, Math.min(pcID, $pcTabsDiv.children().length - 1));
	
	handlePCChange($pcTabsDiv.children().eq(nextActive));
	fixPCList(nextActive);
	
	config(nextActive);
}

function removeVis(i) {
	var pcID = getActivePC();
	resetDiagram();
	var $parent = $('#v' + i + 'div').parent();
	
	$('#v' + i + 'div').remove();
	
	for (var i = $parent.index(); i <= $parent.siblings().length; ++i) {
		fixVisList(i);
	}
	
	$('#addVisBtn').attr('disabled', false);
	config(pcID);
}

function fixPCList(pcID) {
	// Fix tabs list
	$('#pcTabsDiv').children().each(function(i) {
		$(this).find('.tabTitle').text('PC ' + (i + 1));
	});
	
	
	// Fix vis list
	$('#pcLstDiv').children().each(function(i) {
		$(this).attr('id', 'visLstDiv' + i);
		if (i >= pcID) fixVisList(i);
	});
}

function fixVisList(pcID) {
	var startID = getStartingVisID(pcID);
	
	$('#visLstDiv' + pcID).children().each(function(i) {
		i += startID;
		
		var div = $(this);
		div.attr('id', 'v' + i + 'div');
		
		var lbl = $(div.children()[0]);
		lbl.attr('id', 'v' + i + 'lbl');
		lbl.html('Vision' + (i + 1));
		
		var sel = $(div.children()[1]);
		sel.attr('id', 'v' + i + 'sel');
		
		var typ = $(div.children()[3]);
		typ.attr('id', 'v' + i + 'typ');
		
		var ch = $(div.children()[5]);
		ch.attr('id', 'v' + i + 'ch');
		
		var tr = $(div.children()[7]);
		tr.attr('id', 'v' + i + 'tr');
		
		var btn = $(div.children()[8]);
		btn.attr('onclick', 'removeVis(' + i + ')');
	});
}

function formatLabel(prefix, idx) {
	return prefix + (idx < 10 ? '0' : '') + idx;
}

function config(pcID) {
	var visStart = getStartingVisID(pcID);
	var numVis = $('#visLstDiv' + pcID).children().length;
	var visBr = [];
	var visDr = [];
	var visions = [];
	var brChLeft = 0;
		
	var numCurDrv = 0;
	for (var i = visStart; i < visStart + numVis; i++) {
		$('#v' + i + 'typ').attr('disabled', false);
		if ($('#v' + i + 'typ').val() == 'CurDrv') numCurDrv++;
	}
	
	for (var i = visStart; i < visStart + numVis; i++) {
		if (numCurDrv == 3 && $('#v' + i + 'typ').val() == 'ULSC') $('#v' + i + 'typ').attr('disabled', true);
		
		var ch = parseInt($('#v' + i + 'ch').val());
		var tr = $('#v' + i + 'tr').val();
		ch = ch < 1 ? 1 : (ch > 7 ? 7 : ch);
		var name = $('#v' + i + 'lbl').html();
		var type = $('#v' + i + 'sel').val();
		var vis = {
			prio: i,
			name: name,
			type: type,
			label: name + '(' + ch + 'CH)\n' + type + "\nCam=" + (settings.camera.prefix + (i + settings.camera.idxStart)),
			ch: ch,
			chLeft: ch,
			curDrv: $('#v' + i + 'typ').val() == 'CurDrv'
		};
		
		if (tr == 'b') {
			visBr.push(vis);
			brChLeft += vis.ch;
		} else {
			visDr.push(vis);
			visions.push(vis);
		}
	}
	
	// allocate bridges
	visBr.sort(chDescComp);
	var bridges = [];
	while (brChLeft > 0) {
		var chLeft = settings.bridge.capacity;
		var br = {
			prio: 99999,
			ch: 0,
			chLeft: 0,
			isBridge: true,
			vis: []
		};
		
		for (var i = 0; i < visBr.length; i++) {
			if (visBr[i].chLeft > 0 && visBr[i].chLeft <= chLeft) {
				br.ch += visBr[i].chLeft;
				chLeft -= visBr[i].chLeft;
				brChLeft -= visBr[i].chLeft;
				visBr[i].chLeft = 0;
				br.prio = Math.min(br.prio, visBr[i].prio);
				br.vis.push(visBr[i]);
			}
		}
		
		br.chLeft = br.ch;
		bridges.push(br);
		visions.push(br);
	}
	visions.sort(chDescComp);
	var noSplitLscs = [];
	var splitLsc;
	for (var i = 0; i < settings.lsc.types.length; i++) {
		if (typeof settings.lsc.types[i] == 'number') {
			noSplitLscs.push(settings.lsc.types[i]);
		} else {
			splitLsc = settings.lsc.types[i];
		}
	}
	noSplitLscs.sort(ascComp);
	splitLsc.sort(ascComp);
	var maxNoSplitLsc = noSplitLscs[noSplitLscs.length - 1];
	var maxChInLsc = splitLsc[0] + splitLsc[1];
	var cur = 0;
	var lscs = [];
	var ulscCount = 0;
	var curDrvCount = 0;
	while (cur < visions.length) {
		if (visions[cur].chLeft > 0) {
			var lsc = {
				prio: visions[cur].prio,
				vis: [visions[cur]]
			};
			
			if (visions[cur].curDrv) ++curDrvCount;
			else ++ulscCount;
			
			if (visions[cur].chLeft > maxNoSplitLsc) {
				lsc.ch = maxChInLsc;
			} else {
				var remi = -1;
				for (var i = cur + 1; i < visions.length; i++) {
					if (visions[i].chLeft > 0 && visions[i].chLeft <= splitLsc[0]) {
						visions[i].chLeft = 0;
						remi = i;
						break;
					}
				}
				
				if (remi >= 0) {
					lsc.ch = maxChInLsc;
					lsc.prio = Math.min(lsc.prio, visions[remi].prio);
					lsc.vis.push(visions[remi]);
				} else {
					for (var i = 0; i < noSplitLscs.length; i++) {
						if (visions[cur].ch <= noSplitLscs[i]) {
							lsc.ch = noSplitLscs[i];
							break;
						}
					}
				}
			}
			visions[cur].chLeft = 0;
			lscs.push(lsc);
		}
		cur++;
	}
	lscs.sort(prioAscComp);
	
	// Count the number of ULSC and CurDrv LSCs
	lscState[pcID].curDrvCount = curDrvCount;
	lscState[pcID].ulscCount = ulscCount;
	lscState[pcID].numLSC = ulscCount + curDrvCount;
	lscState[pcID].bridgeCount = bridges.length;
	
	labelall(lscs, splitLsc);
	
	
	draw(lscs);
}

function labelall(lscs, splitLsc) {
	var pcID = getActivePC();
	var visStart = getStartingVisID(pcID);
	
	var ulscStart = getStartingIndex(pcID, 'ulscCount');
	var curDrvStart = getStartingIndex(pcID, 'curDrvCount');
	var bridgeStart = getStartingIndex(pcID, 'bridgeCount');
	var numLsc = getStartingIndex(pcID, 'numLSC');
	var chStart = numLsc * 7;
	var portStart = numLsc * 4;
	
	
	var bri = 0;
	var curDrvIdx = settings.lsc.curDrvIdxStart;
  var ulscIdx = settings.lsc.idxStart;
  //var ulscIdx = lscState[pcID].comStart;
	var c = 0;
	var u = 0;
	for (var i = 0; i < lscs.length; i++) {
		var lsc = lscs[i];
		var lscIdx = lsc.vis[0].curDrv ? curDrvIdx++ : ulscIdx++;
		
		
		// JS: Modified lsc label number here -- 18/Nov/2014
		// JS: Made the name of the LSC to reflect if it's ULSC or CurDrv
		// JS: c and u are used to keep track of the current number of the LSC type
		var lscType = lsc.vis[0].curDrv ? ':CurDrv' : ':ULSC';
		if (lsc.vis[0].curDrv) lsc.label = settings.lsc.prefix + (lscIdx + curDrvStart) + lscType + (c++ + 1 + curDrvStart) + " (" + lsc.ch + "CH)";
		else lsc.label = settings.lsc.prefix + (lscIdx + ulscStart) + lscType + (u++ + 1 + ulscStart) + '(' + lsc.ch + "CH)";
    
    // JS: Modified here 7/Sep/2015
    // Display message when COM10 reached
    if (lscIdx + ulscStart >= 10) {
      $('#com10Msg').css('display', 'block');
      alert("COM10 reached!");
    } else {
      $('#com10Msg').css('display', 'none');
    }
    
		//lsc.vis[0].curDrv ? ++c : u++;
		
		lsc.sixWayPortLabel = formatLabel(settings.lsc.sixWayPortPrefix, settings.lsc.sixWayPortIdxStart + i + numLsc);
		lsc.chLabels = [];
		var chi = i * (splitLsc[0] + splitLsc[1]);
		var v = lsc.vis[0];
		var tr5ch = v.ch;
		var tr2ch = 0;
		if (v.isBridge) {
			v.label = "Bridge" + (bri + 1 + bridgeStart);
			var chused = 0;
			for (var j = 0; j < v.vis.length; j++) {
				var vv = v.vis[j];
				vv.chLabel = settings.bridge.chPrefix + (settings.bridge.chIdxStart + settings.bridge.capacity * bri + chused + bridgeStart * settings.bridge.capacity);
				if (vv.ch > 1) {
					vv.chLabel += '-' + settings.bridge.chPrefix + (settings.bridge.chIdxStart + settings.bridge.capacity * bri + chused + vv.ch - 1 + bridgeStart * settings.bridge.capacity);
				}
				
				chused += vv.ch;
				for (var k = 0; k < vv.ch; k++, chi++) {
					// JS: Modified channel starting num here
					lsc.chLabels.push(settings.lsc.chPrefix + (chi + 1 + chStart) + "(" + vv.type + ")");
				}
			}
			v.label += "(" + chused + "/" + settings.bridge.capacity + ")";
			bri++;
		} else {
			for (var j = 0; j < v.ch; j++, chi++) {
				// JS: Modified channel starting num here
				lsc.chLabels.push(settings.lsc.chPrefix + (chi + 1 + chStart) + "(" + v.type + ")");
			}
		}
		
		for (; chi < (lsc.vis.length > 1 ? splitLsc[1] : lsc.ch); chi++) {
			lsc.chLabels.push(settings.lsc.chPrefix + (chi + 1 + chStart));
		}
		
		if (lsc.vis.length > 1) {
			var v = lsc.vis[1];
			tr2ch = v.ch;
			if (v.isBridge) {
				v.label = "Bridge" + (bri + 1 + bridgeStart);
				var chused = 0;
				for (var j = 0; j < v.vis.length; j++) {
					var vv = v.vis[j];
					vv.chLabel = settings.bridge.chPrefix + (settings.bridge.chIdxStart + settings.bridge.capacity * bri + chused + bridgeStart * settings.bridge.capacity);
					if (vv.ch > 1) {
						vv.chLabel += '-' + settings.bridge.chPrefix + (settings.bridge.chIdxStart + settings.bridge.capacity * bri + chused + vv.ch - 1 + bridgeStart * settings.bridge.capacity);
					}
					chused += vv.ch;
					for (var k = 0; k < vv.ch; k++, chi++) {
						lsc.chLabels.push(settings.lsc.chPrefix + (chi + 1 + chStart) + "(" + vv.type + ")");
					}
				}
				v.label += "(" + chused + "/" + settings.bridge.capacity + ")";
				bri++;
			} else {
				for (var j = 0; j < v.ch; j++, chi++) {
					lsc.chLabels.push(settings.lsc.chPrefix + (chi + 1 + chStart) + "(" + v.type + ")");
				}
			}
			
			for (; chi < splitLsc[0] + splitLsc[1]; chi++) {
				lsc.chLabels.push(settings.lsc.chPrefix + (chi + 1 + chStart));
			}
		}
		
		var porti = 4 * i + 1;
		lsc.powerLabel = settings.lsc.portPrefix + (porti++ + portStart) + ":" + settings.lsc.powerPort;
		lsc.usbLabel = settings.lsc.portPrefix + (porti++ + portStart) + ":" + settings.lsc.usbPort;
		lsc.tr5label = settings.lsc.portPrefix + (porti++ + portStart) +":" + settings.lsc.triggerPort + "(" + Math.min(tr5ch, splitLsc[1]) + "/" + splitLsc[1] + "CH)";
		lsc.tr2label = settings.lsc.portPrefix + (porti++ + portStart) +":" + settings.lsc.triggerPort;
		if (tr5ch > splitLsc[1]) tr2ch = tr5ch - splitLsc[1];
		if (tr2ch > 0) {
			 lsc.tr2label += "(" + tr2ch + "/" + splitLsc[0] + "CH)";
		}
		
		if (lsc.vis.length == 1) {
			lsc.vis[0].chLabel = lsc.tr5label;
			if (lsc.vis[0].ch > splitLsc[1]) lsc.vis[0].chLabel += ',' + lsc.tr2label;
		} else {
			lsc.vis[0].chLabel = lsc.tr5label;
			lsc.vis[1].chLabel = lsc.tr2label;
		}
	}
}

function connect(g, src, srcPort, tgt, tgtPort) {
	var link = new joint.shapes.devs.Link({
			source: { id: src.id, selector: src.getPortSelector(srcPort) },
			target: { id: tgt.id, selector: tgt.getPortSelector(tgtPort) },
			smooth: true,
			attrs:{'.connection': { stroke: 'blue' }}
	});
	
	g.addCell(link);
};

function drawVis(g, v, y) {
	v.node = new joint.shapes.devs.Model({
		position: { x: 20, y: y },
		size: { width: 120, height: 40 },
		outPorts: [v.chLabel],
		attrs: {
			'.label': {
				text: v.label,
				'ref-x': 0.5,
				'ref-y': 0.1
			}, rect: {
				fill: '#89ffc6'
			}, '.outPorts circle': { 
				fill: '#666666',
				magnet: 'passive',
				type: 'output'
			}
		}
	});
	g.addCell(v.node);
}

function drawBr(g, b, y) {
	var inPorts = [];
	for (var i = 0; i < b.vis.length; i++) {
		inPorts.push(b.vis[i].chLabel);
	}
	b.node = new joint.shapes.devs.Model({
		position: { x: 300, y: y },
		size: { width: 130, height: inPorts.length * 35 },
		inPorts: inPorts,
		outPorts: [b.chLabel],
		attrs: {
			'.label': { text: b.label, 'ref-x': .4, 'ref-y': .2},
			rect: { fill: '#89ccff' },
			'.inPorts circle': { fill: '#aaaaaa', magnet: 'passive', type: 'input' },
			'.outPorts circle': { fill: '#666666', magnet: 'passive', type: 'output' }
		}
	});
	g.addCell(b.node);
}

function drawLsc(g, l, y) {
	var inPorts = [l.powerLabel, l.usbLabel, l.tr5label, l.tr2label];
	var outPorts = [l.sixWayPortLabel].concat(l.chLabels);
	
	l.node = new joint.shapes.devs.Model({
		position: { x: 700, y: y },
		size: { width: 150, height: 250 },
		inPorts: inPorts,
		outPorts: outPorts,
		attrs: {
			'.label': { text: l.label, 'ref-x': .5, 'ref-y': .1 },
			rect: { fill: '#ffed89' },
			'.inPorts circle': { fill: '#aaaaaa', magnet: 'passive', type: 'input' },
			'.outPorts circle': { fill: '#666666', magnet: 'passive', type: 'output' }
		}
	});
	g.addCell(l.node);
}

function resetDiagram() {
	$('#disp').empty();
	$('#disp').html("<div id='paper' style='float:left'></div>");
}

function draw(lscs) {
	resetDiagram();
	var graph = new joint.dia.Graph;
	var paper = new joint.dia.Paper({
			el: $('#paper'),
			width: 1024,
			height: 1024,
			gridSize: 1,
			perpendicularLinks: true,
			model: graph
	});
	
	var visy = 10;
	var lscy = 10;
	for (var i = 0; i < lscs.length; i++) {
		var l = lscs[i];
		visy = Math.max(lscy, visy) + 138;
		drawLsc(graph, l, lscy);
		lscy += 260;
		for (var j = 0; j < l.vis.length; j++) {
			if (l.vis[j].isBridge) {
				var b = l.vis[j];
				drawBr(graph, b, visy);
				for (var k = 0; k < l.vis[j].vis.length; k++) {
					var v = l.vis[j].vis[k];
					drawVis(graph, v, visy);
					visy += 50;
					connect(graph, v.node, v.chLabel, b.node, v.chLabel);
				}
			} else {
				var v = l.vis[j];
				drawVis(graph, v, visy);
				visy += 50;
			}
			var commai = l.vis[j].chLabel.indexOf(',');
			if (commai == -1) {
				connect(graph, l.vis[j].node, l.vis[j].chLabel, l.node, l.vis[j].chLabel);
			} else {
				var lbl1 = l.vis[j].chLabel.substring(0, commai);
				var lbl2 = l.vis[j].chLabel.substring(commai + 1);
				connect(graph, l.vis[j].node, l.vis[j].chLabel, l.node, lbl1);
				connect(graph, l.vis[j].node, l.vis[j].chLabel, l.node, lbl2);
			}
		}
	}
	
	paper.setDimensions(Math.max(1024, $(window).width()), Math.max(visy, lscy, $(window).height() - $('#paper').position().top));
	$('#resetBtn').attr('disabled', false);
}
