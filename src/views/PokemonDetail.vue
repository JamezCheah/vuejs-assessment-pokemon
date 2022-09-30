<template>
    <article>
        <div class="container back-to-home">
            <div class="row">
                <div class="col-md-12">
                    <b-button variant="primary" @click="backToHome">Back</b-button>
                </div>
            </div>
        </div>
        <section>
            <div class="container">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <h1>Pokemon ID</h1>
                        <h1>({{pokemonDetail.id}})</h1>
                    </div>
                    <div class="col-md-12 text-center">
                        <img :src="pokemonDetail.picture" height="300" width="300">
                        <button v-if="!isFavourite" class="favourite-btn" @click="favourite"><i class="bi-heart heart-icon"></i></button>
                        <button v-if="isFavourite" class="favourite-btn" @click="unfavourite"><i class="bi-heart-fill heart-icon"></i></button>
                    </div>
                    <div class="col-md-12 text-center">
                        <h2>{{(pokemonDetail.name.charAt(0).toUpperCase() + pokemonDetail.name.substring(1))}}</h2>
                    </div>
                    <div class="col-md-12 text-center">
                        <b-card>
                            <h4>Category</h4>
                            <p>{{pokemonDetail.category}}</p>
                        </b-card>
                    </div>
                    <div class="col-md-12 text-center">
                        <b-card>
                            <div class="row">
                                <div class="col-md-12">
                                    <h4>Type</h4>
                                </div>
                                <div class="col-md-2 mx-auto" :key="index" v-for="(type, index) in pokemonDetail.type">
                                    {{type.type.name}}
                                </div>
                            </div>
                        </b-card>
                    </div>
                    <div class="col-md-12 text-center">
                        <b-card>
                            <h4>Description</h4>
                            <p>{{pokemonDetail.description}}</p>
                        </b-card>
                    </div>                    
                    <div class="col-md-12 text-center">
                        <b-card>
                            <div class="row">
                                <h4>Gender</h4>
                                <div class="col-md-12" v-if="(pokemonDetail.male === 0 && pokemonDetail.female === 0)"><span>Genderless</span></div>
                                <div class="col-md-6" v-if="(pokemonDetail.male > 0 && pokemonDetail.female > 0)"><span>Male: {{pokemonDetail.male / (pokemonDetail.male + pokemonDetail.female) * 100}}%</span></div>
                                <div class="col-md-6" v-if="(pokemonDetail.male > 0 && pokemonDetail.female > 0)"><span>Female: {{pokemonDetail.male / (pokemonDetail.male + pokemonDetail.female) * 100}}%</span></div>
                            </div>
                        </b-card>
                    </div>
                    <div class="col-md-12 text-center">
                        <b-card>
                            <h4>Physical</h4>
                            <p>Height: {{pokemonDetail.height / 10}}m</p>
                            <p>Weight: {{pokemonDetail.weight/ 10}} kg</p>
                        </b-card>
                    </div>
                    <div class="col-md-12 text-center">
                        <b-card>
                            <div class="row">
                                <h4>Abilities</h4>
                                <div class="col-md-2 mx-auto" :key="index" v-for="(ability, index) in pokemonDetail.abilities">
                                    {{ability.ability.name}}
                                </div>
                            </div>
                        </b-card>
                    </div>
                    <div class="col-md-12 text-center">
                        <b-card>
                            <div class="row">
                                <h4>Stats</h4>
                                <div class="col-md-2" :key="index" v-for="(stats, index) in pokemonDetail.stats">
                                    {{stats.stat.name}} | {{stats.base_stat}}
                                </div>
                            </div>
                        </b-card>
                    </div>
                    <div class="col-md-12 text-center">
                       <b-card>
                            <div class="row">
                                <h4>Evolution Chain</h4>
                                <div class="col-md-3 mx-auto" :key="index" v-for="(evolve, index) in pokemonDetail.evolutionChain">
                                    <div class="row">
                                        <div class="col-md-12">Pokemon Name: {{(evolve.name.charAt(0).toUpperCase() + evolve.name.substring(1))}}</div>
                                        <div class="col-md-12">Trigger by: {{evolve.trigger}}</div>
                                        <div class="col-md-12">Minimum Level: {{evolve.min_level}}</div>
                                    </div>
                                </div>
                            </div>
                       </b-card>
                    </div>
                    <div class="col-md-12">
                        <b-card>
                            <div class="row">
                                <div class="col-md-6">
                                    <b-button variant="primary" @click="previousPokemon" v-if="pokemonDetail.id>1">Previous</b-button>
                                </div>
                                <div class="col-md-6">
                                    <b-button class="float-end" variant="primary" @click="nextPokemon" v-if="getMaximum(pokemonDetail.id)">Next</b-button>
                                </div>
                            </div>
                        </b-card>
                    </div>
                </div>
            </div>
        </section>
    </article>
</template>

<script setup lang="ts">
    
    import { ref, watch } from 'vue'
    import { useRoute } from 'vue-router'
    import router from '@/router';
    import * as localForage from 'localforage'
    import { default as PokemonAPI } from '@/services/service-proxies'
    import type { Pokemon, PokemonDetail } from '@/modal/pokemon.modal';

    const route = useRoute();

    const id = ref(Number(route.params.id))

    const isFavourite = ref(false)

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

    const backToHome = () =>{
        router.push({path: '/' })
    }
    
    const getMaximum = (id: number) =>{
        const pokemonList : Pokemon [] = sort(JSON.parse(sessionStorage.getItem('PokemonList') || '[]'), 'desc')
        if(pokemonList[0].id == id){
            return false
        }
        return true
    }

    const pokemonDetail = ref<PokemonDetail>({
        id : 0,
        name: '',   
        picture: '',
        description: '',
        type: [],
        height: 0,
        weight: 0,
        abilities: [],
        stats: [],
        category: '',
        evolutionChain: []
    });

    const favourite = () => {
        let favouritePokemonList: Pokemon[] = JSON.parse(localStorage.getItem('Favourite') || '[]')

        const pokemonToFavourite = {
            id: pokemonDetail.value.id,
            name: pokemonDetail.value.name,
            type: pokemonDetail.value.type,
            picture: pokemonDetail.value.picture
        }

        if(!favouritePokemonList.some(x => x.id == pokemonToFavourite.id))
            favouritePokemonList.push(pokemonToFavourite)


        localStorage.setItem('Favourite', JSON.stringify(favouritePokemonList));
        isFavourite.value = true;
    }

    const unfavourite = () => {
        let favouritePokemonList: Pokemon[] = JSON.parse(localStorage.getItem('Favourite') || '[]')

        favouritePokemonList = favouritePokemonList.filter((pokemon) => {
            return pokemon.id !== pokemonDetail.value.id
        })

        localStorage.setItem('Favourite', JSON.stringify(favouritePokemonList));
        isFavourite.value = false
    } 

    const previousPokemon = () => {
        id.value--
        router.push({path: '/pokemonDetail/' + (Number(route.params.id)-1).toString() })
    }

    const nextPokemon = () => {
        id.value++
        router.push({path: '/pokemonDetail/' + (Number(route.params.id)+1).toString() })
    }

    watch(id, async (newPokemon, oldPokemon) => {
        PokemonAPI.getPokemon(id.value.toString())
        .then((response: PokemonDetail) => {
            pokemonDetail.value = response
            
            const favouritedPokemonList = JSON.parse(localStorage.getItem('Favourite') || '[]')
            if(favouritedPokemonList.some((x : any) => x.id == pokemonDetail.value.id)){
                isFavourite.value = true
            }
            else
                isFavourite.value = false
        })
    })

    PokemonAPI.getPokemon(route.params.id.toString())
        .then((response: PokemonDetail) => {
            pokemonDetail.value = response
            
            const favouritedPokemonList = JSON.parse(localStorage.getItem('Favourite') || '[]')
            if(favouritedPokemonList.some((x : any) => x.id == pokemonDetail.value.id)){
                isFavourite.value = true
            }
            else
                isFavourite.value = false
        })

</script>

<style scoped>

.back-to-home{
    margin-top: 5px;
    margin-bottom: 5px;
}

.pokemon-id{
    text-align: center;
}

.favourite-btn{
    position: absolute;
    background: none;
    border: none;
}

.heart-icon{
    color: red;
}
</style>
