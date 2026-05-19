import { useState, useMemo, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS  (see HNS_design_system.html for full spec)
═══════════════════════════════════════════════════════════════════════════ */
const T = {
  bg:"#080810",surf:"#141420",card:"#1c1c2c",border:"#2e2e44",
  accent:"#ff4400",text:"#ffffff",sub:"#bbbbcc",dim:"#666677",
  green:"#00e676",greenD:"#00c853",blue:"#448aff",amber:"#ffab00",
  red:"#ff5252",tagBg:"#1e2a3a",tagTxt:"#5b9aff",
};

/* ── DRIVE FOLDER ─────────────────────────────────────────────────────── */
const DRIVE_FOLDER = "https://drive.google.com/drive/folders/12pRik57CD1myfY1diKzWQ4LNGuoPNojJ";
const DRIVE_IMG = id => `https://drive.google.com/thumbnail?id=${id}&sz=w400`;
const DRIVE_VIEW = id => `https://drive.google.com/file/d/${id}/view`;

/* ── DELIVERED PHOTOS MAP: item_id → [driveFileId, ...] ─────────────── */
const DELIVERED_PHOTOS = {
  // P02 — suitcases/trunks (May 16 batch)
  "P02": [
    "1NDQEArLdpAQ8ERzuAlZ80C0KRCAROIG4", // SCP-061 leather suitcase
    "1xKK9wCnVMa4raZgDEMLgkEqxhT414Och", // green metal trunk 60×35×20
    "1oEmRJ8dN-KnZYcfv1jf63PGdFxPIjLcD", // green metal trunk 55cm
    "1fy-ViD1r8_oueaPmeEAuiXaXLnY9LH9K", // burgundy velvet pram area (suitcase)
    "1Np8-GXMEn4EaKjD0wzv1Dxn_1IXQZaNY", // SCP-066 canvas
    "1OAtu5QQhlsRsdu0MRwRo55eP_Vr_9ygc", // SCT-093
    "11Qm_dbYB9WzmTKjBgWpl9I8rGkTPrrea", // SCT-053 or similar
    "1gNvfgU5f8jkweV2ZE8OLGyYPoCtWpfCg", // SCT-054
    "15yFS1xG-YjIYjYPAWYCgWcuZmPOVgBlz", // trunk item
    "1ElHG4slhVKTczEJv4MfjhiKWxe9a2BXG", // painted trunk
    "1dI_D7msChSm2LA4Id3jXIjQrJ2kXfkdR", // red leather trunk
    "1l7tLMklN1fGwUMOeyN2U916gKvGA3yc3", // white rusted trunk
    "1F2qW2SPcH5XIC2wEnJC4AzdNQdy9ojyF", // another trunk
  ],
  // P03 — luggage trolleys (May 16 batch)
  "P03": [
    "1095s8K9fmxb98-YyxX8KOTr25UMTpdAs", // Tro015 gold/red 55×105×175cm
    "1_2pWkRIPBzBjDLjrJk2rqmLlHitFx3dr", // second trolley option
    "1UglUjD0GG3t4jQu7gOGccLnU2TTebXMU", // PHOTO-16-14-15-57 (trolley)
  ],
  // P10 — old baby prams (May 16 batch)
  "P10": [
    "1K6sttk3oneQIfq7NzVpFUZ3g2y8eFTVt", // SRTT-035 wicker pram ฿15,000
    "1wInYjwpiawuoRLk1nElI17ABybm3yEhk", // SRTT-033 black Victorian เช่า 3,000฿
    "10iXSuLllRfJsDe0WdigfBQvEzK_uPLkA", // SRTT-029 red vinyl ฿7,000
    "1fy-ViD1r8_oueaPmeEAuiXaXLnY9LH9K", // SRTT-028 burgundy velvet ฿7,000
  ],
  // May 17 evening batch (21:39 series) — inflatable shop visit
  "I02": ["1j1HUcAQ4fT2nDgxCabjArfK4I5UELCEB","13GQTdoCTn9YxNKbBGRCKjOjxw7Bz8XDg"],
  "I03": ["1_nM3yMN92pgyxaHbL4nRZRW8_w5Dr0XU","1Nzzl1cjoZ7ssLYDs5yh8NS_WI0eTmvKc"],
  "I04": ["126ydpI6QkNMWg3igP4vqiR-dsnflAGlZ","11Dt9bP2vNY-kVFflfpoghiu9WZAJaAPp"],
  // May 18 inflatables batch (14:01 series)
  "I09": [
    "1LTgiRPSLPCHd6HSQ_t2tJxnX0QDD0Ow8", // rainbow swim ring 90cm ×2 เช่า 60฿
    "1CaruBz3KeuM_2KWLYhZiD2Su8cR5oxjH", // swim ring variant 2
    "16d5XS3Iua718NJPZCx2MFYeRzr_pBzPL", // swim ring variant 3
  ],
  "I05": ["1QLTgbJ2oob5Fmf4B3PFtjeiZbXU3mY9h","1myttD6m_HVRUlAV-rcXknlInQ_lA96UP","102Wk9lh2iAwHBDAMUVQZsIosrAIHSlVT"],
  "I06": ["1-_xu_XDZy49eoaxPoyhgsPr7K3FDYeOQ","11fTzSfMarpEhO5rEQNrnELwVgeKQ3OHc"],
  "I07": ["1yIPwUh0cR3ljkLecEA_SnfdE133tvDh-","1i1ehWqqo5j_mC0V1Eh4G45c-tfMIjwvH","1Q-_8MDwC-cVgtI71cTr71TlO8wncoHhe"],
  "I08": ["1_LzdLNZ1BnLS51eZuul2V8i0AiyygyDB","1TgL10Bwkadhr60VdqfgN0FcSBr4yHUK4","1AUs0qa5Z3SxULHdxlibewx0AZ4tT0ZpY"],
  "I10": ["18GvkRm9CUhL1p6Ed98ldrGiVY8NBBNQ8","1im96uAC9sTnk4B9YWuv81fYGGrB8Lbsc","12SwmCpDGCNsOuTYTwsXeq7PS_BTLqB7N"],
  "I11": ["1Hmjp21r0U0JVzg5ef3IQE6UOtDVWTp0X","1yexGuduLeIa0vWBC_gyZEqrLBgAvvlC4"],
  "I12": ["1Ca6aS6cfGD6ceCWZ-u5jwOQSQK4p1ni0","1axanWK4pZDbjwHizBBpvxq-hsQS5tYAM"],
  // May 16 extras
  "C05": ["1MpazfYZOkEwU6wRF4EEtr429ymX8M_uM"],
};

/* ── STATUS CONFIG ────────────────────────────────────────────────────── */
const STATUS_OPT = ["⬜ Not Started","🔍 Sourcing","✅ Confirmed","📦 Delivered","❌ N/A"];
const SC = {
  "⬜ Not Started":{bg:"#1a1a1a",txt:"#888",brd:"#333",short:"PENDING"},
  "🔍 Sourcing":  {bg:"#0d0d28",txt:T.blue,brd:"#1e2a6a",short:"SOURCING"},
  "✅ Confirmed": {bg:"#081a10",txt:T.green,brd:"#124a24",short:"CONFIRM"},
  "📦 Delivered": {bg:"#0a1c0a",txt:T.greenD,brd:"#1a5c1a",short:"DELIVER"},
  "❌ N/A":       {bg:"#1c0a0a",txt:T.red,brd:"#5c1a1a",short:"N/A"},
};

/* ── TAGS ─────────────────────────────────────────────────────────────── */
const BASE_TAGS = [
  "#hero","#background","#construction","#consumable","#tool",
  "#electrical","#costume","#wearable","#inflatable","#pool",
  "#creepy","#old","#vintage","#broken","#fake","#live",
  "#rent","#buy","#disassemble","#confirmed","#urgent","#perishable",
  "#fragile","#heavy","#hotel","#bedroom","#outdoor","#water",
  "#food","#animal","#lighting","#fabric","#hardware","#paint","#tape",
  "#sourcing-TH","#sourcing-online",
];

export const REF_IMAGES = {
};

/* ── ITEM DATA ────────────────────────────────────────────────────────── */
const CATS_RAW = {
  "HERO PROPS":[
    {id:"P01",item:"Creepy statues (possibly broken)",qty:40,photoReqd:true,tags:["#hero","#creepy","#broken"],
     comment:"Page 5 #1. Client ref shows they should look genuinely creepy, can be broken."},
    {id:"P02",item:"Old suitcases / trunks",qty:20,photoReqd:true,tags:["#hero","#old","#vintage","#hotel","#sourcing-TH"],
     comment:"PHOTOS RCV'D — 8 soft suitcases: SCP-061 73×22×45cm ฿4,500 · SCP-008 76×23×47cm ฿4,500 · SCT-066 56×17×40cm ฿3,000 · SCT-023 50×15×33cm ฿2,000 · SCT-093 66×20×38cm ฿3,000 · SCT-054 59×18×41cm ฿3,000 · SCT-083 60×19×35cm ฿3,500 · SCT-102 60×16×42cm ฿3,500.\n5 metal/hard trunks: green 100×55×38 · green 75×45×30 · painted 75×45×35 · white rusted 66×40×26 · red leather 53×35×20.\nTotal 13 sourced — need 20, still 7 SHORT."},
    {id:"P03",item:"Luggage trolleys (hotel)",qty:5,photoReqd:true,tags:["#hero","#hotel","#rent","#confirmed"],
     comment:"PHOTO RCV'D — Tro015 gold/red carpet 55×105×175cm เช่า 3,750฿ (มี 2 คัน). Client confirmed diff styles OK — 3 confirmed, need 2 more. Rental shop rented out some units, still searching."},
    {id:"P04",item:"Dead birds",qty:7,photoReqd:true,tags:["#hero","#creepy","#animal","#perishable"],
     comment:"Page 5 #5. Must look realistic. Perishable — procure close to shoot date."},
    {id:"P05",item:"Staff alarm bell",qty:1,photoReqd:true,tags:["#hero","#hotel","#vintage","#confirmed"],
     comment:"Nikita: Good 👍. Brass hotel bell style."},
    {id:"P06",item:"Room service cart (gold 3-tier rolling)",qty:1,photoReqd:true,tags:["#hero","#hotel","#rent","#confirmed"],
     comment:"Confirmed in chat. 3-tier gold stainless/mahogany shelf cart with casters. เช่า 80฿/pc from rental shop."},
    {id:"P07",item:"Plates of spoiled / dried food",qty:10,photoReqd:true,tags:["#hero","#food","#creepy","#perishable"],
     comment:"Page 8 #27. Must look genuinely spoiled — dried, mouldy. Prepare or source artistically."},
    {id:"P08",item:"Bird skeleton",qty:1,photoReqd:true,tags:["#hero","#creepy","#animal"],
     comment:"Page 8 #28. Real or prop skeleton."},
    {id:"P09",item:"Ugly dolls (different sizes)",qty:15,photoReqd:true,tags:["#hero","#creepy","#background"],
     comment:"Page 6 #15. Mix of scary/broken/creepy dolls, various sizes. Clown, porcelain, baby doll types preferred."},
    {id:"P10",item:"Old baby carriage / pram / perambulator",qty:1,photoReqd:true,tags:["#hero","#old","#vintage","#creepy","#sourcing-TH"],
     comment:"PHOTOS RCV'D — 4 options sourced:\n• SRTT-035 wicker/rattan 50×105×110cm ฿15,000 (most atmospheric)\n• SRTT-033 BLACK Victorian 43×108×126cm เช่า 3,000฿ ← RECOMMENDED for HNS\n• SRTT-029 red vinyl 38×78×96cm ฿7,000\n• SRTT-028 burgundy velvet 37×74×88cm ฿7,000\nAwaiting client pick."},
    {id:"P11",item:"Worms (live or fake)",qty:20,photoReqd:true,tags:["#hero","#creepy","#animal","#live"],
     comment:"Page 9 #33. Real earthworms or prop worms. If live, procure day before shoot."},
    {id:"P12",item:"Cockroaches (live or fake)",qty:20,photoReqd:true,tags:["#hero","#creepy","#animal","#live"],
     comment:"Page 9 #34. Real or rubber prop cockroaches. Chiang Mai: can be sourced from fishing/bait shops."},
    {id:"P13",item:"Wardrobe (same as location)",qty:2,photoReqd:true,tags:["#hero","#bedroom","#heavy"],
     comment:"Page 7 #23. Must match location wardrobe exactly — get measurements and photo from location scout first."},
    {id:"P14",item:"Mattress (local bed size)",qty:1,photoReqd:false,tags:["#bedroom"],
     comment:"Page 7 #19. Standard Thai double size. Source locally."},
    {id:"P15",item:"Pillows",qty:10,photoReqd:false,tags:["#bedroom","#fabric"],
     comment:"Page 7 #20. Plain white or aged/stained for atmosphere."},
    {id:"P16",item:"Towels 50×100cm",qty:100,photoReqd:false,tags:["#hotel","#fabric"],
     comment:"Page 6 #13. White hotel-style towels."},
    {id:"P17",item:"Tarantula + venom removal + wrangler",qty:1,photoReqd:true,tags:["#hero","#animal","#live","#urgent","#sourcing-TH"],
     comment:"Chat 17:34 — Yuta: 'This is what we can find now we have to pay to removed the venom and a wrangler'. Actively sourcing. Photo of spider in plastic box shared."},
    {id:"P18",item:"Rotten food (package)",qty:1,photoReqd:true,tags:["#hero","#food","#creepy","#perishable"],
     comment:"Page 8 #32. A bag/package of visually rotten food items — for atmosphere/horror."},
  ],
  "COSTUME / WEARABLE":[
    {id:"C01",item:"Camouflage hunting suit (ghillie style)",qty:1,photoReqd:true,tags:["#costume","#wearable","#outdoor"],
     comment:"Page 5 #7. Full-body ghillie suit with leaves/foliage. Needs to completely obscure person."},
    {id:"C02",item:"Wetsuit (non-black, sized to mannequin)",qty:1,photoReqd:true,tags:["#costume","#wearable","#water","#sourcing-TH"],
     comment:"Nikita: 'We can use a different wetsuit, not necessarily the one in the photo. Please send us some options, preferably not black. But the suit size needs to be on the mannequin you sent.' Ma030 mannequin is 180cm female."},
    {id:"C03",item:"Women's wig",qty:2,photoReqd:true,tags:["#costume","#wearable"],
     comment:"Page 6 #10. Two wigs, style TBC. Send options to client."},
    {id:"C04",item:"Black leather gloves (pair)",qty:1,photoReqd:false,tags:["#costume","#wearable"],
     comment:"Page 8 #31. Full-finger black leather gloves."},
    {id:"C05",item:"Mannequin (full size female)",qty:1,photoReqd:true,tags:["#costume","#hero","#confirmed"],
     comment:"PHOTO RCV'D — Ma030 female 180cm. เช่า 625฿ (มี 1 ตัว). Nikita: Good 👍. Wetsuit must be sized to this mannequin."},
    {id:"C06",item:"Construction gloves",qty:20,photoReqd:false,tags:["#consumable","#construction"],
     comment:"Page 3 #47. Standard work gloves for build crew."},
  ],
  "INFLATABLES & POOL TOYS":[
    {id:"I01",item:"Inflatable toys (assorted variety)",qty:15,photoReqd:true,tags:["#inflatable","#pool","#hero"],
     comment:"Page 6 #14 — assorted pool toys of different shapes/colours. Dolphins, flamingos, unicorns, etc."},
    {id:"I02",item:"Flamingo ring float 78×70cm (glitter)",qty:1,photoReqd:true,tags:["#inflatable","#pool","#rent","#confirmed"],
     comment:"Confirmed in chat. เช่า 150฿. Pink glitter flamingo ring float, 78cm wide × 70cm tall."},
    {id:"I03",item:"Angel wings ring float 120cm (rose gold)",qty:1,photoReqd:true,tags:["#inflatable","#pool","#rent","#confirmed"],
     comment:"T-103, INSTOCK 1. เช่า 100฿. Rose gold angel wings ring float, 120cm."},
    {id:"I04",item:"Unicorn winged ride-on float 180cm",qty:1,photoReqd:true,tags:["#inflatable","#pool","#rent","#confirmed"],
     comment:"T-131, INSTOCK 1. เช่า 300฿. Large winged unicorn ride-on float, 180cm."},
    {id:"I05",item:"Unicorn ride-on float (rainbow mane)",qty:1,photoReqd:true,tags:["#inflatable","#pool","#rent","#confirmed"],
     comment:"Confirmed in chat. เช่า 300฿. Rainbow-mane unicorn ride-on, large format."},
    {id:"I06",item:"Pink donut ring float 107cm",qty:1,photoReqd:true,tags:["#inflatable","#pool","#rent","#confirmed"],
     comment:"T-104, INSTOCK 1. เช่า 100฿. Pink donut with sprinkles, 107cm."},
    {id:"I07",item:"Rainbow float mat 165×103cm (cloud)",qty:1,photoReqd:true,tags:["#inflatable","#pool","#rent"],
     comment:"Confirmed in chat. เช่า 180฿. Rainbow stripe cloud-shaped float mat, 165×103cm."},
    {id:"I08",item:"Teal/purple float mat 160cm",qty:1,photoReqd:true,tags:["#inflatable","#pool","#rent","#confirmed"],
     comment:"T-135, INSTOCK 1. เช่า 100฿. Teal/purple wavy float mat, 160cm."},
    {id:"I09",item:"Rainbow 'Sunshine' swim ring 90cm",qty:2,photoReqd:true,tags:["#inflatable","#pool","#rent","#confirmed"],
     comment:"PHOTO RCV'D — rainbow multicolor 'sunshine' swim ring 90cm with handles. เช่า 60฿ each, มี 2 อัน (2 available). Confirmed match for colorful pool shoot."+"\nPhoto shown in chat. Citrus-pattern orange swim ring, 90cm."},
    {id:"I10",item:"Inflatable alien figure 90cm",qty:1,photoReqd:true,tags:["#inflatable","#hero","#rent","#confirmed"],
     comment:"T-107, INSTOCK 2. เช่า 100฿. Green alien standing figure, 90cm."},
    {id:"I11",item:"Beach ball 40cm (multicolour stripe)",qty:1,photoReqd:false,tags:["#inflatable","#pool","#rent","#confirmed"],
     comment:"Chat confirmed. เช่า 80฿. Colourful striped beach ball, 40cm."},
    {id:"I12",item:"Beach ball 45cm (polka dot)",qty:1,photoReqd:false,tags:["#inflatable","#pool","#rent","#confirmed"],
     comment:"Chat confirmed. เช่า 80฿. Clear polka dot beach ball, 45cm."},
    {id:"I13",item:"Beach ball 30cm (classic 4-colour)",qty:1,photoReqd:false,tags:["#inflatable","#pool","#rent"],
     comment:"Chat photo. Classic 4-colour panel beach ball, 30cm."},
    {id:"I14",item:"Kids ball (striped)",qty:1,photoReqd:false,tags:["#background"],
     comment:"Page 8 #29. Small coloured striped ball."},
  ],
  "ELECTRICAL / TECHNICAL":[
    {id:"E01",item:"Hand dryer (large) — buy 1 + rent 1",qty:2,photoReqd:true,tags:["#electrical","#buy","#rent","#disassemble","#confirmed"],
     comment:"Nikita: Good 👍 — Need 2 identical. Buy 1 (will be disassembled for shoot). Rent 1 for functional use. POLO HD-01 220V ฿11,050 (was ฿17,000). Nikita: 'What is the size?' — find dimensions."},
    {id:"E02",item:"Bedside / table lamp",qty:1,photoReqd:true,tags:["#electrical","#lighting","#bedroom","#hero"],
     comment:"Page 8 #30. Atmospheric bedside lamp for hotel room set."},
    {id:"E03",item:"Landscape lighting lamps",qty:10,photoReqd:true,tags:["#electrical","#lighting","#outdoor"],
     comment:"Page 7 #22. Outdoor landscape spotlights/stakes."},
    {id:"E04",item:"Incandescent lamp 40W E27",qty:10,photoReqd:false,tags:["#electrical","#lighting"],
     comment:"Page 9 #35. Standard incandescent bulbs for atmospheric warm light."},
    {id:"E05",item:"Incandescent lamp 60W E27",qty:10,photoReqd:false,tags:["#electrical","#lighting"],
     comment:"Page 9 #36."},
    {id:"E06",item:"Electric dimmer 220V 500W",qty:5,photoReqd:false,tags:["#electrical","#hardware"],
     comment:"Page 9 #37. For controlling light levels on set."},
    {id:"E07",item:"Air compressor 50L",qty:1,photoReqd:false,tags:["#tool","#electrical"],
     comment:"Page 6 #11. For inflating pool toys and other inflatable props."},
    {id:"E08",item:"Cordless leaf blower (rechargeable)",qty:1,photoReqd:false,tags:["#tool","#electrical"],
     comment:"Page 7 #24. Battery-powered blower for set dressing/atmosphere."},
    {id:"E09",item:"Silicone hose 6mm × 100m",qty:1,photoReqd:false,tags:["#construction","#hardware"],
     comment:"Page 6 #12."},
    {id:"E10",item:"Miter saw (with local socket)",qty:1,photoReqd:false,tags:["#tool","#construction"],
     comment:"Page 1 #5."},
    {id:"E11",item:"Power extension reel 50m",qty:2,photoReqd:false,tags:["#electrical","#consumable"],
     comment:"Page 1 #3."},
    {id:"E12",item:"Power extension cord 5m",qty:3,photoReqd:false,tags:["#electrical","#consumable"],
     comment:"Page 1 #4."},
    {id:"E13",item:"Adapter local socket → EU plug",qty:10,photoReqd:false,tags:["#electrical","#consumable"],
     comment:"Page 1 #6. Russian crew uses EU plugs."},
  ],
  "CONSTRUCTION MATERIALS":[
    {id:"M01",item:"Wood beam 40×40×3000mm",qty:20,photoReqd:false,tags:["#construction","#hardware"],comment:"Page 1 #7."},
    {id:"M02",item:"Wood beam 50×50×3000mm",qty:20,photoReqd:false,tags:["#construction","#hardware"],comment:"Page 1 #8."},
    {id:"M03",item:"Plywood 6mm",qty:10,photoReqd:false,tags:["#construction","#hardware"],comment:"Page 1 #9."},
    {id:"M04",item:"Plywood 10mm",qty:6,photoReqd:false,tags:["#construction","#hardware"],comment:"Page 1 #10."},
    {id:"M05",item:"Plywood 15mm",qty:6,photoReqd:false,tags:["#construction","#hardware"],comment:"Page 1 #11."},
    {id:"M06",item:"Self-tapping screws 55mm 2kg",qty:2,photoReqd:false,tags:["#construction","#consumable"],comment:"Page 1 #12."},
    {id:"M07",item:"Self-tapping screws 75mm 2kg",qty:2,photoReqd:false,tags:["#construction","#consumable"],comment:"Page 1 #13."},
    {id:"M08",item:"Self-tapping screws 35mm 2kg",qty:2,photoReqd:false,tags:["#construction","#consumable"],comment:"Page 1 #14."},
    {id:"M09",item:"Self-tapping screws 100mm 2kg",qty:2,photoReqd:false,tags:["#construction","#consumable"],comment:"Page 1 #15."},
    {id:"M10",item:"Dowels with screws 8mm 0.5kg",qty:1,photoReqd:false,tags:["#construction","#hardware"],comment:"Page 1 #16."},
    {id:"M11",item:"Bricks",qty:100,photoReqd:false,tags:["#construction","#heavy"],comment:"Page 1 #17."},
    {id:"M12",item:"Building mesh tape 10sqm",qty:1,photoReqd:false,tags:["#construction","#tape"],comment:"Page 2 #18."},
    {id:"M13",item:"Self-adhesive mesh tape",qty:5,photoReqd:false,tags:["#construction","#tape"],comment:"Page 2 #19."},
    {id:"M14",item:"Wood putty 5kg",qty:1,photoReqd:false,tags:["#construction","#paint"],comment:"Page 2 #20."},
    {id:"M15",item:"White water-based paint 5kg",qty:1,photoReqd:false,tags:["#construction","#paint"],comment:"Page 2 #21."},
    {id:"M16",item:"Colorant 750ml black",qty:5,photoReqd:false,tags:["#construction","#paint"],comment:"Page 2 #22."},
    {id:"M17",item:"Colorants 750ml brown/beige/green/blue/red",qty:"2 ea",photoReqd:false,tags:["#construction","#paint"],comment:"Page 2 #23."},
    {id:"M18",item:"Primer 5kg",qty:1,photoReqd:false,tags:["#construction","#paint"],comment:"Page 2 #24."},
    {id:"M19",item:"Gypsum plaster Rotband 30kg",qty:5,photoReqd:false,tags:["#construction","#heavy"],comment:"Page 2 #33."},
    {id:"M20",item:"Water-based wood stain 5 colours × 1L",qty:5,photoReqd:false,tags:["#construction","#paint"],comment:"Page 4 #65."},
    {id:"M21",item:"Aqua varnish 2.5L",qty:1,photoReqd:false,tags:["#construction","#paint"],comment:"Page 4 #67."},
    {id:"M22",item:"Door hinges",qty:6,photoReqd:false,tags:["#construction","#hardware"],comment:"Page 7 #18."},
    {id:"M23",item:"Door handle brackets",qty:4,photoReqd:false,tags:["#construction","#hardware"],comment:"Page 4 #68."},
    {id:"M24",item:"Cosmo fen super glue",qty:1,photoReqd:false,tags:["#construction","#consumable"],comment:"Page 3 #53."},
    {id:"M25",item:"Mounting adhesive (liquid nails) Titan",qty:3,photoReqd:false,tags:["#construction","#consumable"],comment:"Page 2 #34."},
  ],
  "TOOLS & HARDWARE":[
    {id:"T01",item:"Stepladder 2m",qty:1,photoReqd:false,tags:["#tool","#construction"],comment:"Page 1 #1."},
    {id:"T02",item:"3-section sliding stepladder 3m",qty:1,photoReqd:false,tags:["#tool","#construction"],comment:"Page 1 #2."},
    {id:"T03",item:"Paint rollers 10–25cm (2 of each)",qty:"2 ea",photoReqd:false,tags:["#tool","#paint"],comment:"Page 2 #25."},
    {id:"T04",item:"Telescope extension for roller",qty:2,photoReqd:false,tags:["#tool","#paint"],comment:"Page 2 #26."},
    {id:"T05",item:"Paint trays",qty:5,photoReqd:false,tags:["#tool","#paint"],comment:"Page 2 #27."},
    {id:"T06",item:"Brushes (different widths)",qty:10,photoReqd:false,tags:["#tool","#paint"],comment:"Page 2 #28."},
    {id:"T07",item:"Sandpaper 180-200 grit 100mm×3m",qty:3,photoReqd:false,tags:["#tool","#construction"],comment:"Page 2 #29."},
    {id:"T08",item:"Sandpaper holder attachment",qty:2,photoReqd:false,tags:["#tool","#construction"],comment:"Page 2 #30."},
    {id:"T09",item:"Construction buckets",qty:3,photoReqd:false,tags:["#tool","#construction"],comment:"Page 2 #31."},
    {id:"T10",item:"Construction spatulas (different widths)",qty:7,photoReqd:false,tags:["#tool","#construction"],comment:"Page 2 #32."},
    {id:"T11",item:"Liquid nail gun",qty:1,photoReqd:false,tags:["#tool","#construction"],comment:"Page 2 #35."},
    {id:"T12",item:"Pump sprayer",qty:1,photoReqd:false,tags:["#tool"],comment:"Page 4 #58."},
    {id:"T13",item:"Cut-off wheels for angle grinder (metal)",qty:4,photoReqd:false,tags:["#tool","#construction"],comment:"Page 4 #59."},
    {id:"T14",item:"PH2 screwdriver bits",qty:10,photoReqd:false,tags:["#tool","#hardware"],comment:"Page 4 #60."},
    {id:"T15",item:"Plaster mixer drill attachment",qty:1,photoReqd:false,tags:["#tool","#construction"],comment:"Page 3 #57."},
    {id:"T16",item:"Furniture carrying straps",qty:2,photoReqd:false,tags:["#tool"],comment:"Page 3 #56."},
    {id:"T17",item:"Storage boxes / hard cases",qty:3,photoReqd:false,tags:["#tool","#hardware"],comment:"Page 4 #69."},
    {id:"T18",item:"Plastic storage containers",qty:3,photoReqd:false,tags:["#tool","#consumable"],comment:"Page 3 #48."},
    {id:"T19",item:"Cutter knives",qty:2,photoReqd:false,tags:["#tool"],comment:"Page 3 #44."},
    {id:"T20",item:"Replacement blades for cutter (pack)",qty:1,photoReqd:false,tags:["#tool","#consumable"],comment:"Page 3 #55."},
  ],
  "CONSUMABLES / SUNDRIES":[
    {id:"S01",item:"Double-sided cloth tape",qty:5,photoReqd:false,tags:["#consumable","#tape"],comment:"Page 2 #36."},
    {id:"S02",item:"Masking tape",qty:5,photoReqd:false,tags:["#consumable","#tape"],comment:"Page 3 #37."},
    {id:"S03",item:"Clear packing tape",qty:5,photoReqd:false,tags:["#consumable","#tape"],comment:"Page 3 #38."},
    {id:"S04",item:"Greenhouse film 100 micron 10sqm",qty:1,photoReqd:false,tags:["#consumable","#construction"],comment:"Page 3 #39."},
    {id:"S05",item:"Rope 20m",qty:1,photoReqd:false,tags:["#consumable","#hardware"],comment:"Page 3 #40."},
    {id:"S06",item:"Rope 8mm × 10m",qty:1,photoReqd:false,tags:["#consumable","#hardware"],comment:"Page 7 #25."},
    {id:"S07",item:"Broom and dustpan",qty:1,photoReqd:false,tags:["#consumable","#tool"],comment:"Page 3 #41."},
    {id:"S08",item:"Heavy duty garbage bags (pack of 10)",qty:10,photoReqd:false,tags:["#consumable"],comment:"Page 3 #42."},
    {id:"S09",item:"Stretch film rolls",qty:3,photoReqd:false,tags:["#consumable"],comment:"Page 3 #43."},
    {id:"S10",item:"Fabric sack bags",qty:20,photoReqd:false,tags:["#consumable","#fabric"],comment:"Page 3 #45."},
    {id:"S11",item:"Cloth for mop",qty:3,photoReqd:false,tags:["#consumable","#fabric"],comment:"Page 3 #46."},
    {id:"S12",item:"Waffle fabric/towel pack",qty:1,photoReqd:false,tags:["#consumable","#fabric"],comment:"Page 3 #49."},
    {id:"S13",item:"Microfiber cloth pack",qty:3,photoReqd:false,tags:["#consumable","#fabric"],comment:"Page 3 #50."},
    {id:"S14",item:"Knitting wire roll",qty:1,photoReqd:false,tags:["#consumable","#hardware"],comment:"Page 3 #51."},
    {id:"S15",item:"Construction pencils (set of 5)",qty:1,photoReqd:false,tags:["#consumable","#tool"],comment:"Page 3 #52."},
    {id:"S16",item:"Glass cleaner Mr. Muscle",qty:3,photoReqd:false,tags:["#consumable"],comment:"Page 3 #54."},
    {id:"S17",item:"Black plastic zip ties (pack)",qty:5,photoReqd:false,tags:["#consumable","#hardware"],comment:"Page 4 #61."},
    {id:"S18",item:"Sewing thread (1 black + 1 white)",qty:2,photoReqd:false,tags:["#consumable","#fabric"],comment:"Page 4 #62."},
    {id:"S19",item:"Signal tape rolls",qty:2,photoReqd:false,tags:["#consumable","#tape"],comment:"Page 4 #63."},
    {id:"S20",item:"Needle set",qty:2,photoReqd:false,tags:["#consumable","#fabric"],comment:"Page 4 #64."},
    {id:"S21",item:"Dish sponges (pack)",qty:1,photoReqd:false,tags:["#consumable"],comment:"Page 4 #66."},
    {id:"S22",item:"Black cotton cloth 10sqm",qty:1,photoReqd:false,tags:["#consumable","#fabric"],comment:"Page 7 #17."},
    {id:"S23",item:"Zipper 1 metre",qty:1,photoReqd:false,tags:["#consumable","#fabric"],comment:"Page 7 #21."},
  ],
};

const CHAT_STATUS = {
  P02:"🔍 Sourcing",P03:"✅ Confirmed",P05:"✅ Confirmed",P06:"✅ Confirmed",
  P10:"🔍 Sourcing",P17:"🔍 Sourcing",
  C02:"🔍 Sourcing",C05:"✅ Confirmed",
  I02:"✅ Confirmed",I03:"✅ Confirmed",I04:"✅ Confirmed",I05:"✅ Confirmed",
  I06:"✅ Confirmed",I07:"🔍 Sourcing",I08:"✅ Confirmed",I09:"🔍 Sourcing",
  I10:"✅ Confirmed",I11:"✅ Confirmed",I12:"✅ Confirmed",
  E01:"✅ Confirmed",
};

function buildInitial() {
  const s = {};
  Object.values(CATS_RAW).flat().forEach(it => {
    s[it.id] = {
      label: it.item,
      comment: it.comment || "",
      status: CHAT_STATUS[it.id] || "⬜ Not Started",
      qtyDel: 0,
      photoDel: false,
      tags: [...it.tags],
    };
  });
  return s;
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAG INPUT
═══════════════════════════════════════════════════════════════════════════ */
function TagInput({ tags, onChange, pool }) {
  const [inp, setInp] = useState("");
  const [sugs, setSugs] = useState([]);
  const [si, setSi] = useState(0);
  const ref = useRef();

  const getSugs = v => {
    const w = v.split(/[\s,]+/).pop();
    if (w.startsWith("#") && w.length > 1)
      setSugs(pool.filter(t => t.startsWith(w.toLowerCase()) && !tags.includes(t)).slice(0,7));
    else setSugs([]);
    setSi(0);
  };
  const commit = tag => {
    const t = tag.trim().toLowerCase().replace(/^#*/,"#");
    if (t.length > 1 && !tags.includes(t)) onChange([...tags, t]);
    setInp(""); setSugs([]);
  };
  const onKey = e => {
    if (sugs.length) {
      if (e.key==="ArrowDown"){e.preventDefault();setSi(i=>(i+1)%sugs.length);return;}
      if (e.key==="ArrowUp"){e.preventDefault();setSi(i=>(i-1+sugs.length)%sugs.length);return;}
      if (e.key==="Tab"||e.key==="Enter"){e.preventDefault();commit(sugs[si]);return;}
    }
    if (e.key==="Enter"||e.key===" "||e.key===","){
      e.preventDefault();
      inp.split(/[\s,]+/).filter(w=>w.startsWith("#")&&w.length>1).forEach(commit);
    }
    if (e.key==="Backspace"&&inp===""&&tags.length) onChange(tags.slice(0,-1));
  };

  return (
    <div style={{position:"relative"}}>
      <div onClick={()=>ref.current?.focus()} style={{
        display:"flex",flexWrap:"wrap",gap:5,alignItems:"center",
        background:T.surf,border:`1px solid ${T.border}`,borderRadius:8,
        padding:"6px 10px",minHeight:40,cursor:"text",
      }}>
        {tags.map(t=>(
          <span key={t} style={{background:T.tagBg,color:T.tagTxt,fontSize:13,fontWeight:600,
            borderRadius:5,padding:"3px 9px",display:"flex",alignItems:"center",gap:4}}>
            {t}
            <span onClick={e=>{e.stopPropagation();onChange(tags.filter(x=>x!==t))}}
              style={{cursor:"pointer",color:T.dim,fontSize:15,lineHeight:1}}>×</span>
          </span>
        ))}
        <input ref={ref} value={inp}
          onChange={e=>{setInp(e.target.value);getSugs(e.target.value);}}
          onKeyDown={onKey} onBlur={()=>setTimeout(()=>setSugs([]),140)}
          placeholder={tags.length===0?"#tag…":""}
          style={{background:"transparent",border:"none",outline:"none",
            color:T.sub,fontSize:14,fontFamily:"inherit",minWidth:50,
            width:inp?Math.max(60,inp.length*9):60}}/>
      </div>
      {sugs.length>0&&(
        <div style={{position:"absolute",top:"100%",left:0,zIndex:400,
          background:"#111",border:`1px solid ${T.border}`,borderRadius:8,
          boxShadow:"0 8px 24px #000",minWidth:140,marginTop:3}}>
          {sugs.map((s,i)=>(
            <div key={s} onMouseDown={()=>commit(s)} style={{
              padding:"9px 14px",fontSize:14,cursor:"pointer",fontWeight:600,
              color:i===si?T.text:T.tagTxt,background:i===si?"#222":"transparent",
            }}>{s}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   QTY STEPPER
═══════════════════════════════════════════════════════════════════════════ */
function QtyStepper({ value, onChange }) {
  const v = parseInt(value)||0;
  const btn = (label, color, fn) => (
    <button onClick={fn} style={{
      background:color,border:"none",borderRadius:8,color:T.text,
      width:44,height:44,fontSize:20,fontWeight:900,cursor:"pointer",
      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
    }}>{label}</button>
  );
  return (
    <div style={{display:"flex",gap:8,alignItems:"center"}}>
      {btn("−","#7f1010",()=>onChange(Math.max(0,v-1)))}
      <div style={{flex:1,background:T.surf,border:`2px solid ${T.greenD}44`,borderRadius:8,
        textAlign:"center",height:44,display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:20,fontWeight:800,color:T.green,minWidth:56}}>
        {v}
      </div>
      {btn("+","#006020",()=>onChange(v+1))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ITEM DRAWER
═══════════════════════════════════════════════════════════════════════════ */
function ItemDrawer({ item, st, onUpdate, onClose, pool }) {
  const sc = SC[st.status]||SC["⬜ Not Started"];
  const refImg = REF_IMAGES[item.id];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:500,
      display:"flex",alignItems:"flex-end"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:T.surf,borderRadius:"16px 16px 0 0",width:"100%",
        maxHeight:"88vh",overflowY:"auto",border:`1px solid ${T.border}`}}>
        {/* Handle */}
        <div style={{width:44,height:5,background:T.border,borderRadius:3,margin:"12px auto 4px"}}/>
        <div style={{padding:"0 18px 24px"}}>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <span style={{fontSize:12,color:T.dim,fontWeight:700,letterSpacing:2}}>{item.id}</span>
            <button onClick={onClose} style={{background:"#333",border:"none",borderRadius:8,
              color:T.text,width:38,height:38,fontSize:20,cursor:"pointer"}}>×</button>
          </div>

          {/* Editable name */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,color:T.dim,letterSpacing:2,marginBottom:6,textTransform:"uppercase",fontWeight:700}}>ITEM NAME</div>
            <input value={st.label||item.item} onChange={e=>onUpdate("label",e.target.value)}
              style={{width:"100%",boxSizing:"border-box",background:T.card,
                border:`2px solid ${T.border}`,borderRadius:8,color:T.text,
                padding:"11px 14px",fontSize:17,fontWeight:600,fontFamily:"inherit"}}/>
          </div>

          {/* Status */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,color:T.dim,letterSpacing:2,marginBottom:6,textTransform:"uppercase",fontWeight:700}}>STATUS</div>
            <select value={st.status} onChange={e=>onUpdate("status",e.target.value)}
              style={{width:"100%",background:sc.bg,border:`2px solid ${sc.brd}`,borderRadius:8,
                color:sc.txt,padding:"11px 10px",fontSize:15,fontWeight:700,fontFamily:"inherit",cursor:"pointer"}}>
              {STATUS_OPT.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>

          {/* Qty row */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,color:T.dim,letterSpacing:2,marginBottom:6,textTransform:"uppercase",fontWeight:700}}>
              QTY REQUESTED: <span style={{color:T.sub,fontWeight:400,letterSpacing:0}}>{item.qty}</span>
              &nbsp;&nbsp;→&nbsp;&nbsp;DELIVERED
            </div>
            <QtyStepper value={st.qtyDel} onChange={v=>onUpdate("qtyDel",v)}/>
          </div>

          {/* Images: 2 columns */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {/* Client ref image */}
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden"}}>
              <div style={{fontSize:10,color:T.amber,letterSpacing:2,padding:"8px 10px 4px",fontWeight:700}}>CLIENT REF</div>
              {refImg
                ?<img src={refImg} alt="client ref" style={{width:"100%",display:"block",objectFit:"contain",maxHeight:120,padding:4}}/>
                :<div style={{height:80,display:"flex",alignItems:"center",justifyContent:"center",color:T.dim,fontSize:12}}>No ref image</div>
              }
            </div>
            {/* Delivered photo */}
            {(() => {
              const photoIds = DELIVERED_PHOTOS[item.id] || [];
              const pid = photoIds[0];

              return (
                <div style={{background:T.card,border:`1px solid ${pid ? T.amber+"44" : T.border}`,borderRadius:8,overflow:"hidden"}}>
                  <div style={{fontSize:10,color:pid ? T.amber : T.dim,letterSpacing:2,padding:"8px 10px 4px",fontWeight:700,
                    display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>DELIVERED PHOTO {pid ? "✅" : "📷"} {photoIds.length > 1 ? `(${photoIds.length})` : ""}</span>
                    {pid && (
                      <span
                        onClick={() => window.open(DRIVE_VIEW(pid),"_blank")}
                        style={{cursor:"pointer",color:T.blue,fontSize:9}}
                      >
                        OPEN↗
                      </span>
                    )}
                  </div>

                  {pid ? (
                    <div
                      onClick={() => window.open(DRIVE_VIEW(pid),"_blank")}
                      style={{cursor:"pointer"}}
                    >
                      <img
                        src={DRIVE_IMG(pid)}
                        alt="delivered"
                        style={{width:"100%",display:"block",objectFit:"cover",maxHeight:120}}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />

                      <div style={{display:"none",height:80,alignItems:"center",justifyContent:"center",
                        color:T.dim,fontSize:11,flexDirection:"column",gap:4}}>
                        <span>📁</span>
                        <span style={{fontSize:10}}>Tap to view in Drive</span>
                      </div>

                      {photoIds.length > 1 && (
                        <div style={{fontSize:9,color:T.dim,textAlign:"center",padding:"2px 0 6px"}}>
                          {photoIds.length} photos available in Drive
                        </div>
                      )}
                    </div>
                  ) : (
                    <div onClick={() => window.open(DRIVE_FOLDER,"_blank")}
                      style={{height:80,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                        color:T.dim,fontSize:12,padding:8,textAlign:"center",gap:6,cursor:"pointer"}}>
                      <span style={{fontSize:20}}>📁</span>
                      <span>Tap to open Drive folder</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Photo delivered toggle */}
          {item.photoReqd&&(
            <label style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,
              background:T.card,border:`1px solid ${st.photoDel?T.amber+"44":T.border}`,
              borderRadius:8,padding:"13px 14px",cursor:"pointer"}}>
              <input type="checkbox" checked={!!st.photoDel}
                onChange={e=>onUpdate("photoDel",e.target.checked)}
                style={{width:22,height:22,accentColor:T.amber}}/>
              <span style={{fontSize:16,fontWeight:600,color:st.photoDel?T.amber:T.sub}}>
                Photo delivered ✓
              </span>
            </label>
          )}

          {/* Comments */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,color:T.dim,letterSpacing:2,marginBottom:6,textTransform:"uppercase",fontWeight:700}}>NOTES / COMMENTS</div>
            <textarea value={st.comment||""} onChange={e=>onUpdate("comment",e.target.value)}
              rows={4}
              style={{width:"100%",boxSizing:"border-box",background:T.card,
                border:`1px solid ${T.border}`,borderRadius:8,color:T.text,
                padding:"11px 14px",fontSize:15,fontFamily:"inherit",resize:"vertical",lineHeight:1.5}}/>
          </div>

          {/* Tags */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,color:T.dim,letterSpacing:2,marginBottom:6,textTransform:"uppercase",fontWeight:700}}>TAGS</div>
            <TagInput tags={st.tags||[]} onChange={v=>onUpdate("tags",v)} pool={pool}/>
          </div>

          <button onClick={onClose} style={{background:T.accent,border:"none",borderRadius:10,
            color:T.text,padding:"15px",fontSize:17,fontWeight:700,fontFamily:"inherit",
            cursor:"pointer",width:"100%",letterSpacing:1}}>
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════════════════ */
export default function HNSPropsTracker() {
  const [cats, setCats] = useState(()=>{
    const c={}; Object.entries(CATS_RAW).forEach(([k,v])=>c[k]=v); return c;
  });
  const [st, setSt] = useState(buildInitial);
  const [fStatus, setFStatus] = useState("All");
  const [fTag, setFTag] = useState("");
  const [fPhoto, setFPhoto] = useState(false);
  const [search, setSearch] = useState("");
  const [exp, setExp] = useState(()=>{const e={};Object.keys(CATS_RAW).forEach(k=>e[k]=true);return e;});
  const [showAdd, setShowAdd] = useState(false);
  const [drawer, setDrawer] = useState(null);
  const [landscape, setLandscape] = useState(false);

  useEffect(()=>{
    const fn=()=>setLandscape(window.innerWidth>window.innerHeight);
    fn();
    window.addEventListener("resize",fn);
    window.addEventListener("orientationchange",fn);
    return ()=>{window.removeEventListener("resize",fn);window.removeEventListener("orientationchange",fn);};
  },[]);

  const allTagsPool = useMemo(()=>{
    const s=new Set(BASE_TAGS);
    Object.values(st).forEach(x=>x.tags?.forEach(t=>s.add(t)));
    return [...s].sort();
  },[st]);

  const upd = (id,field,val) => setSt(p=>({...p,[id]:{...p[id],[field]:val}}));
  const allItems = useMemo(()=>Object.values(cats).flat(),[cats]);

  const stats = useMemo(()=>{
    const byS={};STATUS_OPT.forEach(s=>byS[s]=0);
    allItems.forEach(it=>byS[st[it.id]?.status||"⬜ Not Started"]++);
    const pr=allItems.filter(i=>i.photoReqd).length;
    const pd=allItems.filter(i=>i.photoReqd&&st[i.id]?.photoDel).length;
    return {total:allItems.length,byS,pr,pd};
  },[st,allItems]);

  const usedTags = useMemo(()=>{
    const s=new Set(); Object.values(st).forEach(x=>x.tags?.forEach(t=>s.add(t))); return [...s].sort();
  },[st]);

  const filtCats = useMemo(()=>{
    const res={};
    Object.entries(cats).forEach(([cat,items])=>{
      const f=items.filter(it=>{
        const s=st[it.id]||{};
        return (fStatus==="All"||s.status===fStatus)
          &&(!fTag||s.tags?.includes(fTag))
          &&(!fPhoto||it.photoReqd)
          &&(!search||(s.label||it.item).toLowerCase().includes(search.toLowerCase())||it.id.toLowerCase().includes(search.toLowerCase()));
      });
      if(f.length) res[cat]=f;
    });
    return res;
  },[fStatus,fTag,fPhoto,search,st,cats]);

  const addItem=({id,category,item,qty,photoReqd,tags,comment})=>{
    const cat=Object.keys(cats).includes(category)?category:"HERO PROPS";
    setCats(p=>({...p,[cat]:[...(p[cat]||[]),{id,item,qty,photoReqd,tags}]}));
    setSt(p=>({...p,[id]:{label:item,comment:comment||"",status:"⬜ Not Started",qtyDel:0,photoDel:false,tags}}));
    setExp(p=>({...p,[cat]:true}));
  };

  const pct = Math.round((stats.byS["✅ Confirmed"]+stats.byS["📦 Delivered"])/stats.total*100)||0;

  /* ── LANDSCAPE TABLE ─────────────────────────────────────────────────── */
  const LandTable = ()=>(
    <div style={{overflowX:"auto"}}>
      {Object.entries(filtCats).map(([cat,items])=>(
        <div key={cat} style={{marginBottom:8}}>
          <div onClick={()=>setExp(p=>({...p,[cat]:!p[cat]}))}
            style={{background:T.card,borderLeft:`4px solid ${T.accent}`,
              padding:"8px 14px",cursor:"pointer",display:"flex",
              justifyContent:"space-between",borderRadius:"4px 4px 0 0",userSelect:"none"}}>
            <span style={{fontSize:12,fontWeight:800,color:T.accent,letterSpacing:2}}>{cat}</span>
            <span style={{fontSize:13,color:T.dim}}>{items.length} {exp[cat]?"▲":"▼"}</span>
          </div>
          {exp[cat]&&(
            <table style={{width:"100%",borderCollapse:"collapse",background:T.surf}}>
              <thead>
                <tr style={{background:T.card}}>
                  {["ID","ITEM","REQ","DEL","STATUS","📷"].map(h=>(
                    <th key={h} style={{padding:"8px 10px",fontSize:11,color:T.dim,
                      textAlign:"left",fontWeight:700,letterSpacing:1,
                      borderBottom:`1px solid ${T.border}`,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((it,ix)=>{
                  const s=st[it.id]||{};
                  const sc2=SC[s.status]||SC["⬜ Not Started"];
                  return (
                    <tr key={it.id} onClick={()=>setDrawer({item:it})}
                      style={{background:ix%2===0?T.bg:T.surf,cursor:"pointer",
                        borderBottom:`1px solid ${T.border}`}}>
                      <td style={{padding:"10px",fontSize:12,color:T.dim,fontWeight:700,whiteSpace:"nowrap"}}>{it.id}</td>
                      <td style={{padding:"10px",maxWidth:260}}>
                        <div style={{fontSize:15,color:T.text,fontWeight:600,marginBottom:4, textAlign:"left"}}>{s.label||it.item}</div>
                        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                          {(s.tags||[]).slice(0,4).map(t=>(
                            <span key={t} style={{background:T.tagBg,color:T.tagTxt,fontSize:11,
                              borderRadius:3,padding:"1px 5px",fontWeight:600}}>{t}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{padding:"10px",fontSize:15,color:T.sub,fontWeight:700,textAlign:"center"}}>{it.qty}</td>
                      <td style={{padding:"10px",textAlign:"center"}}>
                        <span style={{fontSize:16,fontWeight:800,color:s.qtyDel?T.green:T.dim}}>
                          {s.qtyDel||"—"}
                        </span>
                      </td>
                      <td style={{padding:"10px",whiteSpace:"nowrap"}}>
                        <span style={{background:sc2.bg,color:sc2.txt,border:`1px solid ${sc2.brd}`,
                          borderRadius:5,padding:"4px 8px",fontSize:12,fontWeight:700}}>{sc2.short}</span>
                      </td>
                      <td style={{padding:"10px",textAlign:"center",fontSize:16}}>
                        {it.photoReqd?(s.photoDel?"✅":"📷"):"—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );

  /* ── PORTRAIT CARDS ──────────────────────────────────────────────────── */
  const PortraitCards = ()=>(
    <div>
      {Object.entries(filtCats).map(([cat,items])=>(
        <div key={cat} style={{marginBottom:10}}>
          <div onClick={()=>setExp(p=>({...p,[cat]:!p[cat]}))}
            style={{background:T.card,borderLeft:`4px solid ${T.accent}`,
              padding:"12px 16px",cursor:"pointer",display:"flex",
              justifyContent:"space-between",alignItems:"center",
              userSelect:"none",borderRadius:"8px 8px 0 0"}}>
            <span style={{fontSize:13,fontWeight:800,color:T.accent,letterSpacing:2}}>{cat}</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{background:T.bg,color:T.dim,fontSize:13,fontWeight:700,
                borderRadius:12,padding:"2px 10px"}}>{items.length}</span>
              <span style={{fontSize:14,color:T.dim}}>{exp[cat]?"▲":"▼"}</span>
            </div>
          </div>
          {exp[cat]&&(
            <div style={{border:`1px solid ${T.border}`,borderTop:"none",borderRadius:"0 0 8px 8px",overflow:"hidden"}}>
              {items.map((it,ix)=>{
                const s=st[it.id]||{};
                const sc2=SC[s.status]||SC["⬜ Not Started"];
                return (
                  <div key={it.id} onClick={()=>setDrawer({item:it})}
                    style={{background:ix%2===0?T.bg:T.surf,
                      borderBottom:`1px solid ${T.border}`,padding:"14px 16px",cursor:"pointer",
                      display:"flex",gap:12,alignItems:"flex-start",
                      WebkitTapHighlightColor:"rgba(255,68,0,0.15)"}}>
                    {/* Left */}
                    <div style={{minWidth:58,display:"flex",flexDirection:"column",gap:6,alignItems:"flex-start",paddingTop:2}}>
                      <span style={{fontSize:12,color:T.dim,fontWeight:700}}>{it.id}</span>
                      <span style={{background:sc2.bg,color:sc2.txt,border:`1px solid ${sc2.brd}`,
                        borderRadius:5,padding:"3px 7px",fontSize:11,fontWeight:800,whiteSpace:"nowrap"}}>
                        {sc2.short}
                      </span>
                      {REF_IMAGES[it.id]&&(
                        <img src={REF_IMAGES[it.id]} alt="ref"
                          style={{width:46,height:46,objectFit:"contain",borderRadius:4,
                            border:`1px solid ${T.border}`,background:T.card}}/>
                      )}
                    </div>
                    {/* Center */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:16,fontWeight:700,color:T.text,lineHeight:1.3,marginBottom:6}}>
                        {s.label||it.item}
                      </div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {(s.tags||[]).slice(0,5).map(t=>(
                          <span key={t} style={{background:T.tagBg,color:T.tagTxt,fontSize:12,
                            borderRadius:4,padding:"2px 8px",fontWeight:600}}>{t}</span>
                        ))}
                      </div>
                    </div>
                    {/* Right */}
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,minWidth:44}}>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:11,color:T.dim,lineHeight:1}}>req</div>
                        <div style={{fontSize:18,fontWeight:800,color:T.sub,lineHeight:1.1}}>{it.qty}</div>
                        {s.qtyDel>0&&(
                          <div style={{fontSize:18,fontWeight:800,color:T.green,lineHeight:1.1}}>{s.qtyDel}</div>
                        )}
                      </div>
                      {it.photoReqd&&(
                        <span style={{fontSize:18}}>{s.photoDel?"✅":"📷"}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:T.bg,
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      color:T.text,paddingBottom:80}}>

      {/* HEADER */}
      <div style={{background:T.surf,borderBottom:`2px solid ${T.accent}`,
        position:"sticky",top:0,zIndex:100,padding:landscape?"10px 16px":"14px 16px"}}>
        {/* Title + Add btn */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
            <span style={{fontSize:10,fontWeight:800,color:T.accent,letterSpacing:4}}>HNS</span>
            <span style={{fontSize:landscape?18:20,fontWeight:800,color:T.text,letterSpacing:0.5}}>PROPS TRACKER</span>
            <span style={{fontSize:9,color:T.dim,letterSpacing:3}}>CHIANG MAI</span>
          </div>
          <button onClick={()=>setShowAdd(true)} style={{
            background:T.accent,border:"none",borderRadius:8,color:T.text,
            padding:landscape?"7px 14px":"9px 16px",fontSize:landscape?13:15,
            fontWeight:700,fontFamily:"inherit",cursor:"pointer",letterSpacing:0.5,
          }}>＋ ADD</button>
        </div>

        {/* Stats */}
        <div style={{display:"flex",gap:landscape?20:12,flexWrap:"wrap",marginBottom:10,alignItems:"center"}}>
          {[
            {l:"TOTAL",v:stats.total,c:T.sub},
            {l:"CONFIRMED",v:stats.byS["✅ Confirmed"],c:T.green},
            {l:"DELIVERED",v:stats.byS["📦 Delivered"],c:T.greenD},
            {l:"SOURCING",v:stats.byS["🔍 Sourcing"],c:T.blue},
            {l:"PENDING",v:stats.byS["⬜ Not Started"],c:T.dim},
            {l:"N/A",v:stats.byS["❌ N/A"],c:T.red},
            {l:"PHOTOS",v:`${stats.pd}/${stats.pr}`,c:T.amber},
          ].map(s=>(
            <div key={s.l} style={{textAlign:"center"}}>
              <div style={{fontSize:landscape?20:22,fontWeight:800,color:s.c,lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:9,letterSpacing:1.5,color:T.dim,marginTop:1,fontWeight:600}}>{s.l}</div>
            </div>
          ))}
          {!landscape&&(
            <div style={{flex:1,minWidth:80}}>
              <div style={{height:8,background:"#222",borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",
                  background:`linear-gradient(90deg,${T.green},${T.greenD})`,
                  borderRadius:4,transition:"width 0.4s"}}/>
              </div>
              <div style={{fontSize:10,color:T.dim,marginTop:3,textAlign:"right",fontWeight:600}}>{pct}%</div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search…"
            style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,
              color:T.text,padding:"8px 12px",fontSize:15,fontFamily:"inherit",
              flex:1,minWidth:100,maxWidth:180}}/>
          <select value={fStatus} onChange={e=>setFStatus(e.target.value)}
            style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,
              color:T.text,padding:"8px 10px",fontSize:13,fontFamily:"inherit",fontWeight:600}}>
            <option value="All">All statuses</option>
            {STATUS_OPT.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={fTag} onChange={e=>setFTag(e.target.value)}
            style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,
              color:T.text,padding:"8px 10px",fontSize:13,fontFamily:"inherit",fontWeight:600}}>
            <option value="">All tags</option>
            {usedTags.map(t=><option key={t}>{t}</option>)}
          </select>
          <label style={{fontSize:13,color:T.sub,display:"flex",alignItems:"center",
            gap:5,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>
            <input type="checkbox" checked={fPhoto} onChange={e=>setFPhoto(e.target.checked)}
              style={{width:18,height:18,accentColor:T.amber}}/>
            📷 only
          </label>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{padding:landscape?"8px 12px":"10px 12px"}}>
        {landscape?<LandTable/>:<PortraitCards/>}
      </div>

      {/* MODALS */}
      {showAdd&&<AddModal onClose={()=>setShowAdd(false)} onAdd={addItem} pool={allTagsPool}/>}
      {drawer&&(
        <ItemDrawer
          item={drawer.item}
          st={st[drawer.item.id]||{}}
          onUpdate={(field,val)=>upd(drawer.item.id,field,val)}
          onClose={()=>setDrawer(null)}
          pool={allTagsPool}
        />
      )}
    </div>
  );
}
