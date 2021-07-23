///////////////
// GLOBALS
///////////////

var aPlayer = ['P1', 'P2', 'P3'];
var aPlayerColor = ['#c00000', '#eeaa00', '#00c000'];
var aCompany = ['GRR', 'NW', 'SW', 'SE', 'MK', 'MVR', 'MKV', 'MKN'];
var aCompanyColor = ['#e00000', '#000000', '#ffff00', '#e000e0', '#c06020', '#00c000', '#608060', '#3030ff'];
var aHistoryTotalWorth = aPlayer.map(p => []);
var aHistoryShareWorth = aPlayer.map(p => []);

///////////////
// CELL ACCESSORS
///////////////

var fGetMoney = function(sCompanyOrPlayer) {
	return parseInt($('#money-' + sCompanyOrPlayer).val());
};
var fSetMoney = function(sCompanyOrPlayer, iMoney) {
	$('#money-' + sCompanyOrPlayer).val(iMoney);
};
var fAddMoney = function(sCompanyOrPlayer, iDeltaMoney) {
	fSetMoney(sCompanyOrPlayer, fGetMoney(sCompanyOrPlayer) + iDeltaMoney);
};
var fGetOwnershipForPlayer = function(sCompany, sPlayer) {
	return $('#holding-' + sPlayer + '-' + sCompany).val();
};
var fGetShareWorthForPlayer = function(sPlayer) {
	return parseInt($('#shareWorth-' + sPlayer).val());
};
var fSetShareWorthForPlayer = function(sPlayer, iWorth) {
	$('#shareWorth-' + sPlayer).val(iWorth);
};
var fGetTotalWorthForPlayer = function(sPlayer) {
	return parseInt($('#totalWorth-' + sPlayer).val());
};
var fSetTotalWorthForPlayer = function(sPlayer, iWorth) {
	$('#totalWorth-' + sPlayer).val(iWorth);
};

///////////////
// CALCULATION
///////////////

var fRecalculateShareWorth = function() {
	aPlayer.forEach(p => fSetShareWorthForPlayer(p, 0));
	aCompany.forEach(c => {
		var iSharePrice = parseInt($('#sharePrice-' + c).val());
		aPlayer.forEach(p => {
			var iValueOfShares = iSharePrice * fGetOwnershipForPlayer(c, p);
			fSetShareWorthForPlayer(p, iValueOfShares + fGetShareWorthForPlayer(p));
		});
	});
};
var fRecalculateTotalWorth = function() {
	aCompany.forEach(c => {
		aPlayer.forEach(p => fSetTotalWorthForPlayer(p, fGetShareWorthForPlayer(p) + fGetMoney(p)));
	});
};
var fRecalculate = function() {
	fRecalculateShareWorth();
	fRecalculateTotalWorth();
};

///////////////
// ACTIONS
///////////////
var fPayDividend = function(sId) {
	var sCompany = sId.substring(sId.lastIndexOf('-') + 1);
	var iDividend = parseInt($('#input-' + sId).val());
	fAddMoney(sCompany, iDividend * fGetOwnershipForPlayer(sCompany, ""));
	aPlayer.forEach(p => fAddMoney(p, iDividend * fGetOwnershipForPlayer(sCompany, p)));
	fRecalculate();
};

///////////////
// GENERIC DOM
///////////////

var sHeaderTextColorShadow = 'color: #fff; text-shadow: 1px 1px #000, -1px 1px #000, 1px -1px #000, -1px -1px #000,'
	+ '0px 1px #000, 0px -1px #000, 1px 0px #000, -1px 0px #000;';
var fGetHeaderRow = function(sLabel, aName, aColor) {
	var oRow = $('<tr>');
	oRow.append('<th>' + sLabel + '</th>');
	for (var i = 0; i < aName.length; i++) {
		oRow.append('<th style="' + sHeaderTextColorShadow + ' background-color: ' + aColor[i] + ';">' + aName[i] + '</th>');
	}
	return oRow;
};
var fGetInputCell = function(sId) {
	var oInput = $('<input id="' + sId + '" type="number" value="0" size="5" style="width: 100px">');
	oInput.change(fRecalculate);
	return $('<td>').append(oInput);
};
var fGetInputRow = function(sLabel, sIdPrefix, aIdSuffix) {
	var oRow = $('<tr>');
	oRow.append('<td>' + sLabel + '</td>');
	aIdSuffix.forEach(s => oRow.append(fGetInputCell(sIdPrefix + '-' + s)));
	return oRow;
};
var fGetActionCell = function(sId, sCaption, fAction) {
	var oInput = $('<input id="input-' + sId + '" type="number" value="0" size="5" style="width: 50px">');
	var oButton = $('<button id="action-' + sId + '" style="width: 50px">' + sCaption + '</button>');
	oButton.click(() => fAction(sId));
	return $('<td>').append(oInput).append(oButton);
};
var fGetActionRow = function(sLabel, sIdPrefix, aIdSuffix, sCaption, fAction) {
	var oRow = $('<tr>');
	oRow.append('<td>' + sLabel + '</td>');
	aIdSuffix.forEach(s => oRow.append(fGetActionCell(sIdPrefix + '-' + s, sCaption, fAction)));
	return oRow;
};

///////////////
// CELL CREATION
///////////////

var fCreateCompanyTable = function() {
	var oTable = $('<table border = "1">');
	oTable.append(fGetHeaderRow('Companies', aCompany, aCompanyColor));
	oTable.append(fGetInputRow('Money', 'money', aCompany));
	oTable.append(fGetActionRow('Dividend / Share', 'payDividend', aCompany, 'Pay', fPayDividend));
	oTable.append(fGetInputRow('Share Price', 'sharePrice', aCompany));
	oTable.append(fGetInputRow('Own Shares in 10%', 'holding-', aCompany));
	aPlayer.forEach(p => oTable.append(fGetInputRow('Shares (' + p + ') in 10%', 'holding-' + p, aCompany)));
	$('#companies').append(oTable);
};
var fCreatePlayerTable = function() {
	var oTable = $('<table border = "1">');
	oTable.append(fGetHeaderRow('Players', aPlayer, aPlayerColor));
	oTable.append(fGetInputRow('Money', 'money', aPlayer));
	oTable.append(fGetInputRow('Share Worth', 'shareWorth', aPlayer));
	oTable.append(fGetInputRow('Total Worth', 'totalWorth', aPlayer));
	$('#players').append(oTable);
};

///////////////
// HISTORY
///////////////

var oHistory;
var fWriteHistory = function() {
	fRecalculate();
	for (var i = 0; i < aPlayer.length; i++) {
		aHistoryTotalWorth[i].push({y: fGetTotalWorthForPlayer(aPlayer[i])});
		aHistoryShareWorth[i].push({y: fGetShareWorthForPlayer(aPlayer[i])});
	}
	oHistory.render();
};
var fPrepareHistory = function() {
	var aHistorySeries = aPlayer.map((p, i) => [{
		type: "line",
		name: p,
		showInLegend: true,
		dataPoints: aHistoryTotalWorth[i]
	},{
		type: "line",
		lineDashType: "dash",
		lineThickness: 1,
		markerSize: 3,
		dataPoints: aHistoryShareWorth[i]
	}]).reduce((a, b) => a.concat(b));
	CanvasJS.addColorSet("history", aPlayerColor.map(c => [c, c]).reduce((a, b) => a.concat(b)));
	oHistory = new CanvasJS.Chart("history", {
		colorSet: "history",
		title: { text: "History" },
		axisX: {interval: 1, minimum: 0},
		axisY: {includeZero: false},
		data: aHistorySeries
	});
	oHistory.render();
	$('#history').click(() => fWriteHistory());
};

///////////////
// EXPORT / IMPORT
///////////////

var fPrepareExportImport = function() {
	var fExport = function() {
		$('#exportImportContent').val(JSON.stringify({
			aInput: $('input').toArray().map(e => ({sId: e.id, iValue: e.value})),
			aHistory: aPlayer.map((p, i) =>
				({sName: p, aTotalWorth: aHistoryTotalWorth[i], aShareWorth: aHistoryShareWorth[i]}))
		}));
	};
	$('<button>Export</button>').click(fExport).appendTo($('#exportImport'));
	var fImport = function() {
		var oContent = JSON.parse($('#exportImportContent').val());
		oContent.aInput.map(e => $('#' + e.sId).val(e.iValue));
		aPlayer.forEach((p, i) => {
			var oPlayerHistory = oContent.aHistory.find(h => h.sName === p);
			while (aHistoryTotalWorth[i].length > 0) {
				aHistoryTotalWorth[i].pop();
				aHistoryShareWorth[i].pop();
			}
			oPlayerHistory.aTotalWorth.forEach(e => aHistoryTotalWorth[i].push(e));
			oPlayerHistory.aShareWorth.forEach(e => aHistoryShareWorth[i].push(e));
		});
		oHistory.render();
	};
	$('<button>Import</button>').click(fImport).appendTo($('#exportImport'));
	$('<br><textarea id="exportImportContent" cols="80" rows="10">').appendTo($('#exportImport'));
};

///////////////
// MAIN
///////////////

$(document).ready(function() {
	fCreateCompanyTable();
	fCreatePlayerTable();
	fPrepareHistory();
	fPrepareExportImport();
});
