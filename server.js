const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const surls = require('./models/surls');
const password = require('./models/password');
const app = express();
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://127.0.0.1/urlShortner', { useNewUrlParser: true, useUnifiedTopology: true });
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: 'fklsjflkdjlajf',
        resave: false,
        saveUninitialized: false,
    })
);


const requireAuth = (req, res, next) => {
    if (req.session && req.session.username) {

        next();
    } else {

        res.redirect('/login');
    }
};

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', async (req, res) => {
    const vn = await req.body.name;
    const vp = await req.body.password;
    const u = await password.findOne({ name: vn });
    if (u == null) {
        res.render('error');
    } else {
        const compare = await bcrypt.compare(vp, u.password);
        if (compare) {
            req.session.username = vn; 
            res.render('index', { username: vn });
        } else {
            res.render('error');
        }
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});

app.get('/register', (req, res) => { res.render('register.ejs') })
app.post('/register', async (req, res) => {
    const vn = await req.body.name
    const cvn = await password.findOne({ name: vn })
    if (cvn != null) {
        res.render('already.ejs')
    }
    else {
        const hashp = await bcrypt.hash(req.body.password, 7)
        await password.create({ name: req.body.name, password: hashp })
        res.render('rs.ejs')
    }
})
app.post('/goback', requireAuth, async (req, res) => {
    const vname = await req.body.username;
    res.render('index', { username: vname })
})
app.post('/fsurls', requireAuth, async (req, res) => {
    const f = req.body.fs;
    const short = await surls.findOne({ full: f, username: req.body.username })
    if (short == null) res.render('doesnot', { username: await req.body.username })
    else
        res.render('index22', { short: short, username: await req.body.username })
})
app.post('/ssurls', requireAuth, async (req, res) => {
    const ns = req.body.ns;
    const short = await surls.findOne({ note: ns, username: req.body.username })
    if (short == null) res.render('doesnot', { username: await req.body.username })
    else
        res.render('index22', { short: short, username: await req.body.username })
})
app.post('/sshort', requireAuth, async (req, res) => {
    const ss = req.body.ss;
    const short = await surls.findOne({ Shorturl: ss, username: req.body.username })
    if (short == null) res.render('doesnot', { username: await req.body.username })
    else
        res.render('index22', { short: short, username: await req.body.username })
})

app.post('/surls', requireAuth, async (req, res) => {
    await surls.create({ full: req.body.fullUrl, note: req.body.NOTE, username: req.body.username })
    const f = req.body.fullUrl;
    const short = await surls.findOne({ full: f, note: req.body.NOTE })
    res.render('index2', { short: short, username: await req.body.username })
})


app.get('/:shurl', async (req, res) => {
    const f = await surls.findOne({ Shorturl: req.params.shurl })
    if (f == null) return res.sendStatus(404)
    else
        res.redirect(f.full)
})

app.listen(process.env.PORT || 5000);
