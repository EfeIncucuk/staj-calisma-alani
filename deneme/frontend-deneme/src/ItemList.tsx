interface ItemListProps {
    items: string[]
    onDelete: (index: number) => void
}

function ItemList(props: ItemListProps){
    return (
        <ul>
            {props.items.map((item, index) => (
                <li key={index}>
                    {item}
                    <button onClick={() => props.onDelete(index)}>Sil</button>
                </li>
            ))}
        </ul>
    )
}

export default ItemList
