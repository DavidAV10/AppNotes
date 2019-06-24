const express = require('express');
const router = express.Router();
const user = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))


router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const { nombre, email, password, confirm_password } = req.body;
    const error = [];
    // console.log(req.body);
    if (nombre.length <= 0) {
        error.push({ text: 'Por favor ingrese el nombre' });//Buscar express validator para hacerlo mas sencillo y no validar campo a campo
    }
    if (password != confirm_password) {
        error.push({ text: 'Las contraseñas no son iguales, verifique' });
    }
    if (password.length < 4) {
        error.push({ text: 'La contraseña debe ser por lo menos de 4 caracteres' });
    }
    if (error.length > 0) {
        res.render('users/signup', { error, nombre, email, password, confirm_password });
    } else {
        // res.send('OK')
        const emailUser = await user.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'El email ya esta registrado, prueba con otro');
            res.redirect('/users/signup');
        }
        const newUser = new user({ nombre, email, password });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Estas registrado');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout', (req, res) => {
    req.logOut();
    res.redirect('/index');
})


module.exports = router;
