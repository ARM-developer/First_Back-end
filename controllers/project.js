'use strict'

var Project = require('../models/project');
var fs = require('fs');
var path = require('path');

var controller = {
    /********** ruta home metodo get que nos devuelve un mensaje************/
    home : function(req, res){
        return res.status(200).send({
            message : "soy la home"
        });
    },

    /************ ruta test metodo post que nos devuelve un mensaje******************/

    test : function(req, res){
        return res.status(200).send({
            message : "soy el metodo o accion del controlador project"
        });
    },
    
    /************ ruta save-project metodo post que agrega un nuevo bson************/
    saveProject : function(req, res){
        var project = new Project();
        var params = req.body;

        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;

        project.save((err, projectStored) => {
            if(err) res.status(500).send({message: 'Error al guardar el documento'});

            if(!projectStored) res.status(404).send({message: 'No se ha podido guardar el documento en la base de datos'});

            return res.status(200).send({project: projectStored});
        });
    },

    /************ ruta project/:id? metodo get que nos devuelve un documento ************/
    getProject: function(req, res){
        var projectId = req.params.id;

        if(projectId == null) res.status(404).send({message: 'El proyecto no existe'});

        Project.findById(projectId, (err, project) =>{

            if(err) res.status(500).send({message: 'Error al devolver el documento'});

            if(!projectId) res.status(404).send({message: 'El proyecto no existe'});
            
            return res.status(200).send({
                project: project
            });

        });
    },

    /************ ruta projects metodo get que nos devuelve los contenido en la DB ************/
    getProjects : function(req, res){
        Project.find({}).sort('-years').exec((err, projects) => {
            if(err) res.status(500).send({message: 'Error al devolver los datos'});

            if(!projects) res.status(404).send({message: 'No hay proyectos que mostrar'});
            
            return res.status(200).send({ projects });
        });
    },

    /************ ruta project/:id metodo put que nos actualiza un documento ************/
    updateProject : function(req, res){
        var projectId = req.params.id;
        var update = req.body;
        
        Project.findByIdAndUpdate(projectId, update, {new:true}, (err, projectUpdated) => {

            if(err) res.status(500).send({message: 'Error al actualizar los datos'});

            if(!projectUpdated) res.status(404).send({message: 'No existe proyecto para actualizar'});
            
            return res.status(200).send({ 
                project : projectUpdated 
            });
        });
    },

    /************ ruta project/:id metodo delete que nos borra un documento ************/
    deleteProject : function(req, res){
        var projectId = req.params.id;
            
            Project.findByIdAndRemove(projectId, (err, projectRemove) => {
                if(err) return res.status(500).send({message: 'Error al borrar los datos'});

                if(!projectRemove){
                    return res.status(404).send({message: 'No se ha podido borrar, por que no exite'});
                }else{
                    //si el projecto existe comparamos que tenga imagen
                    if(projectRemove.image != null){

                        //esta es la ruta del archivo
                        var path_file = 'uploads/'+projectRemove.image;

                        //fs. es el filesistem
                        fs.unlink(path_file,(err) =>{
                            if(err) res.status(500).send({message: "Error al eliminar la imagen"});
                            
                            return res.status(200).send({
                                project : projectRemove
                            });
                          })
                    }else{
                        return res.status(200).send({
                            project : projectRemove
                        });
                    }
                }
            });
    },

    /************ ruta metodo put que nos actualiza un documento y le carga una imagen ************/
    uploadImage : function(req,res){
        var projectId = req.params.id;
        var fileName = 'Imagen no subida...';

        if(req.files){            
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('/');
            var fileName = fileSplit[1];
            var extSplit = fileName.split('\.');
            var fileExt = extSplit[1];

            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                Project.findByIdAndUpdate(projectId, {image: fileName}, {new : true}, (err, projectUpdated) => {
                        if(err) res.status(500).send({message: 'Imagen no subida...'});
        
                        if(!projectUpdated) res.status(404).send({message: 'El proyecto no existe y no se puede subir la imagen'});
        
                        return res.status(200).send({
                            project: projectUpdated
                        });
                    });
            }else{
                fs.unlink(filePath, (err) =>{
                    return res.status(500).send({
                        message: 'La extensión no es valida'
                    });
                });
            }            
            
        }else{
            return res.status(200).send({
                message: fileName
            });
        }
    },

    /************ ruta metodo get que nos descarga una imagen ************/
    getImageFile: function(req, res){
        var file = req.params.image;
        var path_file = './uploads/'+file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(200).send({
                    message: 'No exite la imagen...'
                });
            }
        });
    }

}; 

module.exports = controller;