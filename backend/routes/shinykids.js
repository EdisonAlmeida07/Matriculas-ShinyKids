'use strict'
var express = require('express');
var StudentController = require('../controllers/shinykids');
var router = express.Router();
var multer = require('multer');
var upload = multer({ storage: multer.memoryStorage() }).single('imagen');

//home page
router.get('/home', StudentController.home);
//guardar la info del studiante
router.post('/save-student', StudentController.saveStudent);
//ver la info de los estudiantes
router.get('/students', StudentController.getStudents);
//ver los datos de un solo estudiante
router.get('/student/:id', StudentController.getStudent);
//eliminar estudiante
router.delete('/student/:id', StudentController.deleteStudent);
//actualizar datos del estudiante
router.put('/student/:id', StudentController.updateStudent);
//agregar fotos
router.post('/subir-foto/:id', upload, StudentController.uploadFoto);
//mostrar fotos
router.get('/get-foto/:foto', StudentController.getFoto);
//prueba foto
router.post('/prueba-foto', StudentController.pruebaFoto);

module.exports = router;
