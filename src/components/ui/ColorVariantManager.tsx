import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { X, Plus } from 'lucide-react';
import { Card } from './card';
import type { ColorVariant } from '@/types';

interface ColorVariantManagerProps {
  variants: ColorVariant[];
  onChange: (variants: ColorVariant[]) => void;
}

export function ColorVariantManager({ variants, onChange }: ColorVariantManagerProps) {
  const [newColor, setNewColor] = useState({
    name: '',
    hexCode: '#000000',
    stock: 0,
  });

  const addVariant = () => {
    if (newColor.name.trim()) {
      onChange([
        ...variants,
        {
          ...newColor,
          id: `variant-${Date.now()}`,
        },
      ]);
      setNewColor({ name: '', hexCode: '#000000', stock: 0 });
    }
  };

  const removeVariant = (id: string | undefined) => {
    onChange(variants.filter((v) => v.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addVariant();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Color Variants</h3>
        <p className="text-xs text-muted-foreground mb-3">Add different color options for this product</p>
      </div>

      {/* Add New Color */}
      <Card className="p-4 border">
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Color Name</label>
              <Input
                placeholder="e.g., Red, Blue"
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Hex Code</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newColor.hexCode}
                  onChange={(e) => setNewColor({ ...newColor, hexCode: e.target.value })}
                  className="h-10 w-14 rounded border cursor-pointer flex-shrink-0"
                  title="Pick a color"
                />
                <Input
                  placeholder="#000000"
                  value={newColor.hexCode}
                  onChange={(e) => setNewColor({ ...newColor, hexCode: e.target.value })}
                  className="text-xs"
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Stock</label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={newColor.stock}
                onChange={(e) => setNewColor({ ...newColor, stock: parseInt(e.target.value) || 0 })}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={addVariant} size="sm" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add Color
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Listed Variants */}
      {variants.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Added colors: {variants.length}</p>
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
            >
              <div
                className="h-8 w-8 rounded-full border-2 border-gray-300 cursor-pointer flex-shrink-0"
                style={{ backgroundColor: variant.hexCode }}
                title={variant.hexCode}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{variant.name}</p>
                <p className="text-xs text-muted-foreground">
                  {variant.hexCode} • {variant.stock} in stock
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => removeVariant(variant.id)}
              >
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {variants.length === 0 && (
        <div className="p-4 bg-muted/30 rounded-lg border-2 border-dashed text-center">
          <p className="text-xs text-muted-foreground italic">
            No color variants added yet. Add at least one color option for customers to choose from.
          </p>
        </div>
      )}
    </div>
  );
}
