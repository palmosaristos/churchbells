// Lignes 72, 89, 108, 123, 150 : SUPPRIMEZ tout le bloc audioAttributes
// Capacitor ne supporte PAS le volume au niveau du canal

await LocalNotifications.createChannel({
  id: 'sacred-bells-channel',
  name: 'Sacred Bells',
  description: 'Notifications for scheduled bell chimes',
  ...lowPrio,
  sound: 'freemium_carillon.mp3',
  // ❌ SUPPRIMEZ : audioAttributes: { ... }
  lightColor: '#d4a574',
  vibration: false
});

// Le volume est géré AU NIVEAU DE LA LECTURE (useAudioPlayer) pas du canal
