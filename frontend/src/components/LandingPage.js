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

      {/* Hero Section with Perimeter Lightning */}
      <section 
        id="hero" 
        data-animate
        className={`min-h-screen flex items-center justify-center px-4 py-20 transition-all duration-1000 transform relative ${
          isVisible.hero ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'
        }`}
      >
        {/* Perimeter Lightning Animation */}
        <div className="absolute inset-4 pointer-events-none">
          <div className="perimeter-lightning-container">
            <div className="lightning-perimeter top"></div>
            <div className="lightning-perimeter right"></div>
            <div className="lightning-perimeter bottom"></div>
            <div className="lightning-perimeter left"></div>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-center mb-4 md:mb-6 animate-float">
              <img 
                src="/thunder-logo.png" 
                alt="Thunder Services Logo" 
                className="h-20 md:h-32 w-auto"
              />
            </div>
            <div className="thunder-hero-title inline-block relative">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 md:mb-6 leading-tight relative animate-title-glow">
                <span className="text-thunder-yellow">THUNDER</span>
                <br />
                <span className="text-thunder-red">SERVICES</span>
                
                {/* Enhanced Constant Lightning Animation */}
                <div className="lightning-bolt-constant absolute -top-3 -right-6 md:-top-6 md:-right-12 opacity-100">
                  <svg 
                    width="60" 
                    height="80" 
                    viewBox="0 0 100 140" 
                    className="lightning-svg-constant md:w-[100px] md:h-[140px]"
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
            <div className="w-24 md:w-32 h-1 bg-thunder-red mx-auto mb-6 md:mb-8 animate-line-extend"></div>
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-300 mb-8 md:mb-12 leading-relaxed animate-fade-in-delayed px-2">
            Lo mejor en <span className="text-thunder-yellow">relojes de lujo</span>, 
            <span className="text-thunder-red"> zapatillas</span>, y 
            <span className="text-thunder-yellow"> ropa</span>.
            <br />
            Calidad y ofertas que <span className="text-thunder-red">impactan fuerte</span>.
          </p>

          <div className="flex flex-col gap-4 justify-center items-center animate-buttons-in">
            <Button
              onClick={handleTelegramClick}
              size="lg"
              className="bg-thunder-red hover:bg-red-600 text-white font-black text-base md:text-lg px-8 py-4 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-thunder-red/25 animate-pulse-glow w-full sm:w-auto min-h-[56px]"
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 mr-3" />
              ÚNETE A TELEGRAM
            </Button>
          </div>

          {/* Trust Indicators - Removed "100% Auténtico" */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12 md:mt-16 text-gray-400 animate-trust-indicators px-4">
            <div className="flex items-center gap-2 animate-bounce-gentle text-sm md:text-base">
              <Truck className="w-4 h-4 md:w-5 md:h-5 text-thunder-yellow flex-shrink-0" />
              <span className="font-semibold">Envío Rápido</span>
            </div>
            <div className="flex items-center gap-2 animate-bounce-gentle text-sm md:text-base" style={{animationDelay: '0.2s'}}>
              <Watch className="w-4 h-4 md:w-5 md:h-5 text-thunder-yellow flex-shrink-0" />
              <span className="font-semibold">Relojes Premium</span>
            </div>
            <div className="flex items-center gap-2 animate-bounce-gentle text-sm md:text-base" style={{animationDelay: '0.4s'}}>
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-thunder-yellow flex-shrink-0" />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
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
                  className="bg-black border-thunder-yellow border-2 overflow-hidden group hover:border-thunder-red transition-all duration-500 hover:scale-105 md:hover:scale-110 hover:shadow-2xl hover:shadow-thunder-yellow/20 animate-card-float"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative overflow-hidden">
                    {/* Placeholder for watch image */}
                    <div className="w-full h-48 md:h-64 bg-gray-800 border-2 border-dashed border-thunder-yellow flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="mb-2 md:mb-3">
                          <Watch className="w-12 h-12 md:w-16 md:h-16 mx-auto text-thunder-yellow" />
                        </div>
                        <p className="text-base md:text-lg font-bold text-thunder-yellow">RELOJ PREMIUM</p>
                        <p className="text-xs md:text-sm">Agregar imagen aquí</p>
                      </div>
                    </div>
                    <Badge className="absolute top-2 left-2 md:top-4 md:left-4 bg-thunder-yellow text-black font-bold animate-badge-pulse text-xs">
                      {product.category.toUpperCase()}
                    </Badge>
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-thunder-red text-white px-2 py-1 rounded text-xs font-bold animate-highlight-pulse">
                      ¡DESTACADO!
                    </div>
                  </div>
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-black text-white mb-2 leading-tight">
                      {product.name}
                    </h3>
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
                    {/* Placeholder for product image */}
                    <div className="w-full h-64 bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="mb-3">
                          {product.category === 'zapatillas' ? (
                            <svg className="w-16 h-16 mx-auto text-thunder-red" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M2,18H22L20,20H4L2,18M12,4.74L16.71,9.46C17.1,9.85 17.1,10.47 16.71,10.86L15.29,12.28C14.9,12.67 14.27,12.67 13.88,12.28L12,10.41L10.12,12.28C9.73,12.67 9.1,12.67 8.71,12.28L7.29,10.86C6.9,10.47 6.9,9.85 7.29,9.46L12,4.74M12,1L3,10L12,19L21,10L12,1Z"/>
                            </svg>
                          ) : (
                            <svg className="w-16 h-16 mx-auto text-thunder-red" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 8.12,16.5 8.91,15.66L10.5,16.22L11.44,15.28C11.8,14.92 11.8,14.32 11.44,13.96C11.08,13.6 10.48,13.6 10.12,13.96L9.18,14.9L7.85,14.46C7.32,15.12 6.86,15.84 6.5,16.61C6.27,17.1 6.47,17.68 6.96,17.91C7.03,17.94 7.1,17.96 7.17,17.97C7.63,18.05 8.06,17.76 8.14,17.3C8.18,17.06 8.12,16.81 7.96,16.61L7.07,18.28M16.93,18.28C16.5,17.38 15.88,16.5 15.09,15.66L13.5,16.22L12.56,15.28C12.2,14.92 12.2,14.32 12.56,13.96C12.92,13.6 13.52,13.6 13.88,13.96L14.82,14.9L16.15,14.46C16.68,15.12 17.14,15.84 17.5,16.61C17.73,17.1 17.53,17.68 17.04,17.91C16.97,17.94 16.9,17.96 16.83,17.97C16.37,18.05 15.94,17.76 15.86,17.3C15.82,17.06 15.88,16.81 16.04,16.61L16.93,18.28Z"/>
                            </svg>
                          )}
                        </div>
                        <p className="text-lg font-bold text-thunder-red">
                          {product.category === 'zapatillas' ? 'ZAPATILLAS' : 'ROPA'}
                        </p>
                        <p className="text-sm">Agregar imagen aquí</p>
                      </div>
                    </div>
                    <Badge className="absolute top-4 left-4 bg-thunder-red text-white font-bold animate-badge-pulse">
                      {product.category.toUpperCase()}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-black text-white mb-2">
                      {product.name}
                    </h3>
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
              // Show testimonial image placeholders
              testimonials.map((testimonial, index) => (
                <Card 
                  key={testimonial.id}
                  className="bg-black border-gray-800 hover:border-thunder-yellow transition-all duration-500 hover:scale-110 animate-testimonial-fade-in overflow-hidden"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative">
                    {/* Placeholder for testimonial image */}
                    <div className="w-full h-64 bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="mb-2">
                          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold">Imagen de Reseña</p>
                        <p className="text-xs">{testimonial.name}</p>
                      </div>
                    </div>
                    
                    {/* Rating overlay */}
                    <div className="absolute top-4 right-4 bg-thunder-yellow text-black px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">{testimonial.rating}</span>
                    </div>
                    
                    {/* Customer name overlay */}
                    <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-lg">
                      <p className="text-sm font-bold">{testimonial.name}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section with Perimeter Lightning */}
      <section 
        id="cta" 
        data-animate
        className={`py-32 px-4 transition-all duration-1200 transform relative ${
          isVisible.cta ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-95'
        }`}
      >
        {/* Perimeter Lightning Animation for CTA */}
        <div className="absolute inset-4 pointer-events-none">
          <div className="perimeter-lightning-container">
            <div className="lightning-perimeter top"></div>
            <div className="lightning-perimeter right"></div>
            <div className="lightning-perimeter bottom"></div>
            <div className="lightning-perimeter left"></div>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight animate-text-glow">
            <span className="text-white">¿QUIERES SER PARTE</span>
            <br />
            <span className="text-thunder-red">DE LA COMUNIDAD?</span>
          </h2>
          
          <p className="text-2xl text-gray-300 font-bold mb-12 animate-fade-in-up">
            Únete a cientos de personas que reciben ofertas exclusivas y los mejores precios en 
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
            Sin spam, solo ofertas increíbles • Unirse es gratis
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