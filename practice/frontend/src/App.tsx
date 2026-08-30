import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Descriptions, Layout, Spin, Tabs, Typography } from "antd";

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

/**
 * Ortam kontrolu icin sunucudan donen govde.
 * TypeScript'te API cevaplarini boyle bir interface ile tiplemek,
 * yanlis alan adi yazdiginda derleme aninda uyari almani sagliyor.
 */
interface PingResponse {
  api: string;
  veritabani: string;
  sunucuSaati: string;
  aktifUlkeSayisi: number;
  aktifDilSayisi: number;
  paraBirimiSayisi: number;
}

/** Ortamin ayakta oldugunu gosteren gecici panel. Ekranini yazarken silebilirsin. */
function OrtamKontrolu() {
  const [data, setData] = useState<PingResponse | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  // useEffect: bilesen ekrana ilk geldiginde bir kez calisir.
  // Bagimlilik dizisi [] bos oldugu icin tekrar calismaz.
  // Country listesini de bunun aynisiyla cekeceksin.
  useEffect(() => {
    axios
      .get<PingResponse>("/api/ping")
      .then((res) => setData(res.data))
      .catch((err) => setHata(err.message))
      .finally(() => setYukleniyor(false));
  }, []);

  // Not: <Spin tip="..." /> tek basina kullanilamaz - antd'nin `tip` ozelligi
  // sadece bir icerigi sarmaladiginda ya da fullscreen modda calisir,
  // aksi halde konsola uyari yazar. Metni ayri yazmak en temizi.
  if (yukleniyor) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Spin />
        <Text type="secondary">Ortam kontrol ediliyor...</Text>
      </div>
    );
  }

  if (hata) {
    return (
      <Alert
        type="error"
        showIcon
        message="Backend'e ulasilamiyor"
        description={
          <>
            <Paragraph style={{ marginBottom: 8 }}>
              <Text code>{hata}</Text>
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              Sirayla kontrol et: <Text code>scripts\start-db.ps1</Text> ile veritabani
              ayakta mi, <Text code>scripts\start-backend.ps1</Text> ile API calisiyor mu?
            </Paragraph>
          </>
        }
      />
    );
  }

  return (
    <Alert
      type="success"
      showIcon
      message="Ortam hazir"
      description={
        <Descriptions size="small" column={2} style={{ marginTop: 8 }}>
          <Descriptions.Item label="API">{data!.api}</Descriptions.Item>
          <Descriptions.Item label="Veritabani">{data!.veritabani}</Descriptions.Item>
          <Descriptions.Item label="Aktif ulke">{data!.aktifUlkeSayisi}</Descriptions.Item>
          <Descriptions.Item label="Aktif dil">{data!.aktifDilSayisi}</Descriptions.Item>
          <Descriptions.Item label="Para birimi">{data!.paraBirimiSayisi}</Descriptions.Item>
          <Descriptions.Item label="Sunucu saati">
            {new Date(data!.sunucuSaati).toLocaleString("tr-TR")}
          </Descriptions.Item>
        </Descriptions>
      }
    />
  );
}

/**
 * BURADAN SONRASI SANA AIT.
 *
 * Gorevin: AGLDN-989 kabul kriterlerindeki Country Definition ekranini yazmak.
 * Onerilen sira (roadmap Faz 5):
 *   1. Tabloyu API'den doldur (sadece okuma)
 *   2. Uc dropdown'i doldur
 *   3. Formu ve validasyon kurallarini kur
 *   4. Temizle butonu
 *   5. Kaydet: onay modali -> POST -> toast -> temizle -> yenile
 *   6. Duzenle ikonu -> forma doldur -> PUT
 *   7. Sil ikonu -> onay -> soft delete
 *
 * Ekran gorunumu sekmeli: asagidaki Tabs bilesenini oldugu gibi kullanabilirsin.
 */
function CountryDefinitionEkrani() {
  return (
    <div
      style={{
        border: "1px dashed #d9d9d9",
        borderRadius: 8,
        padding: 32,
        textAlign: "center",
        background: "#fafafa",
      }}
    >
      <Title level={5} style={{ marginTop: 0 }}>
        Country Definition ekrani buraya gelecek
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 0 }}>
        Bu bilesen <Text code>src/App.tsx</Text> icinde. Ekranini yazmaya buradan basla.
        <br />
        Ihtiyacin olan Ant Design bilesenleri: <Text code>Form</Text>, <Text code>Input</Text>,{" "}
        <Text code>Select</Text>, <Text code>Table</Text>, <Text code>Button</Text>,{" "}
        <Text code>Modal.confirm</Text>, <Text code>message</Text>.
      </Paragraph>
    </div>
  );
}

export default function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", paddingInline: 24 }}>
        <Title level={4} style={{ margin: 0, lineHeight: "64px" }}>
          AGLDN-989 &middot; Pratik Ortami
        </Title>
      </Header>

      <Content style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <OrtamKontrolu />

        <Tabs
          type="card"
          items={[
            {
              key: "country-definition",
              label: "Country Definition",
              children: <CountryDefinitionEkrani />,
            },
          ]}
        />
      </Content>
    </Layout>
  );
}
