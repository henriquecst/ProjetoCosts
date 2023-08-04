import {Link} from 'react-router-dom'
import {BsPencil, BsFillTrashFill} from 'react-icons/bs'

import styles from './ProjectCard.module.css'



function ProjectCard({id, name, budget, categories, handleRemove}) {
    
    const remove = (e) => {
        e.preventDefault()
        handleRemove(id)
    }
    
    return(
       <div className={styles.project_card}>
            <h4>{name}</h4>
            <p>
                <span>Orçamento:</span> R${budget}
            </p>
            <p className={styles.categories_text}>
                <span className={`${styles[categories.toLowerCase()]}`}></span> {categories}
            </p>
            <div className={styles.project_card_actions}>
                <Link to={`/project/${id}`}>
                    <BsPencil/> Editar
                </Link>
                <button onClick={remove}>
                    <BsFillTrashFill/> Excluir
                </button>
            </div>
       </div>
    )

}

export default ProjectCard