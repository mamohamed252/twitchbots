// API Google Translate
const gtrans = require('googletrans').default;

const tr_lang = {
  'de': ['de', 'says'],
  'en': ['en', 'says'],
  'fr': ['fr', 'says'],
  'pt': ['pt', 'says'],
  'es': ['es', 'says'],
  'pa': ['pa', 'says'],
  'zu': ['zu', 'says'],
  'ar': ['ar', 'says'],
  'tl': ['tl', 'says'], 
  'ko': ['ko', 'says'], 
  'ja': ['ja', 'says'], 
  'km': ['km', 'says'], 
  'so': ['so', 'says'], 
  
}

// Called every time a message comes in
function languageBotCommands(client, target, context, msg, self, commandArray) {
  try {

    // Ignore messages from the bot
    if (self) { return; }

    // Remove whitespace from chat message
    let tMsg = msg.trim();

    // Check if the message starts with @name
    // in that case, extract the name and move the @name at the end of the message, and process
    if (tMsg[0] === '@') {
      let atnameEndIndex = tMsg.indexOf(' ');
      let atname = tMsg.substring(0, atnameEndIndex);
      let msg = tMsg.substring(atnameEndIndex + 1);
      tMsg = msg + ' ' + atname;
      console.info('Changed message :', tMsg);
    }

    // Filter commands (options)
    if (commandArray[1][0] != '!') return; // if first character in second command is not an exclamation stop program
    
    // Extract command
    let cmd = commandArray[1].substring(1).toLowerCase(); // removes the exclamation from command

    // Name for answering
    let answername = '@' + context['display-name'];

    // Command for displaying the commands (in english)
    if (cmd === "lang" || cmd === "translate") {
      client.say(target, 'I can (approximatevely) translate your messages in many languages. Simply start your message with one of these commands: !en (english) !fr (french)  !de (german) !pt (portuguese)... ');
      return;
    }

   

    // Commands for displaying messages explaining the translation feature in various languages
    // TODO: sentences
    const explanations = {
      //    'germans': '',
      //    'spanish': '',
      'french': 'Vous pouvez utiliser notre bot traducteur. Commencez votre message par !en pour traduire votre message en anglais. Par exemple "!en Bonjour"',
    }
    if (cmd in explanations) {
      client.say(target, explanations[cmd]);
      return;
    }

    if (cmd in tr_lang) {
      var ll = tr_lang[cmd];
      //console.error(ll);
      var txt = tMsg.substring(commandArray[0].length + commandArray[1].length + 2); // removes first two commands from the translated message

      // Text must be at least 2 characters and max 200 characters
      var lazy = false;
      if (txt.length > 2) {
        if (txt.length > 200) {
          lazy = true;
          txt = "i'm too lazy to translate long sentences ^^";
        }

        // Lazy mode, and english target => no translation, only displays 'lazy' message in english
        if ((lazy === true) && (ll[0].indexOf('en') == 0)) {
          say(target, context['display-name'] + ', ' + txt);
          return;
        }
        

        // Translate text
        gtrans(txt, { to: ll[0] }).then(res => {
          if (lazy === true) {
            // lazy mode sentence in english and also in requested language
            client.say(target, context['display-name'] + ', ' + txt + '/' + res.text);
          }
          else {
            // Translation
            // TODO: Check is translated text == original text. In that case it
            // means the command was not correctly used (ex: "!en hello friends")
            client.say(target, context['display-name'] + ' ' + ll[1] + ': ' + res.text);
          }
        }).catch(err => {
          console.error('Translation Error:', err);
        })
      }
    }
  }
  catch (e) {
    console.error(e.stack);
  }
}

exports.languageBotCommands = languageBotCommands