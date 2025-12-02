import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, AlertCircle, RefreshCw } from "lucide-react";
import { loadProductsFromToeat } from "@/services/toeat-api";
import { BowlSize, Topping } from "@/types/toeat";
import { toast } from "sonner";

export const BowlBuilder = () => {
  // Selection state
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [lastToggled, setLastToggled] = useState<string | null>(null);

  // Dynamic data state
  const [bowlSizes, setBowlSizes] = useState<BowlSize[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedBowl = bowlSizes.find((bowl) => bowl.id === selectedSize);
  const totalPrice = selectedBowl?.price || 0;
  const originalTotalPrice = selectedBowl?.originalPrice || 0;
  const savings = originalTotalPrice - totalPrice;
  const isBowlComplete = selectedSize && selectedToppings.length >= 1;

  // Load products from Toeat on mount and refresh periodically
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await loadProductsFromToeat();
        
        setBowlSizes(data.bowlSizes);
        setToppings(data.toppings);
        setIsStoreOpen(data.isStoreOpen);
        setLastUpdated(data.lastUpdated);

        if (!data.isStoreOpen) {
          toast.error("La tienda está cerrada", {
            description: "No se pueden hacer pedidos en este momento."
          });
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        toast.error("Error al cargar productos", {
          description: errorMessage
        });
        console.error("Failed to load products from Toeat:", err);
        
        // Fallback to default data on error
        setBowlSizes([
          {
            id: "go",
            name: "Go 10/10",
            size: "290 ml",
            originalPrice: 6500,
            price: 5500,
            description: "Toppings infinitos",
            availability: true,
          },
          {
            id: "tipico",
            name: "Típico",
            size: "350 ml",
            originalPrice: 7600,
            price: 6500,
            description: "El equilibrio perfecto",
            popular: true,
            availability: true,
          },
          {
            id: "clasico",
            name: "Bowl Clásico de la Suerte",
            size: "420 ml",
            originalPrice: 9100,
            price: 7700,
            description: "Máxima indulgencia",
            availability: true,
          },
        ]);
        setToppings([
          { id: "granola-crunchy", name: "Granola crunchy sin azúcar", category: "🥣 Crunch", availability: true },
          { id: "granola-avena", name: "Granola avena miel", category: "🥣 Crunch", availability: true },
          { id: "cacao-nibs", name: "Cacao nibs", category: "🥣 Crunch", availability: true },
          { id: "banana", name: "Banana", category: "🍓 Frutas", availability: true },
          { id: "frutilla", name: "Frutilla", category: "🍓 Frutas", availability: true },
          { id: "arandanos", name: "Arándanos", category: "🍓 Frutas", availability: true },
          { id: "mango", name: "Mango", category: "🍓 Frutas", availability: true },
          { id: "kiwi", name: "Kiwi", category: "🍓 Frutas", availability: true },
          { id: "pina", name: "Piña", category: "🍓 Frutas", availability: true },
          { id: "miel", name: "Miel", category: "🍬 Dulces Naturales", availability: true },
          { id: "mantequilla-mani", name: "Mantequilla de maní", category: "🍬 Dulces Naturales", availability: true },
          { id: "mantequilla-pistachos", name: "Mantequilla de pistachos", category: "🍬 Dulces Naturales", availability: true },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();

    // Refresh every 2 minutes to keep inventory updated
    const refreshInterval = setInterval(loadProducts, 120000);

    return () => clearInterval(refreshInterval);
  }, []);

  const toggleTopping = (toppingId: string) => {
    setLastToggled(toppingId);
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((t) => t !== toppingId)
        : [...prev, toppingId]
    );
    setTimeout(() => setLastToggled(null), 300);
  };

  const groupedToppings = toppings.reduce((acc, topping) => {
    if (!acc[topping.category]) {
      acc[topping.category] = [];
    }
    acc[topping.category].push(topping);
    return acc;
  }, {} as Record<string, Topping[]>);

  const scrollToBowls = () => {
    const bowlSection = document.getElementById('bowl-selection');
    bowlSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-64 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Store closed state
  if (!isStoreOpen && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-background flex items-center justify-center">
        <Card className="max-w-lg mx-6 p-8 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tienda Cerrada</h2>
          <p className="text-muted-foreground mb-6">
            No estamos recibiendo pedidos en este momento. Por favor intenta más tarde.
          </p>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Última actualización: {lastUpdated.toLocaleTimeString("es-CL")}
            </p>
          )}
        </Card>
      </div>
    );
  }

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
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center tracking-tight">
              Elige tu tamaño
            </h2>
            {error && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-muted-foreground hover:text-foreground"
                title="Recargar productos"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-center text-muted-foreground mb-16 text-lg font-light">
            Elige. Sin prisa.
          </p>
          {error && (
            <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                ⚠️ Usando datos predeterminados. {error}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {bowlSizes.map((bowl, index) => (
              <Card
                key={bowl.id}
                className={`relative p-8 transition-all duration-300 ease-in-out animate-scale-in ${
                  bowl.availability
                    ? `cursor-pointer hover:shadow-hover hover:-translate-y-0.5 ${
                        selectedSize === bowl.id
                          ? "ring-2 ring-primary shadow-soft bg-primary-light/10"
                          : "hover:border-primary/30"
                      }`
                    : "opacity-50 cursor-not-allowed grayscale"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => bowl.availability && setSelectedSize(bowl.id)}
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
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{bowl.name}</h3>
                      {!bowl.availability && (
                        <Badge variant="destructive" className="text-xs">
                          Agotado
                        </Badge>
                      )}
                    </div>
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

              {Object.entries(groupedToppings).map(([category, categoryToppings], categoryIndex) => (
                <div 
                  key={category} 
                  className="mb-16 animate-slide-up"
                  style={{ animationDelay: `${categoryIndex * 0.1}s` }}
                >
                  <h3 className="text-lg font-display font-medium mb-6 tracking-tight text-foreground/90">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryToppings.map((topping) => {
                      const isSelected = selectedToppings.includes(topping.id);
                      const isAvailable = topping.availability;
                      
                      return (
                        <Button
                          key={topping.id}
                          variant="outline"
                          disabled={!isAvailable}
                          className={`min-h-[44px] h-auto py-3 px-4 transition-all duration-300 ease-in-out font-light text-left justify-start ${
                            !isAvailable
                              ? "opacity-50 cursor-not-allowed grayscale"
                              : isSelected
                              ? "bg-[hsl(270,60%,90%)] border-[hsl(270,60%,70%)] text-foreground shadow-sm"
                              : "bg-background hover:bg-accent/50 hover:border-border"
                          } ${lastToggled === topping.id ? "animate-pulse" : ""}`}
                          onClick={() => isAvailable && toggleTopping(topping.id)}
                        >
                          <span className="flex-1">
                            {topping.name}
                            {!isAvailable && <span className="ml-2 text-xs text-muted-foreground">(Agotado)</span>}
                          </span>
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
                <div className="flex items-center justify-between mt-6 text-xs text-muted-foreground">
                  <p className="font-light">Avísanos cuando estés.</p>
                  {lastUpdated && (
                    <p className="font-light">
                      Actualizado: {lastUpdated.toLocaleTimeString("es-CL")}
                    </p>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
