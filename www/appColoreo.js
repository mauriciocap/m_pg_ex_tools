function appColoreo() {

var iconsSvg={"star":"<svg fill=\"none\"><polygon points=\"10,1 4,19 19,7 1,7 16,19\" style=\"fill:lime;stroke:purple;stroke-width:1;fill-rule:nonzero;\"/></svg> ","flow":"<svg viewBox=\"0 0 94 94\" style=\"fill:red;stroke:black;\"><path d=\"M86.75,70.981V59.5c0-6.934-4.594-17.25-17.25-17.25h-10c-7.06,0-7.717-3.464-7.75-5.25V23.02 C56.014,21.178,59,16.939,59,12c0-6.626-5.373-12-12-12c-6.627,0-12,5.374-12,12c0,4.939,2.986,9.178,7.25,11.02V37 c0,1.294-0.374,5.25-7.75,5.25h-10c-12.656,0-17.25,10.316-17.25,17.25v11.481C2.986,72.822,0,77.062,0,82c0,6.627,5.373,12,12,12 c6.627,0,12-5.373,12-12c0-4.938-2.986-9.178-7.25-11.019V59.5c0-1.294,0.374-7.75,7.75-7.75h10c3.035,0,5.595-0.459,7.75-1.237 v20.469C37.986,72.822,35,77.062,35,82c0,6.627,5.373,12,12,12c6.627,0,12-5.373,12-12c0-4.938-2.986-9.178-7.25-11.019V50.513 c2.155,0.778,4.715,1.237,7.75,1.237h10c7.06,0,7.717,5.964,7.75,7.75v11.481C72.986,72.822,70,77.062,70,82c0,6.627,5.373,12,12,12 c6.627,0,12-5.373,12-12C94,77.062,91.014,72.822,86.75,70.981z M18.923,82c0,3.823-3.101,6.923-6.923,6.923 c-3.823,0-6.923-3.1-6.923-6.923s3.1-6.923,6.923-6.923C15.822,75.077,18.923,78.177,18.923,82z M40.077,12 c0-3.823,3.101-6.923,6.923-6.923c3.823,0,6.923,3.1,6.923,6.923s-3.1,6.923-6.923,6.923C43.178,18.923,40.077,15.823,40.077,12z M53.923,82c0,3.823-3.1,6.923-6.923,6.923c-3.822,0-6.923-3.1-6.923-6.923s3.101-6.923,6.923-6.923 C50.823,75.077,53.923,78.177,53.923,82z M82,88.923c-3.822,0-6.923-3.1-6.923-6.923s3.101-6.923,6.923-6.923 c3.823,0,6.923,3.1,6.923,6.923S85.823,88.923,82,88.923z\"/></svg> ","plug":"<svg viewBox=\"0 0 50 50\" style=\"fill:orange;stroke:orange;\"><path d=\"M15.962,21.383l-2.908-5.036c-0.353-0.611-0.144-1.392,0.467-1.745c0.61-0.352,1.391-0.142,1.744,0.468l2.908,5.037 L15.962,21.383z M24.176,16.64l2.211-1.277l-2.907-5.036c-0.353-0.61-1.134-0.82-1.745-0.468c-0.61,0.353-0.819,1.134-0.467,1.744 L24.176,16.64z M32.604,28.129c0.471,1.588-0.601,2.682-2.188,3.71c0.004,0.009,0.016,0.015,0.021,0.024 c1.051,1.822,1.721,6.029-3.278,8.916c-0.61,0.351-1.392,0.142-1.744-0.469c-0.352-0.609-0.143-1.391,0.467-1.744 c4.062-2.344,2.416-5.303,2.345-5.428c-0.006-0.01-0.006-0.021-0.012-0.031c-1.686,0.861-3.166,1.242-4.306,0.039 c-2.114,0.567-3.943,0.156-5.353-2.287c-0.195-0.338-0.851-1.473-0.851-1.473l-2.553-4.424c-0.468-0.81-0.188-1.856,0.623-2.325 l11.792-6.809c0.812-0.468,1.857-0.187,2.328,0.624l2.553,4.423c0,0,0.656,1.136,0.851,1.474 C34.708,24.792,34.15,26.582,32.604,28.129z M30.525,24.332c-0.116-0.203-0.512-0.887-0.512-0.887l-0.684-1.187 c-0.282-0.487-0.912-0.656-1.398-0.375l-7.095,4.096c-0.488,0.281-0.657,0.912-0.375,1.399l0.685,1.187c0,0,0.395,0.685,0.512,0.887 c1.413,2.449,3.521,1.515,5.97,0.102C30.077,28.139,31.939,26.779,30.525,24.332z M28.385,23.048l-6.767,3.907l0.296,0.514 l6.766-3.907L28.385,23.048z M29.057,24.212l-6.767,3.907l0.296,0.514l6.766-3.907L29.057,24.212z M22.961,29.282l0.297,0.515 l6.766-3.906l-0.297-0.515L22.961,29.282z\"/></svg> ","house":"<svg viewBox=\"0 0 512 512\" style=\"fill:gray;stroke:black;\"><path d=\"M512,304l-96-96V64h-64v80l-96-96L0,304v16h64v160h160v-96h64v96h160V320h64V304z\"/></svg> "};


var ZOOM_MAX_GGL= 19;
var nodes;
var paths;

function rlat(idx) { return parseFloat(nodes[idx][3]); }
function rlong(idx) { return parseFloat(nodes[idx][4]); }
function rtype(idx) { return nodes[idx][2]; }
function rpopup(idx) { 
 return "<a href='xyz'>"+JSON.stringify(nodes[idx])+"</a>";
 return (nodes[idx].length>7 ? nodes[idx][7] : ("<a href='xyz'>"+JSON.stringify(nodes[idx])+"</a>")) 
}

MapO= { "lat": -34.5786667,"long": -58.4864051};
MapO= { "lat": -34.69171393810595, "long": -58.311354630419046 };
var latlong= [MapO.lat,MapO.long];
var zoom= ZOOM_MAX_GGL;

Ext.application({
    name: 'LeafletMapDemo',

    // launch function is called as soon as app is ready
    launch: function() {
        var mainView= Ext.create('Ext.Panel',{ 'layout': 'vbox'});
        Ext.Viewport.add(mainView);
      
        var btnView= Ext.create('Ext.Panel',{ 'layout': 'hbox'});
        mainView.add(btnView);

        var btnColoreo= Ext.create('Ext.Button', { id: 'btncoloreo', text: 'Accion1'}); btnView.add(btnColoreo);
        var btnColoreo2= Ext.create('Ext.Button', { id: 'btncoloreo', text: 'Accion2'}); btnView.add(btnColoreo2);
        
        btnColoreo.setHandler(function () { dialogShow("boton coloreo") });

        mainView.add(
            Ext.create('Ext.Container', { id: 'mapcanvas', width: '100%', height: (window.innerHeight-30)+'px' })
        );
        
        var map = L.map('mapcanvas',{maxZoom: ZOOM_MAX_GGL}).setView(latlong, zoom);

				//{google maps FROM:  3p/leaflet-plugins/examples/google.html
				/* XXX:SIN INTERNET */
				var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
				var ggl = new L.Google();
				map.addLayer(ggl);
				map.addControl(new L.Control.Layers( {'OSM':osm, 'Google':ggl}, {}));
				/* */
 				//google maps} 

				var icons= {};
				for (var k in iconsSvg) { icons[k]= L.divIcon({className: 'my_div_icon', html: iconsSvg[k]}); }

				var typeToIcon= { "190": icons["house"], "21": icons["plug"], "41": icons["flow"], "*": icons["star"],"*on": icons["plug"]  };

				var layerColoreo= L.layerGroup([]).addTo(map);
				var updateColoreo= function () { 
					try {
						//console.log("COLOREO "+JSON.stringify(nodes)); 
						layerColoreo.clearLayers();

						var src= {};
						var pids= Object.keys(paths);
						for (pid in pids) {
							var p0= paths[pid];
							if (p0) {
								var latlong0= [];
								p0.slice(2).map(function (nid) { 
									if (nodes[nid]) {
										src[nid]= p0[2]
										latlong0.push([rlat(nid), rlong(nid)]); 
									}
								});
								//console.log("POLY"+JSON.stringify({"p": p0, "ll": latlong0}));
								layerColoreo.addLayer(L.polyline(latlong0, { color: "red"} ));
							}
						}

        		for (id in nodes) {
							if (rlat(id) && rlong(id)) {
	         	   layerColoreo.addLayer(L.marker([rlat(id),rlong(id)],{icon: typeToIcon[rtype(id)+(src[id] ? "on" : "")]||typeToIcon["*"+(src[id] ? "on" : "")]}).bindPopup(rpopup(id)))
							}
        		}

					}
					catch (e) {
						console.log("ERR:"+e)
					}
        };

        L.marker(latlong).addTo(map)
			  .bindPopup('<b>EM</b>').openPopup();

//AJAX
var poll;
poll= function () {
Ext.Ajax.request({
   url: 'http://192.168.10.16:8080/app/aqicoloreo',
   success: function(response, opts) {
      //DBG:console.log("JSON:"+response.responseText);
			nodes={}; paths= {};
			response.responseText.split("\n").map(function (l) { 
				var d= l.split("\t") 
				if (d[0]=="N") { nodes[d[1]]=d; }
				else { paths[d[1]]=d }
			});
			updateColoreo();
			setTimeout(poll,10000);
   },
   failure: function(response, opts) {
      console.log('server-side failure with status code ' + response.status);
			setTimeout(poll,10000);
   }
});
};

poll();

}

});

}
