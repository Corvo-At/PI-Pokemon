const { Router } = require('express');
const router = Router();

const {pokeData, getPokeId, getPokeName, createPokemon, getTypes} = require("../controllers/pokeData")

// Configurar los routers



router.get("/pokemons", pokeData)
router.get("/pokemons/:id", getPokeId )
router.get("/pokemons/name", getPokeName)
router.post("/pokemons", createPokemon)
router.get("/pokrmons/types", getTypes)

module.exports = router;
