<template>
  <div class="mx-auto max-w-md space-y-6 mt-16">
    <div class="space-y-2 text-center">
      <h1 class="text-3xl font-bold">Cover Letter Generator</h1>
      <p class="text-zinc-500 dark:text-zinc-400">
        Enter your details to generate a personalized cover letter
      </p>
    </div>
    <div class="space-y-4">
      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          for="name"
          >Name</label
        ><input
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="name"
          v-model="fields.name"
          placeholder="Enter your name"
          required
        />
      </div>
      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          for="position"
          >Position</label
        ><input
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="position"
          v-model="fields.position"
          placeholder="Enter the position you're applying for"
          required
        />
      </div>
      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          for="company"
          >Company</label
        ><input
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="company"
          v-model="fields.company"
          placeholder="Enter the company name"
          required
        />
      </div>
      <button
        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
        type="submit"
      >
        Generate Cover Letter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const fields = ref({
  name: '',
  position: '',
  company: '',
})
</script>
