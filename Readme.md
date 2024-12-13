I denne oppgaven skal dere lage en side som kobler brukeren til vanskeligstilte familier som ønsker noen å feire jul sammen med.

Siden skal kunne matche brukeren med familier basert på et fastsatt sett med egenskaper, som for eksempel størrelse på hus, antall mennesker man ønsker å feire med, allergier, matpreferanser eller andre ting. Man skal ha en oversikt over minst 20 familier, som har følgende info registrert:

- Et bilde
- Et navn
- En tittel
- En kort beskrivelse (Litt om oss, ca 50 ord)
- Ønsker/ Preferanser (Egenskaper) Man bør ha +/- 10 egenskaper å sortere etter

Siden skal ha et søkefelt hvor man kan søke etter keywords hos de ulike familiene, samt sjekkbokser hvor man kan sortere bort familier basert på faktorer man ikke kan tilpasse (for eksempel dyreallergi hos en som har kjæledyr). Når man klikker på en familie, skal man også få opp et tekstfelt hvor man kan booke en julefeiring med denne familien. Denne innsendingen trenger ikke å sendes noe sted, men det er en fordel om tekstfeltet tømmes.

Man skal også ha en side hvor man kan opprette nye familier, redigere de eksisterende familiene eller slette familier som ligger registrert inne. (CRUD)

Det skal også lages en backend, som skal servere dataen til til frontsiden.
Her kan dere bruke JSON for å lagre familiedata.

Da må det lages en model av jsonfilen, både i helhet, og hvert objekt, slik at applikasjonen

kan lage, lese, lagre og slette data via modellen (CRUD).

Dataen må kunne lastes inn i minnet, og kunne lagres tilbake som JSON når det er gjort endringer, slik at applikasjonen kan ha en fast kilde til data mellom oppstarter.

Endepunktene til backenden skal støtte standard CRUD operasjonene frontend delen krever.

Man skal bruke HTML, CSS, Javascript og gjerne JSON til oppgaven.

---

## TODO

- [ ] upload image?
- [ ] auto-rename image file? (if upload)
- [ ] check image format(jpg,png...)?
- [ ] return NoContent() change to response,response.status, response.statusText
- [ ] [FIXME] select in renderForm()
- [ ] redirect after deleting
