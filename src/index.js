const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


//inicializaciones
const app = express();
require('./database');
require('./config/passport');


//Configuracion
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));
app.set('view engine', '.hbs');
//Funciones antes de pasar al server Middlewares
app.use(express.urlencoded({ extended: false }));//Comunicacion con el formulario
app.use(methodOverride('_method'));//Nos sirve para enviar otro tipo de metodos no solo get,post (put,delete)
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Variables globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');//Mensajes de exito
    res.locals.error_msg = req.flash('error_msg');//Mensajes de error
    res.locals.error = req.flash('error');//Mensajes de error
    res.locals.user = req.user || null;//Con esta variable obtendremos los datos de usuario
    next();
});

//Rutas
app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))
// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));
//Server is listenning
app.listen(app.get('port'), () => {
    console.log('Servidor sobre el puerto: ', app.get('port'))
});