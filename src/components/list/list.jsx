import { useParams } from "react-router-dom"

const List = () => {
    const { id } = useParams()


    return (
        <div>this is the list of {id} files</div>

    
    )
}

export default List