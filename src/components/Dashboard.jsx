import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Shirt, Briefcase, Heart } from 'lucide-react';

/**
 * Main dashboard component with navigation tiles
 * @param {Object} props - Component props
 * @param {Function} props.onNavigate - Navigation handler
 */
const Dashboard = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="hero-gradient py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              AI Wardrobe Stylist
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up">
              Discover perfect outfit combinations using intelligent color harmony analysis
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
      </div>

      {/* Action Tiles */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Upload Wardrobe Tile */}
          <Card className="wardrobe-card group cursor-pointer animate-scale-in" 
                onClick={() => onNavigate('upload')}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full hero-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Upload Wardrobe
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Add your clothing items with automatic color extraction. Organize by tops, bottoms, footwear, and accessories.
              </p>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Casual Outfits Tile */}
          <Card className="wardrobe-card group cursor-pointer animate-scale-in" 
                style={{ animationDelay: '0.1s' }}
                onClick={() => onNavigate('casual')}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shirt className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Casual Outfit Suggestions
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Discover vibrant, expressive combinations perfect for everyday wear and social occasions.
              </p>
              <Button variant="outline" className="w-full group-hover:bg-success group-hover:text-success-foreground transition-colors">
                Browse Casual
              </Button>
            </CardContent>
          </Card>

          {/* Formal Outfits Tile */}
          <Card className="wardrobe-card group cursor-pointer animate-scale-in" 
                style={{ animationDelay: '0.2s' }}
                onClick={() => onNavigate('formal')}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Formal Outfit Suggestions
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Professional, sophisticated combinations with neutral tones and elegant color harmony.
              </p>
              <Button variant="outline" className="w-full group-hover:bg-foreground group-hover:text-background transition-colors">
                Browse Formal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="container mx-auto px-4 mt-16 pb-16">
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button 
            variant="secondary" 
            onClick={() => onNavigate('wardrobe')}
            className="flex items-center gap-2 px-8 py-3"
          >
            <Heart className="w-4 h-4" />
            My Wardrobe
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={() => onNavigate('saved')}
            className="flex items-center gap-2 px-8 py-3"
          >
            <Heart className="w-4 h-4" />
            Saved Outfits
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;