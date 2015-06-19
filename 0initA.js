function evalFile(name,failSilently,cbok,cbfail) {
  getFile(CFGLIB.pathToLib+name,"txt",function (src) { var r= evalm(src+' //# sourceURL='+name,failSilently); cbok(r); },cbfail);
}

function evalm(src,failSilently) {
  logm("DBG",9,"EVALM",src);
  var r;
  try { r = window.eval(src); logm("DBG",9,"EVALM",[r,src]); }
  catch (ex) {
    logm("ERR",failSilently ? 9 : 0,"EVALM",[ex.message,src]);
    if (!failSilently) { throw(ex); }
  }
  return r;
}

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
