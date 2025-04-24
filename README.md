# Emiles Movie Database

En app som hämtar data via TMDB:s REST-API och visar filmtopp‑listor och populära personer. Det går att söka på personer och på filmer samt sortera resultaten antingen via populäritet eller bokstavsordning. Datan som hämtas från API:t visas som små kort på hemsidan för att få en fin översikt av resultaten.

---

## Funktioner

### Listknappar

- **Top Rated** – de 10 högst rankade filmerna just nu  
- **Popular Movies** – de 10 populäraste filmerna  
- **Popular People** – de 20 populäraste skådespelarna / regissörerna

### Sök & filter

- Frisökning på *film* eller *person*
- Genre‑dropdown
- Fyra sorteringslägen  
  - Namn A–Ö / Ö–A  
  - Popularitet ↑ / ↓  

### Kort & trailer‑modal

- Responsiva kort som tar oss till TMDB om vi trycker på dem
- Med en hoovereffekt kan vi se en liten beskrivning av filmerna samt se en trailer‑knapp som öppnar en trailer på YouTube

## Programflöde (översikt)

```text
main.js         – Init → uiEvents.js
uiEvents.js     – Fångar klick / submit
browseLogic.js  – Populära / Top‑Rated / Genre
searchLogic.js  – Frisök
api.js          – Enda HTTP‑klienten
results.js      – Mini‑store + sortering
dom.js          – Renderar kort & modal
classes/        – MovieCard | PersonCard
filters.js      – Genrefilter, sort‑helpers
uiUtils.js      – Modal + felbanner
```

---

## Installation

### Snabbstart

```bash
git clone "https://github.com/eschboii/java24-js-slutprojekt-emile-schlick.git"
```

1. **Lägg till Bearer‑token**  
   `modules/api.token.js`
   ```js
   export const ACCESS_TOKEN = 'PASTE-YOUR-TOKEN-HERE';
   ```

2. Ladda ned och Starta liveserver  

3. Öppna <http://localhost:3000>

### Deploy på GitHub Pages

1. Push:a koden till ett repo  
2. Settings → **Pages** → `branch: main / root`

---

## Kodstruktur

```plaintext
project/
├── index.html
├── CSS/
├── main.js
└── modules/
    ├── api.js
    ├── api.token.js (ignored)
    ├── browseLogic.js
    ├── searchLogic.js
    ├── results.js
    ├── dom.js
    ├── uiEvents.js
    ├── uiUtils.js
    ├── filters.js
    └── classes/
        ├── MovieCard.js
        └── PersonCard.js
```

---

## Exempel

1. **Populära filmer** visas automatiskt  
2. Klicka “Top Rated” → lista byts  
3. Sök “Dune” → träffar + trailer-modal  
4. Välj genre “Animation” + Sort A–Ö → lokal sortering
5. Välj typ "Person", välj "Genre" och sök så kommer populäraste personerna med för den genre

---

## Licens

MIT