 "use client";
import { FormEvent, useState } from "react";
type Flight = {
  id: string; price: { total: string; currency: string };
  itineraries: Array<{ duration: string; segments: Array<{
    departure: { iataCode: string; at: string }; arrival: { iataCode: string; at: string };
    carrierCode: string; number: string;
  }> }>;
  validatingAirlineCodes?: string[]; numberOfBookableSeats?: number; bookingUrl: string;
};
const today = new Date().toISOString().slice(0, 10);
const plus14 = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
export default function Home() {
  const [origin, setOrigin] = useState("VTE"), [destination, setDestination] = useState("BKK");
  const [departureDate, setDepartureDate] = useState(plus14), [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState("1"), [currency, setCurrency] = useState("USD");
  const [flights, setFlights] = useState<Flight[]>([]), [loading, setLoading] = useState(false);
  const [error, setError] = useState(""), [searched, setSearched] = useState(false);
  async function search(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError(""); setFlights([]); setSearched(false);
    try {
      const params = new URLSearchParams({origin: origin.trim().toUpperCase(), destination: destination.trim().toUpperCase(), departureDate, adults, currency});
      if (returnDate) params.set("returnDate", returnDate);
      const response = await fetch(`/api/flights?${params.toString()}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "ค้นหาไม่สำเร็จ");
      setFlights(result.flights || []); setSearched(true);
      if (!result.flights?.length) setError("ไม่พบเที่ยวบินจากแหล่งข้อมูลนี้ ลองเปลี่ยนสนามบินหรือวันเดินทาง");
    } catch (err) { setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด"); }
    finally { setLoading(false); }
  }
  return <main className="shell">
    <header className="hero">
      <div className="brand"><span className="plane">✈</span><span>CheapFlight <b>Checker</b></span></div>
      <p>ค้นหาเที่ยวบิน เปรียบเทียบราคา แล้วเลือกข้อเสนอที่เหมาะกับคุณ</p>
      <span className="notice">MVP • ราคาขึ้นกับข้อมูล API และอาจเปลี่ยนก่อนจอง</span>
    </header>
    <section className="panel">
      <h1>ค้นหาตั๋วเครื่องบิน</h1>
      <p className="muted">ใช้รหัสสนามบิน 3 ตัว เช่น VTE = เวียงจันทน์, BKK = กรุงเทพฯ, HAN = ฮานอย</p>
      <form onSubmit={search}>
        <div className="grid">
          <label>ต้นทาง (IATA)<input value={origin} onChange={e=>setOrigin(e.target.value)} maxLength={3} required placeholder="VTE"/></label>
          <label>ปลายทาง (IATA)<input value={destination} onChange={e=>setDestination(e.target.value)} maxLength={3} required placeholder="BKK"/></label>
          <label>วันเดินทางไป<input type="date" min={today} value={departureDate} onChange={e=>setDepartureDate(e.target.value)} required/></label>
          <label>วันกลับ (ไม่ใส่ = เที่ยวเดียว)<input type="date" min={departureDate} value={returnDate} onChange={e=>setReturnDate(e.target.value)}/></label>
          <label>ผู้ใหญ่<select value={adults} onChange={e=>setAdults(e.target.value)}>{[1,2,3,4,5,6,7,8,9].map(n=><option key={n} value={n}>{n} คน</option>)}</select></label>
          <label>สกุลเงินที่ API รองรับ<select value={currency} onChange={e=>setCurrency(e.target.value)}><option value="USD">USD</option><option value="THB">THB</option><option value="EUR">EUR</option></select></label>
        </div>
        <button disabled={loading}>{loading ? "กำลังค้นหา..." : "ค้นหาและเรียงราคาถูกที่สุด"}</button>
      </form>
    </section>
    {error && <div className="message">{error}</div>}
    {searched && flights.length>0 && <section className="results">
      <div className="resultsHead"><h2>ผลการค้นหา</h2><span>{flights.length} ตัวเลือก • เรียงราคาต่ำไปสูง</span></div>
      {flights.map((flight,index)=>{
        const first=flight.itineraries[0]?.segments[0], last=flight.itineraries[0]?.segments.at(-1);
        const stops=Math.max(0,(flight.itineraries[0]?.segments.length||1)-1);
        return <article className="flight" key={flight.id}>
          <div className="flightTop"><span className="rank">#{index+1}</span><div className="route">
            <b>{first?.departure.iataCode||origin} → {last?.arrival.iataCode||destination}</b>
            <small>{flight.validatingAirlineCodes?.join(", ")||"สายการบินตามข้อมูลที่มี"} · {stops===0?"บินตรง":`แวะ ${stops} ครั้ง`}</small>
          </div><div className="price">{Number(flight.price.total).toLocaleString()} <small>{flight.price.currency}</small></div></div>
          <div className="flightBottom"><span>เวลาออก: {first?.departure.at?new Date(first.departure.at).toLocaleString("th-TH"):"ดูรายละเอียดผู้ขาย"}</span>
            <a href={flight.bookingUrl} target="_blank" rel="noreferrer">ตรวจสอบราคา / ไปจอง ↗</a></div>
        </article>;
      })}
      <p className="muted footnote">ราคาจาก API อาจไม่ครอบคลุมทุกสายการบินหรือทุกเว็บไซต์จอง โปรดตรวจสอบราคาสุดท้าย กระเป๋า และค่าธรรมเนียมก่อนชำระเงิน</p>
    </section>}
    <footer>CheapFlight Checker · เวอร์ชันทดลอง · ไม่ใช่ตัวแทนจำหน่ายตั๋ว</footer>
  </main>;
}
