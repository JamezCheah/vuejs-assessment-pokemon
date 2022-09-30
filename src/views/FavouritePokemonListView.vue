<template>
    <div class="container text-center">
        <div class="row">
            <div class="col-md-12">
                <h1>My Favourite Pokemon List</h1>
            </div>
        </div>
    </div>    
    <SearchAndFilterComponent @pokemon-type="type => pokemonType = type" @search-pokemon="toSearch => searchPokemon = toSearch"></SearchAndFilterComponent>
    <PokemonListingComponent :pokemonList='pokemonList'></PokemonListingComponent>
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
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue'
    import PokemonListingComponent from '../components/PokemonListingComponent.vue'
    import SearchAndFilterComponent from '../components/SearchAndFilterComponent.vue'
    import type { Pokemon, PokemonList } from '../modal/pokemon.modal'

    const pokemonType = ref('')
    const searchPokemon = ref('')
    const pokemonList = ref<Pokemon[]>();
    const ex1CurrentPage = ref(1)
    const ex1PerPage = 15
    const ex1Rows = ref(0)

    const sort = (pokemonList : Pokemon[], order: string) =>{
        if(order === 'desc'){
        return pokemonList.sort((a, b) => {
            if(a.id < b.id) {
            return 1;
            } else if(a.id > b.id) {
            return -1;
            } else {
            return 0;
            }
        })
        }
        else{
        return pokemonList.sort((a, b) => {
            if(a.id > b.id) {
            return 1;
            } else if(a.id < b.id) {
            return -1;
            } else {
            return 0;
            }
        })
        }
    }

    ex1Rows.value = JSON.parse(localStorage.getItem('Favourite') || '[]').length

    pokemonList.value = sort(JSON.parse(localStorage.getItem('Favourite') || '[]'), 'asc').splice(0, 15)

    pokemonList.value?.map((pokemon : any) => {
        pokemon.isFavourite = true
    })

    watch(ex1CurrentPage, async (newPage, oldPage) => {
        const favouritePokemonList = sort(JSON.parse(localStorage.getItem('Favourite') || '[]'), 'asc')

        const filteredPokemonList = sort(favouritePokemonList, 'asc').filter((pokemon: any) => {            
            if(pokemonType.value === '')
                return pokemon

            for(var type of pokemon.types){
                if(type.name === pokemonType.value){
                    return pokemon
                }
            }
        })

        pokemonList.value = filteredPokemonList.splice((15 * (newPage-1)), (15))
        
        pokemonList.value.map((pokemon : any) => {
            pokemon.isFavourite = true
        })
    })

    watch(pokemonType, async (newType, oldType) => {
        const favouritePokemonList: Pokemon[] = JSON.parse(localStorage.getItem('Favourite') || '[]')

        const filteredPokemonList = sort(favouritePokemonList, 'asc').filter((pokemon: any) => {
            
            if(newType === '')
                return pokemon

            for(var type of pokemon.types){
                if(type.name === newType){
                    return pokemon
                }
            }
        })
        
        ex1Rows.value = filteredPokemonList.length
        
        pokemonList.value = filteredPokemonList.slice(0, ex1PerPage)
        pokemonList.value.map((pokemon: Pokemon) => {
            pokemon.isFavourite = true;
        })
    })

    watch(searchPokemon, async (newPokemon, oldPokemon) => {
        const favouritePokemonList: Pokemon[] = JSON.parse(localStorage.getItem('Favourite') || '[]')

        pokemonList.value = sort(favouritePokemonList, 'asc').filter((pokemon: any) => {
            console.log(pokemon)
            if(newPokemon === ''){
                return pokemon
            }

            if(pokemon.id.toString() === newPokemon){
                return pokemon
            }
            else if(pokemon.name === newPokemon){
                return pokemon
            }
        }).splice(0, 15)

        pokemonList.value.map((pokemon: Pokemon) => {
            pokemon.isFavourite = true;
        })
        ex1Rows.value = pokemonList.value.length
    })

</script>

<style scoped>

</style>