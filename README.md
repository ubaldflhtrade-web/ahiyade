# Ahiyade

Ahiyade est une marketplace B2B full-stack pour le marche local beninois. Elle connecte fournisseurs, grossistes, distributeurs, acheteurs professionnels, commercants et revendeurs dans les 12 departements du Benin.

## Fonctionnalites

- Marketplace bilingue francais / anglais avec `next-intl`.
- Authentification email / mot de passe avec NextAuth.js et sessions JWT.
- Roles `BUYER`, `SUPPLIER`, `ADMIN` avec routes protegees.
- Catalogue produits avec recherche, categories, departements, filtres de prix et pagination.
- Pages produit, profil fournisseur, tarifs, messagerie interne et tableaux de bord.
- Plan fournisseur gratuit limite a 10 produits et plan Premium illimite.
- Prisma + PostgreSQL avec migration SQL initiale et seed de demonstration.
- Integrations preparees pour Cloudinary, Nodemailer, Africa's Talking, FedaPay, MTN Mobile Money et Moov Money.
- Notifications internes, email et SMS.
- Dashboard admin pour moderation, categories, statistiques, paiements et abonnements.
- Design mobile-first Tailwind CSS avec couleurs beige / brun, accents africains et hero visuel de la statue de l'Amazone a Cotonou.

## Prerequis

- Node.js 20.11 ou plus recent
- PostgreSQL 14 ou plus recent
- Un compte Cloudinary pour les images
- Un compte FedaPay sandbox pour les paiements
- Un SMTP valide pour les emails
- Africa's Talking ou Twilio pour les SMS

## Installation

```bash
npm install
cp .env.example .env
```

Sous PowerShell :

```powershell
Copy-Item .env.example .env
```

Renseigner ensuite les variables dans `.env`, notamment `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, les cles Cloudinary, FedaPay, SMTP et SMS.

## Base de donnees

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Comptes crees par le seed :

- Admin : `admin@ahiyade.bj`
- Fournisseur : `fournisseur@ahiyade.bj`
- Acheteur : `acheteur@ahiyade.bj`
- Mot de passe commun : `Ahiyade2026!`

## Lancement

```bash
npm run dev
```

Ouvrir ensuite `http://localhost:3000/fr`.

## Scripts utiles

```bash
npm run dev              # serveur de developpement
npm run build            # generation Prisma + build Next.js
npm run start            # serveur production
npm run lint             # lint Next.js
npm run prisma:migrate   # migration locale
npm run prisma:deploy    # migration production
npm run prisma:seed      # donnees de demonstration
```

## Structure

```text
src/app                 Routes App Router, pages, API routes, SEO
src/components          Navigation, cartes, formulaires, dashboards
src/i18n                Configuration next-intl
src/lib                 Auth, DB, validations, paiements, notifications, requetes
src/messages            Traductions FR / EN
prisma                  Schema, migration initiale, seed
```

## Paiements

Le checkout Premium utilise FedaPay en deux etapes : creation de transaction, puis generation du token de lien de paiement. En developpement, si `FEDAPAY_SECRET_KEY` est absent, l'API retourne une URL de simulation pour ne pas bloquer le test de l'interface.

Pour la production :

- `FEDAPAY_ENVIRONMENT=live`
- `FEDAPAY_SECRET_KEY` et `FEDAPAY_PUBLIC_KEY` reels
- `NEXTAUTH_URL` avec le domaine public HTTPS
- route webhook exposee : `/api/webhooks/fedapay`

## Images

Les produits peuvent stocker plusieurs URLs d'images. L'API `/api/uploads/cloudinary-signature` fournit une signature d'upload direct Cloudinary pour les fournisseurs et admins.

L'image hero utilise une photo Wikimedia Commons de la statue de l'Amazone a Cotonou : `https://commons.wikimedia.org/wiki/File:L%27Amazone_statue.jpg`.

## Notes de production

- Ajouter une table de jetons de reinitialisation si le flux "mot de passe oublie" doit etre totalement automatise.
- Verifier la signature webhook FedaPay selon la configuration du compte marchand.
- Configurer un rate limiting sur les API publiques.
- Ajouter des tests d'integration pour les flux devis, paiement et moderation.
- Activer la sauvegarde automatique PostgreSQL et la surveillance des erreurs.
