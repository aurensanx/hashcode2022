const _ = require("lodash");
const {writeFile} = require("./utils");
const {prepareData} = require("./prepareData");


const fileName = ['a_an_example.in.txt', 'b_better_start_small.in.txt', 'c_collaboration.in.txt', 'd_dense_schedule.in.txt', 'e_exceptional_skills.in.txt', 'f_find_great_mentors.in.txt']

fileName.forEach(file => {
    const { contributors, projects } = prepareData(file)
    _.orderBy(projects, ['scorer'], ['desc']);
    const finalProjects = []

    projects.forEach(project => {
        const finalProject = {name: project.name, people: []}
        project.skills.forEach(({ skill: projectSkill, level: levelSkill }) => {
            const person = contributors.find(({ skills, name, occupied }) => skills.find(({ skill, level }) => {
                return skill === projectSkill && level >= levelSkill && !occupied
            }))
            if (person) {
                person.occupied = true
                finalProject.people.push(person.name)
            }
        })
        if (project.skills.length === finalProject.people.length) {
            finalProjects.push(finalProject)
        }
    })

// first line, number of executed projects
// E sections, name of the project, then another line with contributors in the same order

// escribir respuesta
    let answer = finalProjects.length + "\n"
    finalProjects.forEach(fp => {
        answer += fp.name + "\n"
        answer += fp.people.join(' ') + "\n"
    })
    writeFile(answer, file);

})
