import {useEffect, useState,} from "react"

import styles from './ProjectForm.module.css'
import Input from '../Form/Input'
import Select from '../Form/Select'
import SubmitButton from '../Form/SubmitButton'
function ProjectForm({handleSubmit, btnText, projectData}){
    
    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || {})

    useEffect(() => {
        fetch ("http://localhost:5000/categories",{
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((resp) => resp.json()).then((data)=>{setCategories(data)}).catch((err) => console.log(err))
    },[])

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
    }
    function handleChange(e){
        setProject({...project, [e.target.name]: e.target.value}) 
    }

    function handleSelect(e){
        setProject({...project, categories:{
            id: e.target.value,
            name: e.target.options[e.target.selectedIndex].text,
        },
    })
    }

    return (
        <form onSubmit={submit} className={styles.form}>
           <Input type="text" text="Nome do Projeto" name="name" placeholder="Insira nome do projeto" handleOnChange={handleChange} value={project.name ? project.name : ''}/>
           <Input type="number" text="Orçamento do Projet" name="budget" placeholder="Insira orçamento total" handleOnChange={handleChange} value={project.budget ? project.budget : ''}/>
            <Select name="category_id" text="Selecione a categoria" options={categories} handleOnChange={handleSelect} value={project.categories ? project.categories.id : ''}/>
            <SubmitButton text={btnText} />
        </form>
    )
}

export default ProjectForm