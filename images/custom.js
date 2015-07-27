
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








var admob_ios_key = 'ca-app-pub-4921720698061851/2582732720';
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
var ocrlanguage;


var serverUrl = "http://54.86.103.211/";
var myId = "";
var myName = "";
var socket = io.connect("http://54.86.103.211:3000");
var re = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;

var db = window.openDatabase("Menuscanner_DB", "1.0", "MenuScanner DB", 200000); //will create database Dummy_DB or open it
document.addEventListener("deviceready", onDeviceReady, false);
//document.addEventListener("pause", onPause, false);

function onPause() {
    db.transaction(function(tx) {
        tx.executeSql("DROP TABLE MenuScanner", [],
            function(tx, results) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS MenuScanner (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL, locallable TEXT NOT NULL,translatedlable TEXT NOT NULL)');
                console.log("Successfully DELETE")
            },
            function(tx, error) {
                console.log("Could not delete")
            }
        );
    })
}


function onloadbody() {

    // more callback to handle Ad events
    document.addEventListener('onReceiveAd', function() {
                              setTimeout(function(){
                                        $('#black_loader').hide();
                                         $('#home').show();
                                         },1000)
                              
                              
                              });
    document.addEventListener('onFailedToReceiveAd', function(data) {
                              $('#black_loader').hide();
                              $('.intro').show();
                              });
    document.addEventListener('onPresentAd', function() {
                              });
    document.addEventListener('onDismissAd', function() {
                              });
    document.addEventListener('onLeaveToAd', function() {
                              });
}

function onDeviceReady() {
    //  createAd();
   // showInterstitialAd()
    //showfullbannerad();
    //domlod();
    
    
    
    checkConnection();
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
              
    checkLanguage();
    updateLocation();
    checkConnection();
    db.transaction(populateDB, errorCB, successCB);
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
        $('#black_loader').hide();
        $('.intro').show();
    }
    else{
      //  $('section').hide();
      //  $('#black_loader').show();
    }
    // alert('Connection type: ' + states[networkState]);
}

function populateDB(tx) {

    //tx.executeSql('DROP TABLE MenuScanner');
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
        var default2 = {
            'publisherId': 'ca-app-pub-4921720698061851/2582732720',
            'adSize': AdMob.AD_SIZE.SMART_BANNER,
            'bannerAtTop': false
        }
        window.plugins.AdMob.createBannerView(default2, successfunction, errorfunction)
    } else {
        // alert('AdMob plugin not available/ready.');
    }
}

function successfunction() {
    window.plugins.AdMob.requestAd({
        'isTesting': true
    }, function() {
        window.plugins.AdMob.showAd(true, function() {}, function() {});
    }, function() {
        //   alert('failed to request ad');
    })
}

function errorfunction() {
    //alert("error");
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

function showInterstitialAd() {
    var am = window.plugins.AdMob;
    am.createInterstitialView({
            'publisherId': 'ca-app-pub-4921720698061851/2205799522',
        },
        function() {
            am.requestInterstitialAd({
                'isTesting': true
            }, function() {
                                     //   $('#black_loader').hide();
                                             //   $('#home').show();
                                     
                                     
                                     }, function() {
                                     $('#black_loader').hide();
                                     $('.intro').show();
                //       alert('failed to request ad');
            });
        },
        function() {
                              
                              $('#black_loader').hide();
                              $('.intro').show();
            // alert("Interstitial failed");
        }
    );
}

function showfullbannerad() {
    setTimeout(function() {
        showInterstitialAd()
    }, 0)
}

function capturePhoto() {
  //  boolflag = true;
    //$('#picText p.textresult').html(' ')
    $('#orderlist .table-bordered tbody').html(' ')
    var wid = $(window).width();
    var height = $(window).height()
    $('#target').attr('src','')
    
    
/*navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType : Camera.PictureSourceType.CAMERA,
        
    });*/
    
   
   /*
    quality : 75,
    destinationType : Camera.DestinationType.DATA_URL,
    sourceType : Camera.PictureSourceType.CAMERA,
    allowEdit : true,
encodingType: Camera.EncodingType.JPEG,
targetWidth: 100,
targetHeight: 100,
popoverOptions: CameraPopoverOptions,
saveToPhotoAlbum: false
 */
 
 
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


function seconcamera(){
              $('#addnew .text-dark').text('Enter meal name').addClass('blankstyle');
    $('#newmeallist tbody').find('img').attr('src','')
              navigator.camera.getPicture(onPhotoSuccess, onFail2, {
                                          quality: 50,
                                          destinationType: destinationType.FILE_URI,
                                          });
              
              }


              
function onPhotoSuccess(imageURI){

              $('#newmeallist tbody').find('img').attr('src',imageURI)
              
              }

function onPhotoURISuccess(imageURI) {
              $('#target').attr('src',imageURI)
              //var randnum = new Date().getTime()
              //var smallImage = document.getElementById('target');
    
//    smallImage.src = imageURI+'?'+randnum;
  //  alert(imageURI+'?'+randnum)
    $('section').hide()
    $('#camerapic').show();
              
              
              
              
              
  //  if (boolflag) {
      //  boolflag = false;
        //croppic(imageURI);

    //}

    

    //    $("#load_container").show();
    $('#picText p.textresult').html(' ')
    $('#orderlist .table-bordered tbody').html(' ')
        //  callNativePlugin({url_imagen: imageURI,'language': ocrlanguage });
}

function croppic(imageURI) {

    

    
    // $("#popupcrophelp").modal('show');
    // setTimeout(function() {$('#popupcrophelp').modal('hide');}, 5000);
    if ($('.jcrop-holder').length) {
        JcropAPI = $('#target').data('Jcrop');
        JcropAPI.destroy();
        $('.usephoto').css({
            'display': 'none'
        })
    }

    $('#camerapic').find('#target').Jcrop({
        onChange: updatePreview,
        onSelect: updatePreview,
        aspectRatio: 16 / 9,
        onRelease: function() {
            $('.usephoto').hide();
        }
    });

}

function updatePreview(c) {
    if (parseInt(c.w) > 0) {
        // Show image preview
        var imageObj = $("#target")[0];
        var canvas = $("#preview")[0];
        var w = c.w;
        var h = c.h;
        //if($('.usephoto').offset().left+)
        //c.y-$('.usephoto').outerHeight()-5
        if ($('#camerapic header').outerHeight() < (c.y - $('.usephoto').outerHeight() - 5 + 60)) {
            $('.usephoto').css({
                'display': 'block',
                'top': (c.y - $('.usephoto').outerHeight() - 5 + 60),
                'left': (c.x + 10)
            })
        } else {
            $('.usephoto').css({
                'display': 'block',
                'top': (c.y + c.h + 5),
                'left': (c.x + 10)
            })
        }
        $("#preview").attr({
            'width': w,
            'height': h
        })
        var context = canvas.getContext("2d");
        context.drawImage(imageObj, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height);
        var image = new Image();
        image.id = "pic"
        image.src = canvas.toDataURL();
        $('#image_for_crop').empty().html(image);

    }

};


function onFail(message) {
    // alert('Failed because:' + message);
 //   $('section').hide();
   // $('#home').css('display', 'block');

}
              
              function onFail2(){
              $('section').hide();
              $('#gallery').css('display', 'block');
              }
              

function callNativePlugin(returnSuccess) {

    OCRPlugin.callNativeFunction(nativePluginResultHandler, nativePluginErrorHandler, returnSuccess);
}

function nativePluginResultHandler(result) {
    //  alert(result);
   
    
    $('#search-load_container').hide()

 //   $("#load_container").hide();
    $('section').hide();
    $('#picText').show();
 //   result=result.replace('-','').replace('\'','').replace('"','').replace('_','').replace(',','').replace('~','').replace('!','').replace('*','');
  //  result=result.replace('%','').replace('#','').replace('>','').replace('<','').replace(';','').replace('$','').replace('.','').replace('=','').replace(':','').replace('+','');
        //result=result.replace(/\n\n\n\n/g, '<br>');
    result=result.replace(/\n\n\n/g, '@@@@@@');
    result=result.replace(/\n\n/g, '@@@@@@');
    result=result.replace(/\n/g, '@@@@@@');
    result=result.replace(/\t/g, '@@@@@@');
    
    result=result.replace(/[^a-zA-Z0-9@]/g, ' ');
    result=result.replace(/@@@@@@/g, '<br>');
    $('#picText p.textresult').html(result);
    $('.usephoto').text('Use Selection');
    // resultado.innerHTML = result;
}

function nativePluginErrorHandler(error) {
    $('#search-load_container').hide();
   // $("#load_container").hide();
    $('.usephoto').text('Use Selection').hide();
    //alert("error on getting text:please click again "+error);
    $("#popupOCR").modal('show');
    setTimeout(function() {
        $('#popupOCR').modal('hide');
    }, 2000);

}

function checkLanguage() {
    navigator.globalization.getPreferredLanguage(
        function(language) {
            devicelanguage = language.value;
            //  alert('language: ' + language.value + '\n');
        },
        function() {
            //alert('Error getting language\n');
        }
    );
}




var imageSearch;
              google.load('search', '1');
             
function searchComplete() {
    $('.countimg').text(imageSearch.results.length)
    if (imageSearch.results && imageSearch.results.length > 0) {
        $(".noresultf").hide();
        var results = imageSearch.results;
        var str = '<div class="row">';
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            str += '<div class="col-xs-6 clicktoorder"><div class="img-boxc"><img class="" src="' + result.tbUrl + '" /></div><button class="addtoorder btn btn-sm btn-block " data-target="orderlist"><i class="glyphicon glyphicon-plus"></i>Add To Orderlist</button></div>'
        }
        str = str + '</div>'
        $('#searchimglist').empty().html(str)
    } else {
        $(".noresultf").show();
        //alert('no result found')
    }

}

  google.setOnLoadCallback(OnLoad);
function OnLoad(value) {
    //  alert(value)
    // Create an Image Search instance.
    imageSearch = new google.search.ImageSearch();
    //  alert(imageSearch)
    // imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE, google.search.ImageSearch.IMAGESIZE_EXTRA_LARGE);
    imageSearch.setResultSetSize(google.search.Search.LARGE_RESULTSET);
    // alert(imageSearch)
    imageSearch.setSearchCompleteCallback(this, searchComplete, null);
    // Find me a beautiful car.
    //   alert(value)
    imageSearch.execute(value);
    // Include the required Google branding
    // google.search.Search.getBranding('branding');
}


var selectionEndTimeout = null;
// bind selection change event to my function
document.onselectionchange = userSelectionChanged;

function userSelectionChanged() {
    // wait 500 ms after the last selection change event
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
                    var diff = x + $('.tooltip').outerWidth(true) - $(window).width();
                    $('.tooltip').show().css({
                        'left': x - diff,
                        'top': y - 30
                    })
                } else {
                    $('.tooltip').show().css({
                        'left': x,
                        'top': y - 30
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
                    'top': y - 27
                })
            } else {
                $('.tooltip').show().css({
                    'left': x,
                    'top': y - 27
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


/*$(document.body).bind('touchend', function(e){
                      var selection;
                      
                      if (window.getSelection) {
                      selection = window.getSelection();
                      } else if (document.selection) {
                      selection = document.selection.createRange();
                      }
                      
                      selection.toString() !== '' && alert('"' + selection.toString() + '" was selected at ' + e.pageX + '/' + e.pageY);
                      });*/



function DownloadFile(URL, Folder_Name, File_Name) {
    //Parameters mismatch check
    if (URL == null && Folder_Name == null && File_Name == null) {
        return;
    } else {
        //checking Internet connection availablity
        var networkState = navigator.connection.type;
              download(URL, Folder_Name, File_Name);
        /*if (networkState == Connection.NONE) {
            return;
        } else {
            download(URL, Folder_Name, File_Name); //If available download function call
        }*/
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
        //  alert(download_link)
        //  alert(fp)
        filetransfer(download_link, fp);
    }

    function onDirectorySuccess(parent) {
        console.log('Directory created successfuly')
    }

    function onDirectoryFail(error) {
        //Error while creating directory
                console.log("Unable to create new directory: " + error.code);
    }

    function fileSystemFail(evt) {
        //Unable to access file system
             console.log('File system failed' + evt.target.error.code);
    }
}

function filetransfer(download_link, fp) {
    var fileTransfer = new FileTransfer();
    // File download function with URL and local path
    //   alert(fileTransfer)
    fileTransfer.download(download_link, fp,
        function(entry) {
                          console.log(entry.fullPath);
                          console.log(translatedtext)
            db.transaction(function(tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS MenuScanner (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL, locallable TEXT NOT NULL,translatedlable TEXT NOT NULL)');           
                tx.executeSql('INSERT INTO MenuScanner (path,locallable,translatedlable) VALUES (?,?, ?)', [entry.fullPath, selectedText, translatedtext], function(tx,results) {
                    console.log(results.insertId)
                    getfilesfromdirctory()
                });
                tx.executeSql('INSERT INTO Menumasterlist (path,locallable,translatedlable) VALUES (?,?, ?)', [entry.fullPath, selectedText, translatedtext], function(tx,results) {
                              var mealid=results.insertId;
                              tx.executeSql('INSERT INTO Languagemaster (mealid,langdesc) VALUES (?, ?)', [mealid, translatedtext], function() {});
                              });




            });

        },
        function(error) {
            //Download abort errors or download failed errors
            console.log("download error source " + error.source);
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
                    str += '<tr><td class="col-xs-9"><p class="text-dark">' + results.rows.item(i).locallable + '</p><p class="text-light">' + results.rows.item(i).translatedlable + '</p></td><td class="col-xs-3"><img class="img-responsive" src="' + results.rows.item(i).path + '" /></td></tr>'
                }
                $('#orderlist .table-bordered tbody').html(str)
            }
        }, null);
    });

    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);

}

function translate() {
    var text = selectedText;
    $('.tooltip').hide();
    //  alert(devicelanguage)
    var languageTo = devicelanguage;
    var s1 = document.createElement("script");
    s1.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?oncomplete=mycallback&appId=68D088969D79A8B23AF8585CC83EBA2A05A97651&from&to=" + languageTo + "&text=" + text;
    var s2 = document.createElement("script");
    s2.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Detect?oncomplete=mycallbackdetect&appId=68D088969D79A8B23AF8585CC83EBA2A05A97651&text=" + text;
    document.getElementsByTagName("head")[0].appendChild(s1);
    document.getElementsByTagName("head")[0].appendChild(s2);
    window.mycallback = function(response) {
        translatedtext = response;
        //   alert(response)
    }
    window.mycallbackdetect = function(response) {
        //   alert(response)
        var languageCodes = '["' + response + '"]'
        var s3 = document.createElement("script");
        s3.src = "http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguageNames?oncomplete=mycallbacklang&appId=68D088969D79A8B23AF8585CC83EBA2A05A97651&locale=en&languageCodes=" + languageCodes;
        document.getElementsByTagName("head")[0].appendChild(s3);
    }
    window.mycallbacklang = function(response) {
        //   alert(response)
    }


}





var successCallback = function(position) {
    var x = position.coords.latitude;
    var y = position.coords.longitude;
    $('#latitude').val(x)
    $('#longitude').val(y)
    localStorage.setItem('locationx', x)
    localStorage.setItem('locationy', y)
        //alert(x);
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
};
var successlatlong = function(position) {
    var x = position.coords.latitude;
    var y = position.coords.longitude;
    $('#latitude').val(x)
    $('#longitude').val(y)
    localStorage.setItem('locationx', x)
    localStorage.setItem('locationy', y)
    displayLocation(x, y)
        //alert(x);


    if (localStorage.getItem('userid')) {
        var form_url = "http://54.86.103.211/api/rest/update_location/" + localStorage.getItem('userid');
        var data = {
            'latitude': x,
            'longitude': y
        }
        $.ajax({
            url: form_url,
            type: 'POST',
            data: data,
            success: function(data) {
                console.log(data)
            },
            error: function(data) {}
        })
    }

};

function updateLocation() {
    navigator.geolocation.getCurrentPosition(successlatlong, errorCallback);
}

function displayLocation(latitude, longitude) {
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
};

function findlanguage(country_name) {
    var index = $.inArray(country_name, country)
    ocrlanguage = language[index]

}


$(document).ready(function(e) {
                  var oldname;
                  var rowid;
                   showInterstitialAd()
    // function domload(){
    $(".txtresetol").hide();
    $("button").bind('click', function(e) {
        e.preventDefault();


        var getID = $(this).attr("data-target");

        if (getID == "orderlist") {
            $("#orderlistbackbtn").hide();
            getfilesfromdirctory();
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



    //if(navigator.geolocation){
    //   alert(111)
    // navigator.geolocation.getCurrentPosition(successCallback,errorCallback);
    //	}
    if (localStorage.getItem('userid')) {
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
                  
                  
                  /*--code added by ritesh--*/
                  myId = localStorage.getItem("userid");;
                  myName = localStorage.getItem('userfirstname') + " " + localStorage.getItem('userlastname');
                  socket.emit('login', {
                              user_id: myId
                              }, chatLogin);
                  /*--code added by ritesh--*/
                  
                  

    }
    if (localStorage.getItem('locationx')) {
        $('#latitude').val(localStorage.getItem('locationx'))

    }
    if (localStorage.getItem('locationy')) {
        $('#longitude').val(localStorage.getItem('locationy'))
    }



    $.getJSON("http://54.86.103.211/api/rest/get-country", function(data) {
        $.each(data, function(key, val) {
            $("#country_id,#country_name").append('<option value="' + key + '">' + val + '</option>');
            $("#residence_country_id,#residence_countryid").append('<option value="' + key + '">' + val + '</option>');

        });
    });

    $.getJSON("http://54.86.103.211/api/rest/get-profession", function(data) {
        $.each(data, function(key, val) {
            $("#profession_id,#professionid").append('<option value="' + key + '">' + val + '</option>');
        });
    });

    $.getJSON("http://54.86.103.211/api/rest/get-activity", function(data) {
        $.each(data, function(key, val) {
            $("#activity_id,#activityid").append('<option value="' + key + '">' + val + '</option>');
        });
    });

    $.getJSON("http://54.86.103.211/api/rest/get-industry", function(data) {
        $.each(data, function(key, val) {
            $("#industry_id,#industry_id").append('<option value="' + key + '">' + val + '</option>');
        });
    });

    $('input[type=file]').bootstrapFileInput();
                  
                //  $("#file-input-wrapper").attr(width:$('#changeMealPic').next('img').attr('width')+'px');
                //  $("#file-input-wrapper").attr(height:$('#changeMealPic').next('img').attr('height')+'px');
   /* $('.file-inputs').bootstrapFileInput();*/

            

                  
                  
    $("#orderlist").on("click", ".meal", function() {
        var getID = $(this).attr("data-target");
        if (getID != "#") {
            $("section").hide();
            $("#" + getID).show();
        }
    });

    $(".list-group-item").bind("click", function() {
        if (!$(this).hasClass('disabled')) {
            var getID = $(this).attr("data-target");
            if (getID != "#") {
                $("section").hide();
                $("#" + getID).show();
            }
        }
    });




    $("select").change(function() {
        $(this).next("span").hide();
    });
    
                  
    $("input, select, .txtresetol").focus(function() {
        $('body').addClass('fixfixed');
    });
 
                  $(".txtresetol").blur(function() {
                                         window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
                                         document.activeElement.blur();
                                         });
                  
                  
  $(".txtresetol").focus(function() {
             $('body').addClass('fixfixed');
   });
                  
                  $("input[type='search']").focus(function() {
                                           $('body').addClass('fixfixed');
                                           });
                  $("input[type='search']").blur(function() {
                                                 $('body').removeClass('fixfixed');
                                                  });
                  
    $("input, select, .txtresetol").blur(function() {
        $('body').removeClass('fixfixed');
    });
                  
              
                  
                 
                  
                  
    // var pageHeight = $(window).height() - ($('header').outerHeight(true)+$('footer').outerHeight(true) );
    //alert($(window).height() );
    var pageHeight = $(window).height() - 104;
    var pageHeight_camera = $(window).height() - 52;
    var pageHeight2 = pageHeight - (100);
    //alert(pageHeight);
    $("article .content").not("#chatConversation article .content").css({
        "height": pageHeight + "px"
    });
    $("#chatConversation article .content").css({
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


    $(window).on("orientationchange", function() {
        var pageHeight = $(window).height() - 104;
        var pageHeight2 = pageHeight - (100);
        //alert(pageHeight);
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
    });

    $("#messagebyme").click(function() {
        var memsg = $("#txtmsgbyme").val();
        //$("#msgconversation").append('<div class="row txt-me pull-right col-xs-11">' + memsg + '</div>');
        //$("#txtmsgbyme").val("");
    });

    $("#chatlistuser").on("click", "tr", function() {
        var getID = $(this).attr("data-target");
        if (getID != "#") {
            $("section").hide();
            $("#" + getID).show();
        }
    });
                  
                  
                  $(document).on("click", "#reportabusebtnn", function() {
                                 $('#idvalue').val($(this).parents('section').attr('id'))
                                 $("#reportlist").find("li").removeClass("added");
                   });
                  
                  $(document).on('click','#chatreport',function(){
                                 $('#idvalue').val($(this).parents('section').attr('id'))
                                 $('#reportlist li').removeClass('added')
                                 })
                  
                  $(document).on("click", "#forcontactpage", function(){
                                 $("#contactmsg").find('textarea').val("");
                                 });
                  $(document).on("click", "#btn_login2", function(){
                                 $("#loginuser").find('input[type="text"], input[type="password"]').val("");
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
        if (localStorage.getItem("userid")) {
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
    });

    $("#resetPasswordu").click(function() {
        $("#formresetpwd").find("#oldpassword").val("");
        $("#formresetpwd").find("#newpassword").val("");
        $("#formresetpwd").find("#cnewpassword").val("");
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
            $("#load_container").show();
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
            return false;
        }

        return false;
    });
    
                  
                  $(document).on('click','.backsendgreet',function(){
                                 $('section').hide();
                                 var id=$('#idval').val();
                                 $('#'+id).show();
                                 
                                 })


    $('.delete-acct').bind('click', function() {

      //  var getConfirm = confirm("");
                           jConfirm('Are you sure you want to delete your account ?', 'Confirmation', function(r) {
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
                                           console.log(qxhr)
                                           $('#load_container').hide()
                                           //   alert("error delete "+txtStatus);
                                           }
                                           
                                           
                                           })
                                    
                                    }
                                    });

    })

    $('#getprofile').bind('click', function() {
                          $("#updateuserdetail").find("input[type='text'], input[type='file'], input[type='date'], input[type='password'] , input[type='email'], select, .ui-autocomplete-input").val("");
                          $(".file-input-name").html("");
                          $('input[name="gender"]').prop('checked', false);
                           $("#afteruserimgt2").find("img").attr("src","images/no-image.jpg"); 
                          
        if (localStorage.getItem('userid')) {
            $("#load_container").show();
            var id = localStorage.getItem('userid');
                          var form_url = 'http://54.86.103.211/api/rest/get-profile' + '/' + id;
                          
            $.ajax({
                url: form_url,
                type: 'POST',
                success: function(data) {
                    $("#load_container").hide();
                    console.log(data)
                    var rnd_no = Math.floor((Math.random() * 1000000) + 1);
                    $('#getimg').attr('src', data.user_profile.profile_picture_thumbnail + "?" + rnd_no)
                        //$('#getuserdetail').find('input[value="'+data.user_profile.gender+'"]').prop('checked',true);
                    $('input[name=gender][value=' + data.user_profile.gender + ']').prop('checked', true);
                    $('#f_name').val(data.user_profile.first_name);
                    $('#l_name').val(data.user_profile.last_name);
                    $('#email_id').val(data.user_profile.email);
                   $('#country_name').next().find('input').val($('#country_name option[value="' + data.user_profile.country_id + '"]').text());
                   $('#residence_countryid').next().find('input').val($('#residence_countryid option[value="' + data.user_profile.residence_country_id + '"]').text())
                   // $('#residence_countryid option[value="' + data.user_profile.residence_country_id + '"]').attr("selected", "selected");
                   
                    $('#professionid option[value="' + data.user_profile.profession_id + '"]').prop("selected", "selected");
                    $('#activityid option[value="' + data.user_profile.activity_id + '"]').prop("selected", "selected");
                    $('#industry_id option[value="' + data.user_profile.industry_id + '"]').prop("selected", "selected");

                    $('#date_of_birth').val(data.user_profile.dob);
                    //alert(data.user_profile.profile_picture_thumbnail)
                },
                   error:function(){
                    $("#load_container").hide();
                   }


            })
        }
        //    else{
        //    $('section').hide();
        //    $('#signup').show();
        //    }
    })


    $('section').click(function(e) {
        if (!$(e.target).closest('.tooltip').length) {
            $(".tooltip").hide();

        }

    });




    $(document).on('click', '.clicktoorder', function(e) {
        e.preventDefault()
        filePath = $(this).find('.img-boxc img').attr('src')
        filename = 'pic' + new Date().getTime();

        DownloadFile(filePath, 'PicMeal', filename)
        $("#orderlistbackbtn").show();
        $("section").hide();
        $("#orderlist").show();

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
        // translate()
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
      //  google.load('search', '1');
      //  google.setOnLoadCallback(OnLoad);
             $('.noresultf').hide()
        $('#searchimglist').empty()
        translate()

        //   alert(selectedText)
        OnLoad(selectedText);
        $('.tooltip').hide();
        $("section").hide();
        $('#picmealfound').show();
        $('#picmealfound .searchtext').text(selectedText)
    });

    $('.inputbox span').bind('click', function() {
    //     google.load('search', '1');
                             $('#searchimglist').empty();
                              $('.noresultf').hide()
        var val = $('.inputbox input').val();
        google.setOnLoadCallback(OnLoad);
        translate()
        OnLoad(val);
        $('.tooltip').hide();
        $("section").hide();
        $('#picmealfound').show();
        $('#picmealfound .searchtext').text(val)
        $('.inputbox').hide()
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
                    console.log(data)
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
            //alert('Please Login before access this service')
        
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
                           window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
                           document.activeElement.blur();


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
                    console.log(data)
                    $("#load_container").hide();
                    var obj = JSON.parse(data)
                    if (obj.hasOwnProperty('fail')) {
                        //     alert(obj.fail);
                        $("#popupLoginFailed .modal-body h4").html(obj.fail);
                        $("#popupLoginFailed").modal('show');

                        setTimeout(function() {
                            $('#popupLoginFailed').modal('hide');
                        }, 2000);


                    } else {
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

                        //$("#popupLogin").modal('show');
                        //setTimeout(function() {$('#popupLogin').modal('hide');}, 4000);
                    }
                    $('#login').find('#username').val('')
                    $('#login').find('#password').val('')

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + " , " + errorThrown);
                    //alert("error "+textStatus);
                    return false;
                }
            });
        }
        return false;


    });

    $('#image_for_crop').bind('click', function() {
        var imageURI = $('#target').attr('src');
        callNativePlugin({
            url_imagen: imageURI,
            'language': ocrlanguage
        });
    })
    $('.usephoto').bind('click', function() {
        // $("#load_container").show();
        //$(this).html('Scanning...');
        setTimeout(function() {
                $('#image_for_crop').trigger('click');
            }, 1000)
            //  
    })
            
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
                    //$('#orderlist .table-bordered').hide();
                    if (len < 1) {
                          $('#gallerylist').hide();
                         $('#noresultlist').show()
                    } else {
                        $('#noresultlist').hide()
                        $('#gallerylist ').show();
                        var i;
                          var str='';
                          for (i = 0; i < len; i++){
                            str +='<tr data-id="'+results.rows.item(i).id+'"><td class="col-xs-9"><p class="text-dark">'+results.rows.item(i).locallable+'</p><p class="text-light">'+results.rows.item(i).translatedlable+'</p></td><td class="col-xs-3 editgallery"><img class="img-responsive" src="'+results.rows.item(i).path+'" /></td></tr>'
                          }
                          $('#gallerylist tbody').html(str)
                   /*     var str = '<div class="row">';
                        for (var i = 0; i < len; i++) {
                            str += '<div class="col-xs-6"><div class="img-boxc"><img class="" src="' + results.rows.item(i).path + '" /></div><button class="addtoorderlist btn btn-sm btn-block " data-target="orderlist"><i class="glyphicon glyphicon-plus"></i>Add To Orderlist</button><span class="local1">' + results.rows.item(i).locallable + '</span><span class="translated1">' + results.rows.item(i).translatedlable + '</span></div>'
                        }
                        str = str + '</div>'
                        $('#searchimglistol').html(str).show();*/

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
                $("#popupupdate").modal('show');
                setTimeout(function() {
                    $('#popupupdate').modal('hide');
                }, 2000);
                console.log(data);
                //$("section").hide();
                //$("#"+"setting").show();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //alert("error "+textStatus);
                $("#load_container").hide();
                return false;
            }
        });

        return false;

    });
                  
   


                  
                  
    $("#csignupbtn").bind("click", function() {
                          $("#registeruser").find("input[type='text'], input[type='file'], input[type='date'], input[type='password'] , input[type='email'], select, .ui-autocomplete-input").val("");
                          $(".file-input-name").html("");
        $('input[name="gender"]').prop('checked', false);
                           $("#afteruserimgt").find("img").attr("src","images/no-image.jpg");   
                          
    });

    $("#registeruser").submit(function(e) {e.preventDefault();
        $("div.error").hide();
        $("#erroruserpic").hide();
        /*  if($("#registeruser").find("#profile_picture").val()==""){
                    $("#erroruserpic").show();
                    return false;
                 } */
                              
        if($('#genderfemale').prop('checked')==false && $('#gendermale').prop('checked')==false ){
                    $("#registeruser").find("#gendermale").parent().nextAll("div.error").show();
                    return false;
                 }
        else if ($("#registeruser").find("#first_name").val() == "") {
            $("#registeruser").find("#first_name").next("div").show();
            return false;
        } else if ($("#registeruser").find("#last_name").val() == "") {
            $("#registeruser").find("#last_name").next("div").show();
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
        } else if ($("#registeruser").find("#dob").val() == "") {
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
        } else {

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
                    console.log(data + textStatus);

                    $("#load_container").hide();
                    var obj = JSON.parse(data)
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

            return false;
        }
        return false;
    });

                  $('#clearconversation').bind('click',function(){
                                               if(localStorage.getItem('userid')){
                                               jConfirm('Are you sure you want to delete all the conversation ?', 'Confirmation', function(r) {
                                                        if(r){
                                                        var userid=localStorage.getItem('userid');
                                                        var data={user_id:userid}
                                                        var formURL = "http://54.86.103.211/api/rest/clear-conversation";
                                                        $.ajax({
                                                               url:formURL,
                                                               type:'POST',
                                                               data:data,
                                                               success:function(data){
                                                               $('#clearconver').modal('show')
                                                               setTimeout(function(){$('#clearconver').modal('hide')},2000)
                                                               //  alert(data.success)
                                                               }
                                                               })
                                                        
                                                        }
                                                        
                                                        })
                                               }
                                               })
                  $(document).on('click','#findnearbyusers',function(){
                                 if(localStorage.getItem('userid')){
                                 var user_id=localStorage.getItem('userid');
                                 var formURL = "http://54.86.103.211/api/rest/members-near-by-me/"+user_id;
                                 $.ajax({url:formURL,
                                        type:'GET',
                                        dataType :'json',
                                        success:function(data){
                                        var str=''
                                        $.each(data.members,function(key,val){
                                             //  alert(val.online)
                                               var online_status=(parseInt(val.online)?'online':'offline');
                                              // alert(online_status)
                                               str += '<li class="list-group-item membernearlist row" data-target="membernearbydetail"  user_id="'+val.id+'" user_name="'+val.first_name +" "+ val.last_name +'" profile_picture_path="'+val.profile_picture_thumbnail+'"     ><div class="col-md-12 col-sm-12 col-xs-12"><img class="pill-left" src="'+val.profile_picture_thumbnail+'" /> <div class="current-user-info "><p class="membername">'+val.first_name+' '+val.last_name+'</p><p class="small">'+val.gender+','+getAge(val.dob)+','+val.country_name+','+val.profession_title+' ,within '+parseInt(val.distance)+' km</p></div><i class="arrowicon glyphicon glyphicon-chevron-right pull-right"></i><span class="memuserid">'+val.id+'</span><span class="'+online_status+'">'+online_status+'</span></div></li> '
                                               })
                                        $('#userlist').html(str)
                                        
                                        },
                                        error:function(jqXHR, textStatus, errorThrown){
                                        console.log(jqXHR)
                                        console.log(textStatus)
                                        console.log(errorThrown)
                                        }	 
                                        
                                        })
                                 }									
                                 })
                  
                  function getAge(dob){
                  var year = dob.split('-')
                  year=year[0];
                  
                  var currentyear = new Date().getFullYear();
                  var age = currentyear - year;
                  return age;
                  }
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
                  
                  $(document).on('click','.membernearlist2',function(){
                                 var name=$(this).find('.membername').text();
                                 var imgpath=$(this).find('img').attr('src');
                                 $('#chatbydetail').find('#memid').text($(this).find('.memuserid').text())
                                 $('#chatbydetail').find('.imguser img').attr('src',imgpath)
                                 $('#chatbydetail').find('.imguser .current-user-info .current-user-info-name').text(name);
                                 $('#chatbydetail').find('.imguser p.small').text($(this).find('p.small').text())
                                 $("section").hide();
                                 $("#chatbydetail").show();
                                 
                                 })
                  
                  
                  $('#reportlist li').bind('click',function(){
                                           $(this).toggleClass('added');
                                           if($('#reportlist li.added').length){
                                           $('.sendreportabusesuccess').removeClass('disabled')
                                           }
                                           else{
                                           $('.sendreportabusesuccess').addClass('disabled')
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
                                                                             reportedItem.push($(this).text())
                                                                             }
                                                                             });
                                                    var reported_by_user_id=localStorage.getItem('userid');
                                                    var reported_to_user_id=$('#membernearbydetail').find('#memid').text();
                                                    var  reported_item=reportedItem
                                                    var data={reported_by_user_id:reported_by_user_id,reported_to_user_id:reported_to_user_id,report_type:reported_item}
                                                    var formURL = "http://54.86.103.211/api/rest/report-to-abuse";
                                                    $.ajax({url:formURL,
                                                           type:'POST',
                                                           data:data,
                                                           success:function(data){
                                                           data=JSON.stringify(data)
                                                           $('section').hide();
                                                           $('#reportabusesuccess').show()
                                                           },
                                                           error:function(data){
                                                           console.log('error')
                                                           $('#reportabusesuccess').show()
                                                           }	
                                                           
                                                           })
                                                    });
                  $('.reportab').bind('click',function(){
                                      $('#reportlist li').removeClass('added')
                                      
                                      })
                  
                  
                  $('.fileclick').bind('click',function(){
                                       $('.changeMealPic').click()
                                       })
                  
                  $('.changeMealPic').change(function(){
                                          //   alert(destinationType.FILE_URI)
                                         //    var oldpic=$('#managePicMeal').find('#travmealpic img').attr('src');
                                         //    getImageURI($(this).val())
                                          //   alert(destinationType)
                                         //   var path =
                                        //  alert($(this).val())
                                      //alert(oldpic)
                                       //$('#managePicMeal').find('#travmealpic img').attr('src',$(this).val())
                                             })
                  
                  $('.gallery').bind('click',function(){
                                     
                                     db.transaction(function(tx) {
                                                    tx.executeSql('SELECT * FROM Menumasterlist', [], function(tx, results) {
                                                                  var len = results.rows.length,
                                                                  i;
                                                                  if (len < 1) {
                                                                  //$('.rowheader').hide();
                                                                  
                                                                  //<img class="img-responsive" src="' + results.rows.item(i).path+'?'+rnd_no+ '" />
                                                                  $('#gallerylist thead').hide()
                                                                  } else {
                                                                  $('#gallerylist thead').show();
                                                                  var str = '';
                                                                  for (i = 0; i < len; i++) {
                                                                   var rnd_no = Math.floor((Math.random() * 1000000) + 1);
                                                                  str += '<tr data-id="'+results.rows.item(i).id+'"><td class="col-xs-9"><p class="text-dark">' + results.rows.item(i).locallable + '</p><p class="text-light">' + results.rows.item(i).translatedlable + '</p></td><td class="col-xs-3 editgallery"><img class="img-responsive" src="' + results.rows.item(i).path+ '" /></td></tr>'
                                                                  }
                                                                  $('#gallerylist tbody').html(str)
                                                                  }
                                                                  }, null);
                                                    });
                                     
                                     });
                  
              
                  
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
                                                                var str='<tr class="langrow" data-id="'+results.rows.item(j).id+'"><td class="col-xs-9"><p class="text-light">'+results.rows.item(j).langdesc+'</p></td><td class="col-xs-3"><button data-target="#" class="btn btn-sm btn-pink btnedit">E</button><br/><button data-target="#" class="btn btn-sm btn-pink langdelete">X</button></td></tr>'
                                                                }
                                                                else{
                                                                var str='<tr class="langrow newrow" data-id="'+results.rows.item(j).id+'"><td class="col-xs-9"><p class="text-light">'+results.rows.item(j).langdesc+'</p></td><td class="col-xs-3"><button data-target="#" class="btn btn-sm btn-pink btnedit">E</button><br/><button data-target="#" class="btn btn-sm btn-pink langdelete">X</button></td></tr>'
                                                                }
                                                                $('#tab-mpicMeal').find('.lasrow').before(str)
                                                                }
                                                                })
                                                })
                                 
                                   //$('#mealnamelang1').parents('tr').remove();
                                 //  var str='<tr class="langrow"><td class="col-xs-9"><p class="text-light">'+$parent.find('.text-light').text()+'</p></td><td class="col-xs-3"><button data-target="#" class="btn btn-sm btn-pink btnedit">E</button><br/><button data-target="#" class="btn btn-sm btn-pink langdelete">X</button></td></tr>'
                                 
                                 
                            //     }
                                 $('section').hide();
                                 $('#managePicMeal').show()
                                 
                                 })
                  
                  $(document).on('click','.addlang',function(){
                            //     $('#tab-mpicMeal').find('tr.langrow').remove();
                                 var temptext='Please enter name of the meal';
                                  db.transaction(function(tx){
                                            tx.executeSql('INSERT INTO Languagemaster (mealid,langdesc) VALUES (?, ?)', [rowid, temptext], function() {});
                                                 tx.executeSql('SELECT * FROM Languagemaster WHERE mealid=?',[rowid],function(tx,results){
                                                               var len = results.rows.length
                                                               for(var j=0;j<len;j++){
                                                               var idd=results.rows.item(j).id;
                                                               var str='<tr class="langrow newrow" data-id="'+results.rows.item(j).id+'"><td class="col-xs-9"><p class="text-light">'+results.rows.item(j).langdesc+'</p></td><td class="col-xs-3"><button data-target="#" class="btn btn-sm btn-pink btnedit">E</button><br/><button data-target="#" class="btn btn-sm btn-pink langdelete">X</button></td></tr>';
                                                               if($('#managePicMeal').find('tr.langrow[data-id="'+idd+'"]').length==0){
                                                                  $('#tab-mpicMeal').find('.lasrow').before(str)
                                                               }
                                                               }
                                                               })
                                                })
                                 
                                 
                                 
                                 })
                  
                  
                  /*
                   
                   <tr>
                   <td class="col-xs-9">
                   <p id="mealnamelang1" class="text-light">Name of the meal in language 2</p>
                   </td>
                   <td class="col-xs-3">
                   <button data-target="#" class="btn btn-sm btn-pink btnedit">E</button><br/>
                   <button data-target="#" class="btn btn-sm btn-pink langdelete">X</button>
                   
                   </td>
                   </tr>
                   
                   */
                  
                  
                  
                  $(document).on('click','.canceledit',function(){
                                       // alert($('#managePicMeal').find('p[contentEditable="true"]').length)
                              $('#managePicMeal').find('p[contentEditable="true"]').attr('contentEditable',false);
                              //  $('.gallery').trigger('click')
                                 $('section').hide()
                                 $('#gallery').show();
                                        
                                        })
                  $(document).on('click','.saveedit',function(){
                                 var obj = $('#managePicMeal').find('p[contentEditable="true"]').parents('tr')
                                      var newname= $('#managePicMeal').find('p[contentEditable="true"]').text()
                                   db.transaction(function(tx) {
                                                  if(!obj.hasClass('newrow')){
                                                  //alert(6565)
                                           tx.executeSql("UPDATE Menumasterlist SET translatedlable=? WHERE id = ?", [newname,rowid]);
                                                  }
                                   tx.executeSql("UPDATE Languagemaster SET langdesc=? WHERE id = ?", [newname,tempid]);
                                                  })
                                 
                                       $('#managePicMeal').find('p[contentEditable="true"]').attr('contentEditable',false);
                                       $('.gallery').trigger('click')
                                 });
                  
                  
                  $(document).on('click','.sendgreeting',function(){
                                 if($('#txtsendgreeting').val()==''){
                                 $('#errorsndgrt').modal('show');
                                 setTimeout(function(){ $('#errorsndgrt').modal('hide');},2000)
                                 }else{
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
                                        alert('error')
                                        }
                                        })
                                 
                                 }
                                 })
                  
                  $(document).on('click','.deletedit',function(){
                                 var obj=$(this)
                                 jConfirm('Are you sure you want to delete this selected meal ?', 'Confirmation', function(r) {
                                          if(r==true){
                                          db.transaction(function(tx) {
                                                         tx.executeSql("DELETE FROM Menumasterlist  WHERE id = ?", [rowid]);
                                                         tx.executeSql("DELETE FROM Languagemaster  WHERE mealid = ?", [rowid]);
                                                         obj.parents('tr').remove();
                                                         $('.gallery').trigger('click')
                                                         //  $('section').hide();
                                                         //  $('#gallery').show();
                                                         })
                                          }
                                          })
                                 
                                 })
                  
                  //langdelete
                  $(document).on('click','.langdelete',function(){
                                 var obj=$(this).parent().parent()
                                 var dleid = $(this).parents('tr').attr('data-id')
                                 jConfirm('Are You sure you want to delete this entry ?', 'Confirmation', function(r) {
                                          if(r){
                                          var val='';
                                          db.transaction(function(tx) {
                                                         if(!obj.hasClass('newrow')){
                                                         tx.executeSql("UPDATE Menumasterlist SET translatedlable=? WHERE id = ?", [val,rowid]);
                                                         }
                                                         tx.executeSql("DELETE FROM Languagemaster  WHERE id = ?", [dleid])
                                                         obj.remove();
                                                         })
                                          //  $('.gallery').trigger('click')
                                          
                                          }
                                          
                                          })
                                 
                                 })
                  
                  
                  $(document).on("click",".btnedit" ,function(){
                                 $(this).parents('section').find('p[contentEditable="true"]').attr('contentEditable',false)
                                 tempid = $(this).parents('tr').attr('data-id')
                                 $(this).parent().prev('td').find('p').attr('contentEditable',true);
                                 $('#managePicMeal').find('p[contentEditable="true"]').focus();
                                 oldname=$(this).parent().prev('td').find('p').text();
                                 //$(this).attr('contentEditable',true);
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
                                     if($(this).text()=="Enter meal name"){
                                            $(this).text("");
                                            $(this).removeClass('blankstyle')
                                      }
                                 
                                 })
                  
                  
                  $(document).on('blur','#newmeallist .text-dark',function(){
                                 $(this).attr('contenteditable',false)
                                 if($(this).text()==""){
                                 $(this).text("Enter meal name");
                                 $(this).addClass('blankstyle')
                                 }
                                 
                                 })
                  
                  
                  $(document).on('click','#findallUsers',function(){
                                 $("section").hide();
                                 $("#allcontactlists").show();
                                 if(localStorage.getItem('userid')){
                                 var user_id=localStorage.getItem('userid');
                                 var formURL = "http://54.86.103.211/api/rest/contacts/"+user_id;
                                 $.ajax({url:formURL,
                                        type:'GET',
                                        dataType :'json',
                                        success:function(data){
                                        var str=''
                                        $.each(data.members,function(key,val){
                                                var online_status=(parseInt(val.online)?'online':'offline');
                                             //  alert(online_status)
                                               str += '<li class="list-group-item membernearlist2 row" data-target="chat"><div class="col-md-12 col-sm-12 col-xs-12"><img class="pill-left" src="'+val.profile_picture_thumbnail+'" /> <div class="current-user-info "><p class="membername">'+val.first_name+' '+val.last_name+'</p><p class="small">'+val.gender+','+getAge(val.dob)+','+val.country_name+','+val.profession_title+'</p></div><i class="arrowicon glyphicon glyphicon-chevron-right pull-right"></i><span class="memuserid">'+val.id+'</span><span class="'+online_status+'">'+online_status+'</span></div></li> '
                                               })
                                        $('#allcontactslist').html(str)
                                        
                                        },
                                        error:function(jqXHR, textStatus, errorThrown){
                                        console.log(jqXHR)
                                        console.log(textStatus)
                                        console.log(errorThrown)
                                        }	 
                                        
                                        })
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
                  
                  
                  $(document).on('focus', 'input,textarea, select', function(){
                        $("footer").hide();
                  })
                  
                  $(document).on('blur', 'input,textarea, select', function(){
                        $("footer").show();
                  })
                  
                  
                  
});

function sendtoocr(){
    //$("#load_container").show();
    $('#search-load_container').show();
    setTimeout(function(){
           
               var imageURI = $('#target').attr('src');
               callNativePlugin({
                                url_imagen: imageURI,
                                'language': ocrlanguage
                                });
               
               
               
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
              var filename = $('#travmealpic img').attr('src');
              filename = filename.split('/')
              filename = filename[filename.length-1].split('.');
              filename =filename[0]
              $('#travmealpic img').attr('src',imageURI);
              
             // DownloadFile(filePath, 'PicMeal', filename)
              
              downloadtogallery(filePath, 'PicMeal', filename)
              }
              function downloadtogallery(URL,Folder_Name,File_Name){
              //Parameters mismatch check
              if (URL == null && Folder_Name == null && File_Name == null) {
              return;
              } else {
              //checking Internet connection availablity
              var networkState = navigator.connection.type;
              if (networkState == Connection.NONE) {
              return;
              } else {
              //step to request a file system
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
              // filetransfer(download_link, fp);
              var fileTransfer = new FileTransfer();
              fileTransfer.download(download_link, fp,
                                    function(entry) {
                                    console.log("download complete: " + entry.fullPath);
                                    var randnum=new Date().getTime()
                                    var obj=$('#gallerylist img[src="'+entry.fullPath+'"]')
                                    obj.attr('src',entry.fullPath+'?'+randnum)
                                    obj.attr('src',entry.fullPath)
                                    },
                                    function(error) {
                                    });
              }
              
              function onDirectorySuccess1(parent) {
              // Directory created successfuly
              }
              
              function onDirectoryFail1(error) {
              //Error while creating directory
              //        alert("Unable to create new directory: " + error.code);
              }
              
              function fileSystemFail1(evt) {
              //Unable to access file system
              //      alert(evt.target.error.code);
              }
              
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
        //var img = document.getElementById("#profile_temp_file");
        img.classList.add("obj");
        img.classList.add("center-block");
        
        img.file = file;
        $(".file-input-name").hide();
        //$(fileInput).after(img);
        
        //$("#afteruserimgt").empty().html(img);
        // $("#afteruserimgt").html("");
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
