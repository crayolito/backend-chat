/*
    path: api/usuarios

*/
const { Router } = require('express');
const {pool} = require('../database/config');   

const router = Router();

router.get('/:id_persona',async (req, res) => {
    console.log(req.params);
    const  id_persona  = req.params.id_persona;

    try {
        const result = await pool.query(`
        SELECT * FROM Persona WHERE id <> $1`,[id_persona]);

        res.status(200).json(result.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
            error
        });
    }
});


module.exports = router;
