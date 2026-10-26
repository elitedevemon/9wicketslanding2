# 9Wickets Landing Page — Setup Instructions
### (কিভাবে localhost এবং cPanel-এ সাইট চালু করবেন)

> **Stack:** Pure HTML + CSS + JavaScript (jQuery + Vue 3 + Tailwind CDN)
> **PHP / Database / Node.js:** কিছুই লাগবে না ❌ — এটা একটা static website।
> ইন্টারনেট লাগবে (Tailwind, jQuery, Vue CDN থেকে load হয়)।

---

## 📁 ফাইল স্ট্রাকচার

```
ninewickets/
├── index.html       ← পুরো website (একটাই ফাইল)
├── images/          ← logo, favicon, banner, ছবি
├── .htaccess        ← Apache settings (optional)
├── README.md
└── instructions.md  ← এই ফাইল
```

---

## 🖥️ Localhost-এ চালানো

**সবচেয়ে সহজ উপায়** — folder-এর ভিতরে গিয়ে browser-এ সরাসরি `index.html` খুলে দিলেই হবে।
(Double-click → Chrome/Firefox-এ খুলবে, সব কাজ করবে।)

অথবা ছোট একটা server চালাতে চাইলে:
```bash
cd ninewickets
# Python থাকলে:
python -m http.server 8000
# অথবা PHP থাকলে:
php -S localhost:8000
# অথবা Node থাকলে:
npx serve .
```
তারপর browser-এ: **http://localhost:8000**

---

## 🌐 cPanel / hosting-এ upload

1. cPanel → **File Manager** খুলুন।
2. `public_html` (বা subdomain-এর root) folder-এ যান।
3. `index.html` আর `images/` folder upload করুন
   (zip করে upload → Extract করলে দ্রুত)।
4. Bas! Browser-এ আপনার domain খুললেই site live।

> কোনো permission/change লাগবে না — static file, পড়ার access থাকলেই চলবে।

**Final structure:**
```
public_html/
├── index.html
└── images/
```

---

## ✏️ Content বদলাতে চাইলে

সব লেখা, নাম্বার, লিংক `index.html` ফাইলের ভিতরেই আছে — নিচের দিকে একটা বড়
`c: { ... }` object দেখবেন। ওখানে:

- `ticker` — উপরের চলা লেখাগুলো
- `slides` — hero banner-এর ৩টা slide
- `agents.master / subs / cs / list` — এডমিন, সাব-এডমিন, কাস্টমার সার্ভিস, ২২ জন এজেন্ট
- `faq` — প্রশ্নোত্তর
- `social / contact / domains / network` — লিংক আর নাম্বার

যেকোনো text editor (VS Code, Notepad++) দিয়ে বদলে save করলেই হয়ে গেল।

**ছবি বদলাতে:** `images/` folder-এ same নামে নতুন ছবি রাখুন, অথবা `c:` object-এ
image-র path/url বদলে দিন (যেকোনো direct image URL-ও দেওয়া যায়)।

---

## 🎨 Theme

Header-এ সূর্য/চাঁদ icon — click করলে **Light / Dark** theme বদলায়, browser মনে রাখে।

---

## 📞 সাইটে দেওয়া নাম্বারগুলো (official list থেকে)

- **Admin:** Asif Khalid — +1 646 470 0338
- **Sub-Admin SA1:** Fardin Khan — +63 956 866 5101
- **Sub-Admin SA2:** Touhid Afridi — +44 777 652 3130
- **CS1:** +63 945 118 2507 • **CS2:** +63 945 118 2464

---

## 🐛 সমস্যা হলে

| সমস্যা | সমাধান |
|---|---|
| Style/load হচ্ছে না | Internet connection check (CDN লাগে) |
| বাংলা font ভাঙা দেখাচ্ছে | Hind Siliguri font Google Fonts থেকে আসে — connection থাকলে ঠিক হবে |
| ছবি দেখাচ্ছে না | `images/` folder ঠিকমতো upload হয়েছে কিনা দেখুন |
