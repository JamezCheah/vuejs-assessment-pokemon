import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PokemonDetail from '../views/PokemonDetail.vue'
import FavouritePokemons from '../views/favouritePokemonListView.vue'
import PageNotFoundView from '../views/PageNotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/pokemonDetail/:id',
      name: 'Pokemon Detail',
      component: PokemonDetail
    },
    {
      path: '/favouritePokemonList',
      name: 'Favourite Pokemons',
      component: FavouritePokemons
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Not Found Page',
      component: PageNotFoundView
    }
  ]
})

export default router
