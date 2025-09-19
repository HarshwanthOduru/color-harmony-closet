import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Filter, Trash2, Eye, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadWardrobeItems, deleteWardrobeItem, groupItemsByCategory } from '../utils/storage.js';

/**
 * My Wardrobe component for viewing and managing clothing items
 * @param {Object} props - Component props
 * @param {Function} props.onNavigate - Navigation handler
 */
const MyWardrobe = ({ onNavigate }) => {
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();

  const categories = [
    { key: 'all', label: 'All Items' },
    { key: 'tops', label: 'Tops' },
    { key: 'bottoms', label: 'Bottoms' },
    { key: 'footwear', label: 'Footwear' },
    { key: 'accessories', label: 'Accessories' }
  ];

  useEffect(() => {
    loadWardrobe();
  }, []);

  useEffect(() => {
    filterItems();
  }, [wardrobeItems, selectedCategory]);

  /**
   * Load wardrobe items from storage
   */
  const loadWardrobe = () => {
    const items = loadWardrobeItems();
    setWardrobeItems(items);
  };

  /**
   * Filter items by selected category
   */
  const filterItems = () => {
    if (selectedCategory === 'all') {
      setFilteredItems(wardrobeItems);
    } else {
      setFilteredItems(wardrobeItems.filter(item => 
        item.category.toLowerCase() === selectedCategory
      ));
    }
  };

  /**
   * Handle item deletion
   */
  const handleDeleteItem = (itemId) => {
    const updatedItems = deleteWardrobeItem(itemId);
    setWardrobeItems(updatedItems);
    setIsDetailModalOpen(false);
    toast({
      title: "Item deleted",
      description: "The item has been removed from your wardrobe",
    });
  };

  /**
   * Show item details in modal
   */
  const showItemDetails = (item) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  /**
   * Get category statistics
   */
  const getCategoryStats = () => {
    const grouped = groupItemsByCategory(wardrobeItems);
    return {
      total: wardrobeItems.length,
      tops: grouped.tops?.length || 0,
      bottoms: grouped.bottoms?.length || 0,
      footwear: grouped.footwear?.length || 0,
      accessories: grouped.accessories?.length || 0
    };
  };

  const stats = getCategoryStats();

  if (wardrobeItems.length === 0) {
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
              <h3 className="text-xl font-semibold mb-2">Empty Wardrobe</h3>
              <p className="text-muted-foreground mb-6">
                Start building your digital wardrobe by uploading clothing items.
              </p>
              <Button onClick={() => onNavigate('upload')} className="w-full">
                Upload First Items
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
            <h1 className="text-3xl font-bold text-foreground">My Wardrobe</h1>
            <p className="text-muted-foreground">
              Browse and manage your clothing collection
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">{stats.tops}</div>
              <div className="text-sm text-muted-foreground">Tops</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">{stats.bottoms}</div>
              <div className="text-sm text-muted-foreground">Bottoms</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-destructive">{stats.footwear}</div>
              <div className="text-sm text-muted-foreground">Footwear</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-500">{stats.accessories}</div>
              <div className="text-sm text-muted-foreground">Accessories</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.key)}
                  className="flex items-center gap-2"
                >
                  {category.label}
                  {category.key !== 'all' && (
                    <Badge variant="secondary">
                      {stats[category.key] || 0}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="wardrobe-card group cursor-pointer">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={item.dataUrl}
                    alt={item.fileName}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  
                  {/* Color Swatch */}
                  <div className="absolute top-2 right-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: item.dominantColorHex }}
                      title={item.dominantColorHex}
                    />
                  </div>
                  
                  {/* Action Buttons - Show on Hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => showItemDetails(item)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
                
                {/* Item Info */}
                <div className="p-3">
                  <p className="text-sm font-medium truncate mb-1">
                    {item.fileName}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.dominantColorHex}</span>
                    <span>HSL({item.hsl[0]}, {item.hsl[1]}%, {item.hsl[2]}%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Items in Category */}
        {filteredItems.length === 0 && selectedCategory !== 'all' && (
          <Card className="text-center py-12">
            <CardContent>
              <Palette className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                No {categories.find(c => c.key === selectedCategory)?.label}
              </h3>
              <p className="text-muted-foreground mb-6">
                Upload some items in this category to see them here.
              </p>
              <Button onClick={() => onNavigate('upload')}>
                Upload Items
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Item Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Item Details</DialogTitle>
            </DialogHeader>
            
            {selectedItem && (
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={selectedItem.dataUrl}
                    alt={selectedItem.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">File Name</h4>
                    <p className="text-sm text-muted-foreground">{selectedItem.fileName}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Category</h4>
                    <Badge variant="outline">{selectedItem.category}</Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Dominant Color</h4>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg border border-border"
                        style={{ backgroundColor: selectedItem.dominantColorHex }}
                      />
                      <div className="text-sm">
                        <p className="font-mono">{selectedItem.dominantColorHex}</p>
                        <p className="text-muted-foreground">
                          RGB({selectedItem.rgb[0]}, {selectedItem.rgb[1]}, {selectedItem.rgb[2]})
                        </p>
                        <p className="text-muted-foreground">
                          HSL({selectedItem.hsl[0]}°, {selectedItem.hsl[1]}%, {selectedItem.hsl[2]}%)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Added</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedItem.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteItem(selectedItem.id)}
                    className="flex-1"
                  >
                    Delete Item
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

export default MyWardrobe;