'use strict';

const socket = io();

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');
//const clientMsg = document.getElementById("textdiv").value;
var textStr = "";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;


var textdiv = document.getElementById("textdiv");
textdiv.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        //validate(e);
 e.preventDefault();
textStr += "You: ";
	textStr += document.getElementById("textdiv").value;
	textStr += "\n";
	console.log(textStr);
	document.getElementById("displaydiv").value = textStr;
var clientMsg = document.getElementById("textdiv").value;
  socket.emit('chat message', clientMsg);

    }
});


document.getElementById('microBtn').addEventListener('click', () => {
  recognition.start();
});
document.getElementById('sendBtn').addEventListener('click', () => {
  var clientMsg = document.getElementById("textdiv").value;
  socket.emit('chat message', clientMsg);
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

function sendClientMsg(){
	textStr += "You: ";
	textStr += document.getElementById("textdiv").value;
	textStr += "\n";
	console.log(textStr);
	document.getElementById("displaydiv").value = textStr;
}
recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  //outputYou.textContent = text;
  document.getElementById("textdiv").value = text;
  console.log('Confidence: ' + e.results[0][0].confidence);
    textStr += "You: ";
	textStr += document.getElementById("textdiv").value;
	textStr += "\n";
	console.log(text);
	document.getElementById("displaydiv").value = text;
  socket.emit('chat message', text);
  
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
  synthVoice(replyText);
  textStr += "Bot replied: "
  textStr += replyText;
  textStr += "\n";
  outputBot.textContent = replyText;
  document.getElementById("displaydiv").value = textStr;
  document.getElementById("textdiv").value = "";
  if(replyText == '') {
  replyText = '(No answer...)';
  outputBot.textContent = replyText;
  textStr += "Bot replied: "
  textStr += replyText;
  textStr += "\n";
  document.getElementById("displaydiv").value = textStr;
  document.getElementById("textdiv").value = "";
  }
});