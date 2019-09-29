window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
if ('SpeechRecognition' in window) {
    // speech recognition API supported
    let finalTranscript = '';
    const recognition = new window.SpeechRecognition();

    // setting recogntion config properties
    recognition.interimResults = true;
    recognition.maxAlternatives = 10;
    recognition.continuous = true;

    // initite recognition with microphoen permission
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
      console.log(finalTranscript , interimTranscript )
    }
      recognition.start();
      textInput.value = 'hello'
      console.log(textInput.value)
  } else {
      alert(false)
    // speech recognition API not supported
  }