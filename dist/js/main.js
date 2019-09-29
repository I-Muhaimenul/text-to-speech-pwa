// init SpeechSynth API
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Init voices array
let voices = [];


const getVoices = () => {
    voices = synth.getVoices();
    console.log(voices)
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
}

//Line 35, 36 causes voice list duplication
// getVoices();
/*if (synth.onvoiceschanged !== undefined) {
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

const bgAnimation = () => {
    // background animation
    body.style.background = '#141414 url(./img/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';
}

// Speak 
const speak = () => {

    // Check if speaking
    if(synth.speaking) {
        console.log('Already speaking...');
        return;
    }
    if(textInput.value !== '') {
        // add background animation
        bgAnimation();

        // Get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);
            
        //speak end
        speakText.onend = e => {
            console.log('Done speaking...');
            body.style.background = '#141414';
        }

        // speak error
        speakText.onerror = e => {
            console.log('Something went wrong');
        }

        // selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
        
        // loop through voices
        voices.forEach(voice => {
            if(voice.name === selectedVoice){
                speakText.voice = voice;
            }
        });

        // set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        //speak
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
rate.addEventListener('change', e => rateValue.textContent = rate.value);

// Pitch value change
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);

//select voice change
voiceSelect.addEventListener('change', e => speak());
