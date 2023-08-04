import {useLocation} from 'react-router-dom'
import { useState, useEffect } from 'react'

import Message from "../Layout/Message"

import styles from './Projects.module.css'
import Container from '../Layout/Container'
import Loader from '../Layout/Loader'
import LinkButton from '../Layout/LinkButton'
import ProjectCard from '../Project/ProjectCard'


function Projects(){

    const [projects, setProjects] = useState([])
    const [removeLoader, setRemoveLoader] = useState(false)
    const [projectMsg, setProjectMsg] =  useState('')
    
    
    const location = useLocation()
    
    let text = ''
    if(location.state){
        text = location.state.text
    }

    useEffect(() => {
        setTimeout(() =>{
            fetch('http://localhost:5000/projects', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
        }, 
    }).then((resp) => resp.json()).then((data) => {
        console.log(data)
        setProjects(data)
        setRemoveLoader(true)
    }).catch((err) => console.log(err))}, 300)
},[])

    function removeProjeto(id){
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
         })
         .then((resp) => resp.json())
         .then((data) => {
                setProjects(projects.filter((project) => project.id !== id))
                //mensagem de removação
                setProjectMsg ('Projeto removido com sucesso!')
            })
            .catch((err) => console.log(err))
    }
    

    return (
        <div className={styles.project_container}>
           <div className={styles.title_container}>
           <h1>Meus Projetos</h1>
           <LinkButton to='/newproject' text = 'Criar Projeto'/>
           </div>
            {text && <Message type='success' msg={text}/> }
            {projectMsg && <Message type='success' msg={projectMsg}/> }
            <Container customClass='start'>
                {projects.length > 0 &&
                    projects.map((project)  => <ProjectCard
                    id={project.id}
                    budget={project.budget}
                    name={project.name}
                    categories={project.categories.name}
                    key={project.id}
                    handleRemove={removeProjeto}
                    />)
                }
                {!removeLoader && <Loader/>}
                {removeLoader && projects.length === 0 && (
                    <p>Não há projetos cadastrados</p>
                )}
            </Container>
        </div>
    )
}

export default Projects