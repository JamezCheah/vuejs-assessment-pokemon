<template>
    <div class="container">
        <div class="row">
            <div class="col-md-4" :key="pokemon.id" v-for="pokemon in pokemonList">
            <b-card class="text-center">
                <div>
                <span>{{pokemon.id}}</span>
                </div>
                <div style="position: absolute; top: 0; right: 0; margin-top: 10px; margin-right: 10px">
                <button v-if="!pokemon.isFavourite" @click="favouritePokemon(pokemon)">
                    <i class="bi-heart"></i>
                </button>
                <button v-if="pokemon.isFavourite"  @click="unfavouritePokemon(pokemon)">
                    <i class="bi-heart-fill"></i>
                </button>
                </div>
                <img :src=pokemon.picture alt="" width="150" height="150" @click="pokemonClicked(pokemon.id)">
                <div>              
                <span>{{pokemon.name}}</span>
                </div>
                <span :key="index" v-for="(pokemonType, index) in pokemon.types" style="margin-right: 5px">{{pokemonType.name}}</span>
            </b-card>
            </div>
        </div>        
    </div>
</template>

<script setup lang="ts">
import router from '@/router'
    import type { Pokemon } from '../modal/pokemon.modal'
    defineProps<{pokemonList: Pokemon []}>()

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
</script>

<style scoped>
button{
    background: none;
    border: none;
    color: red;
}
</style>