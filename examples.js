function tFileOpener() {
	//FROM: https://github.com/pwlin/cordova-plugin-file-opener2/blob/ef5c633/README.md
   cordova.plugins.fileOpener2.open(
     '/sdcard/Download/test.pdf', 
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

function tNavigate() {
	//FROM: https://github.com/interFace-dk/phonegap-googlenavigate/blob/375ee51f3897e455fd7ae9a842567681da5e56bf/README.md
	navigator.google_navigate.navigate("Some Road 1, 1234, Some City", function() {
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
