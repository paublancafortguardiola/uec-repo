// Imports
const express = require('express')
const app = express()
const port = process.env.PORT

// Requiring fs module in which
// readFile function is defined.
const fs = require('fs')

// Static files
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Set views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
    res.render('index', {})
})

app.post('/buscar', (req,res) => {
    capçalera = ` ${allargar_fins("núm",3)} : ${allargar_fins("nom",65)} ${allargar_fins("desnivell (m)",15)}  ${allargar_fins("distància (km)",15)}  ${allargar_fins("accés amb tren",15)}  ${allargar_fins("lloc on dormir",30)}`
    missatge_sortides = ""
    numeros_sortides = ""
    for (const [key, value] of Object.entries(sortides)) {
        if ((parseInt(value.desnivell, 10) < parseInt (req.body.desnivell, 10) || req.body.desnivell == "desnivell màxim") && (parseInt(value.distancia, 10) < parseInt (req.body.distancia, 10) || req.body.distancia == "distància màxima") && (value.tren == req.body.tren || req.body.tren == "no cal tren") && (value.lloc_dormir == req.body.lloc_dormir || req.body.lloc_dormir == "")){
            missatge_sortides = missatge_sortides + ` ${allargar_fins(key,3)} : ${allargar_fins(value.nom,65)} ${allargar_fins(value.desnivell,15)}  ${allargar_fins(value.distancia,15)}  ${allargar_fins(value.tren,15)}  ${allargar_fins(value.lloc_dormir,30)},`
            if (numeros_sortides.length > 0){
                numeros_sortides = numeros_sortides + `,${key}`
            }
            else{
                numeros_sortides = numeros_sortides + `${key}` 
            }
        }           
      }
      missatge_sortides = missatge_sortides.slice(0, -1)
    res.render('buscar', {capçalera: capçalera, text: missatge_sortides, numeros_sortides:numeros_sortides})
});

app.post('/imprimir', (req,res) => {
    sortida = sortides[req.body.número_sortida.slice(-1)]
    res.render('imprimir', { text1: sortida.nom, text2: sortida.desnivell, text3: sortida.distancia, text4: sortida.tren, text5: sortida.lloc_dormir, text6: sortida.descripcio})
});

app.post('/crear', (req,res) => {
    nova_sortida = 
    sortides[(Object.keys(sortides).length+1).toString()] = new Sortida(req.body.nom, req.body.desnivell, req.body.distancia, req.body.tren, req.body.lloc_dormir, req.body.descripcio)

    // Actualitzar el fitxer .txt
    sortides_list = ""
    for (const [key, value] of Object.entries(sortides)) {
        if (key == '1'){
            sortides_list = sortides_list + `${key}; ${value.nom}; ${value.desnivell}; ${value.distancia}; ${value.tren}; ${value.lloc_dormir}; ${value.descripcio} `
        }
        else {
            sortides_list = sortides_list + `; ${key}; ${value.nom}; ${value.desnivell}; ${value.distancia}; ${value.tren}; ${value.lloc_dormir}; ${value.descripcio} `
        }
    } 

    fs.writeFile('sortides.txt', sortides_list, err => {
        if (err) console.error(err);
        else console.log('Data written to file successfully.');
    });
    console.log(sortides_list)
    res.render('index', {})
});

// Funció que afegeix espais fins que una string té la longitud indicada
function allargar_fins(str, longitud) {
    n_espais = longitud-str.length
    console.log(n_espais)
    if (n_espais > 0){
        for (let i = 0; i < n_espais; i++){
        str = str + "_"
        }
    }
    return str;
  }

var sortides = {};

class Sortida {
    constructor(nom, desnivell, distancia, tren, lloc_dormir, descripcio) {
      this.nom = nom;
      this.desnivell = desnivell;
      this.distancia = distancia;
      this.tren = tren;
      this.lloc_dormir = lloc_dormir;
      this.descripcio = descripcio
    }
  }

// Extreure el diccionari de sortides del fitxer de text 
fs.readFile('sortides.txt', 'utf-8', (err, sortides_list) => {
    if (err) throw err;
    sortides_list = sortides_list.split("; ")
    for (let i = 0; i < sortides_list.length/7; i++){
        sortides[(i+1).toString()] = new Sortida(sortides_list[i*7+1], sortides_list[i*7+2], sortides_list[i*7+3], sortides_list[i*7+4], sortides_list[i*7+5], sortides_list[i*7+6])
    }
    console.log(sortides);
})

// Listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`))
