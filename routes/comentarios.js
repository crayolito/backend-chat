/*
    path: api/comentario
*/

const { Router } = require('express');
const {pool} = require('../database/config');   
const  {  v4 : uuidv4  }  =  require ( 'uuid' ) ; 
   
const router = Router();

router.post('/new',async (req, res) => {
    const {mensaje, idPublicacion, idUsuario} = req.body
    console.log(req.body);
    try {
        const result = await pool.query(
            `SELECT imagen FROM Publicacion WHERE id = $1`,
            [idPublicacion]
        );

        const imagenPublicacion =  result.rows[0].imagen;
        console.log(imagenPublicacion);

        const id_comentario = uuidv4().toString();
        await pool.query(
            `INSERT INTO Comentario (id, id_publicacion, titulo,descripcion,imagen,direccion) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [id_comentario,idPublicacion,mensaje,mensaje,imagenPublicacion,mensaje]
        );

        res.send('Salido todo correcto');  
    } catch (error) {
        console.log(error);
        res.send('Error en la creación de la publicación');
    }
});


router.get('/:de',async (req, res) => {
    const {de} = req.params;
    console.log(de);

    try {
        const result = await pool.query(
            `SELECT * FROM Comentario WHERE id_publicacion = $1`,
            [de]
        );
        res.json(result.rows);
        
    } catch (error) {
        res.json({
            message: 'Obtencion de comentarios',
            error
        });
    }
});


module.exports = router;
