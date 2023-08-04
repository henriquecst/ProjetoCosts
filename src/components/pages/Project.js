import {parse, v4 as uuidv4} from 'uuid'

import styles from './Project.module.css'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Loader from '../Layout/Loader'
import Container from '../Layout/Container'
import ProjectForm from '../Project/ProjectForm'
import Message from '../Layout/Message'
import ServiceForm from '../Serviços/ServiceForm'
import ServiceCard from '../Serviços/ServiceCard'

function Project(){

    const {id} = useParams()

    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()
    const [showServiceForm, setShowServiceForm] = useState(false)

    useEffect(() => {
        setTimeout(() => {fetch(`http://localhost:5000/projects/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data)
            setServices(data.services)
        })
        .catch((err) => console.log)}, 300)
},[id])

    function postEdit(project) {
        setMessage('')
        if(project.budget < project.cost) {
            ///mengagem valor total
            setMessage ('O orçamento não pode ser menor que o custo do projeto')
            setType ('error')
            return false
        }   
        fetch(`http://localhost:5000/projects/${project.id}`, {
        method:'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
        
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data)
            setShowProjectForm(false)
            //mensagem validação
            setMessage ('Projeto atualizado com sucesso!')
            setType ('success')
        })
        .catch((err) => console.log(err))
        
    }

    function createService(project){
        setMessage("")
        // ultimo serviço
        const ultServico = project.services[project.services.length - 1]
        // gerando id
        ultServico.id = uuidv4()
        const ultServicoCusto = ultServico.cost

        const novoCusto = parseFloat(project.cost) + parseFloat(ultServicoCusto)

        //validação de valor
        if(novoCusto > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setType('error')
            project.services.pop()
            return false
        }

        //adicionando custo de serviço para o total
        project.cost = novoCusto

        // atualizando custo

        fetch(`http://localhost:5000/projects/${project.id}`,{
            method:'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        }).then(
            (resp => resp.json())
        ).then((data) => {
            setShowServiceForm(false)

        }).catch((err) => console.log(err))

    }

    function removeService(id, cost){
        // removendo serviços
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project

        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`,{
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        }).then(
            (resp) => resp.json())
            .then((data) => {
                setProject(projectUpdated)
                setServices(servicesUpdated)
                setMessage('Serviço removido com sucesso!')
            })
            .catch((err) => console.log(err))

    }

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }
    


    return(
        <>
            {project.name ? 
            (<div className={styles.project_details}>
                <Container customClass="column">
                    <div className={styles.datails_container}>
                        {message && <Message type={type} msg={message}/>}
                        <h1>Projeto: {project.name}</h1>
                        <button className={styles.btn} onClick={toggleProjectForm}>
                            {!showProjectForm ? "Editar Projeto" :'Fechar'}
                            </button>
                            {!showProjectForm ? 
                            (<div className={styles.projeto_info}>
                                <p>
                                   <span>Categoria:</span>{project.categories.name}
                                </p>
                                <p>
                                    <span>Total de Orçamento:</span> R${project.budget}
                                </p>
                                <p>
                                    <span>Total de Utilizado:</span> R${project.cost}
                                </p>
                            </div>) :
                            (<div className={styles.projeto_info}>
                                 <ProjectForm handleSubmit={postEdit} btnText='Concluir Edição' projectData={project}/>
                            </div>)}
                    </div>
                    <div className={styles.service_form_container}>
                        <h2>Adicione um serviço:</h2>
                        <button className={styles.btn} onClick={toggleServiceForm}>
                            {!showServiceForm ? 'Adicionar serviço' :'Fechar'}
                        </button>
                        <div className={styles.projeto_info}>
                            {showServiceForm && (<ServiceForm
                                handleSubmit={createService}
                                btnText="Adicionar Serviço"
                                projectData={project}
                                />
                            )}
                        </div>
                    </div>
                    <h2>Serviços</h2>
                    <div>
                    <Container customClass='start'>
                        {services.length > 0 &&
                            services.map((service) => (
                                <ServiceCard
                                    id={service.id}
                                    name={service.nome}
                                    cost={service.cost}
                                    description={service.descricao}
                                    key={service.id}
                                    handleRemove={removeService}
                                />
                            ))
                            }
                        {services.length === 0 && <p>Não há serviços cadastrados.</p>}   
                    </Container>
                    </div>
                </Container>
            </div>) : (<Loader/>)} 
        </>
    )
}


export default Project