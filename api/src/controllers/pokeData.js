// const axios = require("axios");
// require("dotenv").config();
// const { POKE_URL } = process.env

// const  pokeData = async (req, res) =>{
//     try {
//         const response =await axios.get(`${POKE_URL}`)
//         const data = response.data;

//         if(data.length === 0 ){
//             res.status(404).send([]);
//             return;
//         }

//         const pokemons = data.map(poke =>({
//             id: poke.id,
//             name : poke.name ,
            

//         }))
        
//     } catch (error) {
        
//     }
// }
