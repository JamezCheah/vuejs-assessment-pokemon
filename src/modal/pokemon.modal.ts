
interface PokemonGeneral{
    name: string,
    url: string
}

interface PokemonEvolutionChain{
    name: string,
    trigger: string,
    min_level: number
}

interface PokemonAbility{
    ability: PokemonGeneral
}

interface PokemonStats{
    base_stat: number,
    effort: number,
    stat: PokemonGeneral
}

interface PokemonType{
    name: string,
    url: string
}

interface PokemonTypes{
    slot: number,
    type: PokemonType
}

interface Pokemon{
    id: number;
    name: string;
    picture: string;
    types: any;
    isFavourite?: boolean;
}

interface PokemonDetail {
    id: number,
    name: string,   
    picture: string,
    description: string,
    type: PokemonTypes [],
    height: number,
    weight: number,
    abilities: PokemonGeneral [],
    stats: PokemonStats [],
    category: string,
    evolutionChain: PokemonEvolutionChain[],
    male: number,
    female: number
}

interface PokemonList{
    pokemons: Pokemon[];
    totalCount: number;
}

export type { Pokemon, PokemonList, PokemonDetail, PokemonEvolutionChain }
