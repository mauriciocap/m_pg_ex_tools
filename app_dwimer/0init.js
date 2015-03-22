function exit(msg) {
	if (msg) { alert(msg); }
	navigator.app.exitApp();
}

function tplReplace(tpl,kvf) {
	return tpl.replace(/\$([A-Za-z0-9_.]*)\$/g,function (x,k) { return kvf(k); });
}

function kvfMk(aDict,dflt) {
	return function (k) { return aDict[k]||dflt; }
}

function principal(msgt) {
	var msg= tplReplace(msgt, kvfMk({"NOMBRE": "Federico", "SALUDO": "buen dia"},"no se"));
	alert(msg);
}

function t0() {
	var msgt="Hola $NOMBRE$, $SALUDO$! Hoy desayunamos... $DESAYUNO$.";
	leiPlantilla(msgt);
}

function t1() {
	var n= CFGLIB.pathToLib+"tpl.txt";
	alert("Leyendo "+n);
	getFile(n,"txt",leiPlantilla,leiPlantilla);
}

function leiPlantilla(msgt) {
	if (typeof(msgt)=="string") {
		principal(msgt);
	}
	else {
		alert("la plantilla no es un string, no se pudo leer?")
	}

	exit("Listo, chau!");
}

alert("Inicio");
t1();
