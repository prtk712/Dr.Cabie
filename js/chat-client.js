var profile_picture_path=serverUrl+'media/picture/profile/no-image.jpg';
var socket = io.connect("http://54.86.103.211:8080");

function chatLogin(friends_list)
{
	console.log(friends_list);
	$("#chatlistuser tr").remove();
	if(friends_list.length==0){
        var nousertext=$('#chatConversation').find('.nouserlist').text()
		$("#chatlistuser").html("<tr class='nores' ><td class='col-xs-12 col-sm-12'>"+nousertext+"</td></tr>");
         $('#load_container').hide();
		return ;
	}
	for(var i=0;i<friends_list.length;i++){
		profile_picture_path=serverUrl+'media/picture/profile/no-image.jpg';	
		if(friends_list[i].profile_picture!="" &&  friends_list[i].profile_picture!=null){
			profile_picture_path=serverUrl+"media/picture/profile/100x100_"+friends_list[i].profile_picture;
		}
		var online_status="Offline";
		if(friends_list[i].online=='1'){
			online_status="Online";
		}
			
		var strRow='<tr data-target="chatConversation"  id="cmdChat_'+myId+'_'+friends_list[i].id+'"  user_id="'+friends_list[i].id+'" user_name="'+friends_list[i].first_name +" "+ friends_list[i].last_name +'" profile_picture_path="'+profile_picture_path+'"   >';
		strRow+='<td class="col-xs-2 chatButtonIn"><img src="'+profile_picture_path+'" /></td>';
		strRow+='<td class="col-xs-5 chatButtonIn">';
		strRow+='<span class="chat-name">'+friends_list[i].first_name +" "+ friends_list[i].last_name+'</span>';
		strRow+='<span class=" '+online_status+' chat-date" id="status_span_'+friends_list[i].id+'" >'+online_status+'</span>';
		//strRow+='<span class="chat-text">Add new field to enter the name of the meal i</span>';
		strRow+='</td>';   
		strRow+='<td class="col-xs-3" myid="'+myId+'" friendid="'+friends_list[i].id+'">';
		 strRow+='<span class="add_contact_member glyphicon glyphicon-plus" >&nbsp;</span>';
        strRow+='<span class="delete_chat_member delete_chat_friend glyphicon glyphicon-remove" >&nbsp;</span>';
		if(friends_list[i].has_offline_message=="1"){
			strRow+='<span class="offline_message_received_yes" ></span>';
		}else{
			strRow+='<span class="offline_message_received_no" ></span>';
		}
        if(localStorage.getItem(friends_list[i].id)){
           strRow+='<span class="online_message_received_yes" ></span>';
        }else{
           strRow+='<span class="online_message_received_no" ></span>';
        }
		
		strRow+='</td>';
		strRow+='</tr>';
        $("#chatlistuser").find('tr.nores').remove();
		$("#chatlistuser").append(strRow);
        $('#load_container').hide();
	}
}


jQuery(function($){
	
       $(document).on('click','.membernearlist,.membernearlist2', function(){
                      $('#load_container').show();
                      var sectionid=$(this).attr('data-target');
                      var friend_id=$(this).attr('user_id');
                      var user_name=$(this).attr('user_name');
                      var profile_picture_path=$(this).attr('profile_picture_path');
                      var chattext= $('#'+sectionid).find('.initiate-chat-button span').text();
                      $('#'+sectionid).find( ".initiate-chat-button" ).remove();
                      $('#'+sectionid).find("#button-list-chat").prepend('<li class="chatButton list-group-item initiate-chat-button"  data-target="chatConversation"  id="cmdChat_'+myId+'_'+friend_id+'"  user_id="'+friend_id+'" user_name="'+user_name  +'" profile_picture_path="'+profile_picture_path+'" ><span>'+chattext+'</span> <i class="glyphicon glyphicon-chevron-right"></i></li>');
                      $('#load_container').hide();
                      socket.emit("add_to_friend_list", {user_id: myId, friend_id: $(this).attr('user_id') },  function(status){
                                  if(status=="true"){
                                  
                                  }else{
                                  }
                                  });
                      
                      
                      
                      });
       
       
	

	$("#chat-link").click(function(){
		socket.emit('login', {user_id: myId}, chatLogin);
	
	});
	
	
	
	socket.on('user_goes_offline', function(data){
		console.log(data);
		$("#status_span_"+data.user_id).removeClass( "Online");
		$("#status_span_"+data.user_id).addClass( "Offline");
		$("#status_span_"+data.user_id).html("Offline");
		
		//var data_html = '<div id="offlinemess" class="row txt-friend pull-left col-xs-11"><span class="message">Your friend is not online at the moment. He will see your messages later</span></div>';
		//$(data_html).hide().appendTo('#message_box_'+myId+'_'+data.user_id).fadeIn();
		
		//keep scrolled to bottom of chat!
		//var scrolltoh = $('#message_box_'+myId+'_'+data.user_id)[0].scrollHeight;
		//$('#message_box_'+myId+'_'+data.user_id).scrollTop(scrolltoh);
		if($('#message_box_'+myId+'_'+data.user_id).length>0){
			var data_html ="<div id='offlinemess' class='row txt-friend pull-left col-xs-11'>Your friend is not online at the moment. He will see your messages later</div>";
			$(data_html).hide().appendTo('#message_box_'+myId+'_'+data.user_id).fadeIn();
			var scrolltoh = $('#message_box_'+myId+'_'+data.user_id)[0].scrollHeight;
			$('#message_box_'+myId+'_'+data.user_id).scrollTop(scrolltoh);
		}
	});
	
	socket.on('user_goes_online', function(data){
		$("#status_span_"+data.user_id).removeClass( "Offline");
		$("#status_span_"+data.user_id).addClass( "Online");
		$("#status_span_"+data.user_id).html("Online");
		//$("#cmdChat_"+myId+"_"+data.user_id).show();
		//var data_html ="<div id='onlinemess'>Now User is online</div>";
		//$(data_html).hide().appendTo('#message_box_'+myId+'_'+data.user_id).fadeIn();
		
		//var data_html = '<div id="onlinemess" class="row txt-friend pull-left col-xs-11"><span class="message">Now your friend is online.</span></div>';
		//$(data_html).hide().appendTo('#message_box_'+myId+'_'+data.user_id).fadeIn();
		
		//keep scrolled to bottom of chat!
		//var scrolltoh = $('#message_box_'+myId+'_'+data.user_id)[0].scrollHeight;
		//$('#message_box_'+myId+'_'+data.user_id).scrollTop(scrolltoh);
		if($('#message_box_'+myId+'_'+data.user_id).length>0){
			var data_html ="<div id='onlinemess' class='row txt-friend pull-left col-xs-11'>Now your friend is online.</div>";
			$(data_html).hide().appendTo('#message_box_'+myId+'_'+data.user_id).fadeIn();
			
			var scrolltoh = $('#message_box_'+myId+'_'+data.user_id)[0].scrollHeight;
			$('#message_box_'+myId+'_'+data.user_id).scrollTop(scrolltoh);
		}
	});
	   
	
       $("body").delegate(".chatButtonIn,.chatButton", "click",function(evt){
                          var netconnect =checkConnection2();
                          if(netconnect){
                          var id= $(this).parents('section').attr('id');
                          if(id=="notificationdetail"){
                          id="chat"
                          }

                          $('section').hide();
                          $("#chatConversation").show();
                          $("#chatConversation").find('.btn.btn-sm.btn-pink.pull-left').attr('data-target',id);
                          
                          if($(this).hasClass('chatButtonIn')){
                          var user_id=$(this).parents('tr').attr('user_id');//$(this).attr("user_id");
                          
                          var user_name=$(this).parents('tr').attr('user_name'); //$(this).attr("user_name");
                          
                          profile_picture_path=$(this).parents('tr').attr('profile_picture_path');//$(this).attr("profile_picture_path");
                          }else{
                          var user_id=$(this).attr("user_id");
                          var user_name=$(this).attr("user_name");
                          
                          profile_picture_path=$(this).attr("profile_picture_path");
                          }
                          
                          if($('#chat_box_'+user_id).length>0){
                          $("#chat_box_"+user_id).remove();
                          }
                          createChatBox(myId, user_id, user_name );
                          
                          }else{
            $("#popupNetworkFailed").modal('show');
             setTimeout(function() {
             $('#popupNetworkFailed').modal('hide');
             }, 2000);
            }
            });

	
	function createChatBox(myId, user_id, user_name){
		$("#master_container").html("");
       var placeholdertext = $("#master_container").attr('data-placeholdertext');
       
       var sendbtntext =    $("#master_container").attr('data-sendbttext');
       
       if(localStorage.getItem(user_id)){
            localStorage.removeItem(user_id);
            var onlineusers=localStorage.getItem('onlineusers').split(',');
            var index=$.inArray(user_id,onlineusers);
            if(index!=-1){
                onlineusers.splice(index,1);
            }
            localStorage.setItem('onlineusers',onlineusers);
            if(onlineusers.length==0){
                $('#chat-link').find('.counterflag').text(onlineusers.length).css({"visibility":"hidden"});
            }else{
                $('#chat-link').find('.counterflag').text(onlineusers.length).css({"visibility":"visible"});
            }
            if($('footer').find('.counterflag').css("visibility")=='visible'){
                var total_not=parseInt($('#chat').find('footer .counterflag').text())-1;
                if(total_not!=0){
                    $('footer').find('.counterflag').text(total_not).css({"visibility":"visible"});
                }else{
                    $('footer').find('.counterflag').text(total_not).css({"visibility":"hidden"});
                }
       }else{
       
       }
      
       
       $("#chatlistuser").find('tr[user_id="'+user_id+'"]').find('span.online_message_received_yes').removeClass('online_message_received_yes').addClass('online_message_received_no');
      
       $("#chatlistuser").find('tr[user_id="'+user_id+'"]').find('span').removeClass('offline_message_received_yes').addClass('offline_message_received_no');
       
       
       }
       $("#chatlistuser").find('tr[user_id="'+user_id+'"]').find('span').removeClass('offline_message_received_yes').addClass('offline_message_received_no');
       
		if($('#chat_box_'+user_id).length==0){
			var chat_box='<article class="col-xs-12 full"  id="chat_box_'+user_id+'" >';
			chat_box+=' <div class="content">';
       
			chat_box+='<div class="row" id="header_'+user_id+'">';               
			chat_box+='<div class="chat-friend">';
			chat_box+='<div class="col-xs-12">';
			  chat_box+='<div class="current-user-info txt-f-name">'+user_name+'</div>';
              chat_box+='<img class="userimg pull-left"  src="'+profile_picture_path+'" />';
            chat_box+='</div></div></div>';
	//		chat_box+='</div>';
	//		chat_box+='</div>';
			

       
       
			
			chat_box+='<div  style=" overflow:auto;" id="message_box_'+myId+"_"+user_id+'" class="row friendconvlist col-xs-12 message_box msgconversation chtconvcont"></div>';
						
			chat_box+='<div class="row row-grey" >';
			chat_box+='<div class="col-xs-12">';
			  chat_box+='<div class="row">';
			    chat_box+='<div class="col-xs-9"><textarea tabindex="-1" user_id="'+user_id+'" user_name="'+user_name+'"  name="shout_message_'+myId+"_"+user_id+'" id="shout_message_'+myId+"_"+user_id+'" type="text" class="form-control shout_message"  placeholder="'+placeholdertext+'" ></textarea></div>';
			    chat_box+='<div class="col-xs-3"><input type="button"  user_id="'+user_id+'" class="btn pull-left" id="messagebyme" value="'+sendbtntext+'" /></div>';
			  chat_box+='</div></div></div></div></article>';
			//chat_box+='</div>';
			//chat_box+='</div>';
           // chat_box+='</div>';
			//chat_box+='</article>';
			
       
      
      // alert(chat_box);
       var netconnect =checkConnection2();
       if(netconnect && chat_box!=''){
			$("#master_container").append(chat_box);
       }else{
       $("#popupNetworkFailed").modal('show');
       setTimeout(function() {
                  $('#popupNetworkFailed').modal('hide');
                  }, 2000);
       }

       var pageHeight = screen.height - 102;
       var pageHeight2 = pageHeight - (150);
       $("#chatConversation article .content").css({"height": (pageHeight) + "px" });
       $(".msgconversation").css({
               "height": pageHeight2 + "px"
        });
       
       
       $(window).on("orientationchange", function() {
                    var pageHeight = screen.height - 102;
                    var pageHeight2 = pageHeight - (150);
                    $("#chatConversation article .content").css({
                            "height": (pageHeight) + "px"
                    });
                    $(".msgconversation").css({
                     "height": pageHeight2 + "px"
                     });
        });
       
       
    
	
			
			socket.emit('chat_history', {user_id: myId,to_user_id: user_id,my_name:myName,user_name:user_name}, function(data){
				
				$('#message_box_'+myId+'_'+user_id).html('');
				for(var i=0; i<data.length;i++){

					var data_html=chatRow(data[i].sender_id, data[i].chat_time, data[i].user_name, data[i].chat_message);
					$(data_html).hide().appendTo('#message_box_'+myId+'_'+user_id).fadeIn();
				}
				//keep scrolled to bottom of chat!
				var scrolltoh = $('#message_box_'+myId+'_'+user_id)[0].scrollHeight;
				
				$('#message_box_'+myId+'_'+user_id).scrollTop(scrolltoh);
				
				//reset value of message box
				$('#shout_message_'+myId+'_'+user_id).val('');
				$('#shout_message_'+myId+'_'+user_id).focus();
			});
		}
		
		
	}
	//method to trigger when user hits enter key
	
	/*$("body").delegate(".shout_message", "keypress",function(evt){
		if(evt.which == 13) {
			var user_id=$(this).attr('user_id');
			postChatMessage(user_id);
		}
		
	});*/
	
	$("body").delegate("#messagebyme", "click",function(){
		var user_id=$(this).attr('user_id');
                       
		postChatMessage(user_id);
                       /*if($("footer").css('display')=='none'){
                       $("footer").show();
                       $('#chatConversation').find('.content').height($('#chatConversation').find('.content').height()-53)
                       $('#chatConversation').find('.msgconversation').height($('#chatConversation').find('.msgconversation').height()-53)
                       $('#abc').remove();
                       }*/
                       
	});
	
	function postChatMessage(user_id){
		var chat_message=$(".shout_message").val();
       if(chat_message!=''){
       
		socket.emit('post_message', {user_name:myName, chat_message: chat_message, to_user_id: user_id, from_user_id: myId});
       var data_html = '<div class="row txt-me pull-right col-xs-11"><span class="message">'+chat_message.replace(new RegExp('\r?\n','g'), '<br />')+'</span></div>';
       $(data_html).hide().appendTo('.msgconversation').fadeIn();
        $(".shout_message").val('');
       $('#show_progress').remove()
       }
      
	}
	
	$("body").delegate(".shout_message", "keyup",function(evt){
		var user_id=$(this).attr('user_id');
		var user_name=$(this).attr('user_name');
		//console.log(myName);
		var chat_message=$(this).val();
		socket.emit('write_message',{user_name:myName, chat_message: chat_message, to_user_id: user_id, from_user_id: myId});

	});
	
	socket.on("update_write_message", function(data){
		if($('#chat_box_'+data.from_user_id).length!=0){
			//$( "#show_progress" ).remove();
			if(data.chat_message.length>1)
			{
				data_html='<div id="show_progress" class="row txt-friend pull-left col-xs-11">'+data.user_name+ ' is writing...</div>';
              if($('#message_box_'+data.to_user_id+'_'+data.from_user_id).find('#show_progress').length==0){
                $(data_html).hide().appendTo('#message_box_'+data.to_user_id+'_'+data.from_user_id).fadeIn();
              }
              
              
				//$(data_html).hide().appendTo('#message_box_'+data.to_user_id+'_'+data.from_user_id).fadeIn();
				var scrolltoh = $('#message_box_'+data.to_user_id+'_'+data.from_user_id)[0].scrollHeight;
				$('#message_box_'+data.to_user_id+'_'+data.from_user_id).scrollTop(scrolltoh);
             
			}
		}
	});
	
	socket.on("update_chat_box", function(data){
		var to_user_id=data.to_user_id;
		var from_user_id=data.from_user_id;
             //
	//alert($('#message_box_'+to_user_id+'_'+from_user_id).length)
	//	console.log(to_user_id+','+from_user_id)
		//var data_html = '<div class="row  '+css_class+' col-xs-11"><time>Sender ID :'+data.from_user_id+' MyID: '+myId+' '+data.chat_time+'</time><span class="username">'+data.user_name+'</span><span class="message">'+data.chat_message+'</span></div>';
		var data_html=chatRow(data.sender_id, data.chat_time, data.user_name, data.chat_message);
       console.log(data_html)
		 //createChatBox(to_user_id, from_user_id, data.user_name);
		 if( $('#message_box_'+to_user_id+'_'+from_user_id).length>0 ){
			//append data into messagebox with jQuery fade effect!
              if(data.sender_id!=myId)
				$(data_html).hide().appendTo('#message_box_'+to_user_id+'_'+from_user_id).fadeIn();
				
				//keep scrolled to bottom of chat!
				var scrolltoh = $('#message_box_'+to_user_id+'_'+from_user_id)[0].scrollHeight;
				
				$('#message_box_'+to_user_id+'_'+from_user_id).scrollTop(scrolltoh);
				
				//reset value of message box
				//$('#shout_message_'+to_user_id+'_'+from_user_id).val('');
              
		 }
             
              if($('#message_box_'+to_user_id+'_'+from_user_id).length==0 || $('#message_box_'+to_user_id+'_'+from_user_id).parents('section').css('display')=='none'){
                      localStorage.setItem(from_user_id,'1');
                      if(localStorage.getItem('onlineusers')){
                          var onlineusers=localStorage.getItem('onlineusers').split(',');
                          var index=$.inArray(from_user_id,onlineusers);
                          if(index==-1){
                             onlineusers.push(from_user_id)
                             localStorage.setItem('onlineusers',onlineusers)
                          }
                     }else{
                          localStorage.setItem('onlineusers',from_user_id)
                     }
              
                     if($("#chatlistuser").find('tr[user_id="'+from_user_id+'"]').length){
                          $("#chatlistuser").find('tr[user_id="'+from_user_id+'"]').find('span.online_message_received_no').removeClass('online_message_received_no').addClass('online_message_received_yes');
                     }
                     if($('footer').find('.counterflag').css("visibility")=='visible'){
                        var total_not=parseInt($('#chat').find('footer .counterflag').text())+1;
                        $('#chat').find('footer .counterflag').text(total_not)
                     }else{
                        $('#chat').find('footer .counterflag').text("1").css({'visibility':'visible'})
                     }
              
                     if($('#chat-link').find('.counterflag').css("visibility")=='visible'){
                        var total_not=parseInt($('#chat-link').find('.counterflag').text())+1;
                        $('#chat-link').find('.counterflag').text(total_not)
                     }else{
                        $('#chat-link').find('.counterflag').text("1").css({'visibility':'visible'})
                     }
              
              
              
                }
              
              
              $( "#show_progress" ).remove();
		
	});

	function chatRow(sender_id, chat_time, user_name, chat_message)
	{
		var css_class="txt-me pull-right";
		if(sender_id!=myId){
			css_class="txt-friend pull-left";
       
		}
        var data_html = '<div class="row  '+css_class+' col-xs-11"><span class="message">'+chat_message.replace(new RegExp('\r?\n','g'), '<br />')+'</span></div>';
		//var data_html = '<div class="row  '+css_class+' col-xs-11"> <time>'+chat_time+'</time>  <span class="username">'+user_name+'</span>  <span class="message">'+chat_message+'</span></div>';
		
		return data_html;
	}
	
	//toggle hide/show shout box
	
	/*$("body").delegate(".close_btn", "click",closeButton);
	$("body").delegate(".open_btn", "click", closeButton);

	function closeButton(){
		var user_id=$(this).attr("user_id");
		//get CSS display state of .toggle_chat element
		var toggleState = $('#toggle_chat_'+user_id).css('display');
		
		//toggle show/hide chat box
		$('#toggle_chat_'+user_id).slideToggle();
		
		//use toggleState var to change close/open icon image
		if(toggleState == 'block')
		{
			$("#header_"+user_id+" div").attr('class', 'open_btn');
		}else{
			$("#header_"+user_id+" div").attr('class', 'close_btn');
		}
	}*/
       
       
       //$("#chatConversation article").css({"height":"auto"});
       var pageHeight = screen.height - 104;
       var pageHeight2 = pageHeight - (150); //alert(pageHeight2);
       //alert($(".msgconversation").length);
       $(".msgconversation").css({
                                 "height": pageHeight2 + "px"
                                 });
       //($(".msgconversation").height());
       
       
       
       
});
