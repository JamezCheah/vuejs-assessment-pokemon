<template>
    <div class="container"> 
        <b-card>
            <div class="row">
                <div class="col-md-6">
                    <div class="mt-2">Pokemon Name / Id: </div>
                    <div class="row">
                        <div class="col-md-10">
                        <b-form-input v-model="searchPokemon" placeholder="Search Pokemon Name or ID"></b-form-input>
                        </div>
                        <div class="col-md-2">
                            <button v-if="searchPokemon" class="close" aria-label="Close" @click="clearSearchParameter"><span aria-hidden="true">&times;</span></button>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mt-2">Type: </div>
                    <b-form-select v-model="pokemonTypeSelected" :options="allPokemonTypesOptions" @input="$emit('pokemon-type', pokemonTypeSelected)"></b-form-select>
                </div>
                <div class="col-md-12">
                    <b-button variant="primary" @click="$emit('search-pokemon', searchPokemon)">Search</b-button>
                </div>
            </div>
        </b-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { default as PokemonAPI }  from '../services/service-proxies';

defineEmits(['search:pokemon', 'pokemon-type'])

const searchPokemon = ref<string>('')
const allPokemonTypesOptions = ref([])
const pokemonTypeSelected = ref('')

const clearSearchParameter = () => {
    searchPokemon.value = ''
}

PokemonAPI.getAllPokemonType().then((pokemonTypeResponse: any) => {
    let pokemonTypes: any = []
    pokemonTypes.push({value: '', text: ''})
    pokemonTypes = pokemonTypes.concat(pokemonTypeResponse)
    allPokemonTypesOptions.value = pokemonTypes
  })

</script>

<style scoped>
.close {
    background: none;
    border: none;
}
</style>