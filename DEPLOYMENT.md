# Deployment‑Anleitung: suduxu.com + docs.suduxu.com auf Vercel & Cloudflare

Diese Anleitung beschreibt, wie du dein Next.js‑Projekt (App Router, `app/`‑Ordner) auf Vercel unter `suduxu.com` hostest und gleichzeitig die Dokumentation unter `docs.suduxu.com` erreichbar machst. Sie enthält: Vercel‑Routing (Host‑basierte Rewrites), Cloudflare‑DNS‑Einträge, Test‑Befehle (PowerShell) und Troubleshooting‑Hinweise.

Kurze Checkliste (wird in der Anleitung abgearbeitet)
- [ ] Projekt mit Git zu Vercel verbinden und deployen
- [ ] Domains in Vercel hinzufügen: `suduxu.com` und `docs.suduxu.com`
- [ ] Cloudflare DNS‑Einträge setzen (während Setup: Proxy OFF / DNS only)
- [ ] `vercel.json` (Host‑basierte Rewrite) ins Repo einfügen, commit + push
- [ ] Domain‑Verifikation und SSL in Vercel prüfen
- [ ] Tests: DNS/HTTP/Rewrite prüfen
- [ ] Optional: Cloudflare Proxy (orange cloud) nur nach Tests aktivieren

Voraussetzungen & Hinweise zum Projekt
- Dein Projekt verwendet Next.js App Router (Ordner `app/`) — die Docs liegen unter `app/docs/`.
- Wir nutzen Vercel Edge/Rewrites: eingehende Requests an `docs.suduxu.com/*` werden intern auf `/docs/*` gemappt.
- Während der Einrichtung solltest du Cloudflare Proxy (orange cloud) deaktiviert lassen (setze „DNS only“), da Cloudflare Proxy die Vercel‑Domain‑Verifizierung und das ACME/SSL‑Flow stören kann.

1) Vercel: Projekt erstellen und Git verbinden
1. Gehe zu vercel.com und melde dich an.
2. Erstelle ein neues Projekt → Import Project → wähle dein Git‑Repo (GitHub/GitLab/Bitbucket).
3. Vercel erkennt Next.js automatisch. Standard Build Command: `npm run build` bzw. `next build`.
4. Deploy das Projekt (erzeuge mindestens einmal ein Deployment, damit Vercel die Projekt‑URL hat).

2) Domains in Vercel hinzufügen
1. Öffne dein Projekt in Vercel → Settings → Domains.
2. Füge `suduxu.com` hinzu und weise sie dem Projekt zu.
3. Füge `docs.suduxu.com` hinzu und weise sie demselben Projekt zu.

3) Cloudflare: DNS‑Einträge anlegen (empfohlen: DNS only während Setup)
Hinweis: Vercel verwendet für Apex‑Domains typischerweise die IP `76.76.21.21` und für CNAME die Zieladresse `cname.vercel-dns.com`. Bestätige im Vercel Dashboard, falls sich die Werte geändert haben.

Empfohlene DNS‑Einträge in Cloudflare (Zone: suduxu.com):
- Apex (suduxu.com)
  - Type: A
  - Name: @
  - Value: 76.76.21.21
  - Proxy status: DNS only (graue Wolke)
  - TTL: Auto

- www (optional, empfiehlt sich für `www.suduxu.com`)
  - Type: CNAME
  - Name: www
  - Value: cname.vercel-dns.com
  - Proxy status: DNS only
  - TTL: Auto

- docs (Subdomain für die Dokumentation)
  - Type: CNAME
  - Name: docs
  - Value: cname.vercel-dns.com
  - Proxy status: DNS only
  - TTL: Auto

Warum "DNS only"? Cloudflare Proxy (orange cloud) kann Vercels Host‑Verifizierung, Let's Encrypt‑Flow und bestimmte Edge‑Features beeinträchtigen. Sobald alles funktioniert, kannst du testen, ob Proxy aktivierbar ist; viele Teams lassen die Cloudflare‑Proxy jedoch dauerhaft aus für Vercel‑Deploys.

4) Host‑basierte Rewrite in Vercel (empfohlen)
Lege im Projekt‑Root eine Datei `vercel.json` an und committe sie. Beispiel (kopierbar):

```json
{
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/docs/:path*",
      "has": [
        {
          "type": "host",
          "value": "docs.suduxu.com"
        }
      ]
    }
  ]
}
```

Erklärung:
- Requests an `https://docs.suduxu.com/foo` werden intern an `/docs/foo` weitergereicht. Die URL im Browser bleibt `docs.suduxu.com/foo`.
- Requests an `suduxu.com` bleiben unverändert.

Alternativen:
- Separate Vercel‑Projekte: Falls du Deploys und Traffic komplett trennen möchtest, kannst du ein zweites Vercel‑Projekt nur für die Docs anlegen (z. B. mit einem `root` oder `output`-Pfad), ist aber nicht nötig, da Docs in `app/docs/` liegen.
- `basePath` in Next.js ist hier nicht ideal, weil du zwei Hosts bedienen willst; Rewrite ist sauberer.

5) Commit & Push

Führe im Projekt‑Root (PowerShell) aus:

```powershell
git add vercel.json
git commit -m "Add Vercel host-based rewrite for docs subdomain"
git push
```

Vercel deployed automatisch nach dem Push.

6) Domain‑Verifikation & SSL in Vercel
- Gehe in Vercel → Project → Domains. Klicke bei jeder Domain auf Verify, falls nötig.
- Vercel stellt automatisch ein SSL‑Zertifikat (Let's Encrypt) aus, sobald DNS richtig zeigt.
- Falls Verifikation fehlschlägt: kontrolliere DNS‑Einträge in Cloudflare und dass Proxy OFF ist.

7) Tests (PowerShell)
DNS prüfen:

```powershell
# Apex A record
Resolve-DnsName suduxu.com -Type A

# CNAME für docs
Resolve-DnsName docs.suduxu.com -Type CNAME
```

HTTP(S) prüfen (Statuscode):

```powershell
# Mit Invoke-WebRequest (PowerShell builtin)
(Invoke-WebRequest -Uri "https://suduxu.com" -UseBasicParsing).StatusCode
(Invoke-WebRequest -Uri "https://docs.suduxu.com" -UseBasicParsing).StatusCode

# Alternativ: curl.exe falls installiert (gibt Header aus)
curl.exe -I https://suduxu.com
curl.exe -I https://docs.suduxu.com
```

Rewrite testen (Host Header Test gegen Vercel Deployment URL):
- Hole die Vercel Deployment URL aus dem Dashboard, z. B. `my-project-abc123.vercel.app`.

```powershell
# Teste, ob Host‑Header docs.suduxu.com auf /docs/* rewrited wird
curl.exe -H "Host: docs.suduxu.com" -I https://my-project-abc123.vercel.app/
```

Du solltest die Inhalte/Headers sehen, die dem Pfad `/docs` entsprechen.

8) Troubleshooting – häufige Probleme
- Zertifikat / Verification failed:
  - Prüfe DNS (A/CNAME) auf korrekte Werte; Proxy darf während Verifikation nicht aktiv sein.
  - Warte DNS‑Propagation (einige Minuten bis Stunden).
- Rewrite greift nicht:
  - Prüfe `vercel.json` auf JSON‑Syntax und dass die Datei im Repo wirklich deployed ist.
  - Kontrolliere exakte Host‑Angabe (`docs.suduxu.com`) in `value`.
- Cloudflare Proxy nötig, aber bricht Dinge:
  - Wenn du Proxy aktivieren musst, stelle in Cloudflare SSL/TLS → Full (strict) ein.
  - Teste Verhalten nach Aktivierung gründlich (Headers, CORS, Serverless/Edge Zeitlimits).

9) Weitere Empfehlungen
- Environment Variables: Lege alle Secrets in Vercel → Settings → Environment Variables an (Production/Preview/Development getrennt).
- Preview Deployments: Preview‑Deploys generieren eigene URLs; Host‑basierte Rewrite funktioniert nur für Domains, die dem Projekt in Vercel hinzugefügt sind.
- Logging & IPs: Wenn du Client‑IP brauchst, beachte X‑Forwarded‑For Header; Cloudflare Proxy ändert die Client‑IP.

10) Optional: Variante mit separatem Vercel‑Projekt für `docs.suduxu.com`
- Erstelle ein zweites Vercel‑Projekt, richtet das Root/Output auf einen docs‑Ordner oder nutze ein monorepo‑Setup.
- Binde `docs.suduxu.com` an dieses Projekt in Vercel.
- Vorteil: volle Trennung, unterschiedliche Env‑Vars, unabhängigere Deploys.

11) Checkliste zum Abhaken
- [ ] DNS Einträge in Cloudflare gesetzt (A @ -> 76.76.21.21, CNAME docs -> cname.vercel-dns.com)
- [ ] `vercel.json` hinzugefügt und gepusht
- [ ] Domains in Vercel hinzugefügt und verifiziert
- [ ] SSL‑Zertifikat aktiv
- [ ] Tests (Resolve-DnsName, HTTP Head, Host‑Header Rewrite) erfolgreich

Wenn du willst, kann ich jetzt:
- A) die `vercel.json` direkt in dein Repo erstellen (ich kann sie für dich committen), oder
- B) die Liste der Cloudflare‑Einträge als einfache Tabelle exportieren, oder
- C) deinen `app/docs`‑Code auf absolute Links prüfen und mögliche Anpassungen vorschlagen.

Pfad der erstellten Datei: `DEPLOYMENT.md`

Ende der Anleitung.

