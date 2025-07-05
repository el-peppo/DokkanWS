# Playwright (Empfohlen)

**Bestens geeignet für:**  
Simplicity + Performance + Maintainability

## Vorteile

- Schnelle und zuverlässige Browser-Automatisierung  
- Eingebaute Retry-Mechanismen & Error-Handling  
- Anti-Detection-Features für stabile Scrapes  
- Exzellente TypeScript-Unterstützung  
- Unterstützt JS-gerenderte Inhalte (SPA, dynamisch)  
- Eingebaute Screenshot- & Debugging-Funktionen  
- Parallele Ausführung über mehrere Browser-Kontexte

**Perfekt für deinen Anwendungsfall:**

- Komplexe Wiki-Seiten mit dynamischem Inhalt  
- Robust gegen Layout-Änderungen  
- Sehr gute Performance durch Parallelisierung  
- Minimalinvasive Umstellung (quasi Drop-in für JSDOM)

---

# Implementierungsplan

## Phase 1: Core Scraper Rewrite

1. Ersetze JSDOM durch Playwright  
2. Behalte bestehende API-Interfaces (keine UI-Änderungen)  
3. Nutze Playwrights Retry-Mechanismen für besseres Fehlerhandling  
4. Füge Screenshot-Funktion für fehlschlagende Scrapes hinzu  
5. Implementiere Anti-Detection (User-Agent, Header, Delays)

## Phase 2: Performance-Optimierung

1. Parallele Browser-Kontexte für mehr Durchsatz  
2. Request-Blocking (Images, CSS, Ads, Fonts etc.)  
3. Smartes Caching für wiederholte Anfragen  
4. Performance-Metriken erfassen & auswerten

## Phase 3: MySQL-Integration erweitern

1. Realtime-DB-Updates während des Scrapes  
2. Inkrementelle Updates: Nur geänderte Inhalte scrapen  
3. Fortschrittsverfolgung über die Datenbank  
4. Erweiterte Filter- und Suchmöglichkeiten

## Phase 4: Maintainability & Monitoring

1. Visuelle Regressionstests mit Screenshots  
2. Selector-Health-Monitoring implementieren  
3. Automatische Fallbacks bei kaputten Selektoren  
4. Visuelles Debug-Dashboard für Entwickler

---

# Vorteile dieses Ansatzes

1. Keine Änderungen an der Web-UI  
   - Express + Socket.IO bleiben unberührt

2. Höhere Zuverlässigkeit  
   - Playwright rendert komplexe Inhalte stabil

3. Einfacheres Debugging  
   - Screenshots, Logs, Network Tracing

4. Zukunftssicher  
   - Robust gegen dynamische Inhalte & UI-Änderungen

5. Massive Performance-Gewinne  
   - Parallelisierung + Ressourcen-Blocking

6. Bessere MySQL-Anbindung  
   - Echtzeit-Daten, bessere Abfragen, inkrementelle Updates

---

# Migrationsstrategie

- API-Contracts beibehalten  
  → Web-Frontend funktioniert ohne Anpassung weiter

- Schrittweise Migration  
  → Interne Scraper-Komponenten ersetzen

- MySQL-Funktionen ausbauen  
  → Fortschrittstracking, Realtime-Updates

- Tests & Monitoring  
  → Visuelle Regressionstests erkennen Wiki-Änderungen frühzeitig

bitte inkludiere auch vollständig alle .md Dateien in dein wissen für das projekt, passe die claude.md auch danach an.