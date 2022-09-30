import axios from 'axios'
import { ref } from 'vue'
import type { Pokemon, PokemonList, PokemonDetail, PokemonEvolutionChain } from '../modal/pokemon.modal'

const instance = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/',
    timeout: 5000
});


const responseBody = (response: any) => response.data;

interface PokemonNameAndUrl{
    name: string
    url: string
}

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

const pokemonRequest = {
    get: (url: string) => instance.get(url).then(responseBody)
}

const Pokemon  = {
    getAllPokemonList : (page: number, pokemonType: string = '', limit: number = 15, order: string = 'asc') : any => {
        const allPokemonList : Pokemon[] = JSON.parse(sessionStorage.getItem('PokemonList') || '[]')

        if(allPokemonList.length === 0){
            return pokemonRequest.get('pokemon?limit=' + 100000 )
            .then((response: any) => {
                const pokemonsResponse = response.results;
                const total = response.count
    
                const pokemons : Pokemon[] = [];
                const promises: Promise<any>[] = []
    
                pokemonsResponse.map((pokemon : any) => {
                    promises.push(
                        pokemonRequest.get('pokemon/' + pokemon.name)
                            .then((pokemonResponse: any) => {
                                const types = pokemonResponse.types.map((element: any) => {
                                    let id = 0;
                                    return {
                                        id : id+=1,
                                        name: element.type.name
                                    }
                                });
    
                                const pokemon :Pokemon = {
                                    id : pokemonResponse.id,
                                    name : pokemonResponse.name,
                                    types : types,
                                    picture : pokemonResponse.sprites.front_default,
                                }
                                pokemons.push(pokemon)
                            })
                    )
                })
                return Promise.all(promises).then(() => {
                    sessionStorage.setItem('PokemonList', JSON.stringify(pokemons))

                    const filteredPokemonType = sort(pokemons, order).filter((pokemon: Pokemon) => {
                        if(pokemonType === '')
                            return pokemon

                        for(var type in pokemon.types){
                            if(type === pokemonType){
                                return pokemon
                            }
                        }
                    })

                    const pokemonsPaginationListing: PokemonList ={
                        pokemons : filteredPokemonType.splice((page*limit), limit),
                        totalCount: total
                    }
                    return pokemonsPaginationListing
                })
            })
        }

        let filteredPokemonType : Pokemon [] = sort(allPokemonList, order)
        if(pokemonType !== ''){
            filteredPokemonType = filteredPokemonType.filter((pokemon: Pokemon) => {        
                for(var type of pokemon.types){
                    if(type.name === pokemonType){
                        return pokemon
                    }
                }
            })
        }

        const pokemonsPaginationListing: PokemonList ={
            pokemons : filteredPokemonType.splice((page*limit), limit),
            totalCount: allPokemonList.length
        }

        return new Promise<PokemonList>((resolve, reject) => {
            setTimeout(() => { resolve(pokemonsPaginationListing) })
        })
    },
    getPokemon : (id : string) : any => pokemonRequest.get('pokemon/' + id + '')
        .then((response: any) => {
            const pokemonResponse = response
            // console.log(pokemonResponse)

            // Get Pokemon Description & Category
            return pokemonRequest.get('pokemon-species/' + id.toString() + '')
                .then((pokemonSpeciesResponse: any) => {

                    return pokemonRequest.get('evolution-chain/' + pokemonSpeciesResponse.evolution_chain.url.split('/')[6])
                        .then((pokemonEvolutionChainResponse: any) => {
                            const evolutionChains : PokemonEvolutionChain[] = [];
                            let  evolvesTo = pokemonEvolutionChainResponse.chain.evolves_to[0]
                            
                            evolutionChains.push({
                                name: pokemonEvolutionChainResponse.chain.species.name,
                                min_level: 0,
                                trigger: '',
                            })

                            do{
                                const evolutionChain: PokemonEvolutionChain = {
                                    name: evolvesTo.species.name,
                                    min_level: evolvesTo.evolution_details[0].min_level,
                                    trigger: evolvesTo.evolution_details[0].trigger.name,
                                }
    
                                evolutionChains.push(evolutionChain)
                                evolvesTo = evolvesTo.evolves_to[0]
                            }while(evolvesTo != null)
                            
                            return pokemonRequest.get('gender/1')
                                .then((femaleResponse: any) => {
                                    const pokemonFemaleResult = femaleResponse.pokemon_species_details.filter((pokemon: any) => {
                                        if(pokemon.pokemon_species.name === pokemonResponse.name){
                                            return pokemon
                                        }
                                    })
                                    const femaleRatio: number = pokemonFemaleResult[0].rate
                                    // console.log(pokemonFemaleResult[0].rate)
                                    if(femaleRatio >= 0){
                                        return pokemonRequest.get('gender/2')
                                            .then((maleResponse: any) => {
                                                const pokemonMaleResult = maleResponse.pokemon_species_details.filter((pokemon: any) => {
                                                    if(pokemon.pokemon_species.name === pokemonResponse.name){
                                                        return pokemon
                                                    }
                                                })
                                                const maleRatio: number = pokemonMaleResult[0].rate
                                                
                                                const pokemonDetail: PokemonDetail = {
                                                    id: pokemonResponse.id,
                                                    name: pokemonResponse.name,
                                                    description: pokemonSpeciesResponse.flavor_text_entries.filter((x: any) => x.language.name === 'en')[0].flavor_text,
                                                    picture: pokemonResponse.sprites.front_default,
                                                    type: pokemonResponse.types,
                                                    height: pokemonResponse.height,
                                                    weight: pokemonResponse.weight,
                                                    abilities: pokemonResponse.abilities,
                                                    stats: pokemonResponse.stats,
                                                    category: pokemonSpeciesResponse.genera.filter( (x:any) => x.language.name === 'en')[0].genus,
                                                    evolutionChain: evolutionChains,
                                                    female: femaleRatio,
                                                    male: maleRatio
                                                }

                                                return pokemonDetail
                                            })
                                    }
                                })
                                .catch(() => {
                                    console.log('Genderless')
                                    return pokemonRequest.get('gender/3')
                                            .then((genderlessResponse: any) => {
                                                const pokemonMaleResult = genderlessResponse.pokemon_species_details.filter((pokemon: any) => {
                                                    if(pokemon.pokemon_species.name === pokemonResponse.name){
                                                        return pokemon
                                                    }
                                                })
                                                
                                                const pokemonDetail: PokemonDetail = {
                                                    id: pokemonResponse.id,
                                                    name: pokemonResponse.name,
                                                    description: pokemonSpeciesResponse.flavor_text_entries.filter((x: any) => x.language.name === 'en')[0].flavor_text,
                                                    picture: pokemonResponse.sprites.front_default,
                                                    type: pokemonResponse.types,
                                                    height: pokemonResponse.height,
                                                    weight: pokemonResponse.weight,
                                                    abilities: pokemonResponse.abilities,
                                                    stats: pokemonResponse.stats,
                                                    category: pokemonSpeciesResponse.genera.filter( (x:any) => x.language.name === 'en')[0].genus,
                                                    evolutionChain: evolutionChains,
                                                    female: 0,
                                                    male: 0
                                                }

                                                return pokemonDetail
                                            })
                                })                           
                        })
                })
                .catch(() => {
                    return {
                        id: pokemonResponse.id,
                        name: pokemonResponse.name,
                        picture: pokemonResponse.sprites.front_default,
                        type: pokemonResponse.types,
                        height: pokemonResponse.height,
                        weight: pokemonResponse.weight,
                        abilities: pokemonResponse.abilities,
                        stats: pokemonResponse.stats
                    }
                })
    }),
    getAllPokemonType: () : any => pokemonRequest.get('type').then((response: any) => {
        return response.results.map((pokemonType: any) => {
            return { value: pokemonType.name, text: pokemonType.name.charAt(0).toUpperCase() + pokemonType.name.slice(1)}
        } )
    }) 
}

export default Pokemon;