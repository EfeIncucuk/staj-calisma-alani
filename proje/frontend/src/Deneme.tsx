import { useState, useEffect } from 'react'
import axios from 'axios'
import type { ColumnsType } from 'antd/es/table'
import { Table } from 'antd'
import { Select } from 'antd'
import { Form, Input, Button } from 'antd'
import { Modal } from 'antd'
import { message } from 'antd'

interface ParaBirimi {
  id: number
  currencyAlphaCode: string
  currencyName: string
}

function Deneme() {
  const [paraBirimleri, setParaBirimleri] = useState<ParaBirimi[]>([])
  const [secili, setSecili] = useState<number | undefined>(undefined)


  const getir = async () => {
      const cevap = await axios.get('/api/currency')
      setParaBirimleri(cevap.data)
  }

  useEffect(() => {
    getir()
  }, [])

  const columns: ColumnsType<ParaBirimi> =[
    {title: 'Para kodu',     dataIndex: 'currencyAlphaCode', key: 'kod'},
    {title: 'Para adı',      dataIndex: 'currencyName',      key: 'isim'},
  ]

  const secenekler = paraBirimleri.map((p) => ({
  value: p.id,
  label: `${p.currencyAlphaCode} - ${p.currencyName}`,
  }))

  const [form] = Form.useForm()

  
  return (
    <>
        <hr />

        <Table columns={columns} dataSource={paraBirimleri} rowKey="id" />

        <hr />

        <Select
              options={secenekler}
              value={secili}
              onChange={(deger) => setSecili(deger)}
              placeholder="Para birimi seçin"
              showSearch
              optionFilterProp='label'
              allowClear
              style={{ width: 300 }}
            /> 
        <p>Seçilen id: {secili}</p>

        <Form 
          form={form}
          onFinish={(values) => {
            const gonderilecek = {
              ...values,
              riskScore: values.riskScore ? Number(values.riskScore) : null,
            }
            Modal.confirm({
              title: 'İşlemi kaydetmek istiyor musunuz?',
              okText: 'Evet',
              cancelText: 'Hayır',
              onOk: async () => {
                console.log(gonderilecek)
                message.success('Kaydedildi')
                form.resetFields()
                await getir()
              },
            })
          }}
          onFinishFailed={(hata) => console.log('DOĞRULAMA HATASI', hata)}
        >
          <Form.Item 
            label="Ülke İsmi"  
            name="countryName"
            rules={[
              {required: true, message: 'Zorunlu alan!'},
              {max: 100, message: 'En fazla 100 karakter'},
            ]}
          >
            <Input maxLength={100} placeholder="Ülke adı"/>
          </Form.Item>

          <Form.Item 
            label="Ülke Kodu(2 Harf)"  
            name="country2AlpCode"
            rules={[
              {required: true, message: 'Zorunlu alan!'},
              {max: 2, message: 'En fazla 2 karakter'},
            ]}
          >
            <Input maxLength={2}/>
          </Form.Item>

          <Form.Item 
            label="Risk Skoru"  
            name="riskScore"
            normalize={(values) => values.replace(/[^1-5]/g, '')}
            rules={[
              {required: true, message: 'Zorunlu alan!'},
              {max: 1, message: 'En fazla 1 karakter'},
              {pattern: /^[1-5]$/, message: '1-5 arası bir değer girin' },
            ]}
          >
            <Input maxLength={1}/>
          </Form.Item>

          <Button type="primary" htmlType="submit">Kaydet</Button>
          <Button onClick={() => form.resetFields()}>Temizle</Button>

        </Form>
        
    </>
  )
}

export default Deneme