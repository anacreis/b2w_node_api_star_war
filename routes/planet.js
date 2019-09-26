const express = require('express');
const url = require('url');
const request = require('sync-request');
const router = express.Router();
const Planet = require('../models/planet');

// Getting all planets
router.get('/', async (req, res) => {
    try {
        const url_parts = url.parse(req.url, true);
        const query = url_parts.query;
        if (query.name) {
            const planet = await Planet.find({"name": query.name});
            res.json(planet)
        } else if (query.id) {
            const planet = await Planet.findById(query.id);
            res.json(planet)
        } else {
            const planet = await Planet.find();
            res.json(planet)
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

// Creating one planet
router.post('/', async (req, res) => {

    try {
        let planets = await Planet.find({"name": req.body.name});
        if (planets.length != 0) {
            res.status(400).json({message: "Planet already save"})
        }
        resp = request('GET', `https://swapi.co/api/planets/?search=${req.body.name}`, {
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
        });
        let films_count = 0;
        if (JSON.parse(resp.getBody('utf8')).results != 0) {
            films_count = JSON.parse(resp.getBody('utf8')).results[0].films.length;
        }
        const planet = new Planet({
            name: req.body.name,
            climate: req.body.climate,
            terrain: req.body.terrain,
            films: films_count
        });
        const newPlanet = await planet.save();
        res.status(201).json(newPlanet)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

// Getting one planet
router.get('/:id', getPlanet, (req, res) => {
    res.json(res.planet)
});

// Getting one planet
router.get('/name/:name', getPlanetByName, (req, res) => {
    res.json(res.planet)
});

// Updating one planet
router.patch('/:id', getPlanet, async (req, res) => {
    if (req.body.name != null) {
        res.planet.name = req.body.name
    }
    if (req.body.climate != null) {
        res.planet.climate = req.body.climate
    }
    if (req.body.terrain != null) {
        res.planet.terrain = req.body.terrain
    }
    try {
        const updatedPlanet = await res.planet.save();
        res.json(updatedPlanet)
    } catch (err) {
        res.status(400).json({message: err.message})
    }

});

// Deleting one planet
router.delete('/:id', getPlanet, async (req, res) => {
    try {
        await res.planet.remove();
        res.json({message: 'Deleted This Planet'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

// Middleware function for gettig planet object by ID
async function getPlanet(req, res, next) {
    try {
        planet = await Planet.findById(req.params.id);
        if (planet == null) {
            return res.status(404).json({message: 'Cant find planet'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.planet = planet;
    next()
}

// Middleware function for gettig planet object by Name
async function getPlanetByName(req, res, next) {
    try {
        planet = await Planet.find({"name": req.params.name});
        if (planet == null) {
            return res.status(404).json({message: 'Cant find planet'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.planet = planet;
    next()
}

module.exports = router;
