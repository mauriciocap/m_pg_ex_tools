lng0=-58.49;
lat0=-34.575;
lng1=-58.48;
lat1=-34.581;

function tTiles() {
	zoom=16;
	for (zoom=16; zoom<=19; zoom++) { (function (zoom) {
		var x0,x1,y0,y1;
		x0=mapLngToTile(lng0,zoom); x1= mapLngToTile(lng1,zoom); if (x0>x1) { var z=x1; x1=x0; x0=z; }
		y0=mapLatToTile(lat0,zoom); y1= mapLatToTile(lat1,zoom); if (y0>y1) { var z=y1; y1=y0; y0=z; }
		logm("DBG",9,[x0,x1,y0,y1]);
		for (x=x0; x<=x1; x++) { (function (x) {
			setFileDir(["xtiles",zoom,x].join("/"), function () {
				logm("DBG",9,"dir ok "+zoom+"/"+x);
				for (var y=y0; y<=y1; y++) { (function (y) {
					var fname=[zoom,x,y].join("/")+".png";
					logm("DBG",9,"get "+fname);
					getHttp("http://a.tile.openstreetmap.org/"+fname,{},function (d) {
						setFileBin("xtiles/"+fname,d,nullf);
					});
				})(y)}
			});
		})(x)}
	})(zoom)}
}

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
		getFile(fname,"url",function (d) { tile.src= d }); 
	}
});

if (0) {
getHttp('http://192.168.10.8:8080/www/app.js',{},function (d) {
	setFile(CFGLIB.pathToLib+"app.js",d,nullf);
	CFGLIB.loglvlmax= 3;
	tTiles();
	getHttp("http://192.168.10.8:8080/dbget",{},function (d) { setFileBin("xdata.txt",d,nullf); });
	evalm(d);
},function () {
	CFGLIB.loglvlmax= 3;
	evalFile("app.js");
});
CFGLIB.noUiDflt= true;

}
alert("hola");
uiDflt();
