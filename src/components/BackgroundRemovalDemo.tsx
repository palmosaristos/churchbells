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
  const { toast } = useToast();

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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Remove Background from Bell Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Church Bell 1</h3>
            <div className="space-y-2">
              <img src={churchBell1} alt="Original Bell 1" className="w-full h-48 object-contain border rounded" />
              <Button 
                onClick={() => processImage(churchBell1, 'bell-1')}
                disabled={isProcessing}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Remove Background & Download'}
              </Button>
            </div>
            {processedImage1 && (
              <div className="space-y-2">
                <h4 className="font-medium">Processed:</h4>
                <img src={processedImage1} alt="Processed Bell 1" className="w-full h-48 object-contain border rounded bg-checkered" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Church Bell 2</h3>
            <div className="space-y-2">
              <img src={churchBell2} alt="Original Bell 2" className="w-full h-48 object-contain border rounded" />
              <Button 
                onClick={() => processImage(churchBell2, 'bell-2')}
                disabled={isProcessing}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Remove Background & Download'}
              </Button>
            </div>
            {processedImage2 && (
              <div className="space-y-2">
                <h4 className="font-medium">Processed:</h4>
                <img src={processedImage2} alt="Processed Bell 2" className="w-full h-48 object-contain border rounded bg-checkered" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};