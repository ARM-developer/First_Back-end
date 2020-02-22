'use strict'

var Project = require('../models/project');

var controller = {
    home : function(req, res){
        return res.status(200).send({
            message : "soy la home"
        });
    },

    test : function(req, res){
        return res.status(200).send({
            message : "soy el metodo o accion del controlador project"
        });
    },
    
    saveProject : function(req, res){
        var project = new Project();
        var params = req.body;

        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.years = params.years;
        project.langs = params.langs;
        project.image = null;

        project.save((err, projectStored) => {
            if(err) res.status(500).send({message: 'Error al guardar el documento'});

            if(!projectStored) res.status(404).send({message: 'No se ha podido guardar el documento en la base de datos'});

            return res.status(200).send({project: projectStored});
        });
    },

    getProject: function(req, res){
        var projectId = req.params.id;

        if(projectId == null) res.status(404).send({message: 'El proyecto no existe'});

        Project.findById(projectId, (err, project) =>{

            if(err) res.status(500).send({message: 'Error al devolver el documento'});

            if(!projectId) res.status(404).send({message: 'El proyecto no existe'});
            
            return res.status(200).send({
                project
            });

        });
    },

    getProjects : function(req, res){
        Project.find({}).sort('-years').exec((err, projects) => {
            if(err) res.status(500).send({message: 'Error al devolver los datos'});

            if(!projects) res.status(404).send({message: 'No hay proyectos que mostrar'});
            
            return res.status(200).send({ projects });
        });
    },

    updateProject : function(req, res){
        var projectId = req.params.id;
        var update = req.body;
        
        console.log(projectId);
        
       
        Project.findByIdAndUpdate(projectId, update, (err, projectUpdated) => {

            if(err) res.status(500).send({message: 'Error al actualizar los datos'});

            if(!projects) res.status(404).send({message: 'No existe proyecto para actualizar'});
            
            return res.status(200).send({ 
                Project : projectUpdated 
            });
        });
    },
}; 

module.exports = controller;