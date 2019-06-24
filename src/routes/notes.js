const express = require('express');
const router = express.Router();

const Nota = require('../models/Note');
const { isAuthenticated } = require('../helpers/paginaAutenticar');

router.get('/notes/agregar', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

// router.post('/notes/new-note', (req, res) => {
//     console.log(req.body);
//     res.send('OK');
// });
/**
 * Validacion
 */
router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;//obtencion datos por separado
    const error = [];
    if (!title) {
        error.push({ text: 'Por favor escriba un titulo' });
    }
    if (!description) {
        error.push({ text: 'Por favor escriba una descripcion' });
    }
    if (error.length > 0) {
        res.render('notes/new-note', { error, title, description });
    } else {
        //res.send('OK');
        const newNote = new Nota({ title, description });
        newNote.user=req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Nota agregada satisfactoriamente');
        res.redirect('/notes');
        // console.log(newNote)//Imprimir en consola los datos
        // res.send('OK');
    }
});

// router.get('/notes', (req, res) => {
//     res.send('Notas de la base de datos');
// });
/**
 * Organizar
 */
router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Nota.find({user: req.user.id}).sort({ date: 'desc' });//Nota es la const del schema
    res.render('notes/all-notes', { notes });
});
/**
 * Actualizar
 */
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Nota.findById(req.params.id);
    res.render('notes/edit-notes', { note })
})

router.put('/notes/edit-notes/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    await Nota.findByIdAndUpdate(req.params.id, { title, description });//Metodo asyncque permite buscar primero por id ytoma datos que quiere actualizar
    req.flash('success_msg', 'Nota actualizada satisfactoriamente');
    res.redirect('/notes');
})

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Nota.findByIdAndDelete(req.params.id);
    // console.log(req.params.id)
    req.flash('success_msg', 'Nota eliminada satisfactoriamente');
    res.redirect('/notes');
})
module.exports = router;
