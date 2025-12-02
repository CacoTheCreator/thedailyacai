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

interface Topping {
  name: string;
  category: string;
  popular?: boolean;
  emoji?: string;
}

const toppingsOptions: Topping[] = [
  { name: "Granola crunchy sin azúcar", category: "🥣 Crunch" },
  { name: "Granola avena miel", category: "🥣 Crunch" },
  { name: "Cacao nibs", category: "🥣 Crunch" },
  { name: "Banana", category: "🍓 Frutas" },
  { name: "Frutilla", category: "🍓 Frutas" },
  { name: "Arándanos", category: "🍓 Frutas" },
  { name: "Mango", category: "🍓 Frutas" },
  { name: "Kiwi", category: "🍓 Frutas" },
  { name: "Piña", category: "🍓 Frutas" },
  { name: "Miel", category: "🍬 Dulces Naturales" },
  { name: "Mantequilla de maní", category: "🍬 Dulces Naturales" },
  { name: "Mantequilla de pistachos", category: "🍬 Dulces Naturales" },
];

export const BowlBuilder = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [lastToggled, setLastToggled] = useState<string | null>(null);

  const selectedBowl = bowlSizes.find((bowl) => bowl.id === selectedSize);
  const totalPrice = selectedBowl?.price || 0;
  const originalTotalPrice = selectedBowl?.originalPrice || 0;
  const savings = originalTotalPrice - totalPrice;
  const isBowlComplete = selectedSize && selectedToppings.length >= 1;

  const toggleTopping = (topping: string) => {
    setLastToggled(topping);
    setSelectedToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    );
    setTimeout(() => setLastToggled(null), 300);
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
        <div className="container mx-auto px-6 py-24 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-2 tracking-tight">
                The Daily Grind
              </h2>
              <p className="text-base md:text-lg text-muted-foreground tracking-wide font-light">
                By Jeró
              </p>
            </div>
            <Badge className="mb-6 bg-accent text-accent-foreground hover:bg-accent/90 text-sm px-4 py-1.5 badge-glow">
              ✺ Hecho con Nativo Açaí
            </Badge>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
              Café, fruta y algo más.
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Bowls con Açaí Nativo. Pedido desde tu celular.
            </p>
            <Button 
              size="lg"
              onClick={scrollToBowls}
              className="bg-gradient-primary text-primary-foreground hover:shadow-soft transition-all duration-300"
            >
              Armar mi bowl
            </Button>
          </div>
        </div>
      </section>

      {/* Bowl Size Selection */}
      <section id="bowl-selection" className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-6 tracking-tight">
            Elige tu tamaño
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg font-light">
            Elige. Sin prisa.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {bowlSizes.map((bowl, index) => (
              <Card
                key={bowl.id}
                className={`relative p-8 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-hover hover:-translate-y-0.5 animate-scale-in ${
                  selectedSize === bowl.id
                    ? "ring-2 ring-primary shadow-soft bg-primary-light/10"
                    : "hover:border-primary/30"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedSize(bowl.id)}
              >
                {bowl.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs">
                    Popular
                  </Badge>
                )}
                
                <Badge className="absolute -top-3 right-4 bg-yellow text-yellow-foreground text-xs">
                  -15% con App
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
            <div className="animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-6 tracking-tight">
                Tus toppings.
              </h2>
              <p className="text-center text-muted-foreground mb-16 text-lg font-light">
                Sin límites.
              </p>

              {Object.entries(groupedToppings).map(([category, toppings], categoryIndex) => (
                <div 
                  key={category} 
                  className="mb-16 animate-slide-up"
                  style={{ animationDelay: `${categoryIndex * 0.1}s` }}
                >
                  <h3 className="text-lg font-display font-medium mb-6 tracking-tight text-foreground/90">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {toppings.map((topping) => {
                      const isSelected = selectedToppings.includes(topping.name);
                      return (
                        <Button
                          key={topping.name}
                          variant="outline"
                          className={`min-h-[44px] h-auto py-3 px-4 transition-all duration-300 ease-in-out font-light text-left justify-start ${
                            isSelected
                              ? "bg-[hsl(270,60%,90%)] border-[hsl(270,60%,70%)] text-foreground shadow-sm"
                              : "bg-background hover:bg-accent/50 hover:border-border"
                          } ${lastToggled === topping.name ? "animate-pulse" : ""}`}
                          onClick={() => toggleTopping(topping.name)}
                        >
                          <span className="flex-1">{topping.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Order Summary */}
              <Card className={`sticky bottom-4 p-8 shadow-soft bg-card/95 backdrop-blur-sm border-primary/10 transition-all duration-500 ${
                isBowlComplete ? "ring-1 ring-primary/20 animate-soft-glow" : ""
              }`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-bold text-2xl tracking-tight">Listo.</h3>
                      {isBowlComplete && (
                        <div className="flex items-center gap-2 text-primary animate-check-in">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Listo para enviar</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 font-light">
                      <span className={`transition-all duration-300 ${selectedToppings.length > 0 ? "text-primary font-medium" : ""}`}>
                        {selectedBowl?.name} • {selectedToppings.length} toppings
                      </span>
                    </p>
                    <Badge className="bg-accent text-accent-foreground text-xs badge-glow">
                      ✺ Con Nativo Açaí
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground line-through font-light">
                        ${originalTotalPrice.toLocaleString("es-CL")} CLP
                      </p>
                      <p className="text-sm text-accent font-medium">
                        Ahorras ${savings.toLocaleString("es-CL")}
                      </p>
                      <p className="text-3xl font-display font-bold text-primary tracking-tight">
                        ${totalPrice.toLocaleString("es-CL")} CLP
                      </p>
                    </div>
                    <Button
                      size="lg"
                      disabled={!isBowlComplete}
                      className={`bg-gradient-primary text-primary-foreground transition-all duration-500 ease-in-out ${
                        isBowlComplete 
                          ? "opacity-100 translate-y-0 hover:shadow-soft" 
                          : "opacity-50 translate-y-1"
                      }`}
                      title={isBowlComplete ? "Integración de WhatsApp próximamente" : "Selecciona un bowl y al menos un topping"}
                    >
                      Enviar por WhatsApp
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-6 font-light">
                  Avísanos cuando estés.
                </p>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
