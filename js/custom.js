
(function( $ ) {
 $.widget( "custom.combobox", {
          _create: function() {
	      this.wrapper = $( "<span>" )
          .addClass( "custom-combobox" )
          .insertAfter( this.element );
          this.element.hide();
          this._createAutocomplete();
          this._createShowAllButton();
          },
          _createAutocomplete: function() {
          var selected = this.element.children( ":selected" ),
          value = selected.val() ? selected.text() : "";
          this.input = $( "<input>" )
          .appendTo( this.wrapper )
          .val( value )
          .attr( "title", "" ).attr("placeholder", "")
          .addClass( "form-control" )
          .autocomplete({
                        delay: 0,
                        minLength: 0,
                        source: $.proxy( this, "_source" )
                        })
          .tooltip({
                   tooltipClass: "ui-state-highlight"
                   });
          this._on( this.input, {
                   autocompleteselect: function( event, ui ) {
                   ui.item.option.selected = true;
                   this._trigger( "select", event, {
                                 item: ui.item.option
                                 });
                   },
                   autocompletechange: "_removeIfInvalid"
                   });
          },
          _createShowAllButton: function() {
          var input = this.input,
          wasOpen = false;
          $( "<a>" )
          .attr( "tabIndex", -1 )
          .attr( "title", "Show All Items" )
          .tooltip()
          .appendTo( this.wrapper )
          .button({
                  icons: {
                  primary: "ui-icon-triangle-1-s"
                  },
                  text: false
                  })
          .removeClass( "ui-corner-all" )
          .addClass( "custom-combobox-toggle ui-corner-right" )
          .mousedown(function() {
                     wasOpen = input.autocomplete( "widget" ).is( ":visible" );
                     })
          .click(function() {
                 input.focus();
                 // Close if already visible
                 if ( wasOpen ) {
                 return;
                 }
                 // Pass empty string as value to search for, displaying all results
                 input.autocomplete( "search", "" );
                 });
          },
          _source: function( request, response ) {
          var matcher = new RegExp('^' + $.ui.autocomplete.escapeRegex(request.term), "i" );
          response( this.element.children( "option" ).map(function() {
                                                          var text = $( this ).text();
                                                          if ( this.value && ( !request.term || matcher.test(text) ) )
                                                          return {
                                                          label: text,
                                                          value: text,
                                                          option: this
                                                          };
                                                          }) );
          },
          _removeIfInvalid: function( event, ui ) {
          // Selected an item, nothing to do
          if ( ui.item ) {
          return;
          }
          // Search for a match (case-insensitive)
          var value = this.input.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false;
          this.element.children( "option" ).each(function() {
                                                 if ( $( this ).text().toLowerCase() === valueLowerCase ) {
                                                 this.selected = valid = true;
                                                 return false;
                                                 }
                                                 });
          // Found a match, nothing to do
          if ( valid ) {
          return;
          }
          // Remove invalid value
          this.input
          .val( "" )
          .attr( "title", value + " didn't match any item" )
          .tooltip( "open" );
          this.element.val( "" );
          this._delay(function() {
                      this.input.tooltip( "close" ).attr( "title", "" );
                      }, 2500 );
          this.input.autocomplete( "instance" ).term = "";
          },
          _destroy: function() {
          this.wrapper.remove();
          this.element.show();
          }
          });
 })( jQuery );
$(function() {
  $(".hasautoc" ).combobox();
  $(".hasautor" ).combobox();
  
  });



//var admob_ios_key = 'ca-app-pub-7117138631731592/4607332660';
var admob_ios_key = 'ca-app-pub-7117138631731592/4607332660';
var admob_android_key = 'ca-app-pub-6869992474017983/9375997553';
var adId = (navigator.userAgent.indexOf('Android') >= 0) ? admob_android_key : admob_ios_key;
var pictureSource; // picture source
var destinationType; // sets the format of returned value
var selectedText; // to store selected word / string
var devicelanguage;
var translatedtext = '';
var localtext;
var boolflag = true;
var language = ['eng', 'jpn', 'chi_tra', 'rus', 'spa', 'eng'];
var country = ['india', 'japan', 'russia', 'china', 'spain', 'singapore'];
var country_name;
var ocrlanguage = 'eng';
var internetConnectivity = false;
var countersearch=0;
var serverUrl = "http://54.86.103.211/";
var myId = "";
var myName = "";
var translateflag=false;
var searchflag=false;
//var socket = io.connect("http://54.86.103.211:8080");
var re = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
var cropdata;
//var db = window.openDatabase("Menuscanner_DB", "1.0", "MenuScanner DB", 200000); //will create database Dummy_DB or open it
document.addEventListener("deviceready", onDeviceReady, false);


//document.addEventListener("pause", onPause, false);

function onResume(){
    updateLocation();
    checkConnection2()
    if(localStorage.getItem('userid')){
        var id=parseInt(localStorage.getItem('userid'))
        socket.emit('login', {
                    user_id: id
                }, chatLogin);
    }
    
  //  checkConnection()
}



function onloadbody() {

    // more callback to handle Ad events
	//$('.intro').show();
	loadDom();
  /*  document.addEventListener('onReceiveAd', function() {
                              setTimeout(function(){
                                        $('#black_loader').hide();
                                         
                                         },1000)
                              
                              
                              });
    document.addEventListener('onDidFail', function() {
                              
                              
                              });
    document.addEventListener('onFailedToReceiveAd', function(data) {
                              $('#black_loader').hide();
                              $('#home').show();
                              });
    document.addEventListener('onPresentAd', function() {
                              });
    document.addEventListener('onDismissAd', function() {
                              });
    document.addEventListener('onLeaveToAd', function() {
                              });*/
}

function onDeviceReady() {
   /* alert(window.plugins.inAppPurchaseManager);
    window.plugins.inAppPurchaseManager.requestProductData("PicMealUp_Premium_EN_V1", function(result) {
                                                           console.log("productId: " + result.id + " title: " + result.title + " description: " + result.description + " price: " + result.price);
                                                           window.plugins.inAppPurchaseManager.makePurchase(result.id, 1);
                                                           }, function(id) {
                                                           alert("fail");
                                                           }
                                                           );*/
    
    
    if(localStorage.getItem('langcontent')){
        var lang=localStorage.getItem('langcontent')
        ocrlanguage =lang;
        $('#black_loader').addClass(ocrlanguage)
    }
    else{
        $('#black_loader').addClass('eng')

    }
    checkConnection();
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    checkLanguage();
    updateLocation();
    db.transaction(populateDB, errorCB, successCB);
    document.addEventListener("resume", onResume, false);
 
    //analytics.startTrackerWithId('UA-55930461-2',AnalyticsSuccess,AnalyticsFail);
    //window.GA.trackerWithTrackingId("UA-55930461-2");
    //window.GA.trackView("/index");
    
    /*var gaPlugin;
    gaPlugin = window.plugins.gaPlugin;
    alert(gaPlugin);
    gaPlugin.init(nativePluginResultHandler, nativePluginErrorHandler, "UA-55930461-2", 10);
*/
}


function checkConnection() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';
    if(states[networkState]=='No network connection'){
      //  $('#black_loader').hide();
       // $('#home').show();
        internetConnectivity =false;
    }
    else{
        internetConnectivity =true;
    }
    if(internetConnectivity){
        var imageSearch;
       
        google.load('search', '1',{"callback" : pageLoaded});
        google.setOnLoadCallback(OnLoad);
        
        
        
    }
    else{
        loadDom();
    }
    return internetConnectivity;
}
function checkConnection2() {
    var networkState = navigator.network.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';
    if(states[networkState]=='No network connection'){
     
      var  internetConnectivity =false;
    }
    else{
       var internetConnectivity =true;
    }
    if(internetConnectivity){
        google.load('search', '1',{"callback" : function(){}});
        if($('#country_id').find('option').length < 2){
          _getCountry()
        }
    }
    else{
     //   loadDom()
    }
    return internetConnectivity;
}


function pageLoaded(){
    loadDom();
    if(localStorage.getItem('restore')){
        if(localStorage.getItem('restore')==0){
            showInterstitialAd();
            //createAd()
        }
    }else{
        showInterstitialAd();
    }
    
    
}

function populateDB(tx) {

    tx.executeSql("DROP TABLE MenuScanner", [], function(tx,results){}, function(tx,error){} );

    tx.executeSql('CREATE TABLE IF NOT EXISTS MenuScanner (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL, locallable TEXT NOT NULL,translatedlable TEXT NOT NULL)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Menumasterlist (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL, locallable TEXT NOT NULL,translatedlable TEXT NOT NULL)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Languagemaster (id INTEGER PRIMARY KEY AUTOINCREMENT, mealid INTEGER NOT NULL, langdesc TEXT NOT NULL)');

}

function successCB() {
    // alert("Success");
}

function errorCB(err) {
    // alert("Error processing SQL: "+err.code);
}

function createAd() {
    if (window.plugins && window.plugins.AdMob) {
        var am = window.plugins.AdMob;
        // 'publisherId': 'ca-app-pub-4921720698061851/2582732720',
        var default2 = {
            'publisherId': 'ca-app-pub-4921720698061851/4811502322',
            'adSize': AdMob.AD_SIZE.SMART_BANNER,
            'bannerAtTop': false
        }
        window.plugins.AdMob.createBannerView(default2, successfunction, errorfunction)
    } else {
    }
}

function successfunction() {
    window.plugins.AdMob.requestAd({
        'isTesting': true
    }, function() {
        window.plugins.AdMob.showAd(true, function() {}, function() {});
    }, function() {
    })
}

function errorfunction() {
}

function removeAd() {
    if (window.plugins && window.plugins.AdMob) {
        var am = window.plugins.AdMob;
        am.destroyBannerView({}, function() {
            onResize();
        }, function() {});
    }

}

function showAd(bshow) {
    if (window.plugins && window.plugins.AdMob) {
        var am = window.plugins.AdMob;
        am.showAd(bshow, function() {
            onResize();
        }, function() {
            //alert('please create ad first');
        });
    } else {
        // alert('AdMob plugin not available/ready.');
    }
}
//ca-app-pub-4921720698061851/8417001926
//ca-app-pub-4921720698061851/8417001926
//ca-app-pub-4921720698061851/6131723125
//if(localStorage.getItem('restore')=='0')
function showInterstitialAd() {
    var am = window.plugins.AdMob;
    am.createInterstitialView({
            'publisherId': 'ca-app-pub-4273476539966330/3093214400',
        },
        function() {
            am.requestInterstitialAd({
                'isTesting': true
            }, function(data) {
                                     }, function() {
                                     $('#black_loader').hide();
                                     $('#home').show();
            });
        },
        function() {
                              $('#black_loader').hide();
                              $('#home').show();
        }
    );
}



function capturePhoto() {
        var wid = $(window).width();
    var height = $(window).height()
    $('#target').attr('src','')
    
    
/*navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType : Camera.PictureSourceType.CAMERA,
        
    });*/
 
   CustomCamera.getPicture(function(imagePath){
                                      onPhotoURISuccess(imagePath)
                                    //  alert(imagePath)
                                      }, function(){
                                      });
 
      
}


function capturegallery(){
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
                                quality: 100,
                                sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM ,
                                });
    
    
}
function onFail(){
  //failed
}

function seconcamera(){
              $('#addnew .text-dark').text(entermealtext).addClass('blankstyle');
    $('#newmeallist tbody').find('img').attr('src','')
              navigator.camera.getPicture(onPhotoSuccess, onFail2, {
                                          quality: 50,
                                          destinationType: destinationType.FILE_URI,
                                          allowEdit : false
                                          
                                          });
              
              }


              
function onPhotoSuccess(imageURI){
              $('#newmeallist tbody').find('img').attr('src',imageURI)
              }

function onPhotoURISuccess(imageURI) {
              $('#target').attr('src',imageURI)
   // console.log($('#target').attr('width'))
   // console.log($('#target').width())
             $('section').hide()
            $('#camerapic').show();
           $('#picText p.textresult').html(' ')
    crop();
    
}
function crop(){
   
    var $cropper = $("#target");
    var cropper;
    if($('.cropper-container').length){
        $cropper.cropper("destroy");
       // $('.cropper-container').remove()
    }
    $cropper.cropper({
                     aspectRatio: "auto",
                     data: {
                     x: 0,
                     y: 0,
                     width: 640,
                     height: 360
                     },
                     preview: ".preview",
                     
                     // autoCrop: false,
                     // dragCrop: false,
                     // modal: false,
                     // moveable: false,
                     // resizeable: false,
                     
                     // maxWidth: 480,
                     // maxHeight: 270,
                     // minWidth: 160,
                     // minHeight: 90,
                     
                     done: function(data) {
                     //$('#target').load(function(){
                     
                                    //   })
                     
                     
                     
                     
                     },
                     build: function(e) {
                     
                     },
                     built: function(e) {
                     var drag_width=$('.cropper-dragger').width()
                     var drag_height=$('.cropper-dragger').height()
                     var drag_left=parseInt($('.cropper-dragger').css('left'))
                     var drag_top=parseInt($('.cropper-dragger').css('top'))
                      var data=$cropper.cropper("getData")
                     updatePreview1(drag_width,drag_height,drag_left,drag_top,data)
                     },
                     dragstart: function(e) {
                     },
                     dragmove: function(e) {
                     // updatePreview($cropper.cropper("getData"))
                     },
                     dragend: function(e) {
                     var drag_width=$('.cropper-dragger').width()
                     var drag_height=$('.cropper-dragger').height()
                     var drag_left=parseInt($('.cropper-dragger').css('left'))
                     var drag_top=parseInt($('.cropper-dragger').css('top'))
                     var data=$cropper.cropper("getData")
                     updatePreview(drag_width,drag_height,drag_left,drag_top,data)
                     //  updatePreview($cropper.cropper("getData"))
                     }
                     });
    
    cropper = $cropper.data("cropper");
    
    $cropper.on({
                "build.cropper": function(e) {
                // e.preventDefault();
                },
                "built.cropper": function(e) {
                // e.preventDefault();
                },
                "dragstart.cropper": function(e) {
                // e.preventDefault();
                },
                "dragmove.cropper": function(e) {
                // updatePreview($cropper.cropper("getData"))
                // e.preventDefault();
                },
                "dragend.cropper": function(e) {
                var drag_width=$('.cropper-dragger').width()
                var drag_height=$('.cropper-dragger').height()
                var drag_left=parseInt($('.cropper-dragger').css('left'))
                var drag_top=parseInt($('.cropper-dragger').css('top'))
                updatePreview(drag_width,drag_height,drag_left,drag_top)
                // e.preventDefault();
                }
                });

}
function updatePreview(w,h,x,y,data) {
    if (parseInt(w) > 0) {
        // Show image preview
        var imageObj = $("#compresspic")[0];
        var canvas = $("#preview")[0];

                   cropdata=data
    }
    
};
function updatePreview1(w,h,x,y,data) {
    if (parseInt(w) > 0) {
        // Show image preview
        var imageObj = $("#compresspic")[0];
        var canvas = $("#preview")[0];
        cropdata=data

        
    }
    
};

    function onFail2(){
              $('section').hide();
              $('#gallery').css('display', 'block');
        }
              

function callNativePlugin(returnSuccess) {
    OCRPlugin.callNativeFunction(nativePluginResultHandler, nativePluginErrorHandler, returnSuccess);
}

function nativePluginResultHandler(result) {
    //alert(result);
   // $('#picText p.textresult').html('<img src="'+result+'">');
    
    $('#search-load_container').hide()
    $('section').hide();
    $('#picText').show();
   
    result=result.replace(/\n\n\n/g, '@@@@@@');
    result=result.replace(/\n\n/g, '@@@@@@');
    result=result.replace(/\n/g, '@@@@@@');
    result=result.replace(/\t/g, '@@@@@@');
    if(ocrlanguage=='eng'){
     result=result.replace(/[^a-zA-Z0-9@.$()]/g, ' ');
    
    }
    
    result=result.replace(/@@@@@@/g, '<br>');
    $('#picText p.textresult').html(result);
    $('.usephoto').text('Use Selection');
    
}

function nativePluginErrorHandler(error) {
    $('#search-load_container').hide();
    $('.usephoto').text('Use Selection').hide();
    $("#popupOCR").modal('show');
    setTimeout(function() {
        $('#popupOCR').modal('hide');
    }, 2000);

}

function checkLanguage() {
    navigator.globalization.getPreferredLanguage(
        function(language) {
            devicelanguage = language.value;
        },
        function() {
        }
    );
}

function searchfromgallery(search_val){
    search_val = $.trim(search_val);
    search_val=search_val.split(' ');
    var str='';
    for(var i=0;i<search_val.length;i++){
        if(i>0){
        str += " OR ";
        }
        str += " locallable LIKE '%"+search_val[i]+"%' ";
   }
        db.transaction(function(tx) {
                       tx.executeSql("SELECT * FROM Menumasterlist WHERE "+str, [], function(tx, results) {
                                     var len = results.rows.length;
                                     if(len > 8){
                                     len=8;
                                     }
                                     $('.countimg').text(len)

                                     if (len < 1) {
                                         $(".noresultf").show();
                                      $('#load_container').hide();
                                     } else {
                                     var i;
                                      $(".noresultf").hide();
                                 
                                     var str = '<div class="row">';
                                     for (var i = 0; i < len; i++) {
                                     var result = results.rows.item(i);
                                    
                                     str += '<div class="col-xs-6 clicktoorder" data-name="'+result.locallable+'" data-translatedname="'+result.translatedlable+'"><div class="img-boxc"><img class="" src="' + result.path + '" /></div><button class="addtoorder btn btn-sm btn-block " data-target="orderlist"><i class="glyphicon glyphicon-plus"></i>'+addtoordertext+'</button></div>'
                                     }
                                     str = str + '</div>';
                                     $('#searchimglist').empty().html(str)
                                     $('#load_container').hide();
                                     }
                                     },function(){
                                     })
                       })
}


function searchComplete() {
    $('.countimg').text(imageSearch.results.length)
    if (imageSearch.results && imageSearch.results.length > 0) {
        searchflag =true;
        countersearch=0;
        translate($('#picmealfound .searchtext').text())
        $(".noresultf").hide();
        var results = imageSearch.results;
        var str = '<div class="row">';
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            str += '<div class="col-xs-6 clicktoorder"><div class="img-boxc"><img class="" src="' + result.tbUrl + '" /></div><button class="addtoorder btn btn-sm btn-block " data-target="orderlist"><i class="glyphicon glyphicon-plus"></i>'+addtoordertext+'</button></div>'
        }
        str = str + '</div>'
        $('#searchimglist').empty().html(str);
        if(translateflag && searchflag){
            $('#load_container').hide();
            searchflag=false;
        }
        
        
    } else {
        if(countersearch>=5){
            $(".noresultf").show();
            $('#load_container').hide();
            countersearch=0;
        }else{
            countersearch++;
            OnLoad($('#picmealfound .searchtext').text());
        }
    }

}

function OnLoad(value) {
    imageSearch = new google.search.ImageSearch();
    imageSearch.setResultSetSize(google.search.Search.LARGE_RESULTSET);
    imageSearch.setSearchCompleteCallback(this, searchComplete, null);
    imageSearch.execute(value);
}


var selectionEndTimeout = null;
document.onselectionchange = userSelectionChanged;

function userSelectionChanged() {
    if (selectionEndTimeout) {
        clearTimeout(selectionEndTimeout);
    }
    selectionEndTimeout = setTimeout(function() {
        $(window).trigger('selectionEnd');
    }, 500);
}

function getSelectionText() {
    var text = "";
    var x, y, range, rect;
    if (window.getSelection) {
        text = window.getSelection().toString();
        range = window.getSelection().getRangeAt(0).cloneRange()
        if (range.getClientRects) {
            range.collapse(true);
            rect = range.getClientRects()[0];
            x = rect.left;
            y = rect.top;
            $('.inputbox').css('display', 'none')
            if ($('#picText').css('display') == 'block') {
                if (x + $('.tooltip').outerWidth() > $(window).width()) {
                    var diff = x + $('.tooltip').outerWidth(true) - $(window).width()+10;
                    $('.tooltip').show().css({
                        'left': x - diff,
                        'top': y - 42
                    })
                } else {
                    $('.tooltip').show().css({
                        'left': x,
                        'top': y - 42
                    })
                }

            }
        }
    } else if (document.selection && document.selection.type != "Control") {

        text = document.selection.createRange().text;
        range = document.selection.createRange();
        range.collapse(true);
        x = range.boundingLeft;
        y = range.boundingTop;
        $('.inputbox').css('display', 'none')
        if ($('#picText').css('display') == 'block') {

            if (x + $('.tooltip').outerWidth() > $(window).width()) {
                var diff = x + $('.tooltip').outerWidth() - $(window).width() - 10;
                $('.tooltip').show().css({
                    'left': x - diff,
                    'top': y - 42
                })
            } else {
                $('.tooltip').show().css({
                    'left': x,
                    'top': y - 42
                })
            }

        }
    }
    return text;
}
$(window).bind('selectionEnd', function() {

    selectionEndTimeout = null;
    selectedText = getSelectionText();
    if (selectedText == '' || selectedText.length == 0) {
        $('.tooltip').hide();
    }
});

function DownloadFile(URL, Folder_Name, File_Name) {
    //Parameters mismatch check
    if (URL == null && Folder_Name == null && File_Name == null) {
        return;
    } else {
        //checking Internet connection availablity
         download(URL, Folder_Name, File_Name);
        var networkState = navigator.connection.type;
          if (networkState == Connection.NONE) {
          //    $('#popupNetworkFailed').modal('show')
         //     setTimeout(function(){ $('#popupNetworkFailed').modal('hide')},2000)
            return;
        } else {
           //If available download function call
        }
    }
}

function download(URL, Folder_Name, File_Name) {
    //step to request a file system
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
    function fileSystemSuccess(fileSystem) {
        var download_link = encodeURI(URL);
        ext = 'jpg' //Get extension of URL
        var directoryEntry = fileSystem.root; // to get root path of directory
        directoryEntry.getDirectory(Folder_Name, {
            create: true,
            exclusive: false
        }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
        var rootdir = fileSystem.root;
        var fp = rootdir.fullPath; // Returns Fulpath of local directory
        fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
        // download function call
        filetransfer(download_link, fp);
    }

    function onDirectorySuccess(parent) {
       // console.log('Directory created successfuly')
    }

    function onDirectoryFail(error) {
             //Error while creating directory
             //   console.log("Unable to create new directory: " + error.code);
    }

    function fileSystemFail(evt) {
        //Unable to access file system
           //  console.log('File system failed' + evt.target.error.code);
    }
}

function filetransfer(download_link, fp) {
    var fileTransfer = new FileTransfer();
    // File download function with URL and local path
    fileTransfer.download(download_link, fp,
        function(entry) {
                          if(selectedText=='' || selectedText.length==0){
                          selectedText = $('#picmealfound').find('.searchtext').text();
                          }
            db.transaction(function(tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS MenuScanner (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL, locallable TEXT NOT NULL,translatedlable TEXT NOT NULL)');           
                tx.executeSql('INSERT INTO MenuScanner (path,locallable,translatedlable) VALUES (?,?, ?)', [entry.fullPath, selectedText, translatedtext], function(tx,results) {
                  //  console.log(results.insertId)
                    getfilesfromdirctory()
                });
                tx.executeSql('INSERT INTO Menumasterlist (path,locallable,translatedlable) VALUES (?,?, ?)', [entry.fullPath, selectedText, translatedtext], function(tx,results) {
                              var mealid=results.insertId;
                              tx.executeSql('INSERT INTO Languagemaster (mealid,langdesc) VALUES (?, ?)', [mealid, translatedtext], function() {});
                              });
            });

        },
        function(error) {
        }
    );
}

function getfilesfromdirctory() {
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM MenuScanner', [], function(tx, results) {
            var len = results.rows.length,
                i;
            if (len < 1) {
                //$('.rowheader').hide();
                $('#orderlist .table-bordered').hide()
            } else {
                $('#orderlist .table-bordered').show();
                var str = '';
                for (i = 0; i < len; i++) {
                    str += '<tr><td class="col-xs-7 col-sm-9"><p class="text-dark">' + results.rows.item(i).locallable + '</p><p class="text-light">' + results.rows.item(i).translatedlable + '</p></td><td class="col-xs-5 col-sm-3 center"><img class="img-responsive" src="' + results.rows.item(i).path + '" /><button data-target="#" class="btn btn-sm btn-pink-remove" id="'+results.rows.item(i).id+'" >&mdash;</button></td></tr>'
                }
                $('#orderlist .table-bordered tbody').html(str)
            }
        }, null);
    });

}

function translate(t) {
    var text = t;
    $('.tooltip').hide();
    if(localStorage.getItem('langcontent')){
        var languageTo=localStorage.getItem('langcontent')
        if(languageTo=='fra'){
          languageTo='fr'
        }else if(languageTo=='eng'){
           languageTo='en'
        }else if(languageTo=='chi_tra'){
            languageTo='zh-CHT'
        }else if(languageTo=='jpn'){
          languageTo='ja'
        }
    }
    else{
        var languageTo ='en'
    }
    var fromlang = ocrlanguage;
    if(fromlang=='fra'){
        fromlang='fr'
    }else if(fromlang=='eng'){
        fromlang='en'
    }else if(fromlang=='chi_tra'){
        fromlang='zh-CHT'
    }else if(fromlang=='jpn'){
        fromlang='ja'
    }
  /*
    var requestStr = "http://54.86.103.211/token.php";
    
    $.ajax({
           url: requestStr,
           type: "GET",
           cache: true,
           dataType: 'json',
           success: function (data) {
           g_token = data.access_token;
           var p = new Object;
           p.text = text;
           p.from = fromlang;
           p.to = languageTo;
           // A major puzzle solved.  Who would have guessed you specify the jsonp callback in oncomplete?
           p.oncomplete = 'ajaxTranslateCallback';
           // Another major puzzle.  The authentication is supplied in the deprecated appId param.
           p.appId = "Bearer " + g_token;
           var requestStr = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate";
           
           $.ajax({
                  url: requestStr,
                  type: "GET",
                  data: p,
                  dataType: 'jsonp',
                  cache: true,
                  error: function(request, status, error) {
                      console.log(request+','+status+','+error)
                      translateflag=true;
                      if(translateflag && searchflag){
                         $('#load_container').hide();
                         translateflag=false;
                       }
                      translatedtext = ''
                  }
                  });
           }
           });
    */
    
    
    
    
   // var languageTo = devicelanguage;
   // alert(fromlang+','+languageTo)
    var p = {};
	p.appid = '68D088969D79A8B23AF8585CC83EBA2A05A97651';
	p.to = languageTo;
	p.from = fromlang;
	p.text = text;
	$.ajax({
           url: 'http://api.microsofttranslator.com/V2/Ajax.svc/Translate',
           data: p,
           dataType: 'jsonp',
           jsonp: 'oncomplete',
           jsonpCallback: 'ajaxTranslateCallback',
           complete: function(request, status) {
          // alert('complete: '+status);
           },
           success: function(data, status) {
         //  alert('success: data-'+data+',status-'+status);
           },
           error: function(request, status, error) {
           //console.log(request+','+status+','+error)
           translateflag=true;
           if(translateflag && searchflag){
           $('#load_container').hide();
           translateflag=false;
           }
           translatedtext = ''
           console.log('error to translate '+status+','+request.responseText+','+error)
           }
           });
    
    
  //  var s1 = document.createElement("script");
   // s1.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?oncomplete=mycallback&appId=68D088969D79A8B23AF8585CC83EBA2A05A97651&from&to=" + languageTo + "&text=" + text;
   // var s2 = document.createElement("script");
   // s2.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Detect?oncomplete=mycallbackdetect&appId=68D088969D79A8B23AF8585CC83EBA2A05A97651&text=" + text;
  //  document.getElementsByTagName("head")[0].appendChild(s1);
   // document.getElementsByTagName("head")[0].appendChild(s2);
  //  window.mycallback = function(response) {
  //      console.log(response)
        
        
   // }
  /*  window.mycallbackdetect = function(response) {
        var languageCodes = '["' + response + '"]'
        var s3 = document.createElement("script");
        s3.src = "http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguageNames?oncomplete=mycallbacklang&appId=68D088969D79A8B23AF8585CC83EBA2A05A97651&locale=en&languageCodes=" + languageCodes;
        document.getElementsByTagName("head")[0].appendChild(s3);
    }
    window.mycallbacklang = function(response) {
    }*/

}
function ajaxTranslateCallback(response) {
	//alert('ajaxTranslateCallback('+response+')');
     translatedtext = response;
    //alert(translatedtext)
    translateflag=true;
    if(translateflag && searchflag){
        $('#load_container').hide();
        translateflag=false;
    }
    
}

var successCallback = function(position) {
    var x = position.coords.latitude;
    var y = position.coords.longitude;
    $('#latitude').val(x)
    $('#longitude').val(y)
    localStorage.setItem('locationx', x)
    localStorage.setItem('locationy', y)
};

var errorCallback = function(error) {
    var errorMessage = 'Unknown error';
    switch (error.code) {
        case 1:
            errorMessage = 'Permission denied';
            break;
        case 2:
            errorMessage = 'Position unavailable';
            break;
        case 3:
            errorMessage = 'Timeout';
            break;
    }
   //alert(error.code)
};
var successlatlong = function(position) {
    var x = position.coords.latitude;
    var y = position.coords.longitude;
    $('#latitude').val(x)
    $('#longitude').val(y)
    //localStorage.setItem('locationx', x)
    //localStorage.setItem('locationy', y)
   // jAlert(msg6,alertmessage,oktext)
    if(x=="" || x== null && y=="" || y==null){
       jAlert(msg6,alertmessage,oktext)
    }
    if (localStorage.getItem('userid')) {
		var userid=localStorage.getItem('userid');
        var form_url = "http://54.86.103.211/api/rest/update_location/" + userid;
        var data = {
            'latitude': x,
            'longitude': y
        }
        $.ajax({
            url: form_url,
            type: 'POST',
            data: data,
            success: function(data) {
              
               //alert('location update successfully')
               // alert("lat"+x+",long="+y)
            },
            error: function(data) {
               // alert('unable to update location')
               }
        })
    }

};

function updateLocation() {
  /*  var netconnect=checkConnection2()
    if(netconnect){
        //,{timeout: 0,enableHighAccuracy: true, maximumAge: 'Infinity'}
        navigator.geolocation.getCurrentPosition(successlatlong, errorCallback,{enableHighAccuracy: true,timeout: 100000,maximumAge: 0});
    }*/
}

/*function displayLocation(latitude, longitude) {
    var request = new XMLHttpRequest();
    var method = 'GET';
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true';
    var async = true;
    request.open(method, url, async);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);
            var ab = data.results[0].address_components;
            for (var i in ab) {
                var c = ab[i].types
                if (c[0] == "country") {
                    country_name = ab[i].long_name
                    country_name = country_name.toLowerCase()
                    findlanguage(country_name)
                }
            }

        }
    };
    request.send();
};*/

function findlanguage(country_name) {
    var index = $.inArray(country_name, country)
    ocrlanguage = language[index]
}

//$(document).ready(function(e) {
function loadDom(){
              /*  if(localStorage.getItem('langcontent')){
                  var lang=localStorage.getItem('langcontent')
                    ocrlanguage =lang;
                    $('#black_loader').addClass(ocrlanguage)
                  call_xml_func(lang);
                }
                else{
                  localStorage.setItem('langcontent','eng');
                  $('#black_loader').addClass('eng')
                  call_xml_func('eng');
                  ocrlanguage = 'eng'
                }*/
var oldname;
var rowid;
//var netconn= checkConnection2()
netconn = false;
$('#black_loader').hide();
       $('.intro').show();
    if(netconn){
        
        
        _getCountry();
       // $('#black_loader').hide();
        //$('#home').show();
        
    }else{
       // $('#black_loader').hide();
       // $('#home').show();
    }
    
   
    $(".txtresetol").hide();
    $("button").bind('click', function(e) {
        e.preventDefault();
        var getID = $(this).attr("data-target");
        if (getID == "orderlist") {
            $("#orderlistbackbtn").hide();
            $("section").hide();
            $("#" + getID).show();
        }

        if (getID != "#") {
            $("section").hide();
            $("#" + getID).show();
            if ($('.tooltip').css('display') == 'block') {
                $('.tooltip').css('display', 'none')
            }
            if ($('.inputbox').css('display') == 'block') {
                $('.inputbox').css('display', 'none')
            }

        }
    });

    $(document).on('click', '#profileback',function() {
        var getID = $(this).attr("data-target");
        $("section").hide();
        $("#" + getID).show();
    });
    $(document).on('click','#contactback', function() {
        var getID = $(this).attr("data-target");
        $("section").hide();
        $("#" + getID).show();

    })
   /* if (localStorage.getItem('userid')) {
        //$('.deleteAccount').removeClass('disabled')
        $('#deleteprofile').removeClass('disabled');
        $('#resetPasswordu').removeClass('disabled');
        $('#getprofile').removeClass('disabled');
        $('#contactproblem').removeClass('disabled')
        $('.intrologin').hide();
        $('#chat .list-group').find('li').removeClass('disabled')
            //	$(".list-group-item").removeClass('disabled')
        $("#btn_logout").show();
        $("#btn_login2").hide();
        $('#problem_by_user_id').val(localStorage.getItem('userid'))
        $('#pwd_user_id').val(localStorage.getItem('userid'))
                  
                  myId = localStorage.getItem("userid");;
                  myName = localStorage.getItem('userfirstname') + " " + localStorage.getItem('userlastname');
                  socket.emit('login', {
                              user_id: myId
                              }, chatLogin);
        if(localStorage.getItem(myId)){
            localStorage.removeItem(myId)
            onlineusers=localStorage.getItem('onlineusers').split(',');
            var index=$.inArray(myId,onlineusers)
            if(index!=-1){
                onlineusers.splice(index,1);
                localStorage.setItem('onlineusers',onlineusers)
            }
        }
        

    }
    if (localStorage.getItem('locationx')) {
        $('#latitude').val(localStorage.getItem('locationx'))

    }
    if (localStorage.getItem('locationy')) {
        $('#longitude').val(localStorage.getItem('locationy'))
    }

    //alert($('.premium').length)
    if(localStorage.getItem('restore')){
        if(localStorage.getItem('restore')==1){
            var str='<option value="eng" >English</option><option value="fra">French</option><option class="premium" value="chi_tra">Chinese</option><option class="premium" value="jpn">Japanese</option>';
            $('#select_mylang').html(str);
            $('#popupselectlanguage select').html(str);
            $('#selectmylang').html(str);
            $('#upgrade').hide();
            $('#restore').hide()
        }else{
           // resetPurchases();
            $('#upgrade').show();
            $('#restore').show()
        }
        
    }else{
        $('#upgrade').show();
        $('#restore').show()
        localStorage.setItem('restore',0)
    }*/
    
    
    
    
    $('#upgrade').bind('click',function(){
       // if(localStorage.getItem("userid")){
                       $('.content').css('overflow','hidden')
                       $('#load_container').show()
                       
                    //   window.plugins.inAppPurchaseManager.restoreCompletedTransactions();
                    //   window.plugins.inAppPurchaseManager.onRestoreCompletedTransactionsFinished = function(){
                       //alert("in");
                       
                       
                    //   };
                    //   window.plugins.inAppPurchaseManager.onRestoreCompletedTransactionsFailed = function(errorCode){
                    //    alert("fail");
                    //   };
                       
                       
                window.plugins.inAppPurchaseManager.requestProductData("PicMealUp_Premium_EN_V1", function(result) {
                                 window.plugins.inAppPurchaseManager.makePurchase("PicMealUp_Premium_EN_V1", 1);
                         $('.content').css('overflow','')
                         $('#load_container').hide();
                                                                       
                                                                       
                  window.plugins.inAppPurchaseManager.onPurchased = function(transactionIdentifier, productId, transactionReceipt) {
                                                                      
                    paySuccess(); /* Give coins, enable subscriptions etc */
                  };
                  window.plugins.inAppPurchaseManager.onFailed = function(errorCode, errorText) {
                    //alert(errorCode+": "+errorText);
                  };
                 }, function(id) {
                                    $("#purchaseFailed").modal('show');
                                    setTimeout(function() {
                                                $('#purchaseFailed').modal('hide');
                                    }, 2000);
                                                                       
                                 }
                );
     //   }
     /*   else{
                       $("#purchaseLoginFailed").modal('show');
                       setTimeout(function() {
                                  $('#purchaseLoginFailed').modal('hide');
                                  }, 2000);
        }*/
    
    });
    
    
   /* function paySuccess()
    {
        localStorage.setItem('restore',1);
        var str='<option value="eng" >English</option><option value="fra">French</option><option class="premium" value="chi_tra">Chinese</option><option class="premium" value="jpn">Japanese</option>';
        $('#select_mylang').html(str);
        $('#popupselectlanguage select').html(str);
        $('#selectmylang').html(str);
        $('#upgrade').hide();
        $('#restore').hide()

    }
    $('#restore').bind('click',function(){
                       resetPurchases();
                        })
    
    function resetPurchases(){
     if(localStorage.getItem('restore')=='0'){
        
        window.plugins.inAppPurchaseManager.restoreCompletedTransactions();
        window.plugins.inAppPurchaseManager.onRestoreCompletedTransactionsFinished = function(){
            //alert("in");
            
            
        };
        window.plugins.inAppPurchaseManager.onRestoreCompletedTransactionsFailed = function(errorCode){
            //alert("fail");
        };
        // restore products
        window.plugins.inAppPurchaseManager.onRestored = function(transactionIdentifier, productId, originalTransactionReceipt){
           // alert("fail11");
           // alert(productId);
            $("#purchaserestore").modal('show');
            setTimeout(function() {
                       $('#purchaserestore').modal('hide');
                       }, 2000);
            $('section').hide();
            $('#home').show();

            paySuccess();
        };
    }
   }*/

    $('input[type=file]').bootstrapFileInput();
    
    $("#orderlist").on("click", ".meal", function() {
        var getID = $(this).attr("data-target");
        if (getID != "#") {
            $("section").hide();
            $("#" + getID).show();
        }
    });

    $(".list-group-item").bind("click", function() {
        if (!$(this).hasClass('disabled')) {
           // updateLocation();
            var getID = $(this).attr("data-target");
            if (getID != "#") {
                $("section").hide();
                $("#" + getID).show();
                               if($("#" + getID).find('textarea').length){
                               $("#" + getID).find('textarea').focus()
                               }
            }
        }
    });


    $("select").change(function() {
        $(this).next("span").hide();
    });
    

    var pageHeight = $(window).height()-$('#home header').height() - $('#home footer').height();
    var pageHeight_camera = screen.height - 50;
    var pageHeight2 = pageHeight - (100);
    $("article .content").css({
        "height": pageHeight + "px"
    });
    /*$("#chatConversation article .content").css({
        "height": pageHeight + "px"
    });
    //$("#chatConversation article").css({"height":"auto"});
    $("#camerapic article .content").css({
        "height": pageHeight_camera + "px"
    });
    $("#splash article .content").css({
                          "height": pageHeight_camera + "px"
        });
                  
                  $("#picText article .content").css({
                                                       "height": pageHeight_camera + "px"
                                                       });
   */
    


 /*   $(window).on("orientationchange", function() {
        var pageHeight = screen.height - 102;
        var pageHeight2 = pageHeight - (100);
        $("article .content").not("#chatConversation article .content").css({
            "height": pageHeight + "px"
        });
        $("#msgconversation").css({
            "height": pageHeight2 + "px"
        });
                 
                 $("#camerapic article .content").css({
                                                      "height": pageHeight_camera + "px"
                                                      });
                 
                 $("#picText article .content").css({
                                                    "height": pageHeight_camera + "px"
                                                    });
                 
                 $("#splash article .content").css({
                                                   "height": pageHeight_camera + "px"
                                                   });
    });*/

    $("#chatlistuser").on("click", ".chatButtonIn,.chatButton", function() {
        var getID = $(this).attr("data-target");
        if (getID != "#") {
            $("section").hide();
            $("#" + getID).show();
        }
    });
                  
                  $(document).on("click", "#reportabusebtnn", function() {
                                var netconnect =false;
                                if(netconnect){
                                 $('#idvalue').val($(this).parents('section').attr('id'));
                                 $("#reportlist").find("li").removeClass("added");
								 var reported_by_user_id = parseInt(localStorage.getItem('userid'))
                                 var reported_to_user_id = parseInt($(this).parents('section').find('#memid').text())
								 var data={reported_by_user_id:reported_by_user_id,reported_to_user_id:reported_to_user_id}
								   var formURL = "http://54.86.103.211/api/rest/get-report-to-abuse";
                                                    $.ajax({url:formURL,
                                                           type:'POST',
                                                           data:data,
                                                           success:function(data){
															var report=data.report
															$.each(report,function(key, value){
																				   $('#reportlist li').eq(value.report_type).addClass('added')
																				   })
                                                           },
                                                           error:function(data){
                                                          // console.log('error')
                                                           }
                                                           
                                                           })
								 
                                 }
                                 else{
                                 $("#popupNetworkFailed").modal('show');
                                 setTimeout(function() {
                                            $('#popupNetworkFailed').modal('hide');
                                            }, 2000);
                                 
                                 }
                   });
                  
                  $(document).on('click','#chatreport',function(){
                            var netconnect =false;
                            if(netconnect){
                                 $('#idvalue').val($(this).parents('section').attr('id'));
                                 $('#reportlist li').removeClass('added');
								 var reported_by_user_id = parseInt(localStorage.getItem('userid'))
                                 var reported_to_user_id = parseInt($(this).parents('section').find('#memid').text())
								
								 var data={reported_by_user_id:reported_by_user_id,reported_to_user_id:reported_to_user_id}
							
								   var formURL = "http://54.86.103.211/api/rest/get-report-to-abuse";
                                                    $.ajax({url:formURL,
                                                           type:'POST',
                                                           data:data,
                                                           success:function(data){
															var report=data.report
															$.each(report,function(key, value){
																				   $('#reportlist li').eq(value.report_type).addClass('added')
																				   })
                                                           },
                                                           error:function(data){
                                                           }
                                                           
                                                           })
                                 }
                                 else{
                                 $("#popupNetworkFailed").modal('show');
                                 setTimeout(function() {
                                            $('#popupNetworkFailed').modal('hide');
                                            }, 2000);
                                 }
                                 })
                  
                  $(document).on("click", "#forcontactpage", function(){
                                 $("#contactmsg").find('textarea').val("");
                                 });
                  $(document).on("click", "#btn_login2", function(){
                                 $("#loginuser").find('input[type="text"], input[type="password"]').val("");
                               /*  var netconnect = checkConnection2();
                                 if(netconnect){
                                 $('section').hide();
                                 $('#login').show();
                                 
                                 }
                                 else{
                                 $("#popupNetworkFailed").modal('show');
                                 setTimeout(function() {
                                            $('#popupNetworkFailed').modal('hide');
                                            }, 2000);
                                 }*/
                                 });
                  $(document).on("click", "#myforgotpwd", function(){
                                 $("#formforgotpwd").find('input[type="email"]').val("");
                                 });
                  $(document).on("click","#sendgreetbtnn",  function() {
                                 $('#sendgreeting').find('#idval').val($(this).parents('section').attr('id'))
                                 $("#sendgreeting").find("#txtsendgreeting").val("");
                                 });
                  
                  $(document).on('click','#chatsendgreet',function(){
                                 $('#sendgreeting').find('#idval').val($(this).parents('section').attr('id'))
                                 })
                  
                  
    $("#btn_logout").click(function() {
                    var netconnect = false;
                           if(netconnect){
                           $('section').hide();
                           $('#home').show();
        if (localStorage.getItem("userid")) {
                           /*--code added by ritesh to logout from chat---*/
                           socket.emit('logout', {user_id: myId});
                           /*-------------------------------------*/
                           
            localStorage.removeItem("userid");
            localStorage.removeItem('userfirstname');
            localStorage.removeItem('userlastname');
            $(this).hide();
            $("#btn_login2").show();
                  $('#chat .list-group').find('li').addClass('disabled')
            //   $('.deleteAccount').addClass('disabled');
            $('#deleteprofile').addClass('disabled');
            $('#resetPasswordu').addClass('disabled');
            $('#getprofile').addClass('disabled');
            $('#contactproblem').addClass('disabled');
            $("#popupLogout").modal('show');
            $('.intrologin').show()
            $("#problem_by_user_id").val("");
            setTimeout(function() {
                $('#popupLogout').modal('hide');
            }, 2000);

        }
                           }else{
                           $("#popupNetworkFailed").modal('show');
                           setTimeout(function() {
                                      $('#popupNetworkFailed').modal('hide');
                                      }, 2000);
                           
                           }
    });

    $("#resetPasswordu").click(function() {
                if(!$(this).hasClass('disabled')){
                     var netconnect= false
                        if(netconnect){
                               $('section').hide()
                               $('#resetPassword').show();
                               $("#formresetpwd").find("#oldpassword").val("");
                               $("#formresetpwd").find("#newpassword").val("");
                               $("#formresetpwd").find("#cnewpassword").val("");
                            }else{
                               $("#popupNetworkFailed").modal('show');
                               setTimeout(function() {
                                          $('#popupNetworkFailed').modal('hide');
                                          }, 2000);
                            }
                }
    });


    $("#formresetpwd").submit(function(e) {
        e.preventDefault();
        $(".error").hide();
        var getParent = $("#formresetpwd");
        if (getParent.find("#oldpassword").val() == "") {
            $("#formresetpwd").find("#oldpassword").next("span").show();
            return false;
        } else if (getParent.find("#newpassword").val() == "") {
            $("#formresetpwd").find("#newpassword").next("span").show();
            return false;
        } else if (getParent.find("#cnewpassword").val() == "") {
            $("#formresetpwd").find("#cnewpassword").next("span").show();
            return false;
        } else if (getParent.find("#newpassword").val() != getParent.find("#cnewpassword").val()) {
            $("#formresetpwd").find("#cnewpassword").next("span").show();
            return false;
        } else {
                              
                              var netconnect =false;
                              if(netconnect){
            $("#load_container").show();
               updateLocation()
                              
            var form_url = 'http://54.86.103.211/api/rest/reset-password';
            $.ajax({
                url: form_url,
                type: 'POST',
                data: new FormData(this),
                mimeType: "multipart/form-data",
                contentType: false,
                cache: false,
                processData: false,
                success: function(data, textStatus, jqXHR) {
                    //console.log(data+textStatus);
                    $("#load_container").hide();
                    var obj = JSON.parse(data);
                    if (obj.hasOwnProperty('fail')) {

                        $("#popupChangeFailPwd").modal('show');
                        setTimeout(function() {
                            $('#popupChangeFailPwd').modal('hide');
                        }, 2000);
                    } else {
                        $("#popupChangePwd").modal('show');
                        setTimeout(function() {
                            $('#popupChangePwd').modal('hide');
                        }, 2000);
                        $("section").hide();
                        $("#setting").show();
                    }
                },
                error: function() {
                    $("#load_container").hide();
                    $("#popupChangeFailPwd").modal('show');
                    setTimeout(function() {
                        $('#popupChangeFailPwd').modal('hide');
                    }, 2000);

                }
            })
            }else{
                              $("#popupNetworkFailed").modal('show');
                              setTimeout(function() {
                                         $('#popupNetworkFailed').modal('hide');
                                         }, 2000);
                              
                              }
            return false;
        }

        return false;
    });
    
                  
                  $(document).on('click','.backsendgreet',function(){
                                 $('section').hide();
                                 var id=$('#idval').val();
                                 $('#'+id).show();
                                 
                                 });
                  $(document).on('click','.btn-pink-remove',function(){
                                 var parent_del = $(this).parents('tr');
                                 var id=$(this).attr('id');
                                // msg3=Are you sure you want to delete this selected meal?
                                 jConfirm(msg3, confirmmessage, oktext,canceltext, function(r) {
                                          if(r === true){
                                             parent_del.remove();
                                             db.transaction(function(tx){
                                                           tx.executeSql("DELETE FROM MenuScanner  WHERE id = ?", [id]);
                                                         })
                                          }
                                          });
                                 })
                  

    $('.delete-acct').bind('click', function() {
                           var netconnect =checkConnection2()
                           if(netconnect){
                           jConfirm(msg1, confirmmessage,oktext,canceltext, function(r) {
                                    if(r === true){
                                    $('#load_container').show()
                                    var userid = localStorage.getItem('userid')
                                    var formURL = "http://54.86.103.211/api/rest/delete/"+userid;
                                    $.ajax({
                                           url: formURL,
                                           type: "POST",
                                           mimeType: "multipart/form-data",
                                           contentType: false,
                                           cache: false,
                                           processData: false,
                                           success: function(data) {
                                           $('#load_container').hide()
                                           localStorage.removeItem('userid');
                                           localStorage.removeItem('userfirstname');
                                           localStorage.removeItem('userlastname');
                                           // $('.deleteAccount').addClass('disabled');
                                           $('#deleteprofile').addClass('disabled');
                                           $('#resetPasswordu').addClass('disabled');
                                           $('#getprofile').addClass('disabled');
                                           $('#contactproblem').addClass('disabled');
                                           $('#chat .list-group').find('li').addClass('disabled')
                                           $("#btn_logout").hide();
                                           $("#btn_login2").show();
                                           $('.intrologin').show();
                                           $('section').hide();
                                           $('#setting').show();
                                           $('#popupdleteacct').modal('show');
                                           setTimeout(function(){
                                                      $('#popupdleteacct').modal('hide');
                                                      },2000)
                                           
                                           },
                                           error: function(qxhr, txtStatus) {
                                           $('#load_container').hide()
                                           }
                                           
                                           
                                           })
                                    
                                    }
                                    });
                           }
                           else{
                           $("#popupNetworkFailed").modal('show');
                           setTimeout(function() {
                                      $('#popupNetworkFailed').modal('hide');
                                      }, 2000);
                           }

    })

    $('#getprofile').bind('click', function() {
                          if(!$(this).hasClass('disabled')){
                          $("#updateuserdetail").find("input[type='text'], input[type='file'], input[type='date'], input[type='password'] , input[type='email'], select, .ui-autocomplete-input").val("");
                          $(".file-input-name").html("");
                          $('input[name="gender"]').prop('checked', false);
                           $("#afteruserimgt2").find("img").attr("src","images/no-image.jpg"); 
                    var netconnect =checkConnection2()
                   if(netconnect){
                          $('section').hide();
                          $('#profile').show();
        if (localStorage.getItem('userid')) {
            $("#load_container").show();
            var id = localStorage.getItem('userid');
                          var form_url = 'http://54.86.103.211/api/rest/get-profile' + '/' + id;
                          
            $.ajax({
                url: form_url,
                type: 'POST',
                success: function(data) {
                    $("#load_container").hide();
                   // console.log(data)
                    var rnd_no = Math.floor((Math.random() * 1000000) + 1);
                    $('#getimg').attr('src', data.user_profile.profile_picture_thumbnail + "?" + rnd_no)
                        //$('#getuserdetail').find('input[value="'+data.user_profile.gender+'"]').prop('checked',true);
                    $('input[name=gender][value=' + data.user_profile.gender + ']').prop('checked', true);
                    $('#f_name').val(data.user_profile.first_name);
                    $('#l_name').val(data.user_profile.last_name);
                    $('#email_id').val(data.user_profile.email);
                 
				   $('#country_name').next().find('input').val($('#country_name option[value="' + data.user_profile.country_id + '"]').text());
                   $('#residence_countryid').next().find('input').val($('#residence_countryid option[value="' + data.user_profile.residence_country_id + '"]').text())

                   if(data.user_profile.selectmylang == null){
                   data.user_profile.selectmylang ='eng';
                   }
				   
					 $('#select_mylang option[value="' + data.user_profile.selectmylang + '"]').prop("selected", "selected");
                    $('#professionid option[value="' + data.user_profile.profession_id + '"]').prop("selected", "selected");
                    $('#activityid option[value="' + data.user_profile.activity_id + '"]').prop("selected", "selected");
                    $('#industryid option[value="' + data.user_profile.industry_id + '"]').prop("selected", "selected");
                    
                    $('#date_of_birth').val(data.user_profile.dob);
                   if(data.user_profile.selectmylang!=localStorage.getItem('langcontent')){
                    localStorage.setItem('langcontent',data.user_profile.selectmylang)
                    call_xml_func(data.user_profile.selectmylang)
                    ocrlanguage=data.user_profile.selectmylang;
                   }
                   
                   
                },
                   error:function(){
                    $("#load_container").hide();
                   }


            })
        }
                          }else{
                          $("#popupNetworkFailed").modal('show');
                          setTimeout(function() {
                                     $('#popupNetworkFailed').modal('hide');
                                     }, 2000);
                          }
                          }
    })


    $('section').click(function(e) {
        if (!$(e.target).closest('.tooltip').length) {
            $(".tooltip").hide();

        }

    });


    

    $(document).on('click', '.clicktoorder', function(e) {
                   e.preventDefault();
                   var netconnect = checkConnection2();
                   $('#orderlist .table-bordered tbody').html(' ')
                   if(netconnect){
                     filePath = $(this).find('.img-boxc img').attr('src')
                     filename = 'pic' + new Date().getTime();
                     DownloadFile(filePath, 'PicMeal', filename)
                     $("#orderlistbackbtn").show();
                     $("section").hide();
                     $("#orderlist").show();
                   }
                   else{
                   var path= $(this).find('.img-boxc img').attr('src')
                   var name= $(this).attr('data-name');
                   var name2=$(this).attr('data-translatedname');
                   db.transaction(function(tx){
                                  tx.executeSql('INSERT INTO MenuScanner (path,locallable,translatedlable) VALUES (?,?, ?)', [path, name, name2], function(tx,results) {
                                                getfilesfromdirctory()
                                                });
                                  })
                   
                   $("#orderlistbackbtn").show();
                   $("section").hide();
                   $("#orderlist").show();
                   }

    });

    $(document).on('click', '.addtoorderlist', function() {
        $('#orderlist .table-bordered').show();
        $('#searchimglistol').hide();
        var imgpath = $(this).prev().find('img').attr('src')
        var translatetext = $(this).nextAll('span.translated1').text()
        var localtext = $(this).nextAll('span.local1').text()
        $(".txtresetol").hide();
        $('.searchbar').val("");
        db.transaction(function(tx) {

            tx.executeSql('INSERT INTO MenuScanner (path,locallable,translatedlable) VALUES (?,?, ?)', [imgpath, localtext, translatetext], function() {
                getfilesfromdirctory()
            });
        })




    })

   

    $('.define').bind('click', function() {
        var top = parseInt($('.tooltip').css('top'))
        var left = parseInt($('.tooltip').css('left'))
        $('.inputbox input').val(selectedText)
                      
        if (left + $('.inputbox').width() > $(window).width()) {
            var diff = left + $('.inputbox').width() - $(window).width()
            $('.inputbox').css({
                top: top,
                left: (left - diff - 10),
                display: 'block'
            })
        } else {
            $('.inputbox').css({
                top: top,
                left: left,
                display: 'block'
            })
        }

        $('.tooltip').hide();

    })
                  
    $('.search').bind('click', function() {
                     
          var netConnectivity = checkConnection2()
                      $('#load_container').show()
                      $('.noresultf').hide()
                      $('#searchimglist').empty()
     if(netConnectivity){
     //   translate()
        OnLoad(selectedText.trim());
        $('.tooltip').hide();
        $("section").hide();
        $('#picmealfound').show();
        $('#picmealfound .searchtext').text(selectedText)
                      }
        else{
                      $('.tooltip').hide();
                      $("section").hide();
                      $('#picmealfound').show();
                      $('#picmealfound .searchtext').text(selectedText);
                      searchfromgallery(selectedText);
                      // $('#load_container').hide()
                      
              }
    });

    $('.inputbox span').bind('click', function() {
        var netConnectivity = checkConnection2()
                          $('#load_container').show()    
                             $('#searchimglist').empty();
                              $('.noresultf').hide()
        var val = $('.inputbox input').val();
                             selectedText = val.trim();
                             
      if(netConnectivity){
        OnLoad(val);
        $('.tooltip').hide();
        $("section").hide();
        $('#picmealfound').show();
        $('#picmealfound .searchtext').text(val)
        $('.inputbox').hide()
      }
                             else{
                             searchfromgallery(val)
                             $('.tooltip').hide();
                             $("section").hide();
                             $('#picmealfound').show();
                             $('#picmealfound .searchtext').text(val)
                             $('.inputbox').hide()
                             }
    })


    /* $('.editnsearch').bind('click',function(){
          var top=parseInt($('.tooltip').css('top'))
          var left= parseInt($('.tooltip').css('left'))
          $('.inputbox input').val(selectedText)
          $('.inputbox').css({top:top,left:left,display:'block'})
          $('.tooltip').hide();
       })*/

    $("#formforgotpwd").submit(function() {
        $('#formforgotpwd').find('.error').hide();
                               
        if ($('#usseremailid').val() == '' || $('#usseremailid').val().length == 0) {
            $('#formforgotpwd').find('.error').show();
            return false;
        } else if (!re.test($('#usseremailid').val())) {
            $('#formforgotpwd').find('.error').show();
            return false;
        } else {
                        var netconnect = checkConnection2()
                               if(netconnect){
                               
            var formURL = "http://54.86.103.211/api/rest/forgot-password";
            $("#load_container").show();

            $.ajax({
                url: formURL,
                type: "POST",
                data: new FormData(this),
                mimeType: "multipart/form-data",
                contentType: false,
                cache: false,
                processData: false,
                success: function(data) {
                    $('#usseremailid').val('')
                   // console.log(data)
                    $("#load_container").hide();
                    $("#popupForgotPwd").modal('show');
                    $('section').hide();
                    $('#login').show();
                    setTimeout(function() {
                        $('#popupForgotPwd').modal('hide');
                    }, 2000);
                },
                error: function(data) {
                    $("#load_container").hide();
                    $('#usseremailid').val('')
                }

            })
                               }else{
                               $("#popupNetworkFailed").modal('show');
                               setTimeout(function() {
                                          $('#popupNetworkFailed').modal('hide');
                                          }, 2000);
                               
                               }

        }

        return false;
    });
    $('#contactmsg').submit(function(e) {
        e.preventDefault();
            if($("#problem_error").val()==""){
                            $("#popupproblem_error").modal('show');
                            setTimeout(function() {
                                       $('#popupproblem_error').modal('hide');
                                       }, 2000);
        }else{
                            var netconnect = checkConnection2()
                            if(netconnect){
            var formURL = "http://54.86.103.211/api/rest/describe-your-problem";
            $("#load_container").show();
            $.ajax({
                url: formURL,
                type: 'POST',
                data: new FormData(this),
                mimeType: "multipart/form-data",
                contentType: false,
                cache: false,
                processData: false,
                success: function(data) {
                   $("#load_container").hide();
                   $("#problem_error").val("");
                   $("#popupproblem_success").modal('show');
                   setTimeout(function() {
                              $('#popupproblem_success').modal('hide');
                    }, 2000);
            
                },
                error: function(qXHR, textStatus, errorThrown) {
                    $("#load_container").hide();
                    //alert(qXHR +", "+ textStatus);
                }

            });
                            }else{
                            $("#popupNetworkFailed").modal('show');
                            setTimeout(function() {
                                       $('#popupNetworkFailed').modal('hide');
                                       }, 2000);
                            
                            }
        
          }
        return false;
    })

    $("#loginuser").submit(function() {
        $(".error").hide();
        if ($("#loginuser").find("#username").val() == "") {
            $("#loginuser").find("#username").next("span").show();
            return false;
        }
        else if(!re.test($("#loginuser").find("#username").val())){
                           $("#loginuser").find("#username").next("span").show();
                           return false;
                           }
                           else if ($("#loginuser").find("#password").val() == "") {
            $("#loginuser").find("#password").next("span").show();
            return false;
        } else {
                           var netconnect = checkConnection2()
                           if(netconnect){

            var formURL = "http://54.86.103.211/api/rest/login";
            $("#load_container").show();
            $.ajax({
                url: formURL,
                type: "POST",
                data: new FormData(this),
                mimeType: "multipart/form-data",
                contentType: false,
                cache: false,
                processData: false,
                success: function(data, textStatus, jqXHR) {
                    $("#load_container").hide();
                    var obj = JSON.parse(data)
                    if (obj.hasOwnProperty('fail')) {
                        //     alert(obj.fail);
                        $("#popupLoginFailed .modal-body h4").html(obj.fail);
                        $("#popupLoginFailed").modal('show');

                        setTimeout(function() {
                            $('#popupLoginFailed').modal('hide');
                        }, 2000);
                   //   $('#login').find('#username').val('')
                      $('#login').find('#password').val('')

                    } else {
                      updateLocation()
                        localStorage.setItem('userid', obj.user_info.id);
                         localStorage.setItem('userfirstname', obj.user_info.first_name);
                          localStorage.setItem('userlastname', obj.user_info.last_name);
                        /*--code added by ritesh--*/
                        myId = obj.user_info.id;
                        myName = obj.user_info.first_name + " " + obj.user_info.last_name;
                        socket.emit('login', {
                            user_id: myId
                        }, chatLogin);
                        /*--code added by ritesh--*/

                        $('#problem_by_user_id').val(localStorage.getItem('userid'))
                        $('#pwd_user_id').val(localStorage.getItem('userid'))
                        $("section").hide();
                        $("#" + "home").show();
                        $('.deleteAccount').removeClass('disabled');
                        $(".list-group-item").removeClass('disabled');
                        $('#contactproblem').removeClass('disabled');
                       $('#chat .list-group').find('li').removeClass('disabled')
                        $("#btn_logout").show();
                        $("#btn_login2").hide();
                        $('.intrologin').hide()
                   $('#login').find('#username').val('')
                   $('#login').find('#password').val('')
                   
                   if(localStorage.getItem(obj.user_info.id)){
                     localStorage.removeItem(obj.user_info.id)
                     onlineusers=localStorage.getItem('onlineusers').split(',');
                     var index=$.inArray(obj.user_info.id,onlineusers)
                     if(index!=-1){
                     onlineusers.splice(index,1);
                     localStorage.setItem('onlineusers',onlineusers)
                     }
                   
                   }
                   
                        //$("#popupLogin").modal('show');
                        //setTimeout(function() {$('#popupLogin').modal('hide');}, 4000);
                    }
                   

                },
                   
                error: function(jqXHR, textStatus, errorThrown) {
                    //alert("error "+textStatus);
                   $("#load_container").hide();
                    return false;
                }
            });
                           
                           }else{
                           $("#popupNetworkFailed").modal('show');
                           setTimeout(function() {
                                      $('#popupNetworkFailed').modal('hide');
                                      }, 2000);
                           
                           }
        }
        return false;


    });

                  $(document).on('click','.reportback',function(){
                                 $('section').hide();
                                 var id=$('#idvalue').val()
                                 $('#'+id).show();
                                 })

  

    $('.sbtn').bind('click', function(e) {
        e.preventDefault();
        var search_val = $('.searchbar').val();
        if (!(search_val == '' || search_val.length == 0)) {
            $('.txtresetol').show();
            db.transaction(function(tx) {
                tx.executeSql('SELECT * FROM Menumasterlist WHERE (locallable LIKE ?)', ['%' + search_val + '%'], function(tx, results) {
                    var len = results.rows.length;
                    if (len < 1) {
                          $('#gallerylist').hide();
                         $('#noresultlist').show()
                    } else {
                        $('#noresultlist').hide()
                        $('#gallerylist ').show();
                        var i;
                          var str='';
                          for (i = 0; i < len; i++){
                            str +='<tr data-id="'+results.rows.item(i).id+'"><td class="ccol-xs-7 col-sm-9"><p class="text-dark">'+results.rows.item(i).locallable+'</p><p class="text-light">'+results.rows.item(i).translatedlable+'</p></td><td class="col-xs-5 col-sm-3 editgallery"><img class="img-responsive" src="'+results.rows.item(i).path+'" /></td></tr>'
                          }
                          $('#gallerylist tbody').html(str)
               

                    }
                })


            })
        }
    })

    
    
    
    $(".txtresetol").bind('click', function() {
        $('.searchbar').val("");
        $('#searchimglistol').hide();
        $('#noresultlist').hide();
        $('#orderlist .table-bordered').show();
        $(this).hide();
        $('#gallerylist ').show();
        $('.gallery').trigger('click')

    });

    $("#updateuserdetail").submit(function() {
                                  $("#updateuserdetail").find('.error').hide();
                                  $("#updateuserdetail").find('.error2').hide();
                    if ($("#updateuserdetail").find("#f_name").val() == "") {
                                  $("#updateuserdetail").find("#f_name").next("div").show();
                                  return false;
                                  }else if ($("#updateuserdetail").find("#f_name").val().length <2) {
                                  $("#updateuserdetail").find("#f_name").nextAll("div.error2").show();
                                  return false;
                                  }else if ($("#updateuserdetail").find("#l_name").val() == "") {
                                  $("#updateuserdetail").find("#l_name").next("div").show();
                                  return false;
                                  }else if ($("#updateuserdetail").find("#l_name").val().length <2) {
                                  $("#updateuserdetail").find("#l_name").nextAll("div.error2").show();
                                  return false;
                                  }
                                  /*else if($("#updateuserdetail").find("#country_name").next().find('input').val()==''){
                                  $("#updateuserdetail").find("#country_name").nextAll('.error').show();
                                  return false;
                                  
                                  }
                                  else if($("#updateuserdetail").find("#residence_countryid").next().find('input').val()==''){
                                  $("#updateuserdetail").find("#residence_countryid").nextAll('.error').show();
                                  return false;
                                  
                                  }*/

                                  
                else{
                                  var netconnect = checkConnection2()
                                  if(netconnect){
                                  
                                  
        var formURL = "http://54.86.103.211/api/rest/update-profile/" + localStorage.getItem('userid');
        $("#load_container").show();
        $.ajax({
            url: formURL,
            type: "POST",
            data: new FormData(this),
            mimeType: "multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            success: function(data, textStatus, jqXHR) {
                $("#load_container").hide();
               if( $('#select_mylang').val()!=localStorage.getItem('langcontent')){
               localStorage.setItem('langcontent',$('#select_mylang').val())
               call_xml_func($('#select_mylang').val())
                ocrlanguage=$('#select_mylang').val()
               }
                $("#popupupdate").modal('show');
                setTimeout(function() {
                    $('#popupupdate').modal('hide');
                }, 2000);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //alert("error "+textStatus);
                $("#load_container").hide();
                return false;
            }
        });
                                  }else{
                                  $("#popupNetworkFailed").modal('show');
                                  setTimeout(function() {
                                             $('#popupNetworkFailed').modal('hide');
                                             }, 2000);
                                  
                                  }
      }
        return false;

    });
                  
   


                  
                  
    $("#csignupbtn").bind("click", function() {
                            //$('#selectmylang').val('eng');
                       
                          $("#registeruser").find("input[type='text'], input[type='file'], input[type='date'], input[type='password'] , input[type='email'], select, .ui-autocomplete-input").val("");
						
                          $(".file-input-name").html("");
                     $('input[name="gender"]').prop('checked', false);
                           $("#afteruserimgt").find("img").attr("src","images/no-image.jpg");   
                    $("#selectmylang").val("eng");
    });

    $("#registeruser").submit(function(e) {e.preventDefault();
          
        $("div.error").hide();
		$("div.error2").hide();
        $("#erroruserpic").hide();
         if($("#registeruser").find("#profile_picture").val()==""){
                    $("#erroruserpic").show();
                    return false;
                 }
                              
        /* if($('#genderfemale').prop('checked')==false && $('#gendermale').prop('checked')==false ){
                    $("#registeruser").find("#gendermale").parent().nextAll("div.error").show();
                    return false;
                 } */
        
        else if ($("#registeruser").find("#first_name").val() == "") {
            $("#registeruser").find("#first_name").next("div").show();
            return false;
        }else if ($("#registeruser").find("#first_name").val().length <2) {
            $("#registeruser").find("#first_name").nextAll("div.error2").show();
            return false;
        }else if ($("#registeruser").find("#last_name").val() == "") {
            $("#registeruser").find("#last_name").next("div").show();
            return false;
        }else if ($("#registeruser").find("#last_name").val().length <2) {
            $("#registeruser").find("#last_name").nextAll("div.error2").show();
            return false;
        } else if ($("#registeruser").find("#email").val() == "") {
            $("#registeruser").find("#email").next("div").show();
            return false;
        } else if (!re.test($("#registeruser").find("#email").val())) {
            $("#registeruser").find("#email").next("div").show();
            return false;
        } else if ($("#registeruser").find("#password").val() == "") {
            $("#registeruser").find("#password").next("div").show();
            return false;
        }else if ($("#registeruser").find("#password").val().length<2) {			
            $("#registeruser").find("#password").nextAll("div.error2").show();
            return false;
        }
        /* else if ($("#registeruser").find("#dob").val() == "") {
            $("#registeruser").find("#dob").next("div").show();
            return false;
        } else if ($("#registeruser").find("#country_id").val()==null) {
            $("#registeruser").find("#country_id").nextAll('div.error').show();
            $("#registeruser").find("#country_id").focus();
            return false;
        } else if ($("#registeruser").find("#residence_country_id").val()==null) {
            $("#registeruser").find("#residence_country_id").nextAll('div.error').show();
            $("#registeruser").find("#residence_country_id").focus();
            return false;
        } else if ($("#profession_id option:selected").index() < 1) {
            $("#profession_id").next('div').show();
            $("#profession_id").focus();
            return false;
        } else if ($("#activity_id option:selected").index() < 1) {
            $("#activity_id").next('div').show();
            $("#activity_id").focus();
            return false;
        } else if ($("#industry_id option:selected").index() < 1) {
            $("#industry_id").next('div').show();
            $("#industry_id").focus();
            return false;
        } */
        else {
            updateLocation();
                              var netconnect = checkConnection2()
                              if(netconnect){
            var formURL = "http://54.86.103.211/api/rest/create-profile";
            $("#load_container").show();
                              $.ajax({
                                     url: formURL,
                                     type: "POST",
                                     data: new FormData(this),
                                     mimeType: "multipart/form-data",
                                     contentType: false,
                                     cache: false,
                                     processData: false,
                                     success: function(data, textStatus, jqXHR) {
                                    // console.log(data + textStatus);
                                     var obj = JSON.parse(data)
                                     if(obj.hasOwnProperty('success')){
                                     $("#load_container").hide();
                                     //localStorage.setItem('userid', obj.user_id)
                                     $("section").hide();
                                     $("#" + "login").show();
                                     $("#popupregister").modal('show');
                                     setTimeout(function() {
                                                $('#popupregister').modal('hide');
                                                }, 2000);
                                     
                                     localStorage.setItem('userid', obj.user_id);
                                     localStorage.setItem('userfirstname', $("#registeruser").find("#first_name").val());
                                     localStorage.setItem('userlastname', $("#registeruser").find("#last_name").val());
                                     
                                     if( $('#selectmylang').val()!=localStorage.getItem('langcontent')){
                                     localStorage.setItem('langcontent',$('#selectmylang').val())
                                    // $('body').removeAttr("class");
                                   //  $('body').addClass($('#selectmylang').val())
                                     call_xml_func($('#selectmylang').val())
                                     
                                     ocrlanguage =$('#selectmylang').val()
                                     }
                                     /*--code added by ritesh--*/
                                     myId = obj.user_id;
                                     myName = $("#registeruser").find("#first_name").val() + " " + $("#registeruser").find("#last_name").val();
                                     socket.emit('login', {
                                                 user_id: myId
                                                 }, chatLogin);
                                     /*--code added by ritesh--*/
                                     
                                     $('#problem_by_user_id').val(localStorage.getItem('userid'))
                                     $('#pwd_user_id').val(localStorage.getItem('userid'))
                                     $("section").hide();
                                     $("#" + "setting").show();
                                     $('.deleteAccount').removeClass('disabled');
                                     $(".list-group-item").removeClass('disabled');
                                     $('#contactproblem').removeClass('disabled');
                                     $('#chat .list-group').find('li').removeClass('disabled')
                                     $("#btn_logout").show();
                                     $("#btn_login2").hide();
                                     $('.intrologin').hide()
                                     }
                                     else{
                                     $("#load_container").hide();
									// console.log(obj);
                                     if(obj['email'].hasOwnProperty('recordFound')){
                                     $("#popupEmailFound .modal-body h4").html(obj['email'].recordFound);
                                     $("#popupEmailFound").modal('show');
                                     setTimeout(function() {
                                                $('#popupEmailFound').modal('hide');
                                                }, 2000);
                                     }
                                     
                                     }
                                     
                                     
                                     
                                     
                                     
                                     
                                     },
                                     error: function(jqXHR, textStatus, errorThrown) {
                                     $("#load_container").hide();
                                     
                                     $("#popupRegisterFailed").modal('show');
                                     setTimeout(function() {
                                                $('#popupRegisterFailed').modal('hide');
                                                }, 2000);
                                     //  alert("error "+textStatus);
                                     return false;
                                     }
                                     });
                              }else{
                              $("#popupNetworkFailed").modal('show');
                              setTimeout(function() {
                                         $('#popupNetworkFailed').modal('hide');
                                         }, 2000);
                              
                              }

            return false;
        }
        return false;
    });

                  $('#clearconversation').bind('click',function(){
                                        if(!$(this).hasClass('disabled')){
                                               var netconnect = checkConnection2()
                                               if(netconnect){
                                               if(localStorage.getItem('userid')){
                                               jConfirm(msg2,confirmmessage, oktext,canceltext, function(r) {
                                                        if(r){
                                                        var userid=localStorage.getItem('userid');
                                                        var data={user_id:userid}
                                                        $('#load_container').show()
                                                        setTimeout(function(){
                                                                   var formURL = "http://54.86.103.211/api/rest/clear-conversation";
                                                                   $.ajax({
                                                                          url:formURL,
                                                                          type:'POST',
                                                                          data:data,
                                                                          success:function(data){
                                                                          $('#clearconver').modal('show')
                                                                          $('#load_container').hide()
                                                                          setTimeout(function(){$('#clearconver').modal('hide')},2000)
                                                                          //  alert(data.success)
                                                                          },
                                                                          error:function(){
                                                                           $('#load_container').hide()
                                                                          }
                                                                          })
                                                                   },1000)
                                                        
                                                        
                                                        }
                                                        
                                                        })
                                               }
                                               }else{
                                               $("#popupNetworkFailed").modal('show');
                                               setTimeout(function() {
                                                          $('#popupNetworkFailed').modal('hide');
                                                          }, 2000);
                                               
                                               }
                                               }
                                               })
                  $(document).on('click','#findnearbyusers',function(){
                                 if(!$(this).hasClass('disabled')){
                                 var netconnect = checkConnection2()
                                 $('#userlist').empty();
                                 if(netconnect){
                                 $('section').hide();
                                 $('#membernearby').show();
                                 if(localStorage.getItem('userid')){
                                 
                                 $('#load_container').show();
                                 var user_id=localStorage.getItem('userid');
                                 var formURL = "http://54.86.103.211/api/rest/members-near-by-me/"+user_id;
								  func_near_by(formURL);
                                 }
                                 
                                 }else{
                                 $("#popupNetworkFailed").modal('show');
                                 setTimeout(function() {
                                            $('#popupNetworkFailed').modal('hide');
                                            }, 2000);
                                 }
                                 }
                                 })
                  
                 
                  $(document).on('click','.membernearlist',function(){
                                 var name=$(this).find('.membername').text();
                                 var imgpath=$(this).find('img').attr('src');
                                 $('#membernearbydetail').find('#memid').text($(this).find('.memuserid').text())
                                 $('#membernearbydetail').find('.imguser img').attr('src',imgpath)
                                 $('#membernearbydetail').find('.imguser .current-user-info .current-user-info-name').text(name);
                                 $('#membernearbydetail').find('.imguser p.small').text($(this).find('p.small').text())
                                 $("section").hide();
                                 $("#membernearbydetail").show();
                                 })
                  
                  $(document).on('click','.membernearlist2',function(e){
                                 if($(e.target).hasClass('arrowicon')){
                                 var friend_id=parseInt($(e.target).parents('li').attr('user_id'));
                                 var user_id=parseInt(localStorage.getItem('userid'));
                                 data={user_id:user_id,friend_id:friend_id};
                                 jConfirm(msg7, confirmmessage, oktext,canceltext, function(r) {
                                          if(r==true){
                                          $('#load_container').show();
                                          setTimeout(function(){
                                                     $.ajax({
                                                            url:'http://54.86.103.211/api/rest/delete-contact-list',
                                                            type:"POST",
                                                            async:false,
                                                            data:data,
                                                            success:function(data){
                                                            $(e.target).parents('li').remove();
                                                            if($('#allcontactslist').children().length==0){
                                                            $('.nomembers_list').show()
                                                            }
                                                            
                                                             $('#load_container').hide();
                                                            },
                                                            error:function(data){
                                                            $('#load_container').hide();
                                                            }
                                                            });
                                                     
                                                     
                                                     },1000)
                                          
                                          
                                            }
                                          })
                                 
                                 }else{
                                 var name=$(this).find('.membername').text();
                                 var imgpath=$(this).find('img').attr('src');
                                 $('#chatbydetail').find('#memid').text($(this).find('.memuserid').text())
                                 $('#chatbydetail').find('.imguser img').attr('src',imgpath)
                                 $('#chatbydetail').find('.imguser .current-user-info .current-user-info-name').text(name);
                                 $('#chatbydetail').find('.imguser p.small').text($(this).find('p.small').text())
                                 $("section").hide();
                                 $("#chatbydetail").show();
                                 }
                                 })
                  
                  
                  $('#reportlist li').bind('click',function(){
                                           $(this).toggleClass('added');
                                           if($('#reportlist li.added').length){
                                           }
                                           else{
                                           }
                                           })
                  
                  
                  $(document).on('click','.abdone',function(){
                                 $('section').hide();
                                 $('#chat').show();
                                 })
                  
                  $('.sendreportabusesuccess').bind('click',function(){
                                                    var reportedItem=[];
                                                    $('#reportlist li').each(function(){
                                                                             if($(this).hasClass('added')){
                                                                             reportedItem.push($(this).index())
                                                                             }
                                                                             });
                                                    var reported_by_user_id=localStorage.getItem('userid');
													
                                                    var reported_to_user_id=parseInt($('#'+$('#idvalue').val()).find('#memid').text());
                                                    var  reported_item=reportedItem
                                                    var data={reported_by_user_id:reported_by_user_id,reported_to_user_id:reported_to_user_id,report_type:reported_item}
                                                    var formURL = "http://54.86.103.211/api/rest/report-to-abuse";
                                                    var netconnect = checkConnection2()
                                                    if(netconnect){
                                                    $.ajax({url:formURL,
                                                           type:'POST',
                                                           data:data,
                                                           success:function(data){
                                                           data=JSON.stringify(data)
                                                           $('section').hide();
                                                           $('#reportabusesuccess').show()
                                                           },
                                                           error:function(data){
                                                       //    console.log('error')
                                                           $('#reportabusesuccess').show()
                                                           }	
                                                           
                                                           })
                                                    }else{
                                                    $("#popupNetworkFailed").modal('show');
                                                    setTimeout(function() {
                                                               $('#popupNetworkFailed').modal('hide');
                                                               }, 2000);
                                                    }
                                                    });
                  $('.reportab').bind('click',function(){
                                      $('#reportlist li').removeClass('added')
                                      
                                      })
                  
                  
                  $('.fileclick').bind('click',function(){
                                       $('.changeMealPic').click()
                                       })
                  
    
                  $(document).on('click','.delete_chat_friend', function(){
                                 var netconnect = checkConnection2()
                                 if(netconnect){
                                 var friend_id=$(this).parent('td').attr('friendid');
                                 var user_id=$(this).parent('td').attr('myid');
                                 jConfirm(msg5, confirmmessage, oktext,canceltext, function(r) {
                                          if(r === true){
                                        //  console.log(2222)
                                          $('#load_container').show();
                                          data={user_id:user_id,friend_id:friend_id};
                                          setTimeout(function(){
                                                     $.ajax({
                                                            url:'http://54.86.103.211/api/rest/delete-chat-friend',
                                                            type:"POST",
                                                            async:false,
                                                            data:data,
                                                            success:function(data){
                                                            
                                                            socket.emit('login', {user_id: myId}, chatLogin);
                                                            //$('#load_container').hide();
                                                            },
                                                            error:function(){
                                                             //console.log('could not delete user')
                                                            $('#load_container').hide()
                                                            }
                                                            });
                                                     
                                                     },1000)
                                         
                                          }
                                          });
                                 }else{
                                 $("#popupNetworkFailed").modal('show');
                                 setTimeout(function() {
                                            $('#popupNetworkFailed').modal('hide');
                                            }, 2000);
                                 
                                 }
                                 });
				  
				  $(document).on('click','.add_contact_member',function(){
                                 var netconnect = checkConnection2()
                                 if(netconnect){
                                    $('#load_container').show()
										  var friend_id=$(this).parent('td').attr('friendid');
                                          var user_id=$(this).parent('td').attr('myid');
										   data={user_id:user_id,friend_id:friend_id};
                                 setTimeout(function(){
                                            $.ajax({
                                                   url:'http://54.86.103.211/api/rest/add-contact-list',
                                                   type:"POST",
                                                   async:false,
                                                   data:data,
                                                   success:function(data){
                                                   $('#load_container').hide()
                                                   //	 console.log(JSON.stringify(data))
                                                   $('#addcontact').modal('show');
                                                   setTimeout(function(){$('#addcontact').modal('hide');},2000)
                                                   // socket.emit('login', {user_id: myId}, chatLogin);
                                                   },
                                                   error:function(){
                                                   $('#load_container').hide()
                                                   }
                                                   });
                                            
                                            },1000)
                                 
                                 }else{
                                 $("#popupNetworkFailed").modal('show');
                                 setTimeout(function() {
                                            $('#popupNetworkFailed').modal('hide');
                                            }, 2000);
                                 }
								})
                  $('.gallery').bind('click',function(){
                                     
                                     db.transaction(function(tx) {
                                                    tx.executeSql('SELECT * FROM Menumasterlist', [], function(tx, results) {
                                                                  var len = results.rows.length,
                                                                  i;
                                                                  if (len < 1) {
                                                                  
                                                                  //<img class="img-responsive" src="' + results.rows.item(i).path+'?'+rnd_no+ '" />
                                                                  $('#gallerylist thead').hide();
                                                                  $('#gallerylist tbody').empty();
                                                                  
                                                                  } else {
                                                                  $('#gallerylist thead').show();
                                                                  var str = '';
                                                                  for (i = 0; i < len; i++) {
                                                                   var rnd_no = new Date().getTime()
                                                                  str += '<tr data-id="'+results.rows.item(i).id+'"><td class="col-xs-7 col-sm-9 addord"><p class="text-dark">' + results.rows.item(i).locallable + '</p><p class="text-light">' + results.rows.item(i).translatedlable + '</p></td><td class="col-xs-5 col-sm-3 editgallery"><div class="minheight"><img class="img-responsive" src="' + results.rows.item(i).path+ '" /></div></td></tr>'
                                                                  }
                                                                  $('#gallerylist tbody').html(str)
                                                                  }
                                                                  }, null);
                                                    });
                                     
                                     });
                  
                  $(document).on('click','.addord',function(){
                                 var obj=$(this)
                                 var text1=$(this).find('.text-dark').text();
                                 var text2 ='';
                                 if($(this).find('.text-light').length){
                                   text2=$(this).find('.text-light').text()
                                 }
                                 var imgpath= $(this).parent().find('img').attr('src');
                              
                                 db.transaction(function(tx){
                                                tx.executeSql('INSERT INTO MenuScanner (path,locallable,translatedlable) VALUES (?,?, ?)', [imgpath, text1, text2], function(tx,results) {
                                                   var str='<tr><td class="col-xs-7 col-sm-9"><p class="text-dark">' + text1 + '</p><p class="text-light">' + text2 + '</p></td><td class="col-xs-5 col-sm-3 center"><img class="img-responsive" src="' + imgpath + '" /><button data-target="#" class="btn btn-sm btn-pink-remove" id="'+results.insertId+'"  >&mdash;</button></td></tr>';
                                                    $('#imgorderlist tbody').append(str);
                                                    obj.parents('section').find('footer button').last().trigger('click')
                  
                                                              
                                                              
                                                              });
                            
                                                
                                                })
                       
                                 })
                  
                  var tempid;
                  $(document).on('click','.editgallery',function(){
                                 var $parent=$(this).parent('tr');
                                 $('#tab-mpicMeal').find('tr.langrow').remove();
                                 rowid = $(this).parent('tr').attr('data-id')
                                 $('#managePicMeal').find('#travmealpic img').attr('src',$parent.find('img').attr('src'))
                                 $('#managePicMeal').find('#travmealname').text($parent.find('.text-dark').text())
                                 $('#managePicMeal').find('#mealnamelang1').text($parent.find('.text-light').text())
                               //  if($parent.find('.text-light').text() !=''){
                                 db.transaction(function(tx){
                                                  tx.executeSql('SELECT * FROM Languagemaster WHERE mealid=?',[rowid],function(tx,results){
                                                                var len = results.rows.length
                                                                for(var j=0;j<len;j++){
                                                                if($parent.find('.text-light').text()==results.rows.item(j).langdesc){
                                                                var str='<tr class="langrow" data-id="'+results.rows.item(j).id+'"><td class="col-xs-7 col-sm-9"><p class="text-light">'+results.rows.item(j).langdesc+'</p></td><td class="col-xs-5 col-sm-3"><button data-target="#" class="btn btn-sm btn-pink btnedit">E</button><br/><button data-target="#" class="btn btn-sm btn-pink langdelete">X</button></td></tr>'
                                                                }
                                                                else{
                                                                var str='<tr class="langrow newrow" data-id="'+results.rows.item(j).id+'"><td class="col-xs-7 col-sm-9"><p class="text-light">'+results.rows.item(j).langdesc+'</p></td><td class="col-xs-5 col-sm-3"><button data-target="#" class="btn btn-sm btn-pink btnedit">E</button><br/><button data-target="#" class="btn btn-sm btn-pink langdelete">X</button></td></tr>'
                                                                }
                                                                $('#tab-mpicMeal').find('.lasrow').before(str)
                                                                }
                                                                })
                                                })
                                 
                             
                                 $('section').hide();
                                 $('#managePicMeal').show()
                                 
                                 })
                  
                  $(document).on('click','.addlang',function(){
                            //     $('#tab-mpicMeal').find('tr.langrow').remove();
                                 var temptext=addnewlng;
                                  db.transaction(function(tx){
                                            tx.executeSql('INSERT INTO Languagemaster (mealid,langdesc) VALUES (?, ?)', [rowid, temptext], function() {});
                                                 tx.executeSql('SELECT * FROM Languagemaster WHERE mealid=?',[rowid],function(tx,results){
                                                               var len = results.rows.length
                                                               for(var j=0;j<len;j++){
                                                               var idd=results.rows.item(j).id;
                                                               var str='<tr class="langrow newrow" data-id="'+results.rows.item(j).id+'"><td class="col-xs-7 col-sm-9"><p class="text-light">'+results.rows.item(j).langdesc+'</p></td><td class="col-xs-5 col-sm-3"><button data-target="#" class="btn btn-sm btn-pink btnedit">E</button><br/><button data-target="#" class="btn btn-sm btn-pink langdelete">X</button></td></tr>';
                                                               if($('#managePicMeal').find('tr.langrow[data-id="'+idd+'"]').length==0){
                                                                  $('#tab-mpicMeal').find('.lasrow').before(str)
                                                               }
                                                               }
                                                               })
                                                })
                                 
                                 
                                 
                                 })
                  
                  
    
                  
                  
                  
                  $(document).on('click','.canceledit',function(){
                              $('#managePicMeal').find('p[contentEditable="true"]').attr('contentEditable',false);
                                 $('section').hide()
                                 $('#gallery').show();
                                        
                                        })
                  $(document).on('click','.saveedit',function(){
                                 var obj = $('#managePicMeal').find('p[contentEditable="true"]').parents('tr')
                                 if($('#managePicMeal').find('p[contentEditable="true"]').length){
                                 var newname= $('#managePicMeal').find('p[contentEditable="true"]').text()
                                 db.transaction(function(tx) {
                                                if(!obj.hasClass('newrow')){
                                                tx.executeSql("UPDATE Menumasterlist SET translatedlable=? WHERE id = ?", [newname,rowid]);
                                                }
                                                tx.executeSql("UPDATE Languagemaster SET langdesc=? WHERE id = ?", [newname,tempid]);
                                                })
                                 
                                 }
                                 
                                 
                                       $('#managePicMeal').find('p[contentEditable="true"]').attr('contentEditable',false);
                                       $('.gallery').trigger('click')
                                 });
                  
                  
                  $(document).on('click','.sendgreeting',function(){
                                 if($('#txtsendgreeting').val()==''){
                                 $('#errorsndgrt').modal('show');
                                 setTimeout(function(){ $('#errorsndgrt').modal('hide');},2000)
                                 }else{
                                 var netconnect = checkConnection2()
                                 if(netconnect){
                                 var form_URL='http://54.86.103.211/api/rest/send-greeting';
                                 var send_by_user_id = localStorage.getItem('userid');
                                 var id=$('#idval').val()
                                 var received_by_user_id=parseInt($('#'+id).find('#memid').text());
                                 var greeting= $("#sendgreeting").find("#txtsendgreeting").val();
                                 data={send_by_user_id:send_by_user_id,received_by_user_id:received_by_user_id,greeting:greeting}
                                 $.ajax({url:form_URL,
                                        type:'POST',
                                        data:data,
                                        success:function(data){
				                        $('#txtsendgreeting').val('');
                                        $('#sndgrt').modal('show')
                                        setTimeout(function(){$('#sndgrt').modal('hide')},2000)
                                        
                                        },
                                        error:function(data){
                                        //alert('error')
                                        }
                                        })
                                 }else{
                                 $("#popupNetworkFailed").modal('show');
                                 setTimeout(function() {
                                            $('#popupNetworkFailed').modal('hide');
                                            }, 2000);
                                 
                                 }
                                 
                                 }
                                 })
                  
                  $(document).on('click','.deletedit',function(){
                                 var obj=$(this)
                                 jConfirm(msg3, confirmmessage, oktext,canceltext, function(r) {
                                          if(r==true){
                                          db.transaction(function(tx) {
                                                         tx.executeSql("DELETE FROM Menumasterlist  WHERE id = ?", [rowid]);
                                                         tx.executeSql("DELETE FROM Languagemaster  WHERE mealid = ?", [rowid]);
                                                         obj.parents('tr').remove();
                                                         $('.gallery').trigger('click')
                                                         })
                                          }
                                          })
                                 
                                 })
                  
                  //langdelete
                  $(document).on('click','.langdelete',function(){
                                 var obj=$(this).parent().parent()
                                 var dleid = $(this).parents('tr').attr('data-id')
                                 jConfirm(msg4, confirmmessage, oktext,canceltext, function(r) {
                                          if(r){
                                          var val='';
                                          db.transaction(function(tx) {
                                                         if(!obj.hasClass('newrow')){
                                                         tx.executeSql("UPDATE Menumasterlist SET translatedlable=? WHERE id = ?", [val,rowid]);
                                                         }
                                                         tx.executeSql("DELETE FROM Languagemaster  WHERE id = ?", [dleid])
                                                         obj.remove();
                                                         })
                                          
                                          }
                                          
                                          })
                                 
                                 })
                  
                  
                  $(document).on("click",".btnedit" ,function(){
                                 $(this).parents('section').find('p[contentEditable="true"]').attr('contentEditable',false)
                                 tempid = $(this).parents('tr').attr('data-id')
                                 $(this).parent().prev('td').find('p').attr('contentEditable',true);
                                 $('#managePicMeal').find('p[contentEditable="true"]').focus();
                                 oldname=$(this).parent().prev('td').find('p').text();
                                 if($(this).parents('section').attr('id')=='managePicMeal'){
                                 var h=screen.height-280;
                                 managepicheight=$('#managePicMeal').find('.content').height()
                                 $('#managePicMeal').find('.content').height(h)
                                 }
                                 });
                  
                  $(document).on("click",".btnpicHelp" ,function(){
                                 // $("#picHelp").show();
                                 });
                  
         
                  $(document).on('click','.saveimg',function(e){
                                 $('#load_container').show()
                                 e.preventDefault();
                                 $('#newmeallist .text-dark').attr('contenteditable',false)
                                 filePath = $('#newmeallist tbody').find('img').attr('src')
                                 filename = 'pic' + new Date().getTime();
                                 selectedText = $('#newmeallist tbody').find('p.text-dark').text()
                                 translatedtext = '';
                                 DownloadFile(filePath, 'PicMeal', filename)
                                 setTimeout(function(){
                                            $('#load_container').hide()
                                            $('.gallery').trigger('click')
                                            },2000)
                                 
                                 })
                  
                  $(document).on('click','#newmeallist .text-dark',function(){
                                 $(this).attr('contenteditable',true)
                                 $(this).focus();
                                     if($(this).text()==entermealtext){
                                            $(this).text("");
                                            $(this).removeClass('blankstyle')
                                      }
                                 
                                 })
                  
                  
                  $(document).on('blur','#newmeallist .text-dark',function(){
                                 $(this).attr('contenteditable',false)
                                 if($(this).text()==""){
                                 $(this).text(entermealtext);
                                 $(this).addClass('blankstyle')
                                 }
                                 
                                 })
                  
                  
                  $(document).on('click','#findallUsers',function(){
                                  if(!$(this).hasClass('disabled')){
                                 var netconnect = checkConnection2();
                                  $('#allcontactslist').empty();
                                 if(netconnect){
                                 $("section").hide();
                                 $("#allcontactlists").show();
                                
                                 
                                 if(localStorage.getItem('userid')){
                                 $('#load_container').show()
                                 var user_id=localStorage.getItem('userid');
                                 var formURL = "http://54.86.103.211/api/rest/contacts/"+user_id;
                                     func_all_contacts(formURL);
                                 }
                                 }else{
                                 $("#popupNetworkFailed").modal('show');
                                 setTimeout(function() {
                                            $('#popupNetworkFailed').modal('hide');
                                            }, 2000);
                                 
                                 }
                                 }
                                 })
     
                  
                  $("#country_id").parent().find("input").attr("placeholder", $(".ui-widget").find("#country_id").attr("placeholder"));
                  $("#residence_country_id").parent().find("input").attr("placeholder", $(".ui-widget").find("#residence_country_id").attr("placeholder"));
       
                  
                  $(document).on('click','#travmealpic img',function(){
                                 $('#takepicnew').show();
                                 })
                  $(document).on('click','.takecancel',function(){
                                 $('#takepicnew').hide();
                                 })
                  $(document).on('click','.takephoto',function(){
                                 opencamera()
                                  $('#takepicnew').hide();
                                 })
                  $(document).on('click','.chooseexiting',function(){
                                 opengallery()
                                  $('#takepicnew').hide();
                                 })
                  
                  
                  $(document).on('focus', 'input,textarea,select,p', function(){
                                 
                                // if($(this).attr('type')!='button'){
                                 if($(this).parents('section').attr('id')!='chatConversation' && $(this).prop('type')!='button'){
                                //  $("footer").hide();
                                 if($(this).parents('section').attr('id')=='profile'){
                                 var h=screen.height-280;
                                 profileheight=$('#profile').find('.content').height()
                                  $('#profile').find('.content').height(h)
                                   }
                                 if($(this).parents('section').attr('id')=='signup'){
                                 var h=screen.height-280;
                                 signupheight=$('#signup').find('.content').height()
                                 $('#signup').find('.content').height(h)
                                 }
                                 if($(this).parents('section').attr('id')=='managePicMeal'){
                                // var h=screen.height-280;
                                // managepicmealheight=$('#managePicMeal').find('article').height()
                                // console.log(h+','+managepicmealheight)
                                // $('#managePicMeal').find('article').height(h)
                                // $('#managePicMeal').find('.content').height(h)
                                  var temph=$('#managePicMeal').find('.content').height()-($('#tab-mpicMeal').offset().top+$('#tab-mpicMeal').height())+$('footer').height()
                                 // console.log(temph+$('footer').height())
                                 // console.log($('#managePicMeal').find('.content').height())
                                 // console.log($('#tab-mpicMeal').offset().top)
                                 // console.log($('#tab-mpicMeal').height())
                                 $('#managePicMeal').find('.content').append('<div class="temp"></div>')
                                 $('.temp').height(temph)
                                 }
                                 
                                 

                                 
                              //   }
                                 }
                        
                  })
    
   
                  $(document).on('click','.shout_message',function(e){
                              //   $("footer").hide();
                                 contentheight=$('#chatConversation').find('.content').height()
                                 msgheight=$('#chatConversation').find('.msgconversation').height()
                                 setTimeout(function(){
                                            $('html,body').scrollTop(0);
                                            if($(window).width() > 480){
                                            var h=screen.height-310
                                            
                                            }else{
                                            var h=screen.height-295
                                            }
                                            
                                            $('#chatConversation').find('.content').height(h)
                                            $('#chatConversation').find('.msgconversation').height(h-60);
                                            $('#chatConversation').find('.content > div').first().hide()
                                            $('#chatConversation').find('header').hide();
                                           // $('#messagebyme').focus()
                                       /*     var h=0
                                            $('.message_box.msgconversation > div').each(function(){
                                                                    h += $(this).outerHeight(true)
                                                                        })
                                            if(h < $('#chatConversation').find('.msgconversation').height()){
                                            var temph=parseInt($('#chatConversation').find('.msgconversation').height())-h;
                                              $('#chatConversation').find('.msgconversation').prepend('<div id="abc" style="height:370px;"></div>')
                                            $('#chatConversation').find('#abc').height(420-h)
                                            $('.msgconversation').scrollTop(h);
                                            }else{
                                            $('#chatConversation').find('.msgconversation').prepend('<div id="abc" style="height:120px;"></div>');
                                            $('.msgconversation').scrollTop(h);
                                            }*/
                                            
                                            },100)
                                 
                             
                                
                                 });
    
  
    $(document).on('click', '#black_loader .btn_launch', function(){
                   $('#black_loader').hide();
                   $('#home').show();
                   });
    
    $(window).resize(function() {
                     if(this.resizeTO) clearTimeout(this.resizeTO);
                     this.resizeTO = setTimeout(function() {
                                                $(this).trigger('resizeEnd');
                                                }, 300);
                     });
    $(window).bind('resizeEnd', function() {
                   var a=$('.shout_message').is(':focus')
                  
                   if(!a&& $('.shout_message').parents('section').css('display')=='block' ){
                   $('#chatConversation').find('.content').height(contentheight);
                   $('#chatConversation').find('.msgconversation').height(msgheight)
                   $('#chatConversation').find('.content > div').first().show()
                   $('#chatConversation').find('header').show();
                   $("footer").show();
                 /*  setTimeout(function(){
                              if($(this).parents('section').attr('id')=='profile'){
                              $('#profile').find('.content').height(profileheight)
                             // console.log(profileheight)
                              }
                              
                              if($(this).parents('section').attr('id')=='signup'){
                              
                              $('#signup').find('.content').height(signupheight)
                              }
                              
                              if($(this).parents('section').attr('id')=='managePicMeal'){
                              if($('.temp').length){
                              $('.temp').remove()
                              }
                              //$('#managePicMeal').find('.content').height(managepicmealheight)
                              }
                              
                              $("article .content").not("#chatConversation article .content").css({
                                                                                                  "height": pageHeight + "px"
                                                                                                  });
                              $("#camerapic article .content").css({
                                                                   "height": pageHeight_camera + "px"
                                                                   });
                              $("#picText article .content").css({
                                                                 "height": pageHeight_camera + "px"
                                                                 });
                              $('#load_container').height(screen.height)
                              $('#search-load_container').height(screen.height)
                              
                              
                              },1000)*/
                   }
                   });
    
    $(document).on('click',function(e){
                   
              if($(e.target).parents('section').attr('id')=='chatConversation'){
                 if($(e.target).attr('class').indexOf('shout_message')==-1){
                   if($('footer').css('display')=='none'){
                   $('#chatConversation').find('.content').height(contentheight);
                   $('#chatConversation').find('.msgconversation').height(msgheight)
                   $('#chatConversation').find('.content > div').first().show()
                   $('#chatConversation').find('header').show();
                   $("footer").show();
                  /* setTimeout(function(){
                              if($(this).parents('section').attr('id')=='profile'){
                              $('#profile').find('.content').height(profileheight)
                              //console.log(profileheight)
                              }
                              
                              if($(this).parents('section').attr('id')=='signup'){
                              
                              $('#signup').find('.content').height(signupheight)
                              }
                              if($(this).parents('section').attr('id')=='managePicMeal'){
                              if($('.temp').length){
                              $('.temp').remove()
                              }
                           //   $('#managePicMeal').find('.content').height(managepicmealheight)
                              }
                              
                              $("article .content").not("#chatConversation article .content").css({
                                                                                                  "height": pageHeight + "px"
                                                                                                  });
                              $("#camerapic article .content").css({
                                                                   "height": pageHeight_camera + "px"
                                                                   });
                              $("#picText article .content").css({
                                                                 "height": pageHeight_camera + "px"
                                                                 });
                              $('#load_container').height(screen.height)
                              $('#search-load_container').height(screen.height)
                              
                              },1000)*/
                   }
                   }
                   }
                   })

                  $(document).on('blur', 'p,input,textarea,select', function(e){
                                 if($(this).parents('section').attr('id')!='chatConversation'){
                                 if($(this).parents('section').attr('id')=='managePicMeal'){
                                                                 $('#managePicMeal').find('.content').height(managepicheight)
                                 }
                              /*   if($(this).parents('section').attr('id')=='chatConversation'){
                                 $('#chatConversation').find('.content').height(contentheight);
                                 $('#chatConversation').find('.msgconversation').height(msgheight)
                                 $('#chatConversation').find('.content > div').first().show()
                                 $('#chatConversation').find('header').show();
                                // $('#messagebyme').trigger('click')
                                 }*/
                                 if($(this).parents('section').attr('id')=='signup'){
                                 $('#signup').find('.content').height(signupheight)
                                 }
                                 if($(this).parents('section').attr('id')=='profile'){
                                 $('#profile').find('.content').height(profileheight)
                                 }
                                 if($(this).parents('section').attr('id')=='managePicMeal'){
                                 if($('.temp').length){
                                 $('.temp').remove()
                                 }
                                // $('#managePicMeal').find('.content').height(managepicmealheight)
                                 }
                                //alert(e.target)
                                 if($("footer").css('display')=='none'){
                                 $("footer").show();
                               /*  setTimeout(function(){
                                            if($(this).parents('section').attr('id')=='profile'){
                                            $('#profile').find('.content').height(profileheight)
                                            //console.log(profileheight)
                                            }
                                            
                                            if($(this).parents('section').attr('id')=='signup'){
                                           
                                            $('#signup').find('.content').height(signupheight)
                                            }
                                            
                                            $("article .content").not("#chatConversation article .content").css({
                                                                                                                "height": pageHeight + "px"
                                                                                                                });
                                            $("#camerapic article .content").css({
                                                                                 "height": pageHeight_camera + "px"
                                                                                 });
                                            $("#picText article .content").css({
                                                                               "height": pageHeight_camera + "px"
                                                                               });
                                            $('#load_container').height(screen.height)
                                            $('#search-load_container').height(screen.height)
                                            
                                            },1000)*/
                                 
                            
                                   $('#abc').remove();
             
                                 }
                                 }
                  })
    
                  
    $('section footer .chat-icon').parent().prepend('<label class="counterflag notify"></label>');
   var offlinemsg
                /*  setInterval(function(){
                              var netconnect = checkConnection2()
                              if(netconnect){
                             var id=localStorage.getItem('userid')
                               var formURL = "http://54.86.103.211/api/rest/get-mess-notification/"+id;
                              //console.log('messge')
                              $.ajax({url:formURL,
                                     type:"POST",
                                     success:function(data){
                                     
                                     if(data.hasOwnProperty('success')){
                                       offlinemsg=data.total;
                                
                                     }
                                     else{
                                     
                                     offlinemsg=0;
                                     $('.notifyimg').hide();
                                     }
                                     getNotificationList(id);
                                     }
                                     
                              })
                              }
                              },10000)*/
                  
    
    
    function getNotificationList(id){
       //console.log('notification')
        $.ajax({url:"http://54.86.103.211/api/rest/get-greeting-notification/"+id,
               type:"POST",
               success:function(data){
               if(data.hasOwnProperty('success')){
                   $('#notification').removeClass('disabled');
                   var onlinemsg = 0;
                   if(localStorage.getItem('onlineusers')){
                     onlineusers=localStorage.getItem('onlineusers').split(',')
                     onlinemsg =onlineusers.length
                   }
                   $('footer').find('.counterflag').text((data.total)+onlinemsg+offlinemsg).css({"visibility":"visible"});
                   $('#notification').find('.counterflag').text(data.total).css({"visibility":"visible"});
                   if(onlinemsg==0 && offlinemsg==0){
                     $('#chat-link').find('.counterflag').text(onlinemsg).css({"visibility":"hidden"});
                   }
                   else{
                     $('#chat-link').find('.counterflag').text(onlinemsg+offlinemsg).css({"visibility":"visible"});
                   }
               }
               else{
                   $('#notification').addClass('disabled')
                   $('#notification').find('.counterflag').css({"visibility":"hidden"});
                   var onlinemsg = 0;
                   if(localStorage.getItem('onlineusers')){
                     onlineusers=localStorage.getItem('onlineusers').split(',')
                     onlinemsg =onlineusers.length
                   }
              
                   if(onlinemsg==0 && offlinemsg==0){
                     $('#chat-link').find('.counterflag').text(onlinemsg).css({"visibility":"hidden"});
                     $('footer').find('.counterflag').text(onlinemsg).css({"visibility":"hidden"});
                  }else{
                     $('#chat-link').find('.counterflag').text(onlinemsg+offlinemsg).css({"visibility":"visible"});
                     $('footer').find('.counterflag').text(onlinemsg+offlinemsg).css({"visibility":"visible"});
                  }
               }
               }
               })
    
    
    }
    
    $("#chat-link").click(function(){
                          if(!$(this).hasClass('disabled')){
                          var netconnect = checkConnection2()
                          if(netconnect){
                          $('section').hide();
                          $('#chatlist').show();
                          }
                          else{
                          $("#popupNetworkFailed").modal('show');
                          setTimeout(function() {
                                     $('#popupNetworkFailed').modal('hide');
                                     }, 2000);
                          }
                          }
                    })
    
                  $(document).on('click','#notification',function(){
                                 if(!$(this).hasClass('disabled')){
                                 var netconnect = checkConnection2()
                                 if(netconnect){
                                 $('section').hide();
                                 $('#notificatesection').show();
                                 if(localStorage.getItem('userid')){
                                 var userid=localStorage.getItem('userid');
                                 $.ajax({url:'http://54.86.103.211/api/rest/greeting-notification-list/'+userid,
                                        type:'POST',
                                        async:false,
                                        success:function(data){
                                      //  console.log(data)
                                        if(data.hasOwnProperty('success')){
                                        var str='';
                                        
                                        $.each(data.members,function(key,val){
                                                var online_status=(parseInt(val.online)?'online':'offline');
                                               var dobs = "";
                                               var countryname = "";
                                               var explevel = "";
                                               var industrytitle = "";
                                               
                                               if(val.dob){
                                                var dobs = ', '+getAge(val.dob);
                                               }
                                               if(val.country_name){
                                               var countryname = ', '+val.country_name;
                                               }
                                               if(val.experience_level){
                                               var explevel = ', '+val.experience_level;
                                               }
                                               if(val.industry_title){
                                               var industrytitle = ', '+val.industry_title;
                                               }
                                               
                                               str += '<li class="list-group-item  row" data-target="notificationdetail" data-message="'+val.message+'" data-msgtime="'+val.message_time+'" data-msgid="'+val.message_id+'" user_id="'+val.id+'" user_name="'+val.first_name +" "+ val.last_name +'" profile_picture_path="'+val.profile_picture_thumbnail+'"><div class="col-md-12 col-sm-12 col-xs-12"><img class="pill-left" src="'+val.profile_picture_thumbnail+'" /> <div class="current-user-info "><p class="membername">'+val.first_name+' '+val.last_name+'</p><p class="small">'+val.gender+dobs+countryname+explevel+industrytitle+',within '+parseInt(val.distance)+' km</p></div><i class="arrowicon glyphicon glyphicon-chevron-right pull-right"></i><span class="memuserid">'+val.id+'</span><span class="clearfx '+online_status+'">'+online_status+'</span></div></li> '
                                               })
                                       // console.log(str)
                                        $('#Notificationmemberlist').html(str)
                                        
                                        }
                                        if(data.hasOwnProperty('fail')){
                                        $('#Notificationmemberlist').html('')
                                        }
                                        
                                        }
                                 
                                 })
                                 }
                                 }else{
                                 $("#popupNetworkFailed").modal('show');
                                 setTimeout(function() {
                                            $('#popupNetworkFailed').modal('hide');
                                            }, 2000);
                                 }
                                 }
                                 })
                  
                  $(document).on('click','#Notificationmemberlist li',function(){
                                 var msg =$(this).attr('data-message')
                                 var msgtime=$(this).attr('data-msgtime');
                                 var msgid=$(this).attr('data-msgid');
                                 var datamyid=localStorage.getItem('userid')
                                 var datauserid = $(this).attr('user_id');
                                 var datausername = $(this).attr('user_name');
                                 var dataprofilepic = $(this).attr('profile_picture_path')
                                 $('#notificationdetail').find('.message').text(msg)
                                 $('#notificationdetail').find('.message-time').text(msgtime)
                                 $('section').hide();
                                 $('#notificationdetail').show();
                                 $('#notificationdetail').find('.chatButton').attr({'id':'cmdChat_'+datamyid+'_'+datauserid,'user_id':datauserid,'user_name':datausername,'profile_picture_path':dataprofilepic});
                                 var netconnect = checkConnection2()
                                 if(netconnect){
                                 $.ajax({
                                        url:'http://54.86.103.211/api/rest/greeting-notification-read/'+msgid,
                                        type:"POST",
                                        async:false,
                                        success:function(data){
                                        //console.log(JSON.stringify(data))
                                        $.ajax({url:"http://54.86.103.211/api/rest/get-greeting-notification/"+id,
                                               type:"POST",
                                               async:false,
                                               success:function(data){
                                                 if(data.hasOwnProperty('success')){
                                                     $('.counterflag').text(data.total).css({"visibility":"visible"});
                                                   }
                                                 else{
                                                     $('.counterflag').css({"visibility":"hidden"});
                                                   }
                                                 }
                                            })
                                        }
                                 })
                                 }else{
                                 $("#popupNetworkFailed").modal('show');
                                 setTimeout(function() {
                                            $('#popupNetworkFailed').modal('hide');
                                            }, 2000);
                                 
                                 }
                                 })
								 
								 
								 
$("#selectlanguaget").click(function(){
    $("#popupselectlanguage").modal('show');
    $('#popupselectlanguage select').val(ocrlanguage)
});
    
   /* $('#membernearby .content').scroll(function(){
                if($('#membernearby .content').scrollTop() < 0){
                                       var user_id= parseInt(localStorage.getItem('userid'))
                                       var formURL = "http://54.86.103.211/api/rest/members-near-by-me/"+user_id;
                                       func_near_by(formURL);
                        }
                          
                })*/
   
   

$("#btndonelang").click(function(){
    $("#popupselectlanguage").modal('hide');
	var getval = $("#popupselectlanguage select").val();
                        ocrlanguage = getval;
                        if(localStorage.getItem('langcontent')!=ocrlanguage){
                        $.ajax({
                               url:'xml/'+ocrlanguage+'/settings.xml',
                               type:'POST',
                               dataType:'xml',
                               success:function(data){
                               var obj=$(data).find('orderlist')
                                $('.dulang').html("<br/>("+obj.find('paragraph').text()+")")
                              // alert($('.dulang').text())
                               obj.find('sfilter').children().each(function(k,v){
                                                                   $('#orderlist').find('.checkbox-inline').eq(k).children('small').html("("+$(this).text()+")")
                                                                   })
                               
                               }
                               })
                        }
                        else{
                         $('.dulang').text("")
                        $('#orderlist').find('.checkbox-inline').each(function(k,v){
                                                                      $(this).children('small').text('')
                                                                      })
                        
                        }
	//alert(ocrlanguage);
});

$('#popupselectlanguage select').bind('change',function(){
							var getval = $("#popupselectlanguage select").val();
	                        ocrlanguage = getval;
							$("#popupselectlanguage").modal('hide');
                                      if(localStorage.getItem('langcontent')!=ocrlanguage){
                                      $.ajax({
                                             url:'xml/'+ocrlanguage+'/settings.xml',
                                             type:'POST',
                                             dataType:'xml',
                                             success:function(data){
                                             var obj=$(data).find('orderlist');
                                             $('.dulang').text("("+obj.find('paragraph').text()+")")
                                             obj.find('sfilter').children().each(function(k,v){
                                              $('#orderlist').find('.checkbox-inline').eq(k).children('small').text("("+$(this).text()+")")
                                                                                     })
                                             
                                             }
                                         })
                                      }
                                      else{
                                      $('.dulang').text('')
                                      $('#orderlist').find('.checkbox-inline').each(function(k,v){
                                                                                    
                                                                                    
                                                                          $(this).children('small').text('')
                                                                          })
                                      
                                      }
                                      
									})

      
};




function sendtoocr(){
    //$("#load_container").show();
    $('#search-load_container').show();
    setTimeout(function(){
               var imageURI = $('#target').attr('src');
              
              var iphone4 = (window.screen.height == (960 / 2));
               var iphone5 = (window.screen.height == (1136 / 2));
               
               /*if(iphone5){
                if(cropdata.x>50)
                        cropdata.x = cropdata.x-50;
                if(cropdata.y>100)
                    cropdata.y = cropdata.y-100;
                if(cropdata.height>50)
                    cropdata.height = cropdata.height-50;
               }*/
               callNativePlugin({
                                url_imagen: imageURI,
                                'language': ocrlanguage,
                                x:cropdata.x,
                                y:cropdata.y,
                                width:cropdata.width+50,
                                height:cropdata.height
                                });
               
              /* callNativePlugin({
                                url_imagen: imageURI,
                                'language': ocrlanguage
                                });*/
               
               
               
               },1000) 
    
   
}
              function opencamera(){
              navigator.camera.getPicture(onChangeSuccess, onFail, {
                                          quality: 100,
                                          destinationType: destinationType.FILE_URI,
                                          });
              }
              function opengallery(){
              navigator.camera.getPicture(onChangeSuccess, onFail, {
                                          quality: 100,
                                          sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM ,
                                          });
              }
              function onChangeSuccess(imageURI){
              
              var filePath = imageURI;
              filenameold = $('#travmealpic img').attr('src');
                filename = 'pic'+new Date().getTime()
              $('#travmealpic img').attr('src',imageURI);
              downloadtogallery(filePath, 'PicMeal', filename)
              }
        function downloadtogallery(URL,Folder_Name,File_Name){
              if (URL == null && Folder_Name == null && File_Name == null) {
              return;
              } else {
              
              window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess1, fileSystemFail1);
              
              function fileSystemSuccess1(fileSystem) {
              var download_link = encodeURI(URL);
              ext = 'jpg' //Get extension of URL
              var directoryEntry = fileSystem.root; // to get root path of directory
              directoryEntry.getDirectory(Folder_Name, {
                                          create: true,
                                          exclusive: false
                                          }, onDirectorySuccess1, onDirectoryFail1); // creating folder in sdcard
              var rootdir = fileSystem.root;
              var fp = rootdir.fullPath; // Returns Fulpath of local directory
              fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
              var fileTransfer = new FileTransfer();
              fileTransfer.download(download_link, fp,
                                    function(entry) {
                                 //   console.log("download complete: " + entry.fullPath);
                                    var pth=entry.fullPath;
                                    db.transaction(function(tx){
                                          tx.executeSql("UPDATE Menumasterlist SET path=? WHERE path = ?", [pth,filenameold]);
                                                   })
                                    var randnum=new Date().getTime()
                                    var obj=$('#gallerylist img[src="'+entry.fullPath+'"]')
                                    obj.attr('src',entry.fullPath+'?'+randnum)
                                    setTimeout(function(){
                                               obj.attr('src',entry.fullPath)
                                               },1000)
                                    },
                                    function(error) {
                                    });
              }
              function onDirectorySuccess1(parent) {
              // Directory created successfuly
              }
              function onDirectoryFail1(error) {
              //Error while creating directory
              }
              function fileSystemFail1(evt) {
              //Unable to access file system
              }
              
              
              }
              
              }

              function handleFiles(fileInput) {
              var files = fileInput.files;
              for (var i = 0; i < files.length; i++) {
              var file = files[i];
              var imageType = /image.*/;
              
              if (!file.type.match(imageType)) {
              continue;
              }
              
              var img = document.createElement("img");
              //var img = document.getElementById("#profile_temp_file");
              img.classList.add("obj");
              img.classList.add("center-block");
              
              img.file = file;
              $(".file-input-name").hide();
              //$(fileInput).after(img);
             
              $("#afteruserimgt").empty().append(img);
              var reader = new FileReader();
              var rnd_no = Math.floor((Math.random() * 1000000) + 1);
              var rnd_result =  "?" + rnd_no;
              reader.onload = (function(aImg) {
                               return function(e) {
                               aImg.src = e.target.result;
                               };
                               })(img);
              reader.readAsDataURL(file);
              }
              }



function handleFiles2(fileInput) {
    var files = fileInput.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /image.*/;
        
        if (!file.type.match(imageType)) {
            continue;
        }
        
        var img = document.createElement("img");
        img.setAttribute("id", "getimg");
        img.classList.add("obj");
        img.classList.add("center-block");
        
        img.file = file;
        $(".file-input-name").hide();
 
        $("#afteruserimgt2").html("");
        $("#afteruserimgt2").html(img);
        
        var reader = new FileReader();
        var rnd_no = Math.floor((Math.random() * 1000000) + 1);
        var rnd_result =  "?" + rnd_no;
        reader.onload = (function(aImg) {
                         return function(e) {
                         aImg.src = e.target.result;
                         };
                         })(img);
        reader.readAsDataURL(file);
    }
}






function _getCountry(){
	 $.ajax({
		     url:"http://54.86.103.211/api/rest/get-country",
			 dataType: 'json',
			 success:function(data){
                 _getProfession();
             $("#country_id option").not(':first').remove()
            $("#country_name option").not(':first').remove();
             $("#residence_country_id option").not(':first').remove();
             $("#residence_countryid option").not(':first').remove();
                  $.each(data, function(key, val) {
                      $("#country_id,#country_name").append('<option value="' + key + '">' + val + '</option>');
                      $("#residence_country_id,#residence_countryid").append('<option value="' + key + '">' + val + '</option>');
                  });
              },
             error:function(jqXHR, textStatus){
                if(textStatus == 'timeout')
                     {    
					    _getCountry();
                     }
			 },
			 timeout:3000
			 
		   });
}

function _getProfession(){
	 $.ajax({
		     url:"http://54.86.103.211/api/rest/get-profession",
			 dataType: 'json',
			 success:function(data){
                 _getActivity();
            $("#profession_id option").not(':first').remove();
            $("#professionid option").remove();
                  $.each(data, function(key, val) {
                     $("#profession_id,#professionid").append('<option value="' + key + '">' + val + '</option>');
                  });
              },
             error:function(jqXHR, textStatus){
                if(textStatus == 'timeout')
                     {    
					    _getProfession();
                     }
			 },
			 timeout:3000
			 
		   });
}

function _getActivity(){
	 $.ajax({
		     url:"http://54.86.103.211/api/rest/get-activity",
			 dataType: 'json',
			 success:function(data){
                 _getIndustry();
            $("#activity_id option").not(':first').remove();
            $("#activityid option").remove();
                  $.each(data, function(key, val) {
                     $("#activity_id,#activityid").append('<option value="' + key + '">' + val + '</option>');
                  });
              },
             error:function(jqXHR, textStatus){
                if(textStatus == 'timeout')
                     {  
					    _getActivity();
                     }
			 },
			 timeout:3000
			 
		   });
}

function _getIndustry(){
	 $.ajax({
		     url:"http://54.86.103.211/api/rest/get-industry",
			 dataType: 'json',
			 success:function(data){
            $("#industry_id option").not(':first').remove();
            $("#industryid option").remove();
                  $.each(data, function(key, val) {
                     $("#industry_id, #industryid").append('<option value="' + key + '">' + val + '</option>');
                  });
              },
             error:function(jqXHR, textStatus){
                if(textStatus == 'timeout')
                     {    
					    _getIndustry();
                     }
			 },
			 timeout:3000
			 
		   });
}


/*Start Reading xml*/
function call_xml_func(lang){
    $('#load_container').show()
    $.ajax({url:'xml/'+lang+'/settings.xml',
           type:'POST',
           dataType:'xml',
           success:function(data){
           
           $('.splashcontent').html($(data).find('splashContent').text())
           $(data).find('popups').children().each(function(key,val){
                                                  var id=val.tagName;
                                                  if($(this).find('option').length){
                                                  //$('#'+id).find('option:first').text($(this).find('option').text())
                                                  $('#'+id).find('#btndonelang').text($(this).find('donebtn').text())
                                                  
                                                  }
                                                  else{
                                                  $('#'+id).find('.modal-title').text($(this).find('title').text())
                                                  $('#'+id).find('.modal-body h4').text($(this).find('body').text())
                                                  }
                                                  
                                                  
                                                  })
           msg1=$(data).find('jAlert Messages msg1').text()
           msg2=$(data).find('jAlert Messages msg2').text()
           msg3=$(data).find('jAlert Messages msg3').text()
           msg4=$(data).find('jAlert Messages msg4').text()
           msg5=$(data).find('jAlert Messages msg5').text()
           msg6=$(data).find('jAlert Messages msg6').text()
           msg7=$(data).find('jAlert Messages msg7').text()
           alertmessage=$(data).find('jAlert alertmessage').text()
           confirmmessage=$(data).find('jAlert confirmmessage').text()
           oktext =$(data).find('jAlert okbutton').text()
		   canceltext =$(data).find('jAlert cancelbutton').text()
           
           $('.tooltip').find('span.define').html($(data).find('tooltip txtdefine').text())
           $('.tooltip').find('span.search').html($(data).find('tooltip txtsearch').text())
           $(data).find('section').children().each(function(key, val){
                                                   var id=val.tagName;
                                                   switch (id){
                                                   case 'splash':
                                                   if($(this).find('paragraph').length){
                                                   $(this).find('paragraph').each(function(){
                                                                                  $('#'+id).find('.'+$(this).attr('class')).text($(this).text())
                                                                                  })
                                                   }
                                                   if($(this).find('footer').length){
                                                   $(this).find('footer').children().each(function(k,v){
                                                                                          $('#'+id).find('footer button').eq(k).text($(this).text())
                                                                                          })
                                                   }
                                                   
                                                   break;
                                                   
                                                   case 'home':
                                                   $('#'+id).find('header h4').text($(this).find('title').text())
                                                   $(this).find('paragraph').each(function(k,v){
                                                                                  $('#'+id).find('.txtente p').eq(k).html($(this).text())
                                                                                  })
                                                   $(this).find('lists list').each(function(k,v){
                                                                                   $('#'+id).find('ul.default li').eq(k).text($(this).text())
                                                                                   })
                                                   
                                                   break;
                                                   
                                                   case 'picmeal':
                                                   $('#'+id).find('header h4').text($(this).find('title').text())
                                                   $(this).find('paragraph').each(function(k,v){
                                                                                  $('#'+id).find('.txtente p').eq(k).html($(this).text())
                                                                                  })
                                                   break;
                                                   
                                                   case 'camerapic':
                                                   
                                                   $('#ocrhelptext').html($(this).find('infotext').text())
                                                   $(this).find('button').children().each(function(k,v){
                                                                                          $('#'+id).find('.newoptions button').eq(k).html($(this).text())
                                                                                          })
                                                   break;
                                                   
                                                   case 'picText':
                                                      $('.ftrrow button').find('span').html($(this).find('choosepicbtn').text())
                                                   break;
                                                   
                                                   case 'picHelp':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text())
                                                   $(this).find('paragraph').each(function(k,v){
                                                                                  $('#'+id).find('.'+$(this).attr('class')).html($(this).text())
                                                                                  })
                                                   $(this).find('olists.helplist0 list').each(function(k,v){
                                                                                              $('#'+id).find('ol.helplist0 li').eq(k).html($(this).text())
                                                                                              })
                                                   $(this).find('olists.helplist1 list').each(function(k,v){
                                                                                            $('#'+id).find('ol.helplist1 li').eq(k).html($(this).text())
                                                                                            })
                                                   $(this).find('olists.helplist2 list').each(function(k,v){
                                                                                            $('#'+id).find('ol.helplist2 li').eq(k).html($(this).text())
                                                                                            })
                                                   break;
                                                   
                                                   case 'picmealfound':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text())
                                                   $('#'+id).find('.toppic').html($(this).find('.toppic').text())
                                                   $('#'+id).find('.noresultf p').html($(this).find('.noresultf').text())
                                                   addtoordertext = $(this).find('btnorder').text();
                                                   break;
                                                   
                                                   case 'gallery':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text())
                                                   $('#'+id).find('.content input.sbtn').val($(this).find('searchbtn').text())
                                                   $('#'+id).find('.content input.searchbar').prop('placeholder',$(this).find('placeholder').text())
                                                   $('#'+id).find('#noresultlist p').html($(this).find('.noresultf').text())
                                                   $(this).find('table').children().each(function(k,v){
                                                                                         $('#'+id).find('.rowheader td').eq(k).text($(this).text())
                                                                                         })
                                                   break;
                                                   case 'addnew':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text());
                                                   $('#'+id).find('.saveimg').val($(this).find('savebtn').text());
                                                   entermealtext = $(this).find('entermealtxt').text()
                                                   $(this).find('table').children().each(function(k,v){
                                                                                         $('#'+id).find('.rowheader td').eq(k).text($(this).text())
                                                                                         })
                                                   break;
                                                   case 'orderlist':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text());
                                                   $('#'+id).find('p:first').html($(this).find('paragraph').text())
                                                   $(this).find('sfilter').children().each(function(k,v){
                                                                                            $('#'+id).find('.checkbox-inline').eq(k).children('span').text($(this).text())
                                                                                            })
                                                   $(this).find('table').children().each(function(k,v){
                                                                                         $('#'+id).find('.rowheader td').eq(k).text($(this).text())
                                                                                         })
                                                   break;
                                                   
                                                   case 'managePicMeal':
                                                   $('#'+id).find('header div.col-xs-12').text($(this).find('title').text());
                                                   $(this).find('table').children().each(function(k,v){
                                                        $('#'+id).find('.rowheader td').eq(k).text($(this).text());
                                                                                         })
                                                   addnewlng = $(this).find('addnewlng').text();
                                                   $('#'+id).find('.lasrow p.text-dark').html($(this).find('txtnewlng').text());
                                                   $(this).find('buttons').children().each(function(k,v){
                                                    $('#'+id).find('.choosebtns button').eq(k).text($(this).text());
                                                                                           })
                                                   $(this).find('footerbuttons').children().each(function(k,v){
                                                                                                 $('#'+id).find('footer button').eq(k).text($(this).text());
                                                                                                 })
                                                   break;
                                                   
                                                   case 'chat':
                                                   $('#'+id).find('header h4').text($(this).find('title').text());
                                                   $(this).find('lists').children().each(function(k,v){
                                                                                         $('#'+id).find('.list-group li').eq(k).html($(this).text());
                                                                                         })
                                                   break;
                                                   
                                                   case 'notificatesection':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text());
                                                   break;
                                                   
                                                   case 'notificationdetail':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text());
                                                   $('#'+id).find('.chatbutton button').text($(this).find('txtchatbtn').text());
                                                   break;
                                                   case 'chatlist':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text());
                                                   break;
                                                   
                                                   case 'chatConversation':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text());
                                                   $('#'+id).find('#master_container').attr('data-placeholdertext',$(this).find('txtmsgplaceholder').text());
                                                   $('#'+id).find('#master_container').attr('data-sendbttext',$(this).find('btnmsgbyme').text());
                                                   $('#'+id).find('.nouserlist').text($(this).find('nouserlist').text());
                                                   break;
                                                   
                                                   case 'membernearby':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text())
                                                   $('#'+id).find('.content .text-center').html($(this).find('paragraph').text())
                                                   break;
                                                   
                                                   case 'membernearbydetail':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text())
                                                   $(this).find('options').children().each(function(k,v){
                                                                                          
                                                                                           $('#'+id).find('#button-list-chat li').eq(k).find('span').text($(this).text())
                                                                                           
                                                                                           
                                                                                           })
                                                   break;
                                                   
                                                   case 'chatbydetail':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text())
                                                   $(this).find('options').children().each(function(k,v){
                                                                                          
                                                                                           $('#'+id).find('.list-group li').eq(k).find('span').text($(this).text())
                                                                                           })
                                                   break;
                                                   
                                                   case 'sendgreeting':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text())
                                                   $('#'+id).find('header .btnsend button').text($(this).find('btnsend').text())
                                                   $('#'+id).find('.row > p').html($(this).find('paragraph').text())
                                                   $('#'+id).find('textarea').prop('placeholder',$(this).find('inputarea').text())
                                                   break;
                                                   
                                                   case 'reportabuse':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text())
                                                   $('#'+id).find('header .btnsend button').text($(this).find('btnsend').text())
                                                   $(this).find('lists').children().each(function(k,v){
                                                                                         $('#'+id).find('#reportlist li').eq(k).html($(this).text())
                                                                                         })
                                                   break;
                                                   
                                                   case 'reportabusesuccess':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text())
                                                   $('#'+id).find('.btn-send').text($(this).find('btndone').text())
                                                   $(this).find('paragraph').each(function(k,v){
                                                                                  $('#'+id).find('.row > p').eq(k).text($(this).text())
                                                                                  })
                                                   break;
                                                   
                                                   case 'login':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text())
                                                   $('#'+id).find('#username').prop('placeholder',$(this).find('inputusername placeholder').text())
                                                   $('#'+id).find('#username').next('span').html($(this).find('inputusername errormsg').text())
                                                   $('#'+id).find('#password').prop('placeholder',$(this).find('inputpwd placeholder').text())
                                                   $('#'+id).find('#password').next('span').html($(this).find('inputpwd errormsg').text())
                                                   $('#'+id).find('#btn_login').val($(this).find('btnlogin').text())
                                                   $('#'+id).find('#myforgotpwd').text($(this).find('btnforgotpwd').text())
                                                   $('#'+id).find('#csignupbtn').text($(this).find('btnsignup').text())
                                                   break;
                                                   
                                                   case 'forgotpassword':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text());
                                                   $('#'+id).find('#usseremailid').prop('placeholder',$(this).find('inputusername placeholder').text())
                                                   $('#'+id).find('#usseremailid').next('span').html($(this).find('inputusername errormsg').text())
                                                   $('#'+id).find('#btn_forgotpassword').val($(this).find('btnforgotpwd').text())
                                                   $('#'+id).find('.row.row-black button').text($(this).find('btnlogin').text())
                                                   break;
                                                   
                                                   case 'resetPassword':
                                                   $('#'+id).find('header div.col-xs-10').text($(this).find('title').text());
                                                   $('#'+id).find('#oldpassword').prop('placeholder',$(this).find('inputusername placeholder').text())
                                                   $('#'+id).find('#oldpassword').next('span').html($(this).find('inputusername errormsg').text())
                                                   $('#'+id).find('#newpassword').prop('placeholder',$(this).find('inputpwd placeholder').text())
                                                   $('#'+id).find('#newpassword').next('span').html($(this).find('inputpwd errormsg').text())
                                                   $('#'+id).find('#cnewpassword').prop('placeholder',$(this).find('inputcpwd placeholder').text())
                                                   $('#'+id).find('#cnewpassword').next('span').html($(this).find('inputcpwd errormsg').text());
                                                   $('#'+id).find('#btn_resetpassword').val($(this).find('btnsubmit').text())
                                                   break;
                                                   
                                                   case 'signup':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).children('title').text());
                                                   $('#'+id).find('.content .text-center').html($(this).find('paragraph').text())
                                                   $('#'+id).find('#btn-submit').val($(this).find('btnsubmit').text())
                                                   $('#'+id).find('#profile_picture').prev('span').text($(this).find('inputPic title').text())
                                                   $('#'+id).find('#profile_picture').prop('title',$(this).find('inputPic title').text())
                                                   $('#'+id).find('#profile_picture').next().html($(this).find('inputPic errormsg').text())
                                                   $('#'+id).find('#gendermale').next().html($(this).find('inputGender label1').text())
                                                   $('#'+id).find('#genderfemale').next().html($(this).find('inputGender label2').text())
                                                   // $('#'+id).find('#gendermale').val($(this).find('inputGender value1').text())
                                                   // $('#'+id).find('#genderfemale').val($(this).find('inputGender value2').text())
                                                   
                                                   $('#'+id).find('.rbbtnmg .error').text($(this).find('inputGender errormsg').text())
                                                   $('#'+id).find('#first_name').prop('placeholder',$(this).find('inputFirstName placeholder').text())
                                                   $('#'+id).find('#first_name').nextAll('div.error').html($(this).find('inputFirstName errormsg').text())
                                                   $('#'+id).find('#first_name').nextAll('div.error2').html($(this).find('inputFirstName errormsg2').text())
                                                   $('#'+id).find('#last_name').prop('placeholder',$(this).find('inputLastName placeholder').text())
                                                   $('#'+id).find('#last_name').nextAll('div.error').html($(this).find('inputLastName errormsg').text())
                                                   $('#'+id).find('#last_name').nextAll('div.error2').html($(this).find('inputLastName errormsg2').text())
                                                   $('#'+id).find('#email').prop('placeholder',$(this).find('inputEmail placeholder').text())
                                                   $('#'+id).find('#email').nextAll('div.error').html($(this).find('inputEmail errormsg').text())
                                                   $('#'+id).find('#password').prop('placeholder',$(this).find('inputPassword placeholder').text())
                                                   $('#'+id).find('#password').nextAll('div.error').html($(this).find('inputPassword errormsg').text())
                                                   $('#'+id).find('#password').nextAll('div.error2').html($(this).find('inputPassword errormsg2').text())
                                                   $('#'+id).find('#dob').prop('placeholder',$(this).find('inputDOB placeholder').text())
                                                   $('#'+id).find('#dob').prev('.txtdob').html($(this).find('inputDOB txtdob').text())
                                                   $('#'+id).find('#dob').nextAll('div.error').html($(this).find('inputDOB errormsg').text())
                                                   $('#'+id).find('#selectmylang').prev('.txtdob').html($(this).find('inputLang txtdob').text())
                                                   $('#'+id).find('#country_id').prop('placeholder',$(this).find('selectNationality placeholder').text())
                                                   $('#'+id).find('#country_id').nextAll('div.error').html($(this).find('selectNationality error').text())
                                                   $('#'+id).find('#country_id').next('span').find('input').prop('placeholder',$(this).find('selectNationality placeholder').text())
                                                   $('#'+id).find('#residence_country_id').prop('placeholder',$(this).find('selectCOR placeholder').text())
                                                   $('#'+id).find('#residence_country_id').nextAll('div.error').html($(this).find('selectCOR error').text())
                                                   $('#'+id).find('#residence_country_id').next('span').find('input').prop('placeholder',$(this).find('selectCOR placeholder').text())
                                                   $('#'+id).find('#profession_id option:first').text($(this).find('selectJobFunction option1').text())
                                                   $('#'+id).find('#profession_id').nextAll('div.error').html($(this).find('selectJobFunction error').text())
                                                   $('#'+id).find('#activity_id option:first').text($(this).find('selectExpLevel option1').text())
                                                   $('#'+id).find('#activity_id').nextAll('div.error').html($(this).find('selectExpLevel error').text())
                                                   $('#'+id).find('#industry_id option:first').text($(this).find('selectIndustry option1').text())
                                                   $('#'+id).find('#industry_id').nextAll('div.error').html($(this).find('selectIndustry error').text())
                                                   
                                                   break;
                                                   
                                                   case 'profile':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).children('title').text());
                                                    $('#'+id).find('header input.btn-send').val($(this).children('btnsubmit').text())
                                                   $('#'+id).find('#f_name').nextAll('div.error').html($(this).find('inputFirstName errormsg').text())
                                                   $('#'+id).find('#f_name').nextAll('div.error2').html($(this).find('inputFirstName errormsg2').text())
                                                   $('#'+id).find('#profile_picture').prev('span').text($(this).find('inputPic title').text())
                                                   $('#'+id).find('#l_name').nextAll('div.error').html($(this).find('inputLastName errormsg').text())
                                                   $('#'+id).find('#l_name').nextAll('div.error2').html($(this).find('inputLastName errormsg2').text())
                                                   $('#'+id).find('#date_of_birth').prev('.txtdob').html($(this).find('inputDOB txtdob').text())
                                                   $('#'+id).find('#select_mylang').prev('.txtdob').html($(this).find('inputLang txtdob').text())
                                                   $('#'+id).find('#gender_male').next().html($(this).find('inputGender label1').text())
                                                   $('#'+id).find('#gender_female').next().html($(this).find('inputGender label2').text())
                                                   $('#'+id).find('#country_name').nextAll('div.error').html($(this).find('selectNationality error').text())
                                                   $('#'+id).find('#residence_countryid').nextAll('div.error').html($(this).find('selectCOR error').text())
                                                   break;
                                                   
                                                   case 'deleteaccount':	
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text());
                                                   $('#'+id).find('.row > p').html($(this).find('paragraph').text())
                                                   $(this).find('lists').children().each(function(k,v){
                                                                                         $('#'+id).find('.default li').eq(k).html($(this).text())									
                                                                                         })
                                                   $('#'+id).find('.delete-acct').text($(this).find('btndelete').text())
                                                   break;
                                                   
                                                   case 'setting':	   
                                                   $('#'+id).find('header h4').text($(this).find('title').text());
                                                   $(this).find('lists.upper').children().each(function(k,v){
                                                                                               $('#'+id).find('.upper li').eq(k).html($(this).text())									
                                                                                               })
                                                 //  $(this).find('lists.lower').children().each(function(k,v){
                                                 //                                              $('#'+id).find('.lower li').eq(k).html($(this).text())
                                                 //                                              })
                                                 //  $('#'+id).find('.content .text-center').html($(this).find('paragraph').text())
                                                   break;
                                                   
                                                   case 'tellafriend':
                                                   $('#'+id).find('header div.col-xs-10').text($(this).find('title').text());
                                                   $(this).find('lists').children().each(function(k,v){
                                                                                         $('#'+id).find('.list-group li').eq(k).html($(this).text())									
                                                                                         })
                                                   break;
                                                   
                                                   case 'about':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).children('title').text());
                                                   $('#'+id).find('.content .text-center').html($(this).find('paragraph').text());
                                                   $(this).find('lists').children().each(function(k,v){
                                                                                         $('#'+id).find('.list-group li').eq(k).html($(this).text())									
                                                                                         })
                                                   break;
                                                   
                                                   case 'aboutpicmealup':
                                                   $('#'+id).find('header div.col-xs-10').text($(this).children('title').text());
                                                   $(this).find('content').each(function(k,v){
                                                                                $(this).children().each(function(i,j){
                                                                                                        $('#'+id).find('.content .row').eq(k).find('p').eq(i).html($(this).text())							 
                                                                                                        })					  
                                                                                
                                                                                });
                                                   break;
                                                   case 'contact':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text());
                                                   $('#'+id).find('.content .text-center').html($(this).find('paragraph').text());
                                                   $('#'+id).find('.btn-send').val($(this).find('btnsend').text())
                                                   break;
                                                   
                                                   case 'allcontactlists':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text());
												    $('#'+id).find('.nomembers_list').text($(this).find('noresult').text());
                                                   break;
                                                   case 'faq':
                                                   $('#'+id).find('header div.col-xs-8').text($(this).find('title').text());
                                                   $('#'+id).find('.infotext').html($(this).find('infotext').text());
                                                   $(this).find('panel').each(function(k,v){
                                                                              $('#'+id).find('.panel').eq(k).find('.panel-title span').text($(this).find('paneltitle').text())
                                                                              if($(this).find('panelbody').find('paragraph').length){
                                                                              $(this).find('panelbody').find('paragraph').each(function(i,v){
                                                                                                                               $('#'+id).find('.panel').eq(k).find('.panel-body p').eq(i).html($(this).text())													 
                                                                                                                               })
                                                                              
                                                                              }
                                                                              if($(this).find('panelbody').find('lists').length){
                                                                              $(this).find('panelbody').find('lists').children().each(function(i,v){
                                                                                                                                      $('#'+id).find('.panel').eq(k).find('.panel-body ol li').eq(i).html($(this).text())													 
                                                                                                                                      })
                                                                              }	
                                                                              
                                                                              })
                                                   break;
                                                   
                                                   
                                                   }
                                                   
                                                   
                                                   })
           
           
           },
           error:function(){
            $('#load_container').hide()
          // alert('error')
           },
           complete:function(){
           // $('.btn_launch').show();
           var netconnect=checkConnection2()
           if(!netconnect){
             $('.btn_launch').show()
           }
           if(localStorage.getItem('restore')==1){
             $('.btn_launch').show()
           }
           
           
           $('#load_container').hide();
           if($("#chatlistuser").length){
           $("#chatlistuser").find(".nores").remove();
		    $('body').removeAttr("class");
           $('body').addClass(lang);
           //alert($('#black_loader .btn_launch').length);
           
           
          // updateLocation();
          /* if(navigator.geolocation){
           var id = navigator.geolocation.watchPosition(success1, error1, {enableHighAccuracy: false,timeout: 5000,maximumAge: 0 })
           }else{
           }
           function success1(pos) {
           var crd = pos.coords;
           alert('watchposition'+crd.latitude+','+crd.longitude)
         
           };
           function error1(err) {
           alert('ERROR(' + err.code + '): ' + err.message)
           //console.warn('ERROR(' + err.code + '): ' + err.message);
           };
           */
           
        
           }
           
           }		
           
           })
	
	
	
}
/*End Reading xml*/

function func_near_by(formurl){
$.ajax({url:formurl,
                                        type:'GET',
                                        dataType :'json',
                                        success:function(data){
                                        $('#load_container').hide()
                                        var str=''
                                        $.each(data.members,function(key,val){
                                              
                                               var online_status=(parseInt(val.online)?'online':'offline');
                                               var dobs = "";
                                               var countryname = "";
                                               var explevel = "";
                                               var industrytitle = "";
                                               if(val.dob){
                                                var dobs = ', '+getAge(val.dob);
                                               }
                                               if(val.country_name){
                                               var countryname = ', '+val.country_name;
                                               }
                                               if(val.experience_level){
                                               var explevel = ', '+val.experience_level;
                                               }
                                               if(val.industry_title){
                                               var industrytitle = ', '+val.industry_title;
                                               }

                                               str += '<li class="list-group-item membernearlist row" data-target="membernearbydetail"  user_id="'+val.id+'" user_name="'+val.first_name.toString() +" "+ val.last_name.toString() +'" profile_picture_path="'+val.profile_picture_thumbnail+'"><div class="col-md-12 col-sm-12 col-xs-12"><img class="pill-left" src="'+val.profile_picture_thumbnail+'" /> <div class="current-user-info "><p class="membername">'+val.first_name+' '+val.last_name+'</p><p class="small">'+val.gender+dobs+countryname+explevel+industrytitle+',within '+getDistance(val.distance)+'</p></div><i class="arrowicon glyphicon glyphicon-chevron-right pull-right"></i><span class="memuserid">'+val.id+'</span><span class="'+online_status+'">'+online_status+'</span></div></li>';
                                               
                                               })
											
                                                $('#userlist').html(str);
                                        },
                                        error:function(jqXHR, textStatus, errorThrown){
											if(textStatus == 'timeout') { 
										       func_near_by(formurl);
                    						 }else{
                                                $('#load_container').hide();
											 }
                                        },
										timeout:5000	 
                                        
                                        })	
}

 function func_all_contacts(formurl){
	   $.ajax({url:formurl,
                                        type:'GET',
                                        dataType :'json',
                                        success:function(data){
											//console.log(JSON.stringify(data))
              $('#load_container').hide();
              $('.nomembers_list').hide()
										if(data.hasOwnProperty('fail')){
											$('.nomembers_list').show()
											}
										else{
											$('.nomembers_list').hide()
                                        var str=''
                                        $.each(data.members,function(key,val){
                                                var online_status=(parseInt(val.online)?'online':'offline');
                                             //  alert(online_status)
                                               var dobs = "";
                                               var countryname = "";
                                               var explevel = "";
                                               var industrytitle = "";
                                               if(val.dob){
                                               var dobs = ', '+getAge(val.dob);
                                               }
                                               if(val.country_name){
                                                    var countryname = ', '+val.country_name;
                                               }
                                               if(val.experience_level){
                                                    var explevel = ', '+val.experience_level;
                                               }
                                               if(val.industry_title){
                                                    var industrytitle = ', '+val.industry_title;
                                               }
                                               
                                               str += '<li class="list-group-item membernearlist2 row" data-target="chatbydetail" user_id="'+val.id+'" user_name="'+val.first_name +" "+ val.last_name +'" profile_picture_path="'+val.profile_picture_thumbnail+'"><div class="col-md-12 col-sm-12 col-xs-12"><img class="pill-left" src="'+val.profile_picture_thumbnail+'" /> <div class="current-user-info "><p class="membername">'+val.first_name+' '+val.last_name+'</p><p class="small">'+val.gender+dobs+countryname+explevel+industrytitle+',within '+getDistance(val.distance)+'</p></div><i class="arrowicon glyphicon glyphicon-remove pull-right"></i><span class="memuserid">'+val.id+'</span><span class="'+online_status+'">'+online_status+'</span></div></li> '
                                               })
                                        $('#allcontactslist').html(str)
										}
                                        },
                                        error:function(jqXHR, textStatus, errorThrown){
											if(textStatus=="timeout"){
												func_all_contacts(formurl);
											}else{											
                                        			$('#load_container').hide()
                                        		//	console.log(jqXHR)
                                        		//	console.log(textStatus)
                                        		//	console.log(errorThrown)
												 }
										  },
										  timeout:5000	 
                                        
                                        }) 
 }

 function getAge(dob){
                  var year = dob.split('-')
                  year=year[0];
                  
                  var currentyear = new Date().getFullYear();
                  var age = currentyear - year;
                  return age;
                  }
function getDistance(dist){
    var d=parseInt(dist);
    if(d==0){
        d=dist*1000;
        d=parseInt(d)
        return d+' m.'
    }
    else{
     d=parseInt(dist)
        return d+' km.'
    }
}

/*

function _getCountry(){
	$.getJSON("http://54.86.103.211/api/rest/get-country", function(data) {
          _getProfession();
          $.each(data, function(key, val) {
                 $("#country_id,#country_name").append('<option value="' + key + '">' + val + '</option>');
                 $("#residence_country_id,#residence_countryid").append('<option value="' + key + '">' + val + '</option>');
                 
                 });
          });
}



function _getProfession(){
$.getJSON("http://54.86.103.211/api/rest/get-profession", function(data) {
          _getActivity();
          $.each(data, function(key, val) {
                 $("#profession_id,#professionid").append('<option value="' + key + '">' + val + '</option>');
                 });
          });
}

function _getActivity(){
$.getJSON("http://54.86.103.211/api/rest/get-activity", function(data) {
          _getIndustry();
          $.each(data, function(key, val) {
                 $("#activity_id,#activityid").append('<option value="' + key + '">' + val + '</option>');
                 });
          });
}

function _getIndustry(){
$.getJSON("http://54.86.103.211/api/rest/get-industry", function(data) {
          $.each(data, function(key, val) {
                 $("#industry_id,#industry_id").append('<option value="' + key + '">' + val + '</option>');
                 });
          });
}
*/


