import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Star, Instagram, MessageCircle, Zap, Shield, Truck } from 'lucide-react';
import { mockProducts, mockTestimonials } from '../mock';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleTelegramClick = () => {
    window.open('https://t.me/thunderxservices', '_blank');
  };

  const handleInstagramClick = () => {
    window.open('https://instagram.com/thunderxservices', '_blank');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-thunder-yellow text-thunder-yellow' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-black text-thunder-yellow">
              ⚡ THUNDER SERVICES
            </div>
            <Button
              onClick={handleTelegramClick}
              className="bg-thunder-red hover:bg-red-600 text-white font-bold transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              JOIN CHANNEL
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="hero" 
        data-animate
        className={`min-h-screen flex items-center justify-center px-4 transition-all duration-1000 ${
          isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="text-thunder-yellow">THUNDER</span>
              <br />
              <span className="text-white">SERVICES</span>
            </h1>
            <div className="w-32 h-1 bg-thunder-red mx-auto mb-8"></div>
          </div>
          
          <p className="text-xl md:text-2xl font-bold text-gray-300 mb-12 leading-relaxed">
            The best in <span className="text-thunder-yellow">sneakers</span>, 
            <span className="text-thunder-red"> clothing</span>, and 
            <span className="text-thunder-yellow"> watches</span>.
            <br />
            Quality and deals that <span className="text-thunder-red">hit hard</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={handleTelegramClick}
              size="lg"
              className="bg-thunder-red hover:bg-red-600 text-white font-black text-lg px-8 py-4 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-thunder-red/25"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              JOIN OUR TELEGRAM
            </Button>
            
            <Button
              onClick={handleInstagramClick}
              variant="outline"
              size="lg"
              className="border-thunder-yellow text-thunder-yellow hover:bg-thunder-yellow hover:text-black font-black text-lg px-8 py-4 rounded-lg transition-all duration-300 hover:scale-110"
            >
              <Instagram className="w-6 h-6 mr-3" />
              @THUNDERXSERVICES
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-thunder-yellow" />
              <span className="font-semibold">100% Authentic</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-thunder-yellow" />
              <span className="font-semibold">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-thunder-yellow" />
              <span className="font-semibold">Exclusive Deals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      <section 
        id="products" 
        data-animate
        className={`py-20 px-4 transition-all duration-1000 delay-200 ${
          isVisible.products ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="text-thunder-yellow">PREMIUM</span>
              <span className="text-white"> COLLECTION</span>
            </h2>
            <div className="w-24 h-1 bg-thunder-red mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 font-semibold">
              Curated selection of the hottest drops
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProducts.map((product, index) => (
              <Card 
                key={product.id}
                className="bg-gray-900 border-gray-800 overflow-hidden group hover:border-thunder-yellow transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-thunder-yellow/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 left-4 bg-thunder-red text-white font-bold">
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
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        id="testimonials" 
        data-animate
        className={`py-20 px-4 bg-gray-950 transition-all duration-1000 delay-400 ${
          isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="text-thunder-red">CUSTOMER</span>
              <span className="text-white"> LOVE</span>
            </h2>
            <div className="w-24 h-1 bg-thunder-yellow mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 font-semibold">
              See what our community is saying
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockTestimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.id}
                className="bg-black border-gray-800 hover:border-thunder-yellow transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 150}ms` }}
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta" 
        data-animate
        className={`py-32 px-4 transition-all duration-1000 delay-600 ${
          isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            <span className="text-white">READY TO</span>
            <br />
            <span className="text-thunder-red">UPGRADE?</span>
          </h2>
          
          <p className="text-2xl text-gray-300 font-bold mb-12">
            Join thousands getting exclusive drops and unbeatable deals
          </p>

          <Button
            onClick={handleTelegramClick}
            size="lg"
            className="bg-thunder-yellow hover:bg-yellow-400 text-black font-black text-2xl px-12 py-6 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-thunder-yellow/25 mb-8"
          >
            <MessageCircle className="w-8 h-8 mr-4" />
            JOIN THUNDER TELEGRAM
          </Button>

          <p className="text-lg text-gray-400 font-semibold">
            No spam, just fire deals • Free to join
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-3xl font-black text-thunder-yellow mb-6 md:mb-0">
              ⚡ THUNDER SERVICES
            </div>
            
            <div className="flex gap-6">
              <Button
                onClick={handleTelegramClick}
                variant="outline"
                className="border-thunder-red text-thunder-red hover:bg-thunder-red hover:text-white font-bold"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Telegram
              </Button>
              
              <Button
                onClick={handleInstagramClick}
                variant="outline"
                className="border-thunder-yellow text-thunder-yellow hover:bg-thunder-yellow hover:text-black font-bold"
              >
                <Instagram className="w-5 h-5 mr-2" />
                Instagram
              </Button>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 font-semibold">
              © 2025 Thunder Services. Premium streetwear, authentic products.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;