const _ = require("lodash");
const {writeFile} = require("./utils");
const {prepareData} = require("./prepareData");


const fileName = ['a_an_example.in.txt', 'b_better_start_small.in.txt', 'c_collaboration.in.txt', 'd_dense_schedule.in.txt', 'e_exceptional_skills.in.txt', 'f_find_great_mentors.in.txt']

const findPerson = ({ people, projectSkill, levelSkill }) => {
    return people.find(({ skills }) => skills.find(({ skill, level }) => {
        return skill === projectSkill && level >= levelSkill
    }))
}

const findIntern = ({ people, projectSkill }) => {
    return people.find(({ skills }) => !skills.find(({ skill }) => {
        return skill === projectSkill
    }))
}

fileName.forEach(file => {
    const { contributors, projects } = prepareData(file)
    const orderProjects = _.orderBy(projects, ['best', 'score', 'days'], ['asc', 'desc', 'asc']);
    const finalProjects = []

    orderProjects.forEach(project => {
        const finalProject = {name: project.name, people: []}
        const juniors = []
        const interns = []
        project.skills.forEach(({ skill: projectSkill, level: levelSkill }) => {
            let person
            const alreadyInProject = findPerson({ people: finalProject.people, projectSkill, levelSkill })
            if (alreadyInProject) {
                if (levelSkill === 1) {
                    person = findIntern({ people: contributors, projectSkill })
                    interns.push({ intern: person, skill: projectSkill, level: 0})
                } else {
                    person = findPerson({ people: contributors, projectSkill, levelSkill: levelSkill - 1 })
                    const juniorSkill = person.skills.find(skill => skill.skill === projectSkill)
                    juniors.push({ junior: person, skill: juniorSkill.skill, level: juniorSkill.level })
                }
            } else {
                person = findPerson({ people: contributors, projectSkill, levelSkill })
            }
            if (person && !finalProject.people.find(n => n === person)) {
                finalProject.people.push(person)
            }
        })
        if (project.skills.length === finalProject.people.length) {
            finalProjects.push({name: finalProject.name, people: finalProject.people.map(({ name }) => name)})
            juniors.forEach(({ junior }) => {
                junior.level += 1
            })
            interns.forEach(({ intern }) => {
                intern.level += 1
            })
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
