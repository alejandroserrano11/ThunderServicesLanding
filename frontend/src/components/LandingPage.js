import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Star, MessageCircle, Zap, Truck, Watch } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState({});
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, testimonialsResponse] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/testimonials`)
        ]);
        
        setProducts(productsResponse.data);
        setTestimonials(testimonialsResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content');
        // Fallback to empty arrays
        setProducts([]);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Enhanced Intersection Observer for more visual animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
            // Add enhanced visual class
            entry.target.classList.add('animate-in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleTelegramClick = async () => {
    // Track telegram click
    try {
      await axios.post(`${API}/telegram-click`, {
        user_agent: navigator.userAgent,
        referrer: document.referrer
      });
    } catch (err) {
      console.error('Error tracking telegram click:', err);
    }
    
    // Open telegram
    window.open('https://t.me/thunderxservices', '_blank');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-thunder-yellow text-thunder-yellow' : 'text-gray-600'}`}
      />
    ));
  };

  // Separate products by category with watches first
  const watchProducts = products.filter(p => p.category === 'relojes');
  const otherProducts = products.filter(p => p.category !== 'relojes');

  // Loading skeleton component
  const ProductSkeleton = () => (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-700"></div>
      <CardContent className="p-6">
        <div className="h-6 bg-gray-700 rounded mb-2"></div>
        <div className="h-8 bg-gray-700 rounded w-20"></div>
      </CardContent>
    </Card>
  );

  const TestimonialSkeleton = () => (
    <Card className="bg-black border-gray-800 animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
          <div>
            <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-16"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/thunder-logo.png" 
                alt="Thunder Services Logo" 
                className="h-10 w-auto"
              />
              <div className="text-xl font-black">
                <span className="text-thunder-yellow">THUNDER</span>
                <span className="text-thunder-red"> SERVICES</span>
              </div>
            </div>
            <Button
              onClick={handleTelegramClick}
              className="bg-thunder-red hover:bg-red-600 text-white font-bold transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              ÚNETE AL CANAL
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="hero" 
        data-animate
        className={`min-h-screen flex items-center justify-center px-4 transition-all duration-1000 transform ${
          isVisible.hero ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'
        }`}
      >
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6 animate-float">
              <img 
                src="/thunder-logo.png" 
                alt="Thunder Services Logo" 
                className="h-24 w-auto mr-4"
              />
            </div>
            <div className="thunder-hero-title inline-block relative">
              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight relative animate-title-glow">
                <span className="text-thunder-yellow">THUNDER</span>
                <br />
                <span className="text-thunder-red">SERVICES</span>
                
                {/* Enhanced Constant Lightning Animation */}
                <div className="lightning-bolt-constant absolute -top-6 -right-12 opacity-100">
                  <svg 
                    width="100" 
                    height="140" 
                    viewBox="0 0 100 140" 
                    className="lightning-svg-constant"
                  >
                    <path 
                      d="M55 15 L25 60 L45 60 L35 125 L65 80 L45 80 Z" 
                      fill="url(#lightningGradient)"
                      className="lightning-path-constant"
                    />
                    <defs>
                      <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFF00" />
                        <stop offset="30%" stopColor="#FFD700" />
                        <stop offset="70%" stopColor="#FFA500" />
                        <stop offset="100%" stopColor="#FF0000" />
                      </linearGradient>
                      <filter id="lightningGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                  </svg>
                </div>
              </h1>
            </div>
            <div className="w-32 h-1 bg-thunder-red mx-auto mb-8 animate-line-extend"></div>
          </div>
          
          <p className="text-xl md:text-2xl font-bold text-gray-300 mb-12 leading-relaxed animate-fade-in-delayed">
            Lo mejor en <span className="text-thunder-yellow">relojes de lujo</span>, 
            <span className="text-thunder-red"> zapatillas</span>, y 
            <span className="text-thunder-yellow"> ropa</span>.
            <br />
            Calidad y ofertas que <span className="text-thunder-red">impactan fuerte</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-buttons-in">
            <Button
              onClick={handleTelegramClick}
              size="lg"
              className="bg-thunder-red hover:bg-red-600 text-white font-black text-lg px-8 py-4 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-thunder-red/25 animate-pulse-glow"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              ÚNETE A TELEGRAM
            </Button>
          </div>

          {/* Trust Indicators - Removed "100% Auténtico" */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-gray-400 animate-trust-indicators">
            <div className="flex items-center gap-2 animate-bounce-gentle">
              <Truck className="w-5 h-5 text-thunder-yellow" />
              <span className="font-semibold">Envío Rápido</span>
            </div>
            <div className="flex items-center gap-2 animate-bounce-gentle" style={{animationDelay: '0.2s'}}>
              <Watch className="w-5 h-5 text-thunder-yellow" />
              <span className="font-semibold">Relojes Premium</span>
            </div>
            <div className="flex items-center gap-2 animate-bounce-gentle" style={{animationDelay: '0.4s'}}>
              <Zap className="w-5 h-5 text-thunder-yellow" />
              <span className="font-semibold">Ofertas Exclusivas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Watches Highlight Section */}
      <section 
        id="watches" 
        data-animate
        className={`py-20 px-4 bg-gray-950 transition-all duration-1200 transform ${
          isVisible.watches ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-95'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6 animate-header-slide">
              <Watch className="w-12 h-12 text-thunder-yellow animate-spin-slow" />
              <h2 className="text-5xl md:text-6xl font-black animate-text-glow">
                <span className="text-thunder-yellow">RELOJES</span>
                <span className="text-white"> PREMIUM</span>
              </h2>
              <Watch className="w-12 h-12 text-thunder-yellow animate-spin-slow" style={{animationDelay: '1s'}} />
            </div>
            <div className="w-24 h-1 bg-thunder-red mx-auto mb-6 animate-line-extend"></div>
            <p className="text-xl text-gray-300 font-semibold animate-fade-in-up">
              Nuestra especialidad: Relojes de lujo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {loading ? (
              // Show skeleton loaders while loading
              [...Array(4)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : error ? (
              // Show error message
              <div className="col-span-full text-center text-gray-400">
                <p>No se pudieron cargar los relojes</p>
              </div>
            ) : watchProducts.length === 0 ? (
              // Show no watches message
              <div className="col-span-full text-center text-gray-400">
                <p>No hay relojes disponibles</p>
              </div>
            ) : (
              // Show watches
              watchProducts.map((product, index) => (
                <Card 
                  key={product.id}
                  className="bg-black border-thunder-yellow border-2 overflow-hidden group hover:border-thunder-red transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-thunder-yellow/20 animate-card-float"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-125 transition-transform duration-700"
                    />
                    <Badge className="absolute top-4 left-4 bg-thunder-yellow text-black font-bold animate-badge-pulse">
                      {product.category.toUpperCase()}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-thunder-red text-white px-2 py-1 rounded text-sm font-bold animate-highlight-pulse">
                      ¡DESTACADO!
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-black text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-black text-thunder-yellow">
                      {product.price}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Other Products Gallery */}
      <section 
        id="products" 
        data-animate
        className={`py-20 px-4 transition-all duration-1200 transform ${
          isVisible.products ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-95'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4 animate-text-glow">
              <span className="text-thunder-red">MÁS</span>
              <span className="text-white"> PRODUCTOS</span>
            </h2>
            <div className="w-24 h-1 bg-thunder-yellow mx-auto mb-6 animate-line-extend"></div>
            <p className="text-xl text-gray-300 font-semibold animate-fade-in-up">
              Zapatillas y ropa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Show skeleton loaders while loading
              [...Array(6)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : error ? (
              // Show error message
              <div className="col-span-full text-center text-gray-400">
                <p>No se pudieron cargar los productos</p>
              </div>
            ) : otherProducts.length === 0 ? (
              // Show no products message
              <div className="col-span-full text-center text-gray-400">
                <p>No hay productos disponibles</p>
              </div>
            ) : (
              // Show other products
              otherProducts.map((product, index) => (
                <Card 
                  key={product.id}
                  className="bg-gray-900 border-gray-800 overflow-hidden group hover:border-thunder-yellow transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-thunder-yellow/10 animate-card-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-125 transition-transform duration-700"
                    />
                    <Badge className="absolute top-4 left-4 bg-thunder-red text-white font-bold animate-badge-pulse">
                      {product.category.toUpperCase()}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-black text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-black text-thunder-yellow">
                      {product.price}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        id="testimonials" 
        data-animate
        className={`py-20 px-4 bg-gray-950 transition-all duration-1200 transform ${
          isVisible.testimonials ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-95'
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4 animate-text-glow">
              <span className="text-thunder-red">CLIENTES</span>
              <span className="text-white"> SATISFECHOS</span>
            </h2>
            <div className="w-24 h-1 bg-thunder-yellow mx-auto mb-6 animate-line-extend"></div>
            <p className="text-xl text-gray-300 font-semibold animate-fade-in-up">
              Mira lo que dice nuestra comunidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Show skeleton loaders while loading
              [...Array(4)].map((_, index) => (
                <TestimonialSkeleton key={index} />
              ))
            ) : error ? (
              // Show error message
              <div className="col-span-full text-center text-gray-400">
                <p>No se pudieron cargar los testimonios</p>
              </div>
            ) : testimonials.length === 0 ? (
              // Show no testimonials message
              <div className="col-span-full text-center text-gray-400">
                <p>No hay testimonios disponibles</p>
              </div>
            ) : (
              // Show testimonials
              testimonials.map((testimonial, index) => (
                <Card 
                  key={testimonial.id}
                  className="bg-black border-gray-800 hover:border-thunder-yellow transition-all duration-500 hover:scale-110 animate-testimonial-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Avatar className="mr-3">
                        <AvatarFallback className="bg-thunder-yellow text-black font-black">
                          {testimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-white">{testimonial.name}</p>
                        <div className="flex gap-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 font-medium leading-relaxed">
                      "{testimonial.review}"
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta" 
        data-animate
        className={`py-32 px-4 transition-all duration-1200 transform ${
          isVisible.cta ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-95'
        }`}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight animate-text-glow">
            <span className="text-white">¿QUIERES SER PARTE</span>
            <br />
            <span className="text-thunder-red">DE LA FAMILIA?</span>
          </h2>
          
          <p className="text-2xl text-gray-300 font-bold mb-12 animate-fade-in-up">
            Únete a miles que reciben ofertas exclusivas y los mejores precios en 
            <span className="text-thunder-yellow"> THUNDER</span>
            <span className="text-thunder-red"> SERVICES</span>
          </p>

          <Button
            onClick={handleTelegramClick}
            size="lg"
            className="bg-thunder-yellow hover:bg-yellow-400 text-black font-black text-2xl px-12 py-6 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-thunder-yellow/25 mb-8 animate-cta-pulse"
          >
            <MessageCircle className="w-8 h-8 mr-4" />
            ÚNETE A THUNDER TELEGRAM
          </Button>

          <p className="text-lg text-gray-400 font-semibold animate-fade-in-delayed">
            Sin spam, solo ofertas increíbles • unirse es gratis
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-6 md:mb-0 animate-footer-slide">
              <img 
                src="/thunder-logo.png" 
                alt="Thunder Services Logo" 
                className="h-12 w-auto"
              />
              <div className="text-2xl font-black">
                <span className="text-thunder-yellow">THUNDER</span>
                <span className="text-thunder-red"> SERVICES</span>
              </div>
            </div>
            
            <div className="flex gap-6">
              <Button
                onClick={handleTelegramClick}
                variant="outline"
                className="border-thunder-red text-thunder-red hover:bg-thunder-red hover:text-white font-bold animate-button-glow"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Telegram
              </Button>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 font-semibold">
              © 2025 <span className="text-thunder-yellow">Thunder</span>
              <span className="text-thunder-red"> Services</span>. Relojes premium, variedad de productos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;