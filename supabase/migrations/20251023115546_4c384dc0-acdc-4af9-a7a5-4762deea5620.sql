-- Politiques pour le bucket "CHURCH BELL SOUNDS" (public)
CREATE POLICY "Allow public read access on CHURCH BELL SOUNDS" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'CHURCH BELL SOUNDS');

CREATE POLICY "Allow public upload to CHURCH BELL SOUNDS" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'CHURCH BELL SOUNDS');

CREATE POLICY "Allow public update on CHURCH BELL SOUNDS" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'CHURCH BELL SOUNDS')
WITH CHECK (bucket_id = 'CHURCH BELL SOUNDS');

CREATE POLICY "Allow public delete on CHURCH BELL SOUNDS" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'CHURCH BELL SOUNDS');

-- Politiques pour le bucket "CHURCH BELL IMAGES" (privé)
CREATE POLICY "Allow authenticated read on CHURCH BELL IMAGES" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'CHURCH BELL IMAGES' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated upload to CHURCH BELL IMAGES" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'CHURCH BELL IMAGES' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on CHURCH BELL IMAGES" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'CHURCH BELL IMAGES' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'CHURCH BELL IMAGES' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on CHURCH BELL IMAGES" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'CHURCH BELL IMAGES' AND auth.role() = 'authenticated');

-- Politiques pour le bucket "PALMOS ARISTOS BELLAS" (privé)
CREATE POLICY "Allow authenticated read on PALMOS ARISTOS BELLAS" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'PALMOS ARISTOS BELLAS' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated upload to PALMOS ARISTOS BELLAS" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'PALMOS ARISTOS BELLAS' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on PALMOS ARISTOS BELLAS" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'PALMOS ARISTOS BELLAS' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'PALMOS ARISTOS BELLAS' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on PALMOS ARISTOS BELLAS" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'PALMOS ARISTOS BELLAS' AND auth.role() = 'authenticated');