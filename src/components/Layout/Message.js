import {useState, useEffect} from 'react'
import styles from "./Message.module.css"

function Message({type, msg}){

    const [visivel, setVisual] = useState(false)

    useEffect(() =>{
        if(!msg){
            setVisual(false)
            return
        }
        setVisual(true)


        const timer = setTimeout(() =>{
            setVisual(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [msg])
    
    return (
        <>
            {visivel && (
                <div className={`${styles.message} ${styles[type]}`}>{msg}</div>
            )}
        </>
    )
}

export default Message