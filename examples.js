function tFileOpener(aPath) {
	//FROM: https://github.com/pwlin/cordova-plugin-file-opener2/blob/ef5c633/README.md
   cordova.plugins.fileOpener2.open(
     aPath || '/sdcard/Download/test.pdf', 
     'application/pdf', 
        { 
            error : function(errorObj) { 
                alert('Error status: ' + errorObj.status + ' - Error message: ' + errorObj.message); 
            },
            success : function () {
                alert('file opened successfully');              
            }
        }
    );
}

function tNavigate(anAddr) {
	//FROM: https://github.com/interFace-dk/phonegap-googlenavigate/blob/375ee51f3897e455fd7ae9a842567681da5e56bf/README.md
	navigator.google_navigate.navigate(anAddr or "mendoza 5323, buenos aires, argentina", function() {
    alert('Success');
}, function(errMsg) {
    alert("Failed: " + errMsg);
	});
}

function tScan() {
	//FROM: https://github.com/phonegap-build/BarcodeScanner/blob/9270025f71891b2f46a38b7bc3d1223b4955dce2/README.md
	cordova.plugins.barcodeScanner.scan(
      function (result) {
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
}

function tMail() {
	attachments=[]; //array of file names
	xattachmentsData=[]; // array of [filename, base64data]
  window.plugins.emailComposer.showEmailComposerWithCallback(function (r) { alert("RESULT: "+r); },"Test Msg from phonegap","This is the body of my text message",["m1@mauriciocap.com.ar","m2@mauriciocap.com.ar"],["m3@mauriciocap.com.ar"],["m4@mauriciocap.com.ar"],false,attachments,xattachmentsData);
}

function tTts(aMsg) {
	//FROM: https://github.com/macdonst/TTS/blob/master/2.2.0/docs/TTS.md
	var onStarted= function (result) {
    // When result is equal to STARTED we are ready to play

		alert("TTS INIT "+result);
				alert("TTS SPEAK");
        window.tts.speak(aMsg or "The text to speech service is ready. This example works!",function () { alert("TTS DONE");},onFail);
	}
	alert("TTS");
	window.tts.startup(onStarted, onFail);
}

function extFix() {
  Ext.Component.prototype.animateFn = // or Ext.override( Ext.Component, { animateFn:
    function (animation, component, newState, oldState, options, controller) {
        var me = this;
        if (animation && (!newState || (newState && this.isPainted()))) {


            this.activeAnimation = new Ext.fx.Animation(animation);
            this.activeAnimation.setElement(component.element);


            if (!Ext.isEmpty(newState)) {
                var onEndInvoked = false;
                var onEnd = function () {
                    if (!onEndInvoked) {
                        onEndInvoked = true;
                        me.activeAnimation = null;
                        controller.resume();
                    }
                };


                this.activeAnimation.setOnEnd(onEnd);
                window.setTimeout(onEnd, 50 + (this.activeAnimation.getDuration() || 500));


                controller.pause();
            }


            Ext.Animator.run(me.activeAnimation);
        }
    };
	
}

function tExt() {
alert("launching extJs");

$('#load').hide();

Ext.application({
  launch: function () {
       vMain= Ext.create('Ext.Panel', {
             fullscreen: true,
             html: 'hello world'
       });
       vBtn= Ext.create('Ext.Button', { text: 'dlg'});
       vMain.add(vBtn);
       vBtn.setHandler(function () {
           Ext.Msg.prompt('a ver...','habemus sencha',function (text) {});
       });
       
       vBtnExit= Ext.create('Ext.Button', { text: 'exit'});
       vMain.add(vBtnExit);
       vBtnExit.setHandler(function () {
           $('#load').show();
       });
   }
});

}

}
extFix();
$('#inJs').val("// tTts();\n// tNavigate();\n// tMail();\n// tScan();\n// tMail();\n// tExt();");

