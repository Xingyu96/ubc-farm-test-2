/**
 * Created by Xingyu on 5/26/2017.
 */
const bodyParser = require('body-parser');
const express = require('express');
const router = new express.Router();

router.use(bodyParser.json());

var Field = require('mongoose').model('Field');

router.get('/fields', (req, res) => {

    Field.find({}).lean().exec(function (err, fields) {
        if (err) {
            res.send('error retrieveing fields');
        } else {
            res.json({fields});
        }

    });

});

function serverSideValidate(data){
    //validation
    let errors = {};
    if(data.name === '')
        errors.name = "This field is Required";
    //if valid, create post request
    const isValid = Object.keys(errors).length === 0;

    return {errors, isValid};
}

router.post('/fields', (req, res) => {
    const{errors, isValid} = serverSideValidate(req.body);
    if(isValid){
        const {name} = req.body;
        Field.create({name}, function(err, result){
            if(err){
                res.status(500).json({errors: {global: "mongodb errored while saving"}});
            }else{
                delete result.__v;
                res.status(200).json({field: result});
            }
        });
    }else{
        res.status(400).json({errors});
    }

});

module.exports = router;