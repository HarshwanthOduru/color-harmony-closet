import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shuffle, Heart, Save, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateOutfitSuggestions } from '../utils/colorMatching.js';
import { loadWardrobeItems, groupItemsByCategory, saveOutfit } from '../utils/storage.js';

/**
 * Outfit suggestions component for casual and formal outfits
 * @param {Object} props - Component props
 * @param {Function} props.onNavigate - Navigation handler
 * @param {boolean} props.isFormal - Whether this is for formal outfits
 */
const OutfitSuggestions = ({ onNavigate, isFormal = false }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const styleType = isFormal ? 'formal' : 'casual';
  const title = isFormal ? 'Formal Outfit Suggestions' : 'Casual Outfit Suggestions';

  useEffect(() => {
    loadWardrobe();
  }, []);

  /**
   * Load wardrobe items and generate initial suggestions
   */
  const loadWardrobe = async () => {
    const items = loadWardrobeItems();
    setWardrobeItems(items);
    
    if (items.length < 2) {
      toast({
        title: "Not enough items",
        description: "Upload at least 2 items to get outfit suggestions",
        variant: "destructive"
      });
      return;
    }
    
    generateSuggestions(items);
  };

  /**
   * Generate outfit suggestions
   */
  const generateSuggestions = async (items = wardrobeItems) => {
    if (items.length < 2) return;
    
    setIsGenerating(true);
    
    try {
      // Add small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const groupedWardrobe = groupItemsByCategory(items);
      const newSuggestions = generateOutfitSuggestions(groupedWardrobe, isFormal, 3);
      
      setSuggestions(newSuggestions);
      
      if (newSuggestions.length === 0) {
        toast({
          title: "No combinations found",
          description: "Try uploading more diverse items or check back later",
        });
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      toast({
        title: "Generation failed",
        description: "There was an error generating outfit suggestions",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Save an outfit to favorites
   */
  const handleSaveOutfit = (outfit) => {
    const savedOutfit = saveOutfit(outfit);
    if (savedOutfit) {
      toast({
        title: "Outfit saved",
        description: "Added to your saved outfits collection",
      });
    } else {
      toast({
        title: "Save failed",
        description: "Could not save the outfit",
        variant: "destructive"
      });
    }
  };

  /**
   * Shuffle and generate new suggestions
   */
  const handleShuffle = () => {
    generateSuggestions();
  };

  if (wardrobeItems.length < 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <Palette className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Items Yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload at least 2 clothing items to start getting outfit suggestions.
              </p>
              <Button onClick={() => onNavigate('upload')} className="w-full">
                Upload Wardrobe Items
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground">
              AI-powered outfit combinations based on color harmony principles
            </p>
          </div>
          
          <Button 
            onClick={handleShuffle}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </Button>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Analyzing color combinations...</p>
          </div>
        )}

        {/* Suggestions Grid */}
        {!isGenerating && suggestions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {suggestions.map((suggestion, index) => (
              <Card key={suggestion.id} className="wardrobe-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Outfit #{index + 1}</span>
                    <Badge variant="outline">
                      Score: {suggestion.score.toFixed(1)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {/* Item Thumbnails */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {suggestion.items.map((item) => (
                      <div key={item.id} className="relative">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={item.dataUrl}
                            alt={`${item.category} item`}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Category Label */}
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          
                          {/* Color Swatch */}
                          <div className="absolute bottom-2 right-2">
                            <div
                              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: item.dominantColorHex }}
                              title={item.dominantColorHex}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Color Palette */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Color Palette</h4>
                    <div className="flex gap-2">
                      {suggestion.items.map((item) => (
                        <div key={item.id} className="flex flex-col items-center gap-1">
                          <div
                            className="w-8 h-8 rounded-full border border-border shadow-sm"
                            style={{ backgroundColor: item.dominantColorHex }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {item.dominantColorHex}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-2">Style Analysis</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {suggestion.explanation}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleSaveOutfit(suggestion)}
                      className="flex-1 flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      Save Outfit
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleShuffle}
                      className="flex items-center gap-2"
                    >
                      <Shuffle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Suggestions State */}
        {!isGenerating && suggestions.length === 0 && wardrobeItems.length >= 2 && (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <Palette className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Combinations Found</h3>
              <p className="text-muted-foreground mb-6">
                Try uploading more diverse items or adjusting your wardrobe selection.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => onNavigate('upload')} variant="outline" className="flex-1">
                  Add More Items
                </Button>
                <Button onClick={handleShuffle} className="flex-1">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Color Harmony Help */}
        <Card className="mt-12 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Harmony Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">Complementary Colors</h4>
                <p className="text-muted-foreground">
                  Opposite colors on the color wheel create striking, balanced combinations
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Analogous Colors</h4>
                <p className="text-muted-foreground">
                  Colors close to each other create harmonious, soothing combinations
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Neutral Pairings</h4>
                <p className="text-muted-foreground">
                  Neutral colors (low saturation) work well with any other color
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OutfitSuggestions;