<template>
  <h1>{{ status }}</h1>
  <p>Tap/click then say a color to change the background color of the app.</p>
  <div>
    <p class="output">
      <em>{{ output }}</em>
    </p>
  </div>
  <button @click="doStart">Start</button>
</template>

<script setup>
import { FilesetResolver, TextClassifier } from '@mediapipe/tasks-text'

if ('speechSynthesis' in window) {
  // Speech Synthesis supported 🎉
} else {
  // Speech Synthesis Not Supported 😣
  alert("Sorry, your browser doesn't support text to speech!")
}
const status = ref('Standby')
const output = ref('')
let recognization = new webkitSpeechRecognition()
recognization.onstart = () => {
  status.value = 'Listening...'
}
recognization.onresult = (e) => {
  var transcript = e.results[0][0].transcript
  var confidence = e.results[0][0].confidence
  output.value = transcript
}

async function createClassifier() {
  const textFiles = await FilesetResolver.forTextTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text@latest/wasm/'
  )
  textClassifier = await TextClassifier.createFromOptions(textFiles, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/text_classifier/bert_text_classifier.tflite`,
    },
    maxResults: 5,
  })
}
createClassifier()

const doStart = () => {
  // recognization.start()
  var msg = new SpeechSynthesisUtterance()
  msg.text = 'Hello World'
  window.speechSynthesis.speak(msg)
}
</script>
