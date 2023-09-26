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

app.post('/obrir', (req,res) => {
    sortida = sortides[req.body.número_sortida]
    res.render('obrir', {text0: sortida.numero, text1: sortida.nom, text2: sortida.desnivell, text3: sortida.distancia, text4: sortida.tren, text5: sortida.lloc_dormir, text6: sortida.descripcio})
});

app.post('/crear', (req,res) => {
    sortides[(Object.keys(sortides).length+1).toString()] = new Sortida((Object.keys(sortides).length+1).toString(), req.body.nom, req.body.desnivell, req.body.distancia, req.body.tren, req.body.lloc_dormir, req.body.descripcio, "")

    // Actualitzar el fitxer sortides.txt
    sortides_list = ""
    for (const [key, value] of Object.entries(sortides)) {
            sortides_list = sortides_list + `${key}; ${value.nom}; ${value.desnivell}; ${value.distancia}; ${value.tren}; ${value.lloc_dormir}; ${value.descripcio}; ${value.historial}; `
        }
    sortides_list = sortides_list.slice(0, -2)
    fs.writeFile('sortides.txt', sortides_list, err => {
        if (err) console.error(err);
        else console.log('Data written to file successfully.');
    });
    console.log(sortides_list)

    res.render('index', {})
});

app.post('/historial', (req,res) => {
    sortida = sortides[req.body.número_sortida]
    grups = grups
    res.render('historial', {historial: sortida.historial.toString(), grups: grups})
})

app.post('/historial_personal', (req,res) => {
    persona = persones[req.body.nom]
    res.render('historial_personal', {nom: persona.nom, any_naixement: persona.any_naixement, historial: persona.historial})
})

app.post('/entrar_historial', (req,res) => {
    var participants_list = ""

    data = req.body.data

    moni1 = req.body.moni1
    moni2 = req.body.moni2
    moni3 = req.body.moni3
    moni4 = req.body.moni4
    moni5 = req.body.moni5
    moni6 = req.body.moni6
    moni7 = req.body.moni7

    if (Object.keys(persones).includes(moni1)){
        participants_list = participants_list + persones[moni1].nom + ","
    }
    if (Object.keys(persones).includes(moni2)){
        participants_list = participants_list + persones[moni2].nom + ","
    }
    if (Object.keys(persones).includes(moni3)){
        participants_list = participants_list + persones[moni3].nom + ","
    }
    if (Object.keys(persones).includes(moni4)){
        participants_list = participants_list + persones[moni4].nom + ","
    }
    if (Object.keys(persones).includes(moni5)){
        participants_list = participants_list + persones[moni5].nom + ","
    }
    if (Object.keys(persones).includes(moni6)){
        participants_list = participants_list + persones[moni6].nom + ","
    }
    if (Object.keys(persones).includes(moni7)){
        participants_list = participants_list + persones[moni7].nom + ","
    }

    generacio1 = req.body.generacio1
    generacio2 = req.body.generacio2
    generacio3 = req.body.generacio3
    generacio4 = req.body.generacio4

    if (Object.keys(grups).includes(generacio1)){
        participants_list = participants_list + grups[generacio1] + ","
    }
    if (Object.keys(grups).includes(generacio2)){
        participants_list = participants_list + grups[generacio2] + ","
    }
    if (Object.keys(grups).includes(generacio3)){
        participants_list = participants_list + grups[generacio3] + ","
    }
    if (Object.keys(grups).includes(generacio4)){
        participants_list = participants_list + grups[generacio4]
    }

    participants_list = allargar_llista_fins(participants_list,30)
    res.render('entrar_historial', {text: participants_list})
})

app.post('/entrar_participants', (req,res) => {
    participants_list = ""
    if (typeof req.body.participant0 == "string"){
        participants_list = participants_list + req.body.participant0 + " | "
        persones[req.body.participant0].historial = persones[req.body.participant0].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant1 == "string"){
        participants_list = participants_list + req.body.participant1 + " | "
        persones[req.body.participant1].historial = persones[req.body.participant1].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant2 == "string"){
        participants_list = participants_list + req.body.participant2 + " | "
        persones[req.body.participant2].historial = persones[req.body.participant2].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant3 == "string"){
        participants_list = participants_list + req.body.participant3 + " | "
        persones[req.body.participant3].historial = persones[req.body.participant3].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant4 == "string"){
        participants_list = participants_list + req.body.participant4 + " | "
        persones[req.body.participant4].historial = persones[req.body.participant4].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant5 == "string"){
        participants_list = participants_list + req.body.participant5 + " | "
        persones[req.body.participant5].historial = persones[req.body.participant5].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant6 == "string"){
        participants_list = participants_list + req.body.participant6 + " | "
        persones[req.body.participant6].historial = persones[req.body.participant6].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant7 == "string"){
        participants_list = participants_list + req.body.participant7 + " | "
        persones[req.body.participant7].historial = persones[req.body.participant7].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant8 == "string"){
        participants_list = participants_list + req.body.participant8 + " | "
        persones[req.body.participant8].historial = persones[req.body.participant8].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant9 == "string"){
        participants_list = participants_list + req.body.participant9 + " | "
        persones[req.body.participant9].historial = persones[req.body.participant9].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant10 == "string"){
        participants_list = participants_list + req.body.participant10 + " | "
        persones[req.body.participant10].historial = persones[req.body.participant10].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant11 == "string"){
        participants_list = participants_list + req.body.participant11 + " | "
        persones[req.body.participant11].historial = persones[req.body.participant11].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant12 == "string"){
        participants_list = participants_list + req.body.participant12 + " | "
        persones[req.body.participant12].historial = persones[req.body.participant12].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant13 == "string"){
        participants_list = participants_list + req.body.participant13 + " | "
        persones[req.body.participant13].historial = persones[req.body.participant13].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant14 == "string"){
        participants_list = participants_list + req.body.participant14 + " | "
        persones[req.body.participant14].historial = persones[req.body.participant14].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant15 == "string"){
        participants_list = participants_list + req.body.participant15 + " | "
        persones[req.body.participant15].historial = persones[req.body.participant15].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant16 == "string"){
        participants_list = participants_list + req.body.participant16 + " | "
        persones[req.body.participant16].historial = persones[req.body.participant16].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant17 == "string"){
        participants_list = participants_list + req.body.participant17 + " | "
        persones[req.body.participant17].historial = persones[req.body.participant17].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant18 == "string"){
        participants_list = participants_list + req.body.participant18 + " | "
        persones[req.body.participant18].historial = persones[req.body.participant18].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant19 == "string"){
        participants_list = participants_list + req.body.participant19 + " | "
        persones[req.body.participant19].historial = persones[req.body.participant19].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant20 == "string"){
        participants_list = participants_list + req.body.participant20 + " | "
        persones[req.body.participant20].historial = persones[req.body.participant20].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant21 == "string"){
        participants_list = participants_list + req.body.participant21 + " | "
        persones[req.body.participant21].historial = persones[req.body.participant21].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant22 == "string"){
        participants_list = participants_list + req.body.participant22 + " | "
        persones[req.body.participant22].historial = persones[req.body.participant22].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant23 == "string"){
        participants_list = participants_list + req.body.participant23 + " | "
        persones[req.body.participant23].historial = persones[req.body.participant23].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant24 == "string"){
        participants_list = participants_list + req.body.participant24 + " | "
        persones[req.body.participant24].historial = persones[req.body.participant24].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant25 == "string"){
        participants_list = participants_list + req.body.participant25 + " | "
        persones[req.body.participant25].historial = persones[req.body.participant25].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant26 == "string"){
        participants_list = participants_list + req.body.participant26 + " | "
        persones[req.body.participant26].historial = persones[req.body.participant26].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant27 == "string"){
        participants_list = participants_list + req.body.participant27 + " | "
        persones[req.body.participant27].historial = persones[req.body.participant27].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant28 == "string"){
        participants_list = participants_list + req.body.participant28 + " | "
        persones[req.body.participant28].historial = persones[req.body.participant28].historial + ", " + data + ": " + sortida.numero
    }
    if (typeof req.body.participant29 == "string"){
        participants_list = participants_list + req.body.participant29 + " | "
        persones[req.body.participant29].historial = persones[req.body.participant29].historial + ", " + data + ": " + sortida.numero
    }

    participants_list = participants_list.slice(0, -3);
    sortida.historial = sortida.historial + ", " + data + ": " + participants_list

    // Eliminiar ", " inicials en cas que n'hi hagi perquè era la primera sortida de l'historial
    for (const [nom, persona] of Object.entries(persones)) {
        if (persona.historial.slice(0,2) == ", ") {
            persona.historial = persona.historial.slice(2)
        }
    }
    for (const [numero, sortida] of Object.entries(sortides)) {
        if (sortida.historial.slice(0,2) == ", ") {
            sortida.historial = sortida.historial.slice(2)
        }
    }

    // Actualitzar el fitxer sortides.txt
    sortides_list = ""
    for (const [key, value] of Object.entries(sortides)) {
            sortides_list = sortides_list + `${key}; ${value.nom}; ${value.desnivell}; ${value.distancia}; ${value.tren}; ${value.lloc_dormir}; ${value.descripcio}; ${value.historial}; `
        }
    sortides_list = sortides_list.slice(0, -2)
    fs.writeFile('sortides.txt', sortides_list, err => {
        if (err) console.error(err);
    });
    console.log(sortides_list)

    // Actualitzar el fitxer persones.txt
    persones_list = ""
    for (const [key, value] of Object.entries(persones)) {
            persones_list = persones_list + `${value.nom}; ${value.any_naixement}; ${value.historial}; `
        }
    persones_list = persones_list.slice(0, -2)
    fs.writeFile('persones.txt', persones_list, err => {
        if (err) console.error(err);
        else console.log('Data written to file successfully.');
    });
    console.log(persones_list)
    res.render('index', {})
})

app.post('/afegir_persona', (req,res) => {
    persones[req.body.nom] = new Persona(req.body.nom, req.body.any_naixement, "")
    console.log(persones)

    // Actualitzar grups
    if (grups[req.body.any_naixement]){
        grups[req.body.any_naixement] = grups[req.body.any_naixement] + `, ${req.body.nom}`
    }
    else {
        grups[req.body.any_naixement] =  `${req.body.nom}`
    }
    
    console.log(grups)

    // Actualitzar el fitxer persones.txt
    persones_list = ""
    for (const [key, value] of Object.entries(persones)) {
            persones_list = persones_list + `${value.nom}; ${value.any_naixement}; ${value.historial}; `
        }
    persones_list = persones_list.slice(0, -2)
    fs.writeFile('persones.txt', persones_list, err => {
        if (err) console.error(err);
        else console.log('Data written to file successfully.');
    });
    console.log(persones_list)

    res.render('index', {})
})
//.......................................................................

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

// Funció que afegeix elements a una llista en forma de string fins que té la longitud indicada
function allargar_llista_fins(str, elements) {
    n_elements = elements-str.split(',').length
    if (n_elements > 0){
        for (let i = 0; i < n_elements; i++){
        str = str + ", "
        }
    }
    return str;
}

// diccionari amb les sortides
var sortides = {};

// definició de la classe Sortida
class Sortida {
    constructor(numero, nom, desnivell, distancia, tren, lloc_dormir, descripcio, historial) {
        this.numero = numero;
        this.nom = nom;
        this.desnivell = desnivell;
        this.distancia = distancia;
        this.tren = tren;
        this.lloc_dormir = lloc_dormir;
        this.descripcio = descripcio;
        this.historial = historial;
    }
  }

// diccionari amb les persones
persones = {}

// definició dels grups
grups = {}


// definicio de la classe Persona
class Persona {
    constructor(nom, any_naixement, historial) {
        this.nom = nom;
        this.any_naixement = any_naixement;
        this.historial = historial;
    }
  }

// Extreure el diccionari de sortides del fitxer de text corresponent
fs.readFile('sortides.txt', 'utf-8', (err, sortides_list) => {
    if (err) throw err;
    sortides_list = sortides_list.split("; ")
    for (let i = 0; i < sortides_list.length/8; i++){
        sortides[(i+1).toString()] = new Sortida(i+1, sortides_list[i*8+1], sortides_list[i*8+2], sortides_list[i*8+3], sortides_list[i*8+4], sortides_list[i*8+5], sortides_list[i*8+6], sortides_list[i*8+7])
    }
    console.log(sortides);
})

// Extreure el diccionari de persones del fitxer de text corresponent
fs.readFile('persones.txt', 'utf-8', (err, persones_list) => {
    if (err) throw err;
    persones_list = persones_list.split("; ")
    console.log(persones_list)
    for (let i = 0; i < persones_list.length/3; i++){
        persones[persones_list[i*3]] = new Persona(persones_list[i*3], persones_list[i*3+1], persones_list[i*3+2])
    }

    console.log(persones)
    for (const [key, value] of Object.entries(persones)) {
        if (grups[value.any_naixement]){
            grups[value.any_naixement] = grups[value.any_naixement] + `, ${value.nom}`
        }
        else {
            grups[value.any_naixement] =  `${value.nom}`
        }
    }
    console.log(grups)
})

// Listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`))
