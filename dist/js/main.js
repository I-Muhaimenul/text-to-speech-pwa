// Init SpeechSynth API
const synth = window.speechSynthesis;

// SpeechRecognition based on Firefox || Chrome
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

// Init SpeechRecognition API
let recognition = null;
if ('SpeechRecognition' in window) {
  // speech recognition API supported
  recognition = new window.SpeechRecognition();

  // setting recogntion config properties
  recognition.interimResults = true;
  recognition.maxAlternatives = 10;
  recognition.continuous = true;
}

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

const listenBtn = document.querySelector('#listen'); 

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1+
// var isChrome = !!window.chrome && !!window.chrome.webstore;
var isChrome = (!!window.chrome && !!window.chrome.webstore) || (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor))

// Init voices array
let voices = [];

const getVoices = () => {

  voices = synth.getVoices();

  // Loop through voices and create an option for each one
  voices.forEach(voice => {
    // Create option element
    const option = document.createElement('option');
    // Fill option with voice and language
    option.textContent = voice.name + '(' + voice.lang + ')';

    // Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};

//Line 35, 36 causes voice list duplication
/*getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}*/

//Fix for duplication, run code depending on the browser
if (isFirefox) {
    getVoices();
}
if (isChrome) {
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = getVoices;
    }
}

// Speak
const speak = () => {
  // stop listening
  stopListen()

  // Check if speaking
  if (synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  if (textInput.value !== '') {
    // Add background animation
    body.style.background = '#141414 url(img/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';

    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // Speak end
    speakText.onend = e => {
      console.log('Done speaking...');
      body.style.background = '#141414';
    };

    // Speak error
    speakText.onerror = e => {
      console.error('Something went wrong');
    };

    // Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
    );

    // Loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    // Speak
    synth.speak(speakText);
  }
};

// EVENT LISTENERS

// Text form submit
textForm.addEventListener('submit', e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Rate value change
rate.addEventListener('change', e => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener('change', e => (pitchValue.textContent = pitch.value));

// Voice select change
voiceSelect.addEventListener('change', e => speak());


// Speech recognition
const startListen = () => {
  if (!recognition) {
    console.error('Recognition not found...');
    return;
  }
  let finalTranscript = '';

    // initiate recognition with microphone permission
    recognition.onresult = (event) => {
        // const speechToText = event.results[0][0].transcript;
      let interimTranscript = '';
      for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
        let transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      textInput.value = finalTranscript + interimTranscript 
      // console.log(finalTranscript , interimTranscript )
    }
    recognition.start();
}

const stopListen = () => {
  console.log('Done listening')
  recognition.stop()
  listenBtn.innerHTML = 'Listen It'
    // console.log(recognition.stop())
}

// clicked on listen button
listenBtn.addEventListener('click', e => {
  // listenBtn.text('wee')
  let btnText = listenBtn.innerHTML
  if(btnText == 'Listen It') {
    startListen();
    listenBtn.innerHTML = 'Listening ...'
  } else {
    stopListen();
    listenBtn.innerHTML = 'Listen It' 
  }
  // console.log(listenBtn.innerHTML)
  // alert(23)
});