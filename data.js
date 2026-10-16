/* BK+ — démo : données fictives partagées entre les écrans (stockage local du navigateur) */
(function () {
  const KEY = 'bkdemo-v2';

  const USERS = [
    { id: 'bureau1', nom: 'Bureau 1', role: 'Bureau' },
    { id: 'bureau2', nom: 'Bureau 2', role: 'Bureau' },
    { id: 'chef',    nom: 'Chef d’équipe', role: 'Chef d’équipe' },
  ];

  const TECHS = [
    { id: 'karim',   nom: 'Karim',   couleur: '#1565D8' },
    { id: 'julien',  nom: 'Julien',  couleur: '#0E9F6E' },
    { id: 'mehdi',   nom: 'Mehdi',   couleur: '#E8590C' },
    { id: 'thomas',  nom: 'Thomas',  couleur: '#7C3AED' },
    { id: 'nicolas', nom: 'Nicolas', couleur: '#DB2777' },
  ];

  const pad = n => String(n).padStart(2, '0');
  const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  function monday(d) {
    const x = new Date(d); x.setHours(12, 0, 0, 0);
    const day = (x.getDay() + 6) % 7; x.setDate(x.getDate() - day); return x;
  }
  function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function todayIso() {
    const t = new Date();
    if (t.getDay() === 0) return iso(addDays(t, 1)); // dimanche → on montre lundi
    return iso(t);
  }

  function photo(label, hue) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},25%,62%)"/><stop offset="1" stop-color="hsl(${hue},30%,38%)"/></linearGradient></defs><rect width="320" height="240" fill="url(#g)"/><g fill="none" stroke="rgba(255,255,255,.75)" stroke-width="10" stroke-linecap="round"><path d="M40 170h120v-60h80"/><circle cx="240" cy="110" r="16"/></g><text x="16" y="224" font-family="sans-serif" font-size="16" fill="#fff">${label}</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function seed() {
    const mon = monday(new Date(todayIso()));
    const D = i => iso(addDays(mon, i));
    const T = todayIso();
    const past = n => iso(addDays(new Date(T), -n));
    let n = 100;
    const I = (o) => Object.assign({ id: 'i' + (n++), type: 'intervention', statut: 'planifiee', photos: [], commentaire: '', devisPdf: false, recurrent: false, dur: 2, materiel: [], pieces: [], epingle: false, chantier: null, modifiePar: 'Bureau 1' }, o);
    const doc = (name, kind, hue) => ({ name, kind, src: kind === 'pdf' ? '' : photo(name, hue) });

    const interventions = [
      // Aujourd'hui — Karim (le parcours de démo côté iPad)
      I({ date: T, start: '08:00', dur: 1.5, techs: ['karim'], agence: 'Agence Étang Immobilier', occupant: 'Mme Laurent', tel: '0600000001', adresse: '12 allée des Pins', ville: 'Istres', travaux: "Fuite sous l'évier de la cuisine. Remplacer le siphon et vérifier le flexible d'alimentation.", devisPdf: true, materiel: ['Siphon PVC Ø40', 'Flexible inox 50 cm', 'Joints fibre 15/21'], pieces: [doc('Photo de la fuite (envoyée par l’agence)', 'photo', 200), doc('Vidéo de l’occupante', 'video', 20)] }),
      I({ date: T, start: '10:00', dur: 2, techs: ['karim', 'mehdi'], agence: 'Cabinet Durance Gestion', occupant: 'M. Benali', tel: '0600000002', adresse: '4 rue Frédéric-Mistral, Bât. C', ville: 'Martigues', travaux: 'Remplacement du chauffe-eau électrique 200 L. Évacuer l’ancien appareil.', devisPdf: true, materiel: ['Chauffe-eau 200 L vertical (au dépôt)', 'Groupe de sécurité', 'Raccords diélectriques', 'Diable + sangles'], pieces: [doc('Emplacement du ballon', 'photo', 30), doc('Fiche technique chauffe-eau', 'pdf')] }),
      I({ date: T, start: '14:00', dur: 1, techs: ['karim'], agence: 'Résidence Les Heures Claires', occupant: 'Gardien — M. Rossi', tel: '0600000003', adresse: '27 avenue de la Crau', ville: 'Istres', travaux: 'Contrat d’entretien : contrôle des colonnes d’eau et des vannes en sous-sol.', recurrent: true }),
      I({ date: T, start: '16:00', dur: 1.5, techs: ['karim'], agence: 'Particulier', occupant: 'M. et Mme Garcia', tel: '0600000004', adresse: '8 chemin du Castellan', ville: 'Istres', travaux: 'Débouchage WC à l’étage.' }),
      // Tâches épinglées : à faire dans la journée, sans heure
      I({ date: T, start: '', dur: 0, epingle: true, type: 'tache', techs: ['karim'], agence: 'Interne', occupant: '', tel: '', adresse: 'Comptoir Sanitaire Istres', ville: 'Istres', travaux: 'Récupérer le mitigeur thermostatique commandé (bon n° 4471) pour Mme Martin.' }),
      I({ date: T, start: '', dur: 0, epingle: true, type: 'tache', techs: ['karim', 'mehdi'], agence: 'Interne', occupant: '', tel: '', adresse: 'Dépôt BK+', ville: 'Istres', travaux: 'Déposer l’ancien chauffe-eau à la déchetterie.' }),
      I({ date: T, start: '', dur: 0, epingle: true, type: 'tache', techs: ['julien'], agence: 'Syndic Côte Bleue', occupant: '', tel: '0600000010', adresse: '2 quai Kléber', ville: 'Martigues', travaux: 'Relever le numéro de série de la vanne générale (photo) pour la commande.' }),
      // Chantier en cours : rénovation salle d'eau Fos
      // Reste de la semaine
      I({ date: D(0), start: '08:30', dur: 2, techs: ['julien'], agence: 'Agence Étang Immobilier', occupant: 'M. Petit', tel: '0600000005', adresse: '3 place du Marché', ville: 'Miramas', travaux: 'Recherche de fuite, plafond taché chez le voisin du dessous.' }),
      I({ date: D(0), start: '13:30', dur: 3, techs: ['mehdi', 'nicolas'], agence: 'Cabinet Durance Gestion', occupant: 'Logement vacant', tel: '0600000006', adresse: '15 boulevard de la Libération', ville: 'Fos-sur-Mer', travaux: 'Rénovation salle d’eau : dépose baignoire, pose receveur extra-plat.', devisPdf: true, chantier: 'c1', materiel: ['Receveur 80×120 extra-plat', 'Bonde extra-plate', 'Colle carrelage', 'Disqueuse + aspirateur'] }),
      I({ date: D(1), start: '09:00', dur: 2, techs: ['thomas'], agence: 'Particulier', occupant: 'Mme Martin', tel: '0600000007', adresse: '21 rue des Oliviers', ville: 'Saint-Chamas', travaux: 'Remplacement mitigeur thermostatique douche.' }),
      I({ date: D(1), start: '14:00', dur: 1.5, techs: ['julien'], agence: 'Résidence Les Heures Claires', occupant: 'Mme Nguyen', tel: '0600000008', adresse: '27 avenue de la Crau, apt 12', ville: 'Istres', travaux: 'Chasse d’eau qui coule en continu.' }),
      I({ date: D(2), start: '08:00', dur: 4, techs: ['mehdi'], agence: 'Cabinet Durance Gestion', occupant: 'Logement vacant', tel: '0600000006', adresse: '15 boulevard de la Libération', ville: 'Fos-sur-Mer', travaux: 'Suite rénovation salle d’eau : raccordements et finitions.', chantier: 'c1' }),
      I({ date: D(2), start: '10:00', dur: 1.5, techs: ['nicolas'], agence: 'Agence Étang Immobilier', occupant: 'M. Dubois', tel: '0600000009', adresse: '9 impasse des Salins', ville: 'Istres', travaux: 'Robinet extérieur gelé, remplacement.' }),
      I({ date: D(3), start: '09:00', dur: 2, techs: ['julien', 'thomas'], agence: 'Syndic Côte Bleue', occupant: 'Copropriété Le Phare', tel: '0600000010', adresse: '2 quai Kléber', ville: 'Martigues', travaux: 'Remplacement vanne d’arrêt générale en sous-sol.', devisPdf: true, chantier: 'c2', materiel: ['Vanne 1/4 de tour DN50', 'Manchons', 'Lampe frontale'] }),
      I({ date: D(3), start: '14:00', dur: 1, techs: ['nicolas'], agence: 'Particulier', occupant: 'M. Lopez', tel: '0600000011', adresse: '40 route de Fos', ville: 'Istres', travaux: 'Diagnostic pression d’eau faible.' }),
      I({ date: D(4), start: '08:00', dur: 2, techs: ['mehdi'], agence: 'Résidence Les Heures Claires', occupant: 'Gardien — M. Rossi', tel: '0600000003', adresse: '27 avenue de la Crau', ville: 'Istres', travaux: 'Contrat d’entretien : purge et contrôle du surpresseur.', recurrent: true }),
      I({ date: D(4), start: '11:00', dur: 1.5, techs: ['karim'], agence: 'Agence Étang Immobilier', occupant: 'Mme Faure', tel: '0600000012', adresse: '6 rue Jean-Jaurès', ville: 'Istres', travaux: 'Évier qui s’évacue mal.' }),
      I({ date: D(5), start: '09:00', dur: 2, techs: ['nicolas'], agence: 'Particulier', occupant: 'M. Roux', tel: '0600000013', adresse: '11 lotissement Les Cigales', ville: 'Grans', travaux: 'Dépannage urgence samedi : fuite ballon d’eau chaude.' }),
      // Tâche interne
      I({ date: D(1), start: '07:30', dur: 1, techs: ['karim', 'julien', 'mehdi', 'thomas', 'nicolas'], type: 'interne', agence: 'Interne', occupant: '', tel: '', adresse: 'Dépôt BK+', ville: 'Istres', travaux: 'Réunion d’équipe + récupération matériel chez le grossiste.' }),
      // À contrôler (validées par les techniciens)
      I({ date: past(1), start: '09:00', dur: 2, techs: ['julien'], agence: 'Syndic Côte Bleue', occupant: 'M. Girard', tel: '0600000014', adresse: '18 rue de la République', ville: 'Martigues', travaux: 'Remplacement compteur divisionnaire.', statut: 'controle', commentaire: 'Compteur remplacé, index relevé : 00412. Joint de la vanne amont à surveiller.', photos: [photo('Compteur posé', 205), photo('Index relevé', 30)] }),
      I({ date: past(1), start: '14:00', dur: 1, techs: ['thomas'], agence: 'Particulier', occupant: 'Mme Chevalier', tel: '0600000015', adresse: '5 avenue Hélène-Boucher', ville: 'Istres', travaux: 'Fuite raccord machine à laver.', statut: 'controle', commentaire: 'Raccord changé, test 15 min sans fuite. Cliente satisfaite.', photos: [photo('Raccord neuf', 160)] }),
      // Historique (clôturées, plusieurs années)
      I({ date: '2024-03-12', start: '10:00', dur: 2, techs: ['mehdi'], agence: 'Résidence Les Heures Claires', occupant: 'Gardien — M. Rossi', tel: '0600000003', adresse: '27 avenue de la Crau', ville: 'Istres', travaux: 'Remplacement surpresseur.', statut: 'cloturee', commentaire: 'Surpresseur Grundfos remplacé, garantie 2 ans.', photos: [photo('Surpresseur', 210)] }),
      I({ date: '2025-06-03', start: '08:00', dur: 1, techs: ['karim'], agence: 'Résidence Les Heures Claires', occupant: 'Mme Nguyen', tel: '0600000008', adresse: '27 avenue de la Crau, apt 12', ville: 'Istres', travaux: 'Mécanisme chasse d’eau.', statut: 'cloturee', commentaire: 'Mécanisme complet remplacé.', photos: [photo('Avant', 0), photo('Après', 140)] }),
      I({ date: '2025-11-20', start: '14:00', dur: 2, techs: ['julien'], agence: 'Agence Étang Immobilier', occupant: 'Mme Laurent', tel: '0600000001', adresse: '12 allée des Pins', ville: 'Istres', travaux: 'Remplacement robinet cuisine.', statut: 'cloturee', commentaire: 'Mitigeur posé, flexible OK.', photos: [photo('Mitigeur', 190)] }),
    ];

    const absences = [{ tech: 'thomas', date: D(2), label: 'Congé' }];

    const demandes = [
      { id: 'd1', date: iso(addDays(new Date(T), -1)), nom: 'Sophie Marchand', tel: '0600000020', ville: 'Istres', service: 'Fuite / dégât des eaux', message: 'Fuite au niveau du ballon d’eau chaude, ça goutte depuis hier soir.', traitee: false },
    ];

    const affaires = [
      { id: 'a1', date: past(3), source: 'Téléphone', client: 'M. Roche', tel: '0600000030', adresse: '14 rue Victor-Hugo', ville: 'Miramas', objet: 'Remplacement complet de la colonne d’évacuation de la cuisine.', montant: 1850, statut: 'devis', devisPdf: true },
      { id: 'a2', date: past(2), source: 'Agence (e-mail)', client: 'Agence Étang Immobilier', tel: '0600000031', adresse: '3 place du Marché', ville: 'Miramas', objet: 'Suite recherche de fuite : reprise de la canalisation encastrée + plâtre.', montant: 980, statut: 'chiffrer', devisPdf: false },
      { id: 'a3', date: past(6), source: 'Syndic', client: 'Syndic Côte Bleue', tel: '0600000010', adresse: '2 quai Kléber', ville: 'Martigues', objet: 'Remplacement de la vanne générale et des vannes de pied de colonne.', montant: 3400, statut: 'accepte', devisPdf: true },
      { id: 'a4', date: past(1), source: 'Bouche-à-oreille', client: 'Mme Ferrand', tel: '0600000032', adresse: '9 avenue des Écoles', ville: 'Istres', objet: 'Création d’une douche à l’italienne.', montant: 0, statut: 'chiffrer', devisPdf: false },
    ];
    const chantiers = [
      { id: 'c1', nom: 'Rénovation salle d’eau', client: 'Cabinet Durance Gestion', adresse: '15 boulevard de la Libération', ville: 'Fos-sur-Mer', description: 'Logement vacant avant relocation. Dépose de la baignoire, création d’une douche avec receveur extra-plat, remplacement du lavabo et de la robinetterie, reprise de la faïence.', montant: 6200, debut: D(0), fin: D(4), techs: ['mehdi', 'nicolas'], avancement: 40, devisPdf: true, photos: [photo('Avant travaux', 15), photo('Dépose baignoire', 200)] },
      { id: 'c2', nom: 'Vannes générales copropriété', client: 'Syndic Côte Bleue', adresse: '2 quai Kléber', ville: 'Martigues', description: 'Remplacement de la vanne générale DN50 et des 6 vannes de pied de colonne. Coupure d’eau à prévenir 48 h avant par affichage.', montant: 3400, debut: D(3), fin: D(3), techs: ['julien', 'thomas'], avancement: 0, devisPdf: true, photos: [] },
    ];

    return { interventions, absences, demandes, affaires, chantiers, techs: TECHS, seeded: T };
  }

  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { s = null; }
    if (!s || s.seeded !== todayIso()) { s = seed(); save(s); }
    return s;
  }
  let memory = null;
  function save(s) {
    memory = s;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* mode privé : on garde en mémoire */ }
  }
  function get() { return memory || (memory = load()); }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} memory = null; return get(); }

  const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  function label(isoDate, long) {
    const d = new Date(isoDate + 'T12:00:00');
    const j = JOURS[(d.getDay() + 6) % 7];
    return (long ? j : j.slice(0, 3) + '.') + ' ' + d.getDate() + ' ' + MOIS[d.getMonth()] + (long ? ' ' + d.getFullYear() : '');
  }
  function endTime(start, dur) {
    const [h, m] = start.split(':').map(Number); const t = h * 60 + m + Math.round(dur * 60);
    return pad(Math.floor(t / 60)) + 'h' + pad(t % 60);
  }
  const hh = s => s.replace(':', 'h');

  // Synchronisation entre onglets (bureau ↔ iPad ↔ site)
  const listeners = [];
  window.addEventListener('storage', e => { if (e.key === KEY) { memory = null; listeners.forEach(f => f(get())); } });

  window.BK = {
    get, save, reset, TECHS, USERS, iso, monday, addDays, todayIso, label, endTime, hh, photo,
    tech: id => TECHS.find(t => t.id === id),
    // Bande de couleur : une couleur par technicien, côte à côte (binômes, équipes)
    stripe: (ids, dir) => { const c = ids.map(id => (TECHS.find(t => t.id === id) || { couleur: '#8B8FA3' }).couleur); if (c.length === 1) return c[0]; const step = 100 / c.length; return 'linear-gradient(' + (dir || 'to bottom') + ',' + c.map((x, k) => x + ' ' + (k * step) + '% ' + ((k + 1) * step) + '%').join(',') + ')'; },
    avatars: ids => ids.map(id => { const t = TECHS.find(x => x.id === id); return t ? '<span class="av" style="background:' + t.couleur + '" title="' + t.nom + '">' + t.nom[0] + '</span>' : ''; }).join(''),
    onChange: f => listeners.push(f),
    uid: () => 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    esc: s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
    AFF: { chiffrer: 'À chiffrer', devis: 'Devis envoyé', accepte: 'Accepté', refuse: 'Refusé' },
    STATUTS: { planifiee: 'Planifiée', enroute: 'En route', encours: 'En cours', controle: 'À contrôler', cloturee: 'Clôturée' },
  };
})();
