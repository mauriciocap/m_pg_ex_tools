function runApp() {
	var s0= function () { getHttpToDflt('app.js','http://192.168.10.8:8080/www/app.js',s1,s1); }
	var s1= function () { evalFileOrDflt('app.js',false,nullf); }
	s0();
}

runApp();
