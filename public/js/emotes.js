// Emotes for Super Chatendo

var emotes = {
	"BAWLS":"bawls.png",
	"LINUS":"linus.png",
	"RAZER":"razer.png",
	"BLINKY":"ghost.png",
};

/**
 * Insert emotes into message using emote dictionary.
 */
function insertEmotes(message) {
	for (var key in emotes) {
		if(emotes.hasOwnProperty(key)) {
			var regex = new RegExp(key, 'g');
			message = message.replace(regex, " <img title='"+key+"' src='/images/emotes/"+emotes[key]+"'/> ");
		}
	}
	
	return message;
}

/**
 * Generate emotes list for emote selector.
 */
function returnEmotes() {
	var output = '';

	for (var key in emotes) {
		if(emotes.hasOwnProperty(key)) {
			output = output + " <li class='emoteclick' data-content='"+key+"'><img title='"+key+"' src='/images/emotes/"+emotes[key]+"'/></li> ";
		}
	}

	return output;
}
