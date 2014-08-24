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

//S: log
CFGLIB.loglvlmax=9;
function logm(t,l,msg,o) {
	if (l<=CFGLIB.loglvlmax) {
		alert(["LOG",t,l,msg,str(o)].join(":"));
	}
}

//S: defaults
function onFail(d) { logm("ERR",1,"ON FAIL",d); }

//S: files
function getFile(path, cb) {
	var readAsText= function (file) {
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			logm("DBG",8,"getFile onloadend",{path: path, result: evt.target.result});
			cb(evt.target.result);	
		};
		reader.readAsText(file);
	};

	var onGotFile= function (file) { readAsText(file); }

	var onGotFileEntry= function (fileEntry) { fileEntry.file(onGotFile,onFail); }

	var onGotFs= function (fileSystem) {
		fileSystem.root.getFile(path, {create: false}, onGotFileEntry, onFail);
	}

	logm("DBG",8,"getFile",{path: path});
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onGotFs, onFail);
} 

function getHttp(url,reqdata,cb) {
	logm("DBG",8,"getHttp",{url: url, req: reqdata});
	$.ajax({ url: url, data: reqdata,
		success: function(resdata){
			logm("DBG",8,"getHttp",{url: url, req: reqdata, res: resdata});
			cb(resdata);
		},
		error: onFail
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

//S: DFLT UI
function uiDflt() {
	$(document.body).html('UI Dflt<div id="load"> <input id="inUrl" size=80></br> <input id="btnGet" type="button" value="Get"> <input id="btnFile" type="button" value="File"> <input id="btnEval" type="button" value="Eval"></br> <input id="btnEx" type="button" value="ExUrl"><input id="btnExit" type="button" value="Exit"></br> <input id="btnClear" type="button" value="Clear"></br> <textarea id="inJs" cols=80 rows=25> </textarea> </div>');
	$('#btnGet').on('click', function () { try { getHttp(pathGet(),jsSet);} catch(e) { alert("ERR:"+e) }; return false; });
	$('#btnFile').on('click', function () { try { getFile(pathGet(),jsSet); } catch(e) { alert("ERR:"+e) }; return false; });

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
CFGLIB.initFile0="0init.js";
CFGLIB.initFile1="0initA.js";

function evalFile(name,failSilently,cb) { 
	getFile(CFGLIB.pathToLib+name,function (src) { evalm(src,failSilently); cb(); }); 
}

ensureInit("LibAppStarted",false,this);
function appInit() {
	if (LibAppStarted) { return true; } LibAppStarted= true;
	evalFile(CFGLIB.initFile0,false,function () {
		evalFile(CFGLIB.initFile1,true, function () {
			if (!CFGLIB.noUiDflt) { uiDflt(); }
		})
	})
}

document.addEventListener("deviceready", appInit, false);
