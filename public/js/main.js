// Main front-end logic for Super Chatendo
// Requires: jQuery, socket.io

var modal;
var username = null;
var username_default = "Anonymous";
var socket = io();
var lobby_refresh = 10000;

/**
 * Handle general UI interactions.
 */
function eventsInterface() {

	// Participants toggle.
	$('.toggle_participants').click(function(){
		$('.participants').toggleClass('close');
		$('.chat').toggleClass('close');
	});

	// Send button.
	$("button.send").click(function() {
		// Only send if a username is set and something is in the chat box.
		if(username && $('.chat input').val()) {
			sendMessage();
		}
	});

	// Emote toggle.
	$("button.emotes").click(function() {
		$('div.emotes').fadeToggle(100, "linear");
		$("button.emotes").toggleClass("active");
	});

	// Insert emote into chat window.
	$("li.emoteclick").click(function() {
		$('.chat input').val($('.chat input').val() + ' ' + $(this).data().content);
		return false;
	});

	// Don't invoke form submit.
	$('form').submit(function(){
		return false;
	});

	// Don't invoke form submit.
	$('.chat form').submit(function(){
		return false;
	});
}

/**
 * Set up user username.
 */
function setUsername() {
	username = $('#username').val();
	username = username.trim();

	if (!username) {
		username = username_default;
	}

	socket.emit('useradd', username); // Tell the server your username.
	$('#modal').fadeOut();
	$('.chat input').focus();
}

/**
 * Send a message.
 */
function sendMessage() {
	socket.emit('chatmessage', { 'username': username, 'message': $('#m').val() });
	$('#m').val('');
}

/**
 * Request a room lobby update.
 */
function updateLobby() {
	socket.emit('userlist', { 'username': username });
	setTimeout(updateLobby, lobby_refresh);
}

/**
 * Handle Socket.io events.
 */
function eventsSocketIO() {
	socket.on('chatmessage', function(message){
		// Convert hex to RGB for alpha channel.
		rgb = hex2rgb(message.color);
		message.message = insertEmotes(message.message);		
		element = '<span class="name" style="background: rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',0.5);">'+message.username+'</span><span class="message">'+message.message+'</span>';
		$('#messages').append($('<li>').html(element));

		// Scroll.
		$(".chat").stop().animate({ scrollTop: $(".chat")[0].scrollHeight}, 1000);
	});
	socket.on('useradd', function(message){
		$('.participants').append($('<li>').text(message));
	});
	socket.on('userlist', function(message){
		$('.participants').empty();
		message = JSON.parse(message);
		message.sort();
		for (var i in message) {
			$('.participants').append($('<li>').text(message[i]));
		}
	});
}

/**
 * Utility to convert hex to rgb
 * @param {String} color Color to convert
 * @return Color
 */
function hex2rgb(hexStr){
    // note: hexStr should be #rrggbb
    var hex = parseInt(hexStr.substring(1), 16);
    var r = (hex & 0xff0000) >> 16;
    var g = (hex & 0x00ff00) >> 8;
    var b = hex & 0x0000ff;
    return [r, g, b];
}

// On document load.
$(document).ready(function() {
	// Populate emoticons.
	$('div.emotes').append(returnEmotes());

	eventsSocketIO();
	eventsInterface();
	updateLobby();

	// Login screen.
	modal = document.getElementById('modal');
	modal.style.display = "block";
	$('#modal input').focus();
});

// Handle enter key for modal.
$(document).keypress(function(e) {
	if(e.which == 13) {
		if (!username) {
			setUsername();
		}
	}
});
