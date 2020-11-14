const baseUrl = require('../config/url.config')
const uploadFile = require("../middleware/uploadFile");
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
            message: "Se subió el archivo correctamente: " + req.file.originalname,
        });
    } catch (err) {
        console.log(err);

        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(500).send({
                message: "El tamaño del archivo no puede superar los 15 MB",
            });
        }
        res.status(500).send({
            message: `No se pudo cargar el archivo: ${req.file.originalname}. ${err}`,
        }); return;
    }
};
const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/uploads/";
    res.sendFile(directoryPath + fileName, { headers: { 'Content-Type': "application/pdf" } }, (err) => {
        if (err) {
            res.status(500).send({
                message: "No se pudo descargar el archivo" + err,
            }); return;
        }
    });
};

module.exports = {
    upload,
    // getListFiles,
    download,
};

// const getListFiles = (req, res) => {
//     const directoryPath = __basedir + "/resources/uploads/";

//     fs.readdir(directoryPath, function (err, files) {
//         if (err) {
//             res.status(500).send({
//                 message: "No se pueden escanear los archivos",
//             });
//             return;
//         }

//         let fileInfos = [];

//         files.forEach((file) => {
//             fileInfos.push({
//                 name: file,
//                 url: baseUrl.url + file,
//             });
//         });

//         res.status(200).send(fileInfos);
//     });
// };


// const download = (req, res) => {
//     const fileName = req.params.name;
//     const directoryPath = __basedir + "/resources/uploads/";
//     fs.readFile(directoryPath + fileName, {headers: {'Content-Type': "application/pdf"}}, (err) => {
//         if (err) {
//             res.status(500).send({
//                 message: "No se pudo descargar el archivo" + err,  
//             }); return;
//         }
//     });
// };
