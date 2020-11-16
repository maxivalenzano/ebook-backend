const baseUrl = require('../config/image.config')
const uploadFile = require("../middleware/uploadImg");
const fs = require("fs");

// guardamos el archivo
const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Falta cargar el archivo" });
        };
        let fileInfo = [];
        fileInfo.push({
            name: req.file.originalname,
            url: baseUrl.url + req.file.originalname,
        });
        res.status(200).send({
            fileInfo,
            message: "Se subió la imagen correctamente: " + req.file.originalname,
        });
    } catch (err) {
        console.log(err);

        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(500).send({
                message: "El tamaño de la imagen no puede superar los 2 MB",
            });
        }
        res.status(500).send({
            message: `No se pudo cargar la imagen: ${req.file.originalname}. ${err}`,
        }); return;
    }
};
const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/uploadsIMG/";
    res.sendFile(directoryPath + fileName, { headers: { 'Content-Type': "image/png, image/jpeg, image/bmp, image/jpg" } }, (err) => {
        if (err) {
            res.status(500).send({
                message: "No se pudo descargar la imagen" + err,
            }); return;
        }
    });
};

module.exports = {
    upload,
    download,
};