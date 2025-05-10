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
main.js         – Förladdar genrer, kopplar alla event-listeners och
                  kickar igång första “Popular Movies”-vyn.

uiEvents.js     – Lyssnare för UI:t. Lyssnar på navbar-klick, sök-submit,
                  sort-dropdown, ESC-key m.m. Ropar vidare till browseLogic
                  eller searchLogic och stänger/öppnar modaler via uiUtils.

browseLogic.js  – Hanterar logik för flikarna “Popular / Top Rated / Genre”.
                  Hämtar listor via api.js, filtrerar/sorterar, skriver dem
                  till results-cachen och säger åt dom.js att rendera dessa.

searchLogic.js  – Hanterar fritextssökning. Tar söksträng + typ (movie/person),
                  hämtar rådata, rensar med filters.js, cachar i results.js
                  och låter dom.js rendera.

api.js          – Enda service-lagret mot TMDB med fetch-helpers för:
                  • Populära / Top-Rated filmer  
                  • Populära personer  
                  • Frisök (movie|person)  
                  • Hämta alla genrer (cache)  
                  • Plocka första YouTube-trailern för en film

results.js      – Klient-cache för senaste resultaten. Håller senaste resultat­listan 
                  och erbjuder lokala sorteringsfunktioner så vi slipper nya
                  API-anrop när användaren sorterar resultaten.

dom.js          – Bygger Movie-/PersonCard-komponenter, stoppar in dem i DOM-en, 
                  sköter trailer-modalen och visar tom- eller fel-state.

classes/        – Återanvändbara kort-klasser:  
                  • **MovieCard.js** – renderar ett filmobjekt  
                  • **PersonCard.js** – renderar ett personobjekt

filters.js      – Rena util-funktioner: genre-filter, namn-filter på personer,
                  sorteringsfunktion för popularitet osv.

uiUtils.js      – Innehåller UI-hjälpare som klasserna andvänder sig av:  
                  • show/hideLoader()  
                  • showErrorBanner(msg)  
                  • openModalWithContent(html) / closeModal()  
                  • scrollTop()
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