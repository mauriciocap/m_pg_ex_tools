function tAccel() {
	function onSuccess(acceleration) {
		alert('Acceleration X: ' + acceleration.x + '\n' +
				'Acceleration Y: ' + acceleration.y + '\n' +
				'Acceleration Z: ' + acceleration.z + '\n' +
				'Timestamp: ' + acceleration.timestamp + '\n');
	};

	function onError() {
		alert('onError!');
	};

	var options = { frequency: 3000 }; // Update every 3 seconds
	var watchID = window.accelerometer.watchAcceleration(onSuccess, onError, options);
}

function tExt() {
	$('#load').hide();
	Ext.application({
		launch: function () {
			Ext.apply(Ext.MessageBox, {
				hide: function() {
					if (this.activeAnimation && this.activeAnimation._onEnd) { this.activeAnimation._onEnd(); }
					return this.callParent(arguments);
				}
			});

			vMain= Ext.create('Ext.Panel', {
				fullscreen: true,
				html: 'hello world'
			});
			vBtn= Ext.create('Ext.Button', { text: 'dlg'});
			vMain.add(vBtn);
			vBtn.setHandler(function () {
				Ext.Msg.prompt('a ver...','habemus sencha',function (text) {});
			});
		}
	});
}

PATH2="/sdcard1";

function tFileDir() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fsSuccess, onFail);
 
	function fsSuccess(fs){
		alert("fsSuccess "+fs.root.fullPath); try {
		fs.root.fullPath = PATH2; // change the path

		// create directory reader
		var directoryReader = fs.root.createReader()
		// get a list of all entries in the directory
		directoryReader.readEntries(dirSuccess,onFail);
		} catch (ex) {
			alert("ERROR: fsSuccess "+ex.message);
		}
	}
	 
	function dirSuccess(entries){
		alert("dirSuccess"); try {
			alert(entries.map(function (e) { return e.fullPath; }).join("\n"));
		} catch (ex) { alert("ERROR: dirSuccess "+ex.message); }
	}
}

function tDld() {
	getHttp("http://a.tile.openstreetmap.org/18/88517/157930.png",{},function (d) {
		setFileBin("xtile.png",d,function () { alert("done"); });
	});
}

var p='file:///'
function tDld2() {
	var url= "http://a.tile.openstreetmap.org/18/88517/157930.png";
	var filePath= "xtile.png"

	//FROM: http://docs.phonegap.com/en/1.5.0/phonegap_file_file.md.html#FileTransfer
	var fileTransfer = new FileTransfer();
	fileTransfer.download(
    url,
    p+filePath,
    function(entry) {
        alert("download complete: " + entry.fullPath);
    },
    function(error) {
        alert("download error source " + error.source);
        alert("download error target " + error.target);
        alert("upload error code" + error.code);
    }
	);
}

function tDir() {
	setFileDir("x1/x2/x3", function () {})
}

function tSdImg() {
	getFile('xtile.png',function (d) {
		alert(d);
		$(document.body).append($("<img/>",{src: d}));
	},"url");	
}

lng0=-58.45990419387817;
lat0=-34.57556026465245;
lng1=-58.43059301376343;
lat1=-34.57066614385291;

function tTiles() {
	zoom=16;
	for (zoom=16; zoom<=18; zoom++) { (function (zoom) {
		var x0,x1,y0,y1;
		x0=lng2tile(lng0,zoom); x1= lng2tile(lng1,zoom); if (x0>x1) { var z=x1; x1=x0; x0=z; }
		y0=lat2tile(lat0,zoom); y1= lat2tile(lat1,zoom); if (y0>y1) { var z=y1; y1=y0; y0=z; }
		logm("DBG",9,[x0,x1,y0,y1]);
		for (x=x0; x<=x1; x++) { (function (x) {
			setFileDir(["xtiles",zoom,x].join("/"), function () {
				logm("DBG",9,"dir ok "+zoom+"/"+x);
				for (var y=y0; y<=y1; y++) { (function (y) {
					var fname=[zoom,x,y].join("/")+".png";
					logm("DBG",9,"get "+fname);
					getHttp("http://a.tile.openstreetmap.org/"+fname,{},function (d) {
						setFileBin("xtiles/"+fname,d,function () {});
					});
				})(y)}
			});
		})(x)}
	})(zoom)}
}

function tMap() {
	$(document.body).append('<div id="map" style="height: '+window.innerHeight+'px; width: '+window.innerWidth+'px; background: #999;"/>');
	map = L.map("map").setView([-34.5731,-58.44524],15);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
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
		getFile(fname, function (d) { tile.src= d }, "url"); 
	}
});

function tMapL() {
	$(document.body).append('<div id="map" style="height: '+window.innerHeight+'px; width: '+window.innerWidth+'px; background: #999;"/>');
	map = L.map("map").setView([(lat1-lat0)/2+lat0,(lng1-lng0)/2+lng0],16);
  lyr= new L.TileLayer.MobileSdTiles('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
	map.addLayer(lyr);	
}
