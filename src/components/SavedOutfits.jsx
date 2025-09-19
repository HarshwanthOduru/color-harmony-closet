import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Heart, Trash2, Eye, Calendar, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadSavedOutfits, deleteSavedOutfit } from '../utils/storage.js';

/**
 * Saved Outfits component for viewing and managing favorite outfits
 * @param {Object} props - Component props
 * @param {Function} props.onNavigate - Navigation handler
 */
const SavedOutfits = ({ onNavigate }) => {
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadOutfits();
  }, []);

  /**
   * Load saved outfits from storage
   */
  const loadOutfits = () => {
    const outfits = loadSavedOutfits();
    // Sort by saved date, most recent first
    const sortedOutfits = outfits.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
    setSavedOutfits(sortedOutfits);
  };

  /**
   * Handle outfit deletion
   */
  const handleDeleteOutfit = (outfitId) => {
    deleteSavedOutfit(outfitId);
    setSavedOutfits(prev => prev.filter(outfit => outfit.id !== outfitId));
    setIsDetailModalOpen(false);
    toast({
      title: "Outfit deleted",
      description: "The outfit has been removed from your saved collection",
    });
  };

  /**
   * Show outfit details in modal
   */
  const showOutfitDetails = (outfit) => {
    setSelectedOutfit(outfit);
    setIsDetailModalOpen(true);
  };

  /**
   * Format date for display
   */
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get style statistics
   */
  const getStyleStats = () => {
    const formalCount = savedOutfits.filter(outfit => outfit.style === 'formal').length;
    const casualCount = savedOutfits.filter(outfit => outfit.style === 'casual').length;
    return { formal: formalCount, casual: casualCount, total: savedOutfits.length };
  };

  const stats = getStyleStats();

  if (savedOutfits.length === 0) {
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
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Saved Outfits</h3>
              <p className="text-muted-foreground mb-6">
                Start creating and saving outfit combinations to build your collection.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => onNavigate('casual')} className="flex-1">
                  Casual Outfits
                </Button>
                <Button onClick={() => onNavigate('formal')} variant="outline" className="flex-1">
                  Formal Outfits
                </Button>
              </div>
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
            <h1 className="text-3xl font-bold text-foreground">Saved Outfits</h1>
            <p className="text-muted-foreground">
              Your favorite outfit combinations
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Heart className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Saved</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-success flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <div className="text-2xl font-bold text-success">{stats.casual}</div>
              <div className="text-sm text-muted-foreground">Casual Outfits</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-background text-sm font-bold">F</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.formal}</div>
              <div className="text-sm text-muted-foreground">Formal Outfits</div>
            </CardContent>
          </Card>
        </div>

        {/* Outfits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOutfits.map((outfit) => (
            <Card key={outfit.id} className="wardrobe-card group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {outfit.style === 'formal' ? 'Formal' : 'Casual'} Outfit
                  </CardTitle>
                  <Badge variant={outfit.style === 'formal' ? 'default' : 'secondary'}>
                    Score: {outfit.score?.toFixed(1) || 'N/A'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatDate(outfit.savedAt || outfit.timestamp)}
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Item Thumbnails */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {outfit.items.map((item) => (
                    <div key={item.id} className="relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.dataUrl}
                          alt={`${item.category} item`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Category Label */}
                        <div className="absolute top-1 left-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        
                        {/* Color Swatch */}
                        <div className="absolute bottom-1 right-1">
                          <div
                            className="w-4 h-4 rounded-full border border-white shadow-sm"
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
                  <div className="flex gap-1 justify-center">
                    {outfit.items.map((item) => (
                      <div key={item.id} className="flex flex-col items-center gap-1">
                        <div
                          className="w-6 h-6 rounded-full border border-border shadow-sm"
                          style={{ backgroundColor: item.dominantColorHex }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation Preview */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {outfit.explanation}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => showOutfitDetails(outfit)}
                    className="flex-1 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteOutfit(outfit.id)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Outfit Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                {selectedOutfit?.style === 'formal' ? 'Formal' : 'Casual'} Outfit Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedOutfit && (
              <div className="space-y-6">
                {/* Outfit Items Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedOutfit.items.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.dataUrl}
                          alt={`${item.category} item`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className="mb-1">
                          {item.category}
                        </Badge>
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: item.dominantColorHex }}
                          />
                          <span className="text-sm font-mono">
                            {item.dominantColorHex}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Color Analysis */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color Palette
                  </h4>
                  <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
                    {selectedOutfit.items.map((item) => (
                      <div key={item.id} className="text-center">
                        <div
                          className="w-12 h-12 rounded-lg border border-border shadow-sm mb-2"
                          style={{ backgroundColor: item.dominantColorHex }}
                        />
                        <div className="text-xs">
                          <p className="font-mono">{item.dominantColorHex}</p>
                          <p className="text-muted-foreground">
                            HSL({item.hsl[0]}°, {item.hsl[1]}%, {item.hsl[2]}%)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Style Analysis */}
                <div>
                  <h4 className="font-medium mb-2">Style Analysis</h4>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm leading-relaxed">
                      {selectedOutfit.explanation}
                    </p>
                  </div>
                </div>

                {/* Outfit Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">Style Type</h4>
                    <Badge variant={selectedOutfit.style === 'formal' ? 'default' : 'secondary'}>
                      {selectedOutfit.style === 'formal' ? 'Formal' : 'Casual'}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Harmony Score</h4>
                    <span className="text-primary font-semibold">
                      {selectedOutfit.score?.toFixed(1) || 'N/A'} / 10
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Items Count</h4>
                    <span>{selectedOutfit.items.length} pieces</span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Saved Date</h4>
                    <span>{formatDate(selectedOutfit.savedAt || selectedOutfit.timestamp)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteOutfit(selectedOutfit.id)}
                    className="flex-1"
                  >
                    Delete Outfit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDetailModalOpen(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SavedOutfits;