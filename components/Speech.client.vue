<template>
  <h1>{{ status }}</h1>
  <p>{{ inputText }}</p>
  <div>
    <p class="output">
      <em>{{ result }}</em>
    </p>
  </div>
  <button @click="doStart">Start</button>
</template>

<script setup lang="ts">
import {
  TextClassifier,
  FilesetResolver,
} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text@0.10.0'

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
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text@0.10.0/wasm'
  )
  return await TextClassifier.createFromOptions(textFiles, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/text_classifier/bert_text_classifier.tflite`,
    },
    maxResults: 5,
  })
}
const textClassifier = await createClassifier()

const inputText = 'Please set a reminder for calling mom at 2 pm.'

// Wait to run the function until inner text is set
const result = await textClassifier.classify(inputText)

console.log(result)

const doStart = () => {
  // recognization.start()
  var msg = new SpeechSynthesisUtterance()
  msg.text = 'Hello World'
  window.speechSynthesis.speak(msg)
}
</script>
