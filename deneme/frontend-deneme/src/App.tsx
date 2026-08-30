import { useState } from 'react'
import ItemList from './ItemList'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface Ulke {
  id: number
  ad: string
  kod: string
}

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const [items, setItems] = useState<string[]>([])

  const veriler: Ulke[] = [
  { id: 1, ad: 'Türkiye', kod: 'TR' },
  { id: 2, ad: 'Almanya', kod: 'DE' },
  { id: 3, ad: 'Fransa',  kod: 'FR' },
  ]

  const kolonlar: ColumnsType<Ulke> = [
  { title: 'Ülke Adı', dataIndex: 'ad', key: 'ad' },
  { title: 'Kod',      dataIndex: 'kod',key: 'kod'},
  {
    title: 'İşlem',
    key: 'islem',
    render: (_, row) => <button onClick={() => alert(row.kod)}>Sil</button>,
  },
]

  return (
    <div>
      <p>Sayı : {count}</p>
      <button onClick={() => setCount(count + 1)}>Arttır</button>
      
      <hr />

      <input value={text} onChange={(e) => setText(e.target.value)} />

      <button
        onClick={
          () => {
          if (text.trim() === ''){return}
          setItems([...items, text])
          setText('')
        }}
      >
        Ekle
      </button>

      <ItemList items={items} onDelete={(index) => setItems(items.filter((_, i) => i !== index))} />

      
      <Table columns={kolonlar} dataSource={veriler} rowKey="id" />

    </div>
  )
}

export default App
