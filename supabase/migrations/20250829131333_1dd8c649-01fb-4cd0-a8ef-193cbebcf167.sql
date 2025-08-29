-- Rendre le bucket CHURCH BELL SOUNDS public pour permettre l'accès aux fichiers audio
UPDATE storage.buckets 
SET public = true 
WHERE id = 'CHURCH BELL SOUNDS';