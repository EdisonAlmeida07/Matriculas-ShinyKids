'use strict';

const { v4: uuidv4 } = require('uuid'); // Para generar nombres únicos para los archivos
var { db, bucket } = require('../firebase');
var path = require('path');
var multer = require('multer');

// se usa multer para usar memoria en lugar de almacenamiento en disco
var storage = multer.memoryStorage();
var upload = multer({ storage: storage }).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'carnetVacunas', maxCount: 1 }
]);

var controller = {
    home: function (req, res) {
        return res.status(201).send("<h1>Shiny Kids - Tulcán Ec.</h1>");
    },
    /*saveStudent: async function (req, res) {
        var params = req.body;

        var newStudent = {
            nombres: params.nombres,
            apellidos: params.apellidos,
            cedula: params.cedula,
            direccion: params.direccion,
            tipoSangre: params.tipoSangre,
            fechaNacimiento: params.fechaNacimiento,
            sexo: params.sexo,
            fotoVacunas: null,
            fotoStudent: null,
            padre: {
                nombres: params.nombresPadre,
                apellidos: params.apellidosPadre,
                cedula: params.cedulaPadre,
                profesion: params.profesionPadre,
                telefono: params.telefonoPadre,
                lugarTrabajo: params.lugarTrabajoPadre,
                correo: params.correoPadre,
                fechaNacimiento: params.fechaNacimientoPadre
            },
            madre: {
                nombres: params.nombresMadre,
                apellidos: params.apellidosMadre,
                cedula: params.cedulaMadre,
                profesion: params.profesionMadre,
                telefono: params.telefonoMadre,
                lugarTrabajo: params.lugarTrabajoMadre,
                correo: params.correoMadre,
                fechaNacimiento: params.fechaNacimientoMadre
            }
        };

        try {
            const studentRef = await db.collection('estudiante').add(newStudent);
            return res.status(200).send({ student: { id: studentRef.id, ...newStudent } });
        } catch (err) {
            return res.status(500).send({ message: 'Error al guardar', error: err });
        }
    },*/
    saveStudent: function (req, res) {
        upload(req, res, async function (err) {
            if (err) {
                return res.status(500).send({ message: 'Error al subir los archivos', error: err });
            }

            const params = req.body;
            const files = req.files;
            const profileImage = files.profileImage ? files.profileImage[0] : null;
            const carnetVacunas = files.carnetVacunas ? files.carnetVacunas[0] : null;
            const docID = db.collection('estudiante').doc().id;
            let imageUrl = null;
            let carnetVacunasUrl = null;

            const newStudent = {
                nombres: params.nombres,
                apellidos: params.apellidos,
                cedula: params.cedula,
                direccion: params.direccion,
                tipoSangre: params.tipoSangre,
                fechaNacimiento: params.fechaNacimiento,
                paralelo: params.paralelo,
                yearLectivo: params.yearLectivo,
                sexo: params.sexo,
                fotoCarnetVacunas: null,
                fotoStudent: null,
                padre: {
                    nombresP: params.nombresP,
                    apellidosP: params.apellidosP,
                    cedulaP: params.cedulaP,
                    profesionP: params.profesionP,
                    telefonoP: params.telefonoP,
                    lugarTrabajoP: params.lugarTrabajoP,
                    correoP: params.correoP,
                    fechaNacP: params.fechaNacP
                },
                madre: {
                    nombresM: params.nombresM,
                    apellidosM: params.apellidosM,
                    cedulaM: params.cedulaM,
                    profesionM: params.profesionM,
                    telefonoM: params.telefonoM,
                    lugarTrabajoM: params.lugarTrabajoM,
                    correoM: params.correoM,
                    FechaNacM: params.FechaNacM
                },
                representante: {
                    nombresR: params.nombresR,
                    apellidosR: params.apellidosR,
                    direccionR: params.direccionR,
                    telefonoR: params.telefonoR,
                    correoR: params.correoR,
                    parentesco: params.parentesco
                }
            };

            if (profileImage) {
                const uniqueFileName = `${docID}.${profileImage.mimetype.split('/')[1]}`;
                const tempLocalFile = profileImage.buffer;

                try {
                    const file = bucket.file(`images/${uniqueFileName}`);
                    await file.save(tempLocalFile, {
                        metadata: {
                            contentType: profileImage.mimetype,
                            metadata: {
                                firebaseStorageDownloadTokens: uuidv4(),
                            }
                        }
                    });

                    imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/images%2F${encodeURIComponent(uniqueFileName)}?alt=media&token=${uuidv4()}`;
                    newStudent.fotoStudent = imageUrl; // Guardar la URL en el campo correspondiente
                } catch (uploadErr) {
                    return res.status(500).send({
                        message: 'Error al subir la imagen',
                        error: uploadErr,
                    });
                }
            }

            if (carnetVacunas) {
                const uniqueFileName = `${docID}-vacunas.${carnetVacunas.mimetype.split('/')[1]}`;
                const tempLocalFile = carnetVacunas.buffer;

                try {
                    const file = bucket.file(`documents/${uniqueFileName}`);
                    await file.save(tempLocalFile, {
                        metadata: {
                            contentType: carnetVacunas.mimetype,
                            metadata: {
                                firebaseStorageDownloadTokens: uuidv4(),
                            }
                        }
                    });

                    carnetVacunasUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/documents%2F${encodeURIComponent(uniqueFileName)}?alt=media&token=${uuidv4()}`;
                    newStudent.fotoCarnetVacunas = carnetVacunasUrl; // Guardar la URL en el campo correspondiente
                } catch (uploadErr) {
                    return res.status(500).send({
                        message: 'Error al subir el carnet de vacunas',
                        error: uploadErr,
                    });
                }
            }

            try {
                await db.collection('estudiante').doc(docID).set(newStudent, { merge: true });
                return res.status(200).send({
                    message: 'Estudiante creado exitosamente',
                    student: { id: docID, ...newStudent },
                });
            } catch (dbErr) {
                return res.status(500).send({
                    message: 'Error al guardar los datos del estudiante',
                    error: dbErr,
                });
            }
        });
    },
    getStudents: async function (req, res) {
        try {
            const querySnapshot = await db.collection('estudiante').get();
            const students = querySnapshot.docs.map(doc => ({ id: doc.id, nombres: doc.data().nombres, apellidos: doc.data().apellidos, grado: doc.data().grado, direccion: doc.data().direccion }));
            return res.status(200).send({ students });
        } catch (err) {
            return res.status(500).send({ message: 'Error al recuperar los datos', error: err });
        }
    },
    getStudent: async function (req, res) {
        var studentId = req.params.id;
        if (studentId == null) return res.status(404).send({ message: 'El estudiante no existe' });

        try {
            const studentDoc = await db.collection('estudiante').doc(studentId).get();
            if (!studentDoc.exists) return res.status(404).send({ message: 'El estudiante no existe' });
            return res.status(200).send({ student: studentDoc.data() });
        } catch (err) {
            return res.status(500).send({ message: 'Error al recuperar los datos', error: err });
        }
    },
    deleteStudent: async function (req, res) {
        var studentId = req.params.id;

        try {
            await db.collection('estudiante').doc(studentId).delete();
            return res.status(200).send({ message: 'Estudiante eliminado' });
        } catch (err) {
            return res.status(500).send({ message: 'Error al eliminar los datos', error: err });
        }
    },
    updateStudent: async function (req, res) {
        var studentId = req.params.id;
        var update = req.body;

        try {
            await db.collection('estudiante').doc(studentId).update(update);
            const updatedStudent = await db.collection('estudiante').doc(studentId).get();
            return res.status(200).send({ student: updatedStudent.data() });
        } catch (err) {
            return res.status(500).send({ message: 'Error al actualizar los datos', error: err });
        }
    },
    uploadFoto: function (req, res) {
        upload(req, res, async function (err) {
            var studentId = req.params.id;
            console.log('Student ID:', studentId);
            if (err) return res.status(500).send({ message: 'Error al subir la imagen', error: err });
            if (!req.file) return res.status(400).send({ message: 'No se ha subido ninguna imagen' });

            var fileExt = req.file.mimetype.split('/')[1];
            if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'gif') {
                const uniqueFileName = `${uuidv4()}.${fileExt}`;
                const tempLocalFile = req.file.buffer;

                try {
                    const file = bucket.file(`images/${uniqueFileName}`);
                    await file.save(tempLocalFile, {
                        metadata: {
                            contentType: req.file.mimetype,
                            metadata: {
                                firebaseStorageDownloadTokens: uuidv4(),
                            }
                        }
                    });

                    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/images%2F${uniqueFileName}?alt=media`;

                    // Actualizar la referencia de la imagen en Firestore
                    await db.collection('estudiante').doc(studentId).update({ fotoStudent: publicUrl });
                    return res.status(200).send({ student: { id: studentId, fotoStudent: publicUrl } });
                } catch (err) {
                    console.error('Error al subir la imagen:', err);
                    return res.status(500).send({ message: 'La imagen no se ha subido', error: err });
                }
            } else {
                return res.status(400).send({ message: 'La extensión no es válida' });
            }
        });
    },
        getFoto: function (req, res) {
        var file = req.params.foto;
        var path_file = './uploads/' + file;
        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({ message: 'No existe la imagen' });
            }
        });
    },pruebaFoto: function (req, res) {
        upload(req, res, async function (err) {
            if (err) return res.status(500).send({ message: 'Error al subir la imagen', error: err });
            if (!req.file) return res.status(400).send({ message: 'No se ha subido ninguna imagen' });

            var fileExt = req.file.mimetype.split('/')[1];
            if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'gif') {
                const uniqueFileName = `${uuidv4()}.${fileExt}`;
                const tempLocalFile = req.file.buffer;

                try {
                    const file = bucket.file(`images/${uniqueFileName}`);
                    await file.save(tempLocalFile, {
                        metadata: {
                            contentType: req.file.mimetype,
                            metadata: {
                                firebaseStorageDownloadTokens: uuidv4(),
                            }
                        }
                    });

                    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/images%2F${uniqueFileName}?alt=media`;

                    return res.status(200).send({ url: publicUrl });
                } catch (err) {
                    console.error('Error al subir la imagen:', err);
                    return res.status(500).send({ message: 'La imagen no se ha subido', error: err });
                }
            } else {
                return res.status(400).send({ message: 'La extensión no es válida' });
            }
        });
    }
};

module.exports = controller;
