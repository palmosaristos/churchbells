import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { removeBackground, loadImageFromUrl } from '@/utils/backgroundRemoval';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';
import churchBell1 from '@/assets/church-bell-1.png';
import churchBell2 from '@/assets/church-bell-2.png';
export const BackgroundRemovalDemo = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage1, setProcessedImage1] = useState<string | null>(null);
  const [processedImage2, setProcessedImage2] = useState<string | null>(null);
  const {
    toast
  } = useToast();
  const processImage = async (imageUrl: string, imageName: string) => {
    try {
      setIsProcessing(true);

      // Load the image
      const image = await loadImageFromUrl(imageUrl);

      // Remove background
      const processedBlob = await removeBackground(image);

      // Create URL for preview
      const processedUrl = URL.createObjectURL(processedBlob);
      if (imageName === 'bell-1') {
        setProcessedImage1(processedUrl);
      } else {
        setProcessedImage2(processedUrl);
      }

      // Create download link
      const link = document.createElement('a');
      link.href = processedUrl;
      link.download = `${imageName}-no-bg.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Success",
        description: `Background removed from ${imageName}. Image downloaded.`
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: `Failed to process ${imageName}`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  return <Card className="w-full max-w-4xl mx-auto">
      
      
    </Card>;
};