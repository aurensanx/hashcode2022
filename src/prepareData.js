const {readFile} = require("./utils");

const prepareData = filename => {

    const {headData, bodyData} = readFile(filename)
// preprocessing data specific problem
    const [C, P] = headData.split(" ").map(h => parseInt(h));

    const contributors = []
    const projects = []

    for (let i = 0; i < bodyData.length; i++) {
        if (contributors.length < C) {
            const [name, numberOfSkills] = bodyData[i].split(" ")
            contributors.push({ name, skills: [] })
            for (let j = 0; j < numberOfSkills; j++) {
                const [skill, level] = bodyData[i+j+1].split(" ")
                contributors[contributors.length - 1].skills.push({ skill, level: +level })
            }
            i += +numberOfSkills
        } else {
            const [name, days, score, best, roles] = bodyData[i].split(" ")
            projects.push({ name, days: +days, score: +score, best: +best, roles: +roles, skills: [] })
            for (let j = 0; j < roles; j++) {
                const [skill, level] = bodyData[i+j+1].split(" ")
                projects[projects.length - 1].skills.push({ skill, level: +level })
            }
            i += +roles
        }
    }
    return ({ contributors, projects })
}

module.exports = {prepareData};