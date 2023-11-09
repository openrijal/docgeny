<template>
    <!-- start: hero section -->
    <UCard>
    <template #header>
      <Placeholder class="h-8" />
    </template>

    <Placeholder class="h-32" />

    <template #footer>
      <Placeholder class="h-8" />
    </template>
  </UCard>
  <!-- end: hero section -->

  <UDivider />

  <!-- start: features section -->
  <UInput name="search" placeholder="what service would you like" color="primary" variant="outline" v-model="search_term" />

  <div class="grid grid-cols-4 gap-4">
    <div>
        <UCard>
            <template #header>
            Cover Letter <UBadge color="secondary">$5</UBadge>
            </template>

            A fully customized package for your next job application.
        
            <template #footer>
                <UButton
                icon="i-heroicons-pencil-square"
                size="sm"
                color="primary"
                variant="solid"
                label="Try Now"
                :trailing="false"
                to="/coverLetter"
                />
            </template>
        </UCard>
    </div>
    
    <div>
        <UCard>
            <template #header>
            H1B Application Letter
            </template>

            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non cumque unde ipsam consectetur quae odio beatae velit id mollitia nesciunt, magni asperiores quas quisquam nisi! Incidunt, iste. Suscipit, aperiam praesentium.

            <template #footer>
                <UButton
                icon="i-heroicons-pencil-square"
                size="sm"
                color="primary"
                variant="solid"
                label="Button"
                :trailing="false"
                />
            </template>
        </UCard>
    </div>

    <div>
        <UCard>
            <template #header>
            GMAT Essay
            </template>

            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate ab repudiandae earum pariatur veniam ipsum nam sunt delectus vitae! Aut ratione porro blanditiis harum ipsa quia dolorem odit facere eum!

            <template #footer>
            <UButton>Try This!</UButton>
            </template>
        </UCard>
    </div>

    <div>
        <UCard>
            <template #header>
            High School Essay
            </template>

            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum quidem molestias commodi ea esse, hic illo voluptatibus officiis repellat, veritatis consequatur maxime repudiandae sint doloribus autem, porro placeat provident? Aliquid!

            <template #footer>
            <UButton>Try This!</UButton>
            </template>
        </UCard>
    </div>

    <div>
        <UCard>
            <template #header>
            NIW Application
            </template>

            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates assumenda iste fugit hic inventore, perspiciatis recusandae alias? Possimus reiciendis deleniti, quaerat rem eligendi minima incidunt temporibus! Aut sunt necessitatibus expedita.

            <template #footer>
            <UButton>Try This!</UButton>
            </template>
        </UCard>
    </div>
  </div>
  

  <!-- end: features section -->
</template>

<script setup>
const search_term = ref('')
</script>   