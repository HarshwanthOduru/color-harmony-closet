import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractDominantColor } from '../utils/colorExtraction.js';
import { addWardrobeItem, loadWardrobeItems, deleteWardrobeItem } from '../utils/storage.js';

/**
 * Upload wardrobe component for managing clothing items
 * @param {Object} props - Component props
 * @param {Function} props.onNavigate - Navigation handler
 */
const UploadWardrobe = ({ onNavigate }) => {
  const [wardrobeItems, setWardrobeItems] = useState(() => loadWardrobeItems());
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRefs = useRef({});
  const { toast } = useToast();

  const categories = [
    { key: 'tops', label: 'Tops', description: 'Shirts, t-shirts, blouses, sweaters' },
    { key: 'bottoms', label: 'Bottoms', description: 'Pants, jeans, skirts, shorts' },
    { key: 'footwear', label: 'Footwear', description: 'Shoes, boots, sneakers, sandals' },
    { key: 'accessories', label: 'Accessories', description: 'Ties, belts, scarves, jewelry' }
  ];

  /**
   * Handle file upload for a specific category
   */
  const handleFileUpload = useCallback(async (files, category) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newItems = [];

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file`,
            variant: "destructive"
          });
          continue;
        }

        // Create data URL for the image
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });

        // Create image element for color extraction
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = async () => {
            try {
              const colorData = await extractDominantColor(img);
              
              const newItem = {
                id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                category: category.charAt(0).toUpperCase() + category.slice(1),
                fileName: file.name,
                dataUrl,
                dominantColorHex: colorData.hex,
                rgb: colorData.rgb,
                hsl: colorData.hsl,
                addedAt: Date.now()
              };
              
              const savedItem = addWardrobeItem(newItem);
              if (savedItem) {
                newItems.push(savedItem);
              }
              
              resolve();
            } catch (error) {
              console.error('Color extraction failed:', error);
              reject(error);
            }
          };
          
          img.onerror = reject;
          img.src = dataUrl;
        });
      }

      if (newItems.length > 0) {
        setWardrobeItems(prev => [...prev, ...newItems]);
        toast({
          title: "Upload successful",
          description: `Added ${newItems.length} item${newItems.length > 1 ? 's' : ''} to ${category}`,
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "There was an error processing your images",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRefs.current[category]) {
        fileInputRefs.current[category].value = '';
      }
    }
  }, [toast]);

  /**
   * Handle item deletion
   */
  const handleDeleteItem = useCallback((itemId) => {
    const updatedItems = deleteWardrobeItem(itemId);
    setWardrobeItems(updatedItems);
    toast({
      title: "Item deleted",
      description: "The item has been removed from your wardrobe",
    });
  }, [toast]);

  /**
   * Group items by category
   */
  const groupedItems = wardrobeItems.reduce((groups, item) => {
    const category = item.category.toLowerCase();
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  /**
   * Handle drag and drop
   */
  const handleDrop = useCallback((e, category) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files, category);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground">Upload Wardrobe</h1>
            <p className="text-muted-foreground">Add clothing items with automatic color extraction</p>
          </div>
        </div>

        {/* Upload Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {categories.map((category) => (
            <Card key={category.key} className="wardrobe-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{category.label}</span>
                  <Badge variant="secondary">
                    {groupedItems[category.key]?.length || 0} items
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
              
              <CardContent>
                {/* Upload Area */}
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onDrop={(e) => handleDrop(e, category.key)}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRefs.current[category.key]?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag & drop images here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPG, PNG, WEBP
                  </p>
                  
                  <input
                    ref={(el) => fileInputRefs.current[category.key] = el}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files, category.key)}
                  />
                </div>

                {/* Items Grid */}
                {groupedItems[category.key] && groupedItems[category.key].length > 0 && (
                  <div className="mt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {groupedItems[category.key].map((item) => (
                        <div key={item.id} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                            <img
                              src={item.dataUrl}
                              alt={item.fileName}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Color Swatch Overlay */}
                            <div className="absolute bottom-2 left-2 flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: item.dominantColorHex }}
                                title={item.dominantColorHex}
                              />
                              <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                                {item.dominantColorHex}
                              </span>
                            </div>
                            
                            {/* Delete Button */}
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(item.id);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="wardrobe-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <ImageIcon className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Wardrobe Summary</h3>
                <p className="text-sm text-muted-foreground">
                  Total items: {wardrobeItems.length} | 
                  Ready for outfit suggestions: {wardrobeItems.length >= 2 ? 'Yes' : 'Need more items'}
                </p>
              </div>
            </div>
            
            {wardrobeItems.length >= 2 && (
              <div className="flex gap-4 mt-4">
                <Button onClick={() => onNavigate('casual')} className="flex-1">
                  Generate Casual Outfits
                </Button>
                <Button onClick={() => onNavigate('formal')} variant="outline" className="flex-1">
                  Generate Formal Outfits
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {isUploading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p>Processing images and extracting colors...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadWardrobe;