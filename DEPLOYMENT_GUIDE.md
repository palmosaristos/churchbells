# 📱 Sacred Bells - Guide de déploiement mobile

Ce guide vous accompagne dans le processus de publication de Sacred Bells sur Google Play Store et Apple App Store.

---

## 🎯 Vue d'ensemble

Sacred Bells est une application mobile hybride construite avec:
- **React + TypeScript** pour l'interface
- **Vite** pour le build
- **Capacitor** pour l'encapsulation native
- **Replit** pour l'hébergement du contenu web

---

## ✅ Pré-requis

### Comptes développeur
- [ ] **Google Play Console**: 25$ (paiement unique) - [S'inscrire](https://play.google.com/console/signup)
- [ ] **Apple Developer Program**: 99$/an - [S'inscrire](https://developer.apple.com/programs/)

### Logiciels nécessaires
- [ ] **Android Studio** (pour Android) - [Télécharger](https://developer.android.com/studio)
- [ ] **Xcode + Mac** (pour iOS) - Requis pour la compilation iOS
- [ ] **Node.js** installé (déjà sur Replit)

---

## 📦 Configuration actuelle

Votre application est déjà configurée avec:

### Identifiants
- **App ID**: `com.sacredbells.app`
- **Nom**: Sacred Bells
- **Version web**: Hébergée sur Replit

### Plateformes initialisées
- ✅ Android (dossier `/android`)
- ✅ iOS (dossier `/ios`)

### Ressources créées
- ✅ Icône de l'application (1024x1024)
- ✅ Splash screen vertical
- ✅ Build de production optimisé

---

## ⚠️ IMPORTANT - Vérification avant déploiement

**CRITIQUE**: Avant de déployer, vérifiez que `capacitor.config.ts` **N'A PAS** de bloc `server` pointant vers une URL de développement:

```typescript
// ❌ MAUVAIS - Ne jamais utiliser pour production
server: {
  url: 'https://...replit.dev',
  cleartext: true
}

// ✅ BON - Configuration production (app embarquée)
const config: CapacitorConfig = {
  appId: 'com.sacredbells.app',
  appName: 'Sacred Bells',
  webDir: 'dist'
  // Pas de 'server' = app 100% native
};
```

**Pourquoi?**
- Les URL Replit de développement expirent
- `cleartext: true` permet HTTP non sécurisé
- L'app ne fonctionnera pas après expiration

**Si vous modifiez `capacitor.config.ts`**, toujours re-synchroniser:
```bash
npm run build
npx cap sync
```

---

## 🤖 Déploiement Android (Google Play)

### Étape 1: Préparer le build

```bash
# 1. Vérifier capacitor.config.ts (voir avertissement ci-dessus)

# 2. Construire l'application web
npm run build

# 3. Synchroniser avec Android
npx cap sync android

# 4. Ouvrir Android Studio
npx cap open android
```

### Étape 2: Configuration dans Android Studio

1. **Ouvrir le projet** dans Android Studio
2. **Mettre à jour le fichier `android/app/build.gradle`**:
   ```gradle
   android {
       defaultConfig {
           versionCode 1
           versionName "1.0.0"
           minSdkVersion 22
           targetSdkVersion 33
       }
   }
   ```

3. **Générer une clé de signature**:
   ```bash
   keytool -genkey -v -keystore sacred-bells-release.keystore \
     -alias sacred-bells -keyalg RSA -keysize 2048 -validity 10000
   ```
   
4. **Configurer la signature** dans `android/app/build.gradle`:
   ```gradle
   signingConfigs {
       release {
           storeFile file("path/to/sacred-bells-release.keystore")
           storePassword "VOTRE_MOT_DE_PASSE"
           keyAlias "sacred-bells"
           keyPassword "VOTRE_MOT_DE_PASSE"
       }
   }
   ```

### Étape 3: Créer le fichier de release

Dans Android Studio:
1. **Build → Generate Signed Bundle / APK**
2. Choisir **Android App Bundle** (.aab)
3. Sélectionner votre keystore
4. Build type: **Release**
5. Générer

Le fichier sera dans: `android/app/release/app-release.aab`

### Étape 4: Publier sur Google Play

1. **Se connecter à** [Google Play Console](https://play.google.com/console)
2. **Créer une application**
3. **Remplir les informations**:
   - Nom: Sacred Bells
   - Description courte (80 car max)
   - Description complète (4000 car max)
   - Catégorie: Lifestyle ou Productivity
   
4. **Uploader les assets**:
   - Icône: 512x512 px
   - Feature graphic: 1024x500 px
   - Screenshots: Minimum 2 (téléphone)
   
5. **Uploader l'APK/AAB**:
   - Production → Create new release
   - Upload `app-release.aab`
   
6. **Questionnaire de contenu**:
   - Public cible: Tous âges
   - Pas de publicité
   - Aucune donnée sensible collectée
   
7. **Soumettre pour révision**

**Temps de révision**: 1-7 jours

---

## 🍎 Déploiement iOS (App Store)

### Étape 1: Préparer le build

```bash
# 1. Vérifier capacitor.config.ts (voir avertissement au début)

# 2. Construire l'application web
npm run build

# 3. Synchroniser avec iOS
npx cap sync ios

# 4. Ouvrir Xcode
npx cap open ios
```

### Étape 2: Configuration dans Xcode

1. **Ouvrir le workspace** (`ios/App/App.xcworkspace`)
2. **Sélectionner le projet** App dans le navigateur
3. **Configurer les identifiants**:
   - Bundle Identifier: `com.sacredbells.app`
   - Team: Sélectionner votre compte développeur
   - Version: 1.0.0
   - Build: 1

4. **Configurer les capabilities** si nécessaire:
   - Audio Background Mode (pour les cloches)

### Étape 3: Créer l'archive

1. **Choisir un appareil réel** ou Generic iOS Device
2. **Product → Archive**
3. Attendre la fin de la compilation
4. La fenêtre Organizer s'ouvre automatiquement

### Étape 4: Uploader vers App Store Connect

1. Dans **Organizer**, sélectionner votre archive
2. **Distribute App → App Store Connect**
3. Suivre l'assistant jusqu'à l'upload
4. Attendre le traitement (5-30 minutes)

### Étape 5: Configurer dans App Store Connect

1. **Se connecter à** [App Store Connect](https://appstoreconnect.apple.com)
2. **Mes Apps → + (Nouvelle app)**
3. **Remplir les informations**:
   - Nom: Sacred Bells
   - Langue principale: Français ou Anglais
   - Bundle ID: com.sacredbells.app
   - SKU: SACREDBELLS001
   
4. **Informations sur l'app**:
   - Sous-titre (30 car)
   - Description (4000 car max)
   - Mots-clés (100 car max): church, bells, prayer, sacred
   - URL support: Votre site web
   
5. **Assets requis**:
   - Icône: 1024x1024 px (déjà créée)
   - Screenshots iPhone (min 3):
     - 6.5" (1284x2778)
     - 5.5" (1242x2208)
   - Screenshots iPad (min 2) si supporté
   
6. **Build pour révision**:
   - Sélectionner le build uploadé
   - Version: 1.0.0
   
7. **Informations supplémentaires**:
   - Classification du contenu
   - Coordonnées pour la révision
   - Notes pour les réviseurs
   
8. **Soumettre pour révision**

**Temps de révision**: 24-48 heures (généralement)

---

## 🔧 Configuration avancée

### Mise à jour de l'URL de production

Quand vous déployez sur Replit en production, mettez à jour `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  appId: 'com.sacredbells.app',
  appName: 'Sacred Bells',
  webDir: 'dist',
  server: {
    url: 'VOTRE_URL_PRODUCTION_REPLIT',
    cleartext: true
  }
};
```

### Mode production natif (optionnel)

Pour une app 100% native sans serveur externe:

```typescript
const config: CapacitorConfig = {
  appId: 'com.sacredbells.app',
  appName: 'Sacred Bells',
  webDir: 'dist'
  // Pas de 'server' = app embarquée
};
```

---

## 📝 Checklist avant soumission

### Android
- [ ] Version et versionCode mis à jour
- [ ] App signée avec keystore de production
- [ ] AAB généré et testé
- [ ] Screenshots préparés (min 2)
- [ ] Description et assets prêts
- [ ] Politique de confidentialité disponible

### iOS
- [ ] Bundle ID configuré
- [ ] Certificats et profils à jour
- [ ] Archive créée avec succès
- [ ] Build uploadé et traité
- [ ] Screenshots pour tous les formats requis
- [ ] Description et assets prêts
- [ ] Compte développeur actif

---

## 🎨 Assets recommandés

### Screenshots efficaces
1. Écran d'accueil avec les cloches
2. Configuration des horaires
3. Sélection des traditions de cloches
4. Page des temps de prière
5. Interface premium (si applicable)

### Description suggérée

**Description courte** (Google Play):
"Laissez le son sacré des cloches d'église rythmer votre journée"

**Description complète**:
```
Sacred Bells transforme votre téléphone en carillon d'église personnel.

🔔 CARACTÉRISTIQUES PRINCIPALES
• Authentiques sons de cloches d'église
• Planification horaire personnalisable
• Multiples traditions de cloches (cathédrale, village, carillon)
• Temps de prière configurables
• Interface élégante et spirituelle

⛪ TRADITIONS DE CLOCHES
Choisissez parmi différentes traditions campanaires :
- Cloches de cathédrale majestueuses
- Cloches de village chaleureuses
- Carillons byzantins

⏰ PERSONNALISATION
• Définissez vos horaires de sonnerie
• Configurez les temps de prière
• Ajustez le volume pour chaque tradition
• Activez les rappels

🌍 POUR TOUS
Que vous souhaitiez marquer les heures canoniales, vous rappeler des temps de prière, ou simplement apprécier le son des cloches tout au long de la journée, Sacred Bells apporte la sérénité des églises dans votre poche.

Rejoignez des milliers d'utilisateurs qui ont redécouvert le rythme sacré des cloches.
```

---

## 🆘 Support et ressources

### Documentation officielle
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

### Problèmes courants

**Build Android échoue**:
- Vérifier que JAVA_HOME est configuré
- Nettoyer: `cd android && ./gradlew clean`
- Invalider cache Android Studio

**Build iOS échoue**:
- Vérifier les certificats dans Xcode
- Pod install: `cd ios/App && pod install`
- Nettoyer: Product → Clean Build Folder

**App rejetée**:
- Lire attentivement les raisons
- Corriger les problèmes mentionnés
- Re-soumettre avec explications

---

## 📊 Après la publication

### Suivi
- Monitorer les avis et notes
- Répondre aux commentaires
- Suivre les statistiques de téléchargement

### Mises à jour
1. Incrémenter la version dans les configs
2. Rebuild et re-sign
3. Re-upload vers les stores
4. Soumettre pour révision

### Marketing
- Partager sur les réseaux sociaux
- Créer une page de destination
- Contacter la presse spécialisée
- Utiliser la fonction de partage intégrée dans l'app

---

## 🎉 Félicitations!

Une fois votre application approuvée, elle sera disponible pour des millions d'utilisateurs à travers le monde. Sacred Bells apportera le son sacré des cloches dans la vie quotidienne de vos utilisateurs.

**Bonne chance avec votre lancement!** 🔔
