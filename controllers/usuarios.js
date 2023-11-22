const { response } = require("express");
const Usuario = require('../models/usuario');


const getUsuarios =async (req, res = response) =>{
    // const desde = Nunber(req.query.desde) || 0;
    // const usuarios = await Usuario.find({_id:{$ne:req.uid}}).sort('-online').skip(desde).limit(20));
    const usuarios = await Usuario.find().sort('-online');

    res.json({
        ok: true,
        usuarios
    })
}

module.exports = {
    getUsuarios
}   