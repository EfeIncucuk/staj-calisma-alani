import { Row, Col } from 'antd'
import { Card } from 'antd'
import { Form } from 'antd'
import { Input } from 'antd'
import { Button, Space, Table, Modal, Select, message } from 'antd'
import axios from 'axios'
import { useState, useEffect } from 'react'
import type { ColumnsType } from 'antd/es/table'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface Country {
	id: number
	countryName: string
	countryNameOfficial: string
	countryNameOriginal: string
	country2AlpCode: string
	country3AlpCode: string
	countryNumCode: number
	currencyName: string | null
	languageName: string | null
	phoneCode: number | null
	riskScore: number | null
	accountingRegionCode: number | null
	accountingRegionDesc: string | null
}

interface CurrencyDto {
	id: number
	currencyAlphaCode: string
	currencyName: string
}

interface LanguageDto {
	id: number
	name: string
}

// Zorunlu alanların sağındaki kırmızı yıldız
const Yildiz = () => <span style={{ color: '#ff4d4f', lineHeight: '32px' }}>*</span>

// Input + yıldızı yan yana dizen sarmalayıcının stilleri
const alanSatiri = { display: 'flex', alignItems: 'flex-start', gap: 4 } as const
const alanKutusu = { flex: 1, marginBottom: 0 } as const

function CountryPage() {
	const [countries, setCountries] = useState<Country[]>([])
	const [form] = Form.useForm()
	const [currencies, setCurrencies] = useState<CurrencyDto[]>([])
	const [languages, setLanguages] = useState<LanguageDto[]>([])
	const [duzenlenenId, setDuzenlenenId] = useState<number | null>(null)

	const getir = async () => {
		const cevap = await axios.get<Country[]>('/api/country')
		setCountries(cevap.data)
	}

	// Alandan çıkınca baştaki/sondaki boşlukları kırpar
	const trimle = (alan: string) => () => {
		const deger = form.getFieldValue(alan)
		if (typeof deger === 'string') {
			form.setFieldsValue({ [alan]: deger.trim() })
		}
	}

	const kaydet = (values: any) => {
		Modal.confirm({
			title: 'İşlemi kaydetmek istiyor musunuz?',
			okText: 'Evet',
			cancelText: 'Hayır',
			onOk: async () => {
				const gonderilecek = {
					...values,
					countryNumCode: Number(values.countryNumCode),
					riskScore: values.riskScore ? Number(values.riskScore) : null,
					phoneCode: values.phoneCode ? Number(values.phoneCode) : null,
				}

				try {
					if (duzenlenenId === null) {
						await axios.post('/api/country', gonderilecek)
						message.success('Kayıt eklendi')
					} else {
						await axios.put(`/api/country/${duzenlenenId}`, gonderilecek)
						message.success('Kayıt güncellendi')
					}
					form.resetFields()
					setDuzenlenenId(null)
					await getir()
				} catch (hata) {
					if (axios.isAxiosError(hata) && hata.response) {
						if (hata.response.status === 409) {
							message.error('Bu ülke zaten kayıtlı')
						} else if (hata.response.status === 400) {
							message.error('Girilen bilgilerde hata var')
						} else {
							message.error('Kayıt eklenemedi')
						}
					} else {
						message.error('Sunucuya ulaşılamıyor')
					}
				}
			},
		})
	}

	const duzenle = async (id: number) => {
		const cevap = await axios.get(`/api/country/${id}`)
		form.setFieldsValue(cevap.data)
		setDuzenlenenId(id)
	}

	const sil = (id: number) => {
		Modal.confirm({
			title: 'Kaydı silmek istiyor musunuz?',
			okText: 'Evet',
			cancelText: 'Hayır',
			okButtonProps: { danger: true },
			onOk: async () => {
				try {
					await axios.delete(`/api/country/${id}`)
					message.success('Kayıt silindi')

					if (duzenlenenId === id) {
						form.resetFields()
						setDuzenlenenId(null)
					}

					await getir()
				} catch {
					message.error('Kayıt silinemedi')
				}
			},
		})
	}

	useEffect(() => {
		getir()
		axios.get<CurrencyDto[]>('/api/currency').then((c) => setCurrencies(c.data))
		axios.get<LanguageDto[]>('/api/language').then((c) => setLanguages(c.data))
	}, [])

	const currencyOptions = currencies.map((c) => ({
		value: c.id,
		label: `${c.currencyAlphaCode} - ${c.currencyName}`,
	}))

	const languageoptions = languages.map((l) => ({
		value: l.id,
		label: `${l.name}`,
	}))

	const regionOptions = [
		{ value: 'Londra', label: 'Londra' },
		{ value: 'Yurtdışı Ülke', label: 'Yurtdışı Ülke' },
	]

	const columns: ColumnsType<Country> = [
		{ title: 'Ülke İsmi', dataIndex: 'countryName', key: 'name', width: 180 },
		{ title: 'Orjinal Ülke İsmi', dataIndex: 'countryNameOriginal', key: 'nameorg', width: 180 },
		{ title: 'Resmi Ülke İsmi', dataIndex: 'countryNameOfficial', key: 'nameofc', width: 220 },
		{ title: 'Ülke Kodu (2 Harf)', dataIndex: 'country2AlpCode', key: '2code', width: 140 },
		{ title: 'Ülke Kodu (3 Harf)', dataIndex: 'country3AlpCode', key: '3code', width: 140 },
		{ title: 'Ülke Kodu', dataIndex: 'countryNumCode', key: 'numcode', width: 110 },
		{ title: 'Para Birimi', dataIndex: 'currencyName', key: 'cur', width: 140 },
		{ title: 'Dil', dataIndex: 'languageName', key: 'lan', width: 120 },
		{ title: 'Telefon Kodu', dataIndex: 'phoneCode', key: 'tel', width: 120 },
		{ title: 'Risk Skoru', dataIndex: 'riskScore', key: 'risk', width: 110 },
		{ title: 'Muhasebe Bölgesi', dataIndex: 'accountingRegionDesc', key: 'ard', width: 160 },
		{
			title: 'Aksiyon',
			key: 'aksiyon',
			fixed: 'right',
			width: 100,
			render: (_, row) => (
				<Space>
					<Button type="text" icon={<EditOutlined />} onClick={() => duzenle(row.id)} />
					<Button type="text" danger icon={<DeleteOutlined />} onClick={() => sil(row.id)} />
				</Space>
			),
		},
	]

	return (
		<div style={{ padding: 24 }}>
			<Card style={{ marginBottom: 16 }}>
				<Form form={form} onFinish={kaydet}>
					{/* ---------- 1. satır ---------- */}
					<Row gutter={[16, 16]}>
						<Col span={6}>
							<div style={alanSatiri}>
								<Form.Item
									name="countryName"
									style={alanKutusu}
									rules={[
										{ required: true, message: 'Zorunlu alan!' },
										{ max: 100, message: 'En fazla 100 karakter' },
									]}
								>
									<Input maxLength={100} placeholder="Ülke İsmi" onBlur={trimle('countryName')} />
								</Form.Item>
								<Yildiz />
							</div>
						</Col>

						<Col span={6}>
							<div style={alanSatiri}>
								<Form.Item
									name="countryNameOriginal"
									style={alanKutusu}
									rules={[
										{ required: true, message: 'Zorunlu alan!' },
										{ max: 100, message: 'En fazla 100 karakter' },
									]}
								>
									<Input
										maxLength={100}
										placeholder="Orjinal Ülke İsmi"
										onBlur={trimle('countryNameOriginal')}
									/>
								</Form.Item>
								<Yildiz />
							</div>
						</Col>

						<Col span={6}>
							<div style={alanSatiri}>
								<Form.Item
									name="countryNameOfficial"
									style={alanKutusu}
									rules={[
										{ required: true, message: 'Zorunlu alan!' },
										{ max: 100, message: 'En fazla 100 karakter' },
									]}
								>
									<Input
										maxLength={100}
										placeholder="Resmi Ülke İsmi"
										onBlur={trimle('countryNameOfficial')}
									/>
								</Form.Item>
								<Yildiz />
							</div>
						</Col>

						<Col span={3}>
							<div style={alanSatiri}>
								<Form.Item
									name="country2AlpCode"
									style={alanKutusu}
									normalize={(v) => String(v ?? '').replace(/[^a-zA-Z]/g, '')}
									rules={[
										{ required: true, message: 'Zorunlu alan!' },
										{ len: 2, message: 'Tam 2 harf olmalı' },
									]}
								>
									<Input
										maxLength={2}
										placeholder="Ülke Kodu (2 Harf)"
										onBlur={trimle('country2AlpCode')}
									/>
								</Form.Item>
								<Yildiz />
							</div>
						</Col>

						<Col span={3}>
							<div style={alanSatiri}>
								<Form.Item
									name="country3AlpCode"
									style={alanKutusu}
									normalize={(v) => String(v ?? '').replace(/[^a-zA-Z]/g, '')}
									rules={[
										{ required: true, message: 'Zorunlu alan!' },
										{ len: 3, message: 'Tam 3 harf olmalı' },
									]}
								>
									<Input
										maxLength={3}
										placeholder="Ülke Kodu (3 Harf)"
										onBlur={trimle('country3AlpCode')}
									/>
								</Form.Item>
								<Yildiz />
							</div>
						</Col>
					</Row>

					{/* ---------- 2. satır ---------- */}
					<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
						<Col span={3}>
							<div style={alanSatiri}>
								<Form.Item
									name="countryNumCode"
									style={alanKutusu}
									normalize={(v) => String(v ?? '').replace(/\D/g, '')}
									rules={[{ required: true, message: 'Zorunlu alan!' }]}
								>
									<Input maxLength={6} placeholder="Ülke Kodu" />
								</Form.Item>
								<Yildiz />
							</div>
						</Col>

						<Col span={4}>
							<Form.Item name="currencyId" style={alanKutusu}>
								<Select
									options={currencyOptions}
									placeholder="Para Birimi"
									showSearch
									optionFilterProp="label"
									allowClear
								/>
							</Form.Item>
						</Col>

						<Col span={3}>
							<Form.Item
								name="phoneCode"
								style={alanKutusu}
								normalize={(v) => String(v ?? '').replace(/\D/g, '')}
							>
								<Input maxLength={6} placeholder="Telefon Kodu" />
							</Form.Item>
						</Col>

						<Col span={4}>
							<Form.Item name="languageId" style={alanKutusu}>
								<Select
									options={languageoptions}
									placeholder="Dil"
									showSearch
									optionFilterProp="label"
									allowClear
								/>
							</Form.Item>
						</Col>

						<Col span={3}>
							<Form.Item
								name="riskScore"
								style={alanKutusu}
								normalize={(v) => String(v ?? '').replace(/[^1-5]/g, '')}
								rules={[{ pattern: /^[1-5]$/, message: '1-5 arası bir değer girin' }]}
							>
								<Input maxLength={1} placeholder="Risk Skoru" />
							</Form.Item>
						</Col>

						<Col span={3}>
							<Form.Item name="accountingRegionDesc" style={alanKutusu}>
								<Select
									options={regionOptions}
									placeholder="Muhasebe Bölgesi"
									showSearch
									optionFilterProp="label"
									allowClear
								/>
							</Form.Item>
						</Col>

						<Col span={4}>
							<Space style={{ width: '100%', justifyContent: 'flex-end' }}>
								<Button
									type="primary"
									onClick={() => {
										form.resetFields()
										setDuzenlenenId(null)
									}}
								>
									Temizle
								</Button>
								<Button type="primary" htmlType="submit">
									{duzenlenenId === null ? 'Kaydet' : 'Güncelle'}
								</Button>
							</Space>
						</Col>
					</Row>
				</Form>
			</Card>

			<Card title="Ülke Tanımları" extra={<Button>Excel'e Aktar</Button>}>
				<Table
					size="small"
					columns={columns}
					dataSource={countries}
					rowKey="id"
					scroll={{ x: 'max-content', y: 400 }}
					pagination={false}
					footer={() => (
						<div style={{ textAlign: 'right' }}>
							Rows: <b>{countries.length}</b>
						</div>
					)}
				/>
			</Card>
		</div>
	)
}

export default CountryPage
