const axios = require("axios");
require("dotenv").config(); 
const { POKE_URL } = process.env;
const {Pokemon, Type} = require("../db");

const pokeData = async (req, res) => {
  try {
    const response = await axios.get(`${POKE_URL}?limit=50&offset=0`);
    const results = response.data.results;

    if (results.length === 0) {
      res.status(404).send([]);
      return;
    }
    const pokemonInfo = await Promise.all(
      results.map(async (pokemon) => {
        const pokes = await axios.get(pokemon.url);
        const pokeInfo = pokes.data;
        return {
          id: pokeInfo.id,
          name: pokeInfo.name,
          hp: pokeInfo.stats[0].base_stat,
          types: pokeInfo.types.map((t) => t.type.name),
          image: pokeInfo.sprites.other["official-artwork"].front_default,
          attack: pokeInfo.stats[1].base_stat,
          defense: pokeInfo.stats[2].base_stat,
          speed: pokeInfo.stats[5].base_stat,
          weight: pokeInfo.weight,
          height: pokeInfo.height,
        };
      })
    );

    res.status(200).json(pokemonInfo);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPokeId = async (req, res) => {
  
  const { id } = req.params;
  try {
    
    const response = await axios.get(`${POKE_URL}/${id}`);
    const pokeInfo = response.data;

    if(!pokeInfo.id){
      res.status(404).send("Pokemon not found")
      return;
    }

    const pokemonData = {
      id: pokeInfo.id,
      name: pokeInfo.name,
      hp: pokeInfo.stats[0].base_stat,
      types: pokeInfo.types.map((t) => t.type.name),
      img: pokeInfo.sprites.other["official-artwork"].front_default,
      attack: pokeInfo.stats[1].base_stat,
      weight: pokeInfo.weight,
      height: pokeInfo.height,
    };

    res.status(200).json(pokemonData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getPokeName = async(req, res) => {
  const { name } = req.query
  const pokeName = name.toLowerCase();
  
  try {
    
    console.log(pokeName);
    
    const response = await axios.get(`${POKE_URL}/?name=${pokeName}`);
    const pokeInfo = response.data;
  


if(!pokeInfo.name){
  res.status(404).send("Pokemon not found");
  return;
}


const pokemonData = {
  id: pokeInfo.id,
  name: pokeInfo.name,
  hp: pokeInfo.stats[0].base_stat,
  types: pokeInfo.types.map((t) => t.type.name),
  img: pokeInfo.sprites.other["official-artwork"].front_default,
  attack: pokeInfo.stats[1].base_stat,
  weight: pokeInfo.weight,
  height: pokeInfo.height,
};

res.status(200).json(pokemonData);


  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}


const createPokemon = async (req, res) => {
  const { name, hp, image, attack, defense, speed, weight, height, types } = req.body;

  try {
    const createdPokemon = await Pokemon.create({
      name,
      hp,
      image,
      attack,
      defense,
      speed,
      weight,
      height,
    });

    if (types && types.length > 0) {
      const foundTypes = await Type.findAll({
        where: { name: types },
      });
      await createdPokemon.addTypes(foundTypes);
    }

    res.status(201).json(createdPokemon);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTypes = async (req, res) => {
  try {
    const types = await Type.findAll();

    if (types.length === 0) {
      const response = await axios.get(`${POKE_URL}/type`);
      const apiTypes = response.data.results;
      apiTypes.forEach(async (type) => {
        await Type.create({
          name: type.name,
        });
      });
      const updatedTypes = await Type.findAll();
      res.status(200).json(updatedTypes);
    } else {
      res.status(200).json(types);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  pokeData,
  getPokeId,
  getPokeName,
  createPokemon,
  getTypes
};
