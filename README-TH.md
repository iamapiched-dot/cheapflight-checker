# CheapFlight Checker — คู่มือเริ่มต้นผ่านมือถือ

ชื่อโปรเจกต์และชื่อที่แสดงในเว็บไซต์เปลี่ยนเป็น CheapFlight Checker แล้ว

## ความสามารถของ MVP
- หน้าค้นหาที่รองรับมือถือ
- ค้นหา Flight Offers ผ่าน Amadeus Self-Service API
- เรียงผลลัพธ์จากราคาต่ำไปสูง
- ลิงก์ไปตรวจสอบเที่ยวบินบน Google Flights
- API credentials อยู่ฝั่ง server

## ข้อจำกัด
- API อาจไม่ครอบคลุมทุกสายการบินหรือทุกเว็บไซต์ OTA
- ปุ่มจองเป็นลิงก์ค้นหา Google Flights ไม่ใช่ deep link ของข้อเสนอเดียวกัน
- ยังไม่มีระบบติดตามราคา/แจ้งเตือน; เพิ่มในระยะต่อไปหลัง deploy สำเร็จ
- ห้าม commit API secrets ลง GitHub

## ขั้นตอน
1. อัปโหลดไฟล์ทั้งหมดนี้เข้า GitHub repository
2. สมัคร Amadeus for Developers และสร้าง API app
3. เชื่อม repository กับโฮสต์ที่รองรับ Next.js
4. ตั้ง Environment Variables: `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET`, `AMADEUS_BASE_URL=https://test.api.amadeus.com`
5. Deploy และทดสอบด้วยสนามบิน VTE → BKK และวันเดินทางในอนาคต
6. ก่อนใช้งานจริง ให้ตรวจสอบสิทธิ์ Production และเงื่อนไขของผู้ให้บริการ

API ตัวอย่าง:
`/api/flights?origin=VTE&destination=BKK&departureDate=2026-12-01&adults=1&currency=USD`

เพิ่ม `&returnDate=2026-12-08` เพื่อค้นหาไป-กลับ
