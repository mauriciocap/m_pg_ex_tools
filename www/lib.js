//INFO: quickly prototype/deploy apps using phonegap & loading from url/sdcard

//S: base 
function ensureInit(k,v,scope) { //D: ensure k exists in scope initializing with "v" if it didn't
	if (!(k in scope)) { scope[k]= v; }
	return scope[k];
}
CFGLIB= ensureInit("CFGLIB",{},this);

function str(x) {
	var r; 
	try { r= JSON.stringify(x); }
	catch (ex) { //A: json fails, must be circular
		var t= typeof(x)
		r="str_r('"+typeof(x)+"',{";
		for (var i in x) { r+="'"+i+"': '"+x[i]+"', " }	
		r+="});"
	}
	return r;
}

function evalm(src,failSilently) {
	logm("DBG",9,"EVALM",src);
	var r;
	try { r = window.eval(src); logm("DBG",9,"EVALM",[r,src]); }
	catch (ex) {
		logm("ERR",9,"EVALM",[ex.message,src]); 
		if (!failSilently) { throw(ex); }
	}	
	return r;
}

function strToBin(d) {
  var dataBuf = new ArrayBuffer(d.length);
  var dataView = new Int8Array(dataBuf);
  for (var i=0; i < d.length; i++) { dataView[i] = d.charCodeAt(i) & 0xff; }
	return dataBuf;
}

//S: log
CFGLIB.loglvlmax=9;
function logm(t,l,msg,o) {
	if (l<=CFGLIB.loglvlmax) {
		alert(["LOG",t,l,msg,str(o)].join(":"));
	}
}

//S: defaults
function onFail(d) { logm("ERR",1,"ON FAIL",d); }
function nullf() {}

//S: files
function getFile(path,fmt,cbok,cbfail) {
	cbfail=cbfail ||onFail;
	function read(file) {
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			logm("DBG",8,"getFile onloadend",{path: path, result: evt.target.result});
			cbok(evt.target.result);	
		};
		if (fmt=="url") { reader.readAsDataURL(file); }
		else if (fmt=="bin") { reader.readAsBinaryString(file); }
		else if (fmt=="array") { reader.readAsArrayBuffer(file); }
		else { reader.readAsText(file); }
	};

	var onGotFile= function (file) { read(file); }

	var onGotFileEntry= function (fileEntry) { fileEntry.file(onGotFile,cbfail); }

	var onGotFs= function (fileSystem) {
		fileSystem.root.getFile(path, {create: false}, onGotFileEntry, cbfail);
	}

	logm("DBG",8,"getFile",{path: path});
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onGotFs, cbfail);
} 

function getFileMeta(path,cbok,cbfail) {
	cbfail=cbfail ||onFail;
	var onGotFileEntry= function (fileEntry) { fileEntry.getMetadata(cbok,cbfail); }
	var onGotFs= function (fileSystem) {
		fileSystem.root.getFile(path, {create: false}, onGotFileEntry, cbfail);
	}
	logm("DBG",8,"getFile",{path: path});
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onGotFs, cbfail);
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

function keysFile(dirPath,cb) {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fsSuccess, onFail);
 
	function fsSuccess(fs) {
		logm("DBG",9,"keysFile gotfs",[dirPath,fs.root]); try {
			if (dirPath) { fs.root.fullPath= dirPath; } //A: cd
			var directoryReader = fs.root.createReader()
			directoryReader.readEntries(cb,cb);
		} catch (ex) { logm("ERR",7,"keysFile gotfs",[dirPath,ex.message]); }
	}
}

function setFile(path,data,cbok,cbfail) {
	cbfail=cbfail || onFail;

  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, onFail);

  function gotFS(fileSystem) {
		logm("DBG",9,"setFile gotfs",[path]); try {
	    fileSystem.root.getFile(path, {create: true, exclusive: false}, gotFileEntry, cbfail);
		} catch (ex) { logm("ERR",7,"setFile gotfs",[path,ex.message]); }
	}

  function gotFileEntry(fileEntry) {
		logm("DBG",9,"setFile gotentry",[path]); try {
	    fileEntry.createWriter(gotFileWriter, cbfail);
		} catch (ex) { logm("ERR",7,"setFile gotentry",[path,ex.message]); }
  }

  function gotFileWriter(writer) {
		logm("DBG",9,"setFile write",[path]); try {
			writer.onwriteend = function(evt) {
					writer.onwriteend = cbok;
					writer.write(data);
			};
			writer.truncate(0);  
		} catch (ex) { logm("ERR",7,"setFile write",[path,ex.message]); }
  }
}

function setFileBin(path,data,cbok,cbfail) { setFile(path,strToBin(data),cbok,cbfail); }

function setFileDir(path,cbok,cbfail) {
	cbfail=cbfail ||onFail;
	var parts= path.split("/");
	var i= 0;

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, cbfail); 

	function onRequestFileSystemSuccess(fileSystem) { 
		if (parts.length==0) { cbok(fileSystem.root); }
		else {	createPart(fileSystem.root) }
	}

	function createPart(pdir) {
		var p= parts[i]; i++;
    pdir.getDirectory(p, {create: true, exclusive: false}, i<parts.length ? createPart : cbok,cbfail);
	}
} 

//S: maps
//FROM: http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#X_and_Y
//EG: http://a.tile.openstreetmap.org/15/11064/19741.png is /zoom/x/y.png 
function mapLngToTile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function mapLatToTile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }

function mapPathToTile(z,x,y) {
	return CFGLIB.pathToTiles+[z,x,y].join("/")+".png";
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
		var fname= mapPathToTile(z,x,y);
		getFile(fname,"url",function (d) { tile.src= d },nullf); 
	}
});


//S: DFLT UI
function uiDflt() {
	$(document.body).html('UI Dflt<div id="load"> <input id="inUrl" size=80></br> <input id="btnGet" type="button" value="Get"> <input id="btnFile" type="button" value="File"> <input id="btnEval" type="button" value="Eval"></br> <input id="btnEx" type="button" value="ExUrl"><input id="btnExit" type="button" value="Exit"></br> <input id="btnClear" type="button" value="Clear"></br> <textarea id="inJs" cols=80 rows=25> </textarea> </div>');
	$('#btnGet').on('click', function () { try { getHttp(pathGet(),{},jsSet);} catch(e) { alert("ERR:"+e) }; return false; });
	$('#btnFile').on('click', function () { try { getFile(pathGet(),"txt",jsSet); } catch(e) { alert("ERR:"+e) }; return false; });

	$('#btnEval').on('click', function () { try { var js= $('#inJs').val(); alert("EVAL '"+js+"'"); window.eval(js); } catch(e) { alert("ERR:"+e) }; return false; });

	$('#btnClear').on('click', function () { jsSet(""); return false; });

	$('#btnEx').on('click', function () { pathSetDflt();	return false; });
	$('#btnExit').on('click', function () { navigator.app.exitApp(); return false; });
	pathSetDflt();
}

function jsSet(txt) { $('#inJs').val(txt); }
function pathGet() { return $('#inUrl').val(); }
function pathSetDflt() {
	$('#inUrl').val("https://raw.githubusercontent.com/mauriciocap/m_pg_ex_tools/master/examples.js");
}

//UI{
///DIALOG{
//FROM: http://sureshdotariya.blogspot.com.ar/2013/04/how-to-show-alert-dialog-box-in-sencha.html
function dialogShow(msg) {
	Ext.Msg.show({
		title: 'Status',
		message: msg || 'Your message here',
		// width: 500,
		buttons: Ext.MessageBox.YESNOCANCEL,
		iconCls: Ext.MessageBox.INFO,
		fn: function(buttonId) { alert('You pressed the "' + buttonId + '" button.'); }
	});
}
//}DIALOG
//}UI
CFGLIB.pathToLib="inno/pg/";
CFGLIB.pathDfltInLib="dflt/";
CFGLIB.pathToTiles="xtiles/";
CFGLIB.initFile0="0init.js";
CFGLIB.initFile1="0initA.js";
CFGLIB.cfgurl="https://raw.githubusercontent.com/mauriciocap/m_pg_ex_tools/master/";

function evalFile(name,failSilently,cbok,cbfail) { 
	getFile(CFGLIB.pathToLib+name,"txt",function (src) { var r= evalm(src,failSilently); cb(r); },cbfail);
}

function evalFileOrDflt(name,failSilently,cbok,cbfail) {
	var s0= function () { evalFile(name,failSilently,cbok,s1f); }
	var s1f= function () { evalFile(CFGLIB.pathDfltInLib+name,failSilently,cbok,cbfail); }
	s0();
}

function getHttpToDflt(fname,url,cbok,cbfail) {
	getHttp(url,{},function (d) {
		setFile(CFGLIB.pathToLib+CFGLIB.pathDfltInLib+fname,d,cbok,cbok);
	},cbfail);
}

function evalUpdated(name,cbok,cbfail) {
	var s0= function () { getHttpToDflt(name,CFGLIB.cfgurl+name,s1,s1); }
	var s1= function () { evalFileOrDflt(name,false,cbok,cbfail); }
	s0();
}

//S: init
function rtInitImpl() {
	var s0= function () { setFileDir(CFGLIB.pathToLib+CFGLIB.pathDfltInLib,s10); }
	var s10= function () { evalUpdated(CFGLIB.initFile0,s11,s11); }
	//A: fue a la web a buscar "0init.js", si pudo lo guardo en 'inno/pg/dflt/0init.js'
	//A: si existe 'inno/pg/0init.js' (porque vos lo creaste y editaste) ejecuta ese, sino el de dflt
	//A: entonces, podes trabajar en tu compu y actualizar en github y se te actualizan solos los telfonos
	//A: Y TAMBIEN, si estas probando algo en el telefono, modificar localmente
	var s11= function () { evalUpdated(CFGLIB.initFile1,s12,s12); }
	var s12= function () { if (!CFGLIB.noUiDflt) { uiDflt(); } }
	s0();
}

CFGLIB.appUrl= 'http://192.168.10.8:8080/www/app.js';
function runApp() {
	var s0= function () { getHttpToDflt('app.js',CFGLIB.appUrl,s1,s1); }
	var s1= function () { evalFileOrDflt('app.js',false,nullf); }
	s0();
}

function initScreen() { //D: pantalla inicial ofreciendo Run, Run con debug (alerts) y bajarse la app
	$(document.body).html('<center style="font-size: 200%; height: 2048px; width: '+window.innerWidth+'; background: #087;"><h1>FastApp</h1><br><big><p><button id="btnRun">GO</button><br></big><p><button id="btnRunDbg">dbg</button><p><input id="appUrl" value="'+CFGLIB.appUrl+'" style="width: 100%;"></center>');
	$('#btnRun').on('click',function () { CFGLIB.loglvlmax=0; s2(); });
	$('#btnRunDbg').on('click',function () { CFGLIB.loglvlmax=9; s2(); });
	var s2= function () { 
		CFGLIB.appUrl=$('#appUrl').val(); 
		$(document.body).html('<center style="font-size: 200%; margin-top: 50px; height: 2048px; width: '+window.innerWidth+'; background: #000;"><img src="img/loading.gif"></center>');
		rtInitImpl();
	}
}


ensureInit("LibAppStarted",false,this);
function rtInit() {
	if (LibAppStarted) { return true; } LibAppStarted= true;
	CFGLIB.loglvlmax=0;	
	evalFile(CFGLIB.initFile0,true,nullf,initScreen);	
}
document.addEventListener("deviceready", rtInit, false);
