L.TileLayer.MobileSdTiles = L.TileLayer.extend({
	initialize: function(url, options) {
		L.Util.setOptions(this, options);
	},
	_loadTile: function (tile, tilePoint) {
		//SEE: "3p/leaflet/leaflet-src.js" 2958
		tile._layer = this;
		tile.onload = this._tileOnLoad;
		tile.onerror = this._tileOnError;

		var z= this._map.getZoom();
		var x= tilePoint.x;
		var y= tilePoint.y;
		var fname= ["xtiles",z,x,y].join("/")+".png";
		getFile(fname,"url",function (d) { tile.src= d },nullf); 
	}
});

function getHttpToDflt(fname,url,cbok,cbfail) {
	getHttp(url,{},function (d) {
		setFile(CFGLIB.pathToLib+CFGLIB.pathDfltInLib+fname,d,cbok,cbok);
	},cbfail);
}

function runApp() {
	var s0= function () { getHttpToDflt('app.js','http://192.168.10.8:8080/www/app.js',s1,s1); }
	var s1= function () { evalFileOrDflt('app.js',false,nullf); }
	s0();
}

function initScreen() {
	$(document.body).html('<center><h1>FastApp</h1><br><big><p><button id="btnRun">GO</button></big><p><button id="btnRunDbg">dbg</button></center>');
	$('#btnRun').on('click',function () { CFGLIB.loglvlmax=0; runApp(); });
	$('#btnRunDbg').on('click',function () { CFGLIB.loglvlmax=9; runApp(); });
}

initScreen();
