<template>
  <article>
    <div class="text-center">
      <h1>Pokedex</h1>
    </div>
    <section>
      <SearchAndFilterComponent @pokemon-type="type => pokemonTypeSelected = type" @search-pokemon="toSearch => searchPokemon = toSearch"></SearchAndFilterComponent>
      <div class="container">
        <b-card>
          <div class="row">
            <div class="col-md-8"></div>
            <div class="col-md-2">
                <div class="mt-2 float-end">Sort: </div>
            </div>
            <div class="col-md-2">            
                <b-form-select v-model="sortSelected" :options="sortOptions"></b-form-select>
            </div>
          </div>
        </b-card>
      </div>
      <PokemonListingComponent v-if="isFound" :pokemonList='pokemonList'></PokemonListingComponent>
      <div class="container" v-if="!isFound">
        <div class="row">
          <div class="col-md-12">
            <h3>Pokemon Not Found!</h3>
          </div>
        </div>
      </div>
      <div class="container">
          <div class="row">
              <div class="col-md-12">
                <b-card>
                  <div class="overflow-auto py-2">
                    <b-pagination
                      v-model="ex1CurrentPage"
                      :total-rows="ex1Rows"
                      :per-page="ex1PerPage"
                      first-text="First"
                      prev-text="Prev"
                      next-text="Next"
                      last-text="Last"
                    ></b-pagination>
                  </div>
                </b-card>
              </div>
          </div>
        </div>
    </section>
  </article>
</template>

<script setup lang="ts">
  import { watch, ref } from 'vue'
  
  import router from '@/router';
  import PokemonListingComponent from '../components/PokemonListingComponent.vue'  
  import SearchAndFilterComponent from '../components/SearchAndFilterComponent.vue'
  import { default as PokemonAPI }  from '../services/service-proxies';
  import type { Pokemon, PokemonList, PokemonDetail } from '../modal/pokemon.modal'

  const pokemonList = ref<Pokemon[]>();

  const isFound = ref(true)
  const pokemonTypeSelected = ref('')
  const allPokemonTypesOptions = ref([])
  const ex1CurrentPage = ref(1)
  const ex1PerPage = 15
  const ex1Rows = ref(0)

  const sortOptions = [
    {value: 'asc', text: 'Ascending'},
    {value: 'desc', text: 'Descending'},
  ]
  
  const sortSelected = ref('asc')
  const searchPokemon = ref('')

  watch(searchPokemon, async (newPokemon, oldPokemon) => {
    const pokemon = newPokemon
   
    if(pokemon === ''){
      isFound.value = true
      const result = PokemonAPI.getAllPokemonList(0)

      result.then((res: PokemonList) => {
        ex1Rows.value = res.totalCount
        
        pokemonList.value = res.pokemons.sort((a, b) => {
          if(a.id > b.id) {
            return 1;
          } else if(a.id < b.id) {
            return -1;
          } else {
            return 0;
          }
        })

        pokemonList.value.map((pokemon: Pokemon) => {
          let favouritePokemonList: Pokemon[] = JSON.parse(localStorage.getItem('Favourite') || '[]')

          if(favouritePokemonList.some(x => x.id == pokemon.id))
            pokemon.isFavourite = true
          else
            pokemon.isFavourite = false
        })
      })
    }
    else{
      PokemonAPI.getPokemon(pokemon)
        .then((response: PokemonDetail) => {
          console.log(response)
          if(response){
            const pokemon: Pokemon = {
              id: response.id,
              name: response.name,
              types: response.type,
              picture: response.picture
            }

            const pokemons : Pokemon[] = []

            pokemons.push(pokemon)

            pokemonList.value = pokemons
            ex1Rows.value = 1
          }
        })
        .catch((error: any) => {
          isFound.value = false
          console.log(error)
        })
    }
  })

  const clearSearchParameter = () => {
    searchPokemon.value = ''
  }

  

  const pokemonClicked = (id: string) => {
    // Direct Pokemon Detail page
    router.push({path: '/pokemonDetail/' + id })
  }

  const favouritePokemon = (pokemon : Pokemon) => {
    let favouritePokemonList: Pokemon[] = JSON.parse(localStorage.getItem('Favourite') || '[]')

    if(!favouritePokemonList.some(x => x.id == pokemon.id))
      favouritePokemonList.push(pokemon)


    localStorage.setItem('Favourite', JSON.stringify(favouritePokemonList));
    pokemon.isFavourite = true
  }

  const unfavouritePokemon = (pokemonToUnfavourite : Pokemon) => {
    let favouritePokemonList: Pokemon[] = JSON.parse(localStorage.getItem('Favourite') || '[]')

    favouritePokemonList = favouritePokemonList.filter((pokemon) => {
      return pokemon.id !== pokemonToUnfavourite.id
    })

    localStorage.setItem('Favourite', JSON.stringify(favouritePokemonList));
    pokemonToUnfavourite.isFavourite = false
  }

  watch(ex1CurrentPage, async (newPage, oldPage) => {
    const result = PokemonAPI.getAllPokemonList(0, pokemonTypeSelected.value, 100000, sortSelected.value)

    result.then((res: PokemonList) => {      
      pokemonList.value = res.pokemons.splice((newPage-1)*ex1PerPage, ex1PerPage)

      pokemonList.value.map((pokemon: Pokemon) => {
        let favouritePokemonList: Pokemon[] = JSON.parse(localStorage.getItem('Favourite') || '[]')

        if(favouritePokemonList.some(x => x.id == pokemon.id))
          pokemon.isFavourite = true
        else
          pokemon.isFavourite = false
      })

    })
  })
 
  watch(sortSelected, async (newSort, oldSort) => {
    PokemonAPI.getAllPokemonList(0, pokemonTypeSelected.value, 10000, newSort)
      .then((response: PokemonList) => {
        ex1CurrentPage.value = 0
        pokemonList.value = response.pokemons.splice(0, ex1PerPage)
      })
  })

  watch(pokemonTypeSelected, async (newType, oldType) => {
    const result = PokemonAPI.getAllPokemonList(0, newType, 100000, sortSelected.value)

    result.then((res: PokemonList) => {   
      ex1Rows.value = res.pokemons.length   
      pokemonList.value = res.pokemons.splice(0, ex1PerPage)

      pokemonList.value.map((pokemon: Pokemon) => {
        let favouritePokemonList: Pokemon[] = JSON.parse(localStorage.getItem('Favourite') || '[]')

        if(favouritePokemonList.some(x => x.id == pokemon.id))
          pokemon.isFavourite = true
        else
          pokemon.isFavourite = false
      })

    })
  })

  const result = PokemonAPI.getAllPokemonList(0)

  result.then((res: PokemonList) => {
    ex1Rows.value = res.totalCount

    pokemonList.value = res.pokemons

    pokemonList.value.map((pokemon: Pokemon) => {
      let favouritePokemonList: Pokemon[] = JSON.parse(localStorage.getItem('Favourite') || '[]')

      if(favouritePokemonList.some(x => x.id == pokemon.id))
        pokemon.isFavourite = true
      else
        pokemon.isFavourite = false
    })
  });

  PokemonAPI.getAllPokemonType().then((pokemonTypeResponse: any) => {
    let pokemonTypes: any = []
    pokemonTypes.push({value: '', text: ''})
    pokemonTypes = pokemonTypes.concat(pokemonTypeResponse)
    allPokemonTypesOptions.value = pokemonTypes
  })


</script>

<style scoped>

</style>