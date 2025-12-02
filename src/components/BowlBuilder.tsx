import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Minus } from "lucide-react";

interface BowlSize {
  id: string;
  name: string;
  size: string;
  originalPrice: number;
  price: number;
  description: string;
  popular?: boolean;
}

const bowlSizes: BowlSize[] = [
  {
    id: "go",
    name: "Go 10/10",
    size: "290 ml",
    originalPrice: 6500,
    price: 5500,
    description: "Toppings infinitos",
  },
  {
    id: "tipico",
    name: "Típico",
    size: "350 ml",
    originalPrice: 7600,
    price: 6500,
    description: "El equilibrio perfecto",
    popular: true,
  },
  {
    id: "clasico",
    name: "Bowl Clásico de la Suerte",
    size: "420 ml",
    originalPrice: 9100,
    price: 7700,
    description: "Máxima indulgencia",
  },
];

const toppingsOptions = [
  { name: "Granola", category: "Crunch" },
  { name: "Coco rallado", category: "Crunch" },
  { name: "Almendras", category: "Crunch" },
  { name: "Nueces", category: "Crunch" },
  { name: "Banana", category: "Frutas" },
  { name: "Frutilla", category: "Frutas" },
  { name: "Arándanos", category: "Frutas" },
  { name: "Kiwi", category: "Frutas" },
  { name: "Mango", category: "Frutas" },
  { name: "Miel", category: "Dulces" },
  { name: "Mantequilla de maní", category: "Dulces" },
  { name: "Nutella", category: "Dulces" },
];

export const BowlBuilder = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  const selectedBowl = bowlSizes.find((bowl) => bowl.id === selectedSize);
  const totalPrice = selectedBowl?.price || 0;
  const originalTotalPrice = selectedBowl?.originalPrice || 0;
  const savings = originalTotalPrice - totalPrice;

  const toggleTopping = (topping: string) => {
    setSelectedToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    );
  };

  const groupedToppings = toppingsOptions.reduce((acc, topping) => {
    if (!acc[topping.category]) {
      acc[topping.category] = [];
    }
    acc[topping.category].push(topping);
    return acc;
  }, {} as Record<string, typeof toppingsOptions>);

  const scrollToBowls = () => {
    const bowlSection = document.getElementById('bowl-selection');
    bowlSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent/90 text-sm px-4 py-1">
              ✺ Hecho con Nativo Açaí
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Esto es café, fruta y un poco de arte.
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              Bowls personalizables con Açaí Nativo. Pedido desde tu celular.
            </p>
            <Button 
              size="lg"
              onClick={scrollToBowls}
              className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              Armar mi bowl
            </Button>
          </div>
        </div>
      </section>

      {/* Bowl Size Selection */}
      <section id="bowl-selection" className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Elige tu tamaño
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Ese es el único lujo.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {bowlSizes.map((bowl, index) => (
              <Card
                key={bowl.id}
                className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-hover hover:scale-105 animate-scale-in ${
                  selectedSize === bowl.id
                    ? "ring-2 ring-primary shadow-glow bg-primary-light/20"
                    : "hover:border-primary/50"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedSize(bowl.id)}
              >
                {bowl.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                    Popular
                  </Badge>
                )}
                
                <Badge className="absolute -top-3 right-4 bg-yellow text-yellow-foreground animate-pulse">
                  🎉 -15% con App
                </Badge>
                
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mb-3">
                      {bowl.size.split(" ")[0]}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{bowl.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{bowl.size}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {bowl.description}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-lg text-muted-foreground line-through mb-1">
                      ${bowl.originalPrice.toLocaleString("es-CL")}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      ${bowl.price.toLocaleString("es-CL")}
                    </p>
                  </div>

                  {selectedSize === bowl.id && (
                    <div className="flex items-center justify-center gap-2 text-primary animate-scale-in">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Seleccionado</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Toppings Selection */}
          {selectedSize && (
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Hay favoritos, hay descubrimientos.
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                Elige tus toppings sin límites.
              </p>

              {Object.entries(groupedToppings).map(([category, toppings]) => (
                <div key={category} className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {toppings.map((topping) => {
                      const isSelected = selectedToppings.includes(topping.name);
                      return (
                        <Button
                          key={topping.name}
                          variant={isSelected ? "default" : "outline"}
                          className={`h-auto py-4 transition-all duration-300 ${
                            isSelected
                              ? "bg-gradient-primary text-primary-foreground shadow-soft"
                              : "hover:border-primary hover:shadow-soft"
                          }`}
                          onClick={() => toggleTopping(topping.name)}
                        >
                          <span className="flex items-center gap-2">
                            {isSelected ? (
                              <Minus className="w-4 h-4" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                            {topping.name}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Order Summary */}
              <Card className="sticky bottom-4 p-6 shadow-hover bg-card/95 backdrop-blur-sm border-primary/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1">Tu pedido está casi listo.</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {selectedBowl?.name} • {selectedToppings.length} toppings
                    </p>
                    <Badge className="bg-accent text-accent-foreground">
                      ✺ Con Nativo Açaí
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground line-through">
                        ${originalTotalPrice.toLocaleString("es-CL")} CLP
                      </p>
                      <p className="text-sm text-accent font-medium">
                        Ahorras ${savings.toLocaleString("es-CL")}
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        ${totalPrice.toLocaleString("es-CL")} CLP
                      </p>
                    </div>
                    <Button
                      size="lg"
                      disabled
                      className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 hover:scale-105 animate-pulse"
                      title="Integración de WhatsApp próximamente"
                    >
                      Enviar por WhatsApp
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Lo demás es arte. ✨
                </p>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
