/*
    path: api/login
*/
const { Router } = require('express');
const {pool} = require('../database/config');   
const  {  v4 : uuidv4  }  =  require ( 'uuid' ) ; 

const router = Router();

router.post('/new',async (req, res) => {
    const { nr_telefono, contrasena, ci, nombre, apellido } = req.body;
    const id_persona = uuidv4().toString();
    try {
        const result = await pool.query(`
        INSERT INTO Persona (id_persona, nr_telefono, contrasena, ci, nombre, apellido) 
        VALUES ($1, $2, $3, $4, $5, $6)`,[id_persona,nr_telefono, contrasena, ci, nombre, apellido]);
       
        res.status(200).json({
            msg: 'Usuario creado correctamente',
        })

    } catch (error) {
        res.status(500).json({
            msg: 'Hable con el administrador',
            error 
        });
    }
});

router.post('/',async (req, res) => {
    const { ci, contrasena } = req.body;
    try {
        const result = await pool.query(`
        SELECT * FROM Persona WHERE ci = $1 AND contrasena = $2`,[ci, contrasena]);
       
        if (result.rows.length === 0) {
            // Si no se encontró al usuario, devolver un estado 404
            // El error HTTP 404 significa "No encontrado".
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
});


module.exports = router;
