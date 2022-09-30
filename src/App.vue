<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink, RouterView } from 'vue-router'

const isHomeLinkActive = ref(false)
const isFavouriteLinkActive = ref(false)

const route = useRoute()

watchEffect(() => {
  if(route.name === 'Home'){
    isHomeLinkActive.value = true
    isFavouriteLinkActive.value = false
  }
})

const selectedLink = (item: number) => {
  if(item === 1){
    isHomeLinkActive.value = true
    isFavouriteLinkActive.value = false
    }
  else if(item === 2){
    isHomeLinkActive.value = false
    isFavouriteLinkActive.value = true
  }
    
}
</script>

<template>
  <header>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <b-card>
            <b-nav pills>
              <RouterLink to="/" id="homeLinkId"  @click="selectedLink(1)"><b-nav-item :active="isHomeLinkActive">Home</b-nav-item></RouterLink>
              <RouterLink to="/favouritePokemonList" id="favouriteLinkId" @click="selectedLink(2)"><b-nav-item :active="isFavouriteLinkActive">Favourite</b-nav-item></RouterLink>       
            </b-nav>
          </b-card>
        </div>
      </div>
    </div>
  </header>

  <RouterView />

  <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <div class="container-fluid">
      © 2022 Fourtitude Asia
    </div>
  </footer>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

.active a{
  color: white;
}

nav a:first-of-type {
  border: 0;
}

a{
  text-decoration: none;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
