'use strict';

const helpers = require('../helpers');
const user = require('../../user');
const db = require('../../database');
const fetch = require('node-fetch');

const Career = module.exports;

Career.register = async (req, res) => {
    const userData = req.body;
    try {
        const userCareerData = {
            student_id: userData.student_id,
            major: userData.major,
            age: userData.age,
            gender: userData.gender,
            gpa: userData.gpa,
            extra_curricular: userData.extra_curricular,
            num_programming_languages: userData.num_programming_languages,
            num_past_internships: userData.num_past_internships,
        };

        // userCareerData.prediction = Math.round(Math.random()); // TODO: Change this line to do call and retrieve actual candidate success prediction from the model instead of using a random number
       
        const apiEndpoint = "url" //NOT WORKING YET
        const response = await fetch(apiEndpoint, {
            method: "POST",
            body: JSON.stringify(userCareerData),
            headers: {
                'Content-Type': 'application/json'
            }
        }); // https://www.npmjs.com/package/node-fetch "Post with JSON" section
        
        const resJson = await response.json();
        userCareerData.prediction = resJson['good_employee'];
        await user.setCareerData(req.uid, userCareerData);
        db.sortedSetAdd('users:career', req.uid, req.uid);
        
    } catch (err) {
        console.log(err);
        helpers.noScriptErrors(req, res, err.message, 400);
    }
};