/*
    path: api/publicacion

*/
const { Router } = require('express');
const {pool} = require('../database/config');   
const  path = require('path');
const cloudinary = require('cloudinary');
const  {  v4 : uuidv4  }  =  require ( 'uuid' ) ; 


cloudinary.config({ 
    cloud_name: 'da9xsfose', 
    api_key: '422253887739587', 
    api_secret: 'h6lb1iQebGIwHMfsoVPBO61dyvI'
  });

const router = Router();

router.post('/updateImage', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({ msg: 'No hay archivos que subir' });
    }

    const {archivo} = req.files;
    const uploadPath =  path.join(__dirname, '../uploads/', archivo.name);     
    
    archivo.mv(uploadPath, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ msg: 'Error al mover el archivo' });
        }
    });
    const {tempFilePath} = req.files.archivo;
    try {
        const resp = await cloudinary.uploader.upload(uploadPath);
        res.send(resp.url);
    } catch (error) {
        res.send('Error en al subida a Cloudinary');
    }
});

router.post('/new',async (req, res) => {
    const {de_persona, titulo, descripcion, imagen, direccion , paraQuienes} = req.body

    const paraQuienesJson = '[' + paraQuienes.slice(1, -1).split(',').map(s => `"${s.trim()}"`).join(',') + ']';
    const destinos = JSON.parse(paraQuienesJson);
    const id_publicacion = uuidv4().toString();

    try {
        await pool.query(`INSERT INTO Publicacion 
        (id, id_persona, titulo, descripcion, direccion, imagen)
        VALUES($1, $2, $3, $4, $5, $6)`,
        [id_publicacion, de_persona, titulo, descripcion, direccion, imagen]
        );

        const id_comentario = uuidv4().toString();

        await pool.query(
            `INSERT INTO Comentario (id, id_publicacion, titulo,descripcion,imagen,direccion) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [id_comentario,id_publicacion,titulo,descripcion,imagen,direccion]
        );

        for (const destino of destinos) {
            const id_notificacion = uuidv4().toString();
            await pool.query(`
            INSERT INTO Notificacion (id, id_persona, id_publicacion) 
            VALUES ($1, $2, $3)`,[id_notificacion,destino,id_publicacion]);
        }

        res.send('Salido todo correcto');  
    } catch (error) {
        res.send('Error en la creación de la publicación');
    }
});

router.get('/:de',async (req, res) => {
    const {de} = req.params;

    try {
        const result = await pool.query(`
    SELECT
        n.id AS id_notificacion,
        n.id_persona,
        n.id_publicacion,
        p.titulo AS titulo,
        p.descripcion AS descripcion,
        p.direccion AS direccion
    FROM
        Notificacion n
    JOIN
        Publicacion p ON n.id_publicacion = p.id
    WHERE
        n.id_persona = $1;
        `,[de]);
        res.json(result.rows);
        
    } catch (error) {
        res.json({
            message: 'Obtencion de Publicaciones',
            error
        });
    }
});




module.exports = router;
