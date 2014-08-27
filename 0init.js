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

function getHttp(url,reqdata,cbok,cbfail) {
  cbfail=cbfail || onFail;
  logm("DBG",8,"getHttp",{url: url, req: reqdata});
  $.ajax({ url: url, data: reqdata,
    cache: false,
    dataType: 'text', //A: don't eval or process data
    beforeSend: function (jqXHR, settings) { //A: for binary downloads
      jqXHR.overrideMimeType('text/plain; charset=x-user-defined');
    },
    success: function(resdata){
      logm("DBG",8,"getHttp",{url: url, len: reqdata.length, req: reqdata, res: resdata});
      cbok(resdata);
    },
    error: cbfail
  });
}


CFGLIB.appUrl= 'http://192.168.10.8:8080/www/app.js';
function runApp() {
	var s0= function () { getHttpToDflt('app.js',CFGLIB.appUrl,s1,s1); }
	var s1= function () { evalFileOrDflt('app.js',false,nullf); }
	s0();
}

function initScreen() {
	$(document.body).html('<center style="font-size: 200%; height: 2048px; width: '+window.innerWidth+'; background: #087;"><h1>FastApp</h1><br><big><p><button id="btnRun">GO</button><br></big><p><button id="btnRunDbg">dbg</button><p><input id="appUrl" value="http://192.168.10.8:8080/www/app.js" style="width: 100%;"></center>');
	$('#btnRun').on('click',function () { CFGLIB.loglvlmax=0; CFGLIB.appUrl=$('#appUrl').val(); runApp(); });
	$('#btnRunDbg').on('click',function () { CFGLIB.loglvlmax=9; CFGLIB.appUrl=$('#appUrl').val(); runApp(); });
}

initScreen();
