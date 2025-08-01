#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Thunder Services Landing Page
Tests all API endpoints, database operations, and Spanish content verification
"""

import asyncio
import aiohttp
import json
import os
from datetime import datetime
from typing import Dict, List, Any

# Load environment variables
from dotenv import load_dotenv
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE_URL = f"{BACKEND_URL}/api"

class BackendTester:
    def __init__(self):
        self.session = None
        self.test_results = {
            'health_check': {'passed': False, 'details': ''},
            'products_api': {'passed': False, 'details': ''},
            'testimonials_api': {'passed': False, 'details': ''},
            'telegram_click_tracking': {'passed': False, 'details': ''},
            'analytics_api': {'passed': False, 'details': ''},
            'spanish_content_verification': {'passed': False, 'details': ''},
            'watch_prioritization': {'passed': False, 'details': ''},
            'database_integrity': {'passed': False, 'details': ''}
        }
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def test_health_check(self):
        """Test GET /api/ - Health check endpoint"""
        print("🔍 Testing Health Check Endpoint...")
        try:
            async with self.session.get(f"{API_BASE_URL}/") as response:
                if response.status == 200:
                    data = await response.json()
                    if data.get('status') == 'healthy' and 'Thunder Services API' in data.get('message', ''):
                        self.test_results['health_check']['passed'] = True
                        self.test_results['health_check']['details'] = f"✅ Health check passed: {data}"
                        print(f"✅ Health check passed: {data}")
                    else:
                        self.test_results['health_check']['details'] = f"❌ Unexpected response format: {data}"
                        print(f"❌ Unexpected response format: {data}")
                else:
                    self.test_results['health_check']['details'] = f"❌ Health check failed with status {response.status}"
                    print(f"❌ Health check failed with status {response.status}")
        except Exception as e:
            self.test_results['health_check']['details'] = f"❌ Health check error: {str(e)}"
            print(f"❌ Health check error: {str(e)}")

    async def test_products_api(self):
        """Test GET /api/products - Should return 9 products with watches featured first"""
        print("🔍 Testing Products API...")
        try:
            async with self.session.get(f"{API_BASE_URL}/products") as response:
                if response.status == 200:
                    products = await response.json()
                    
                    # Check total count
                    if len(products) != 9:
                        self.test_results['products_api']['details'] = f"❌ Expected 9 products, got {len(products)}"
                        print(f"❌ Expected 9 products, got {len(products)}")
                        return
                    
                    # Check if all products have required fields
                    required_fields = ['id', 'name', 'category', 'image', 'price', 'featured']
                    for product in products:
                        for field in required_fields:
                            if field not in product:
                                self.test_results['products_api']['details'] = f"❌ Product missing field '{field}': {product}"
                                print(f"❌ Product missing field '{field}': {product}")
                                return
                    
                    # Check watch prioritization (first 4 should be watches with featured=true)
                    watch_count = 0
                    featured_watches = 0
                    for i, product in enumerate(products):
                        if product['category'] == 'relojes':
                            watch_count += 1
                            if product['featured']:
                                featured_watches += 1
                            if i >= 4:  # Watches should be in first 4 positions
                                self.test_results['products_api']['details'] = f"❌ Watch found at position {i+1}, should be in first 4"
                                print(f"❌ Watch found at position {i+1}, should be in first 4")
                                return
                    
                    if featured_watches != 4:
                        self.test_results['products_api']['details'] = f"❌ Expected 4 featured watches, got {featured_watches}"
                        print(f"❌ Expected 4 featured watches, got {featured_watches}")
                        return
                    
                    self.test_results['products_api']['passed'] = True
                    self.test_results['products_api']['details'] = f"✅ Products API passed: {len(products)} products, {featured_watches} featured watches"
                    print(f"✅ Products API passed: {len(products)} products, {featured_watches} featured watches")
                    
                    # Store products for further testing
                    self.products_data = products
                    
                else:
                    self.test_results['products_api']['details'] = f"❌ Products API failed with status {response.status}"
                    print(f"❌ Products API failed with status {response.status}")
        except Exception as e:
            self.test_results['products_api']['details'] = f"❌ Products API error: {str(e)}"
            print(f"❌ Products API error: {str(e)}")

    async def test_testimonials_api(self):
        """Test GET /api/testimonials - Should return 4 Spanish testimonials"""
        print("🔍 Testing Testimonials API...")
        try:
            async with self.session.get(f"{API_BASE_URL}/testimonials") as response:
                if response.status == 200:
                    testimonials = await response.json()
                    
                    # Check total count
                    if len(testimonials) != 4:
                        self.test_results['testimonials_api']['details'] = f"❌ Expected 4 testimonials, got {len(testimonials)}"
                        print(f"❌ Expected 4 testimonials, got {len(testimonials)}")
                        return
                    
                    # Check if all testimonials have required fields
                    required_fields = ['id', 'name', 'rating', 'review', 'initials']
                    expected_ratings = [5, 5, 5, 4]  # Based on seeded data
                    
                    for i, testimonial in enumerate(testimonials):
                        for field in required_fields:
                            if field not in testimonial:
                                self.test_results['testimonials_api']['details'] = f"❌ Testimonial missing field '{field}': {testimonial}"
                                print(f"❌ Testimonial missing field '{field}': {testimonial}")
                                return
                        
                        # Check rating matches expected
                        if testimonial['rating'] != expected_ratings[i]:
                            self.test_results['testimonials_api']['details'] = f"❌ Testimonial {i+1} rating mismatch: expected {expected_ratings[i]}, got {testimonial['rating']}"
                            print(f"❌ Testimonial {i+1} rating mismatch: expected {expected_ratings[i]}, got {testimonial['rating']}")
                            return
                    
                    self.test_results['testimonials_api']['passed'] = True
                    self.test_results['testimonials_api']['details'] = f"✅ Testimonials API passed: {len(testimonials)} testimonials with correct ratings"
                    print(f"✅ Testimonials API passed: {len(testimonials)} testimonials with correct ratings")
                    
                    # Store testimonials for further testing
                    self.testimonials_data = testimonials
                    
                else:
                    self.test_results['testimonials_api']['details'] = f"❌ Testimonials API failed with status {response.status}"
                    print(f"❌ Testimonials API failed with status {response.status}")
        except Exception as e:
            self.test_results['testimonials_api']['details'] = f"❌ Testimonials API error: {str(e)}"
            print(f"❌ Testimonials API error: {str(e)}")

    async def test_telegram_click_tracking(self):
        """Test POST /api/telegram-click - Should track telegram button clicks"""
        print("🔍 Testing Telegram Click Tracking...")
        try:
            # Test data
            click_data = {
                "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "referrer": "https://thunderservices.com"
            }
            
            headers = {
                'Content-Type': 'application/json',
                'User-Agent': 'BackendTester/1.0',
                'Referer': 'https://test.thunderservices.com'
            }
            
            async with self.session.post(
                f"{API_BASE_URL}/telegram-click", 
                json=click_data,
                headers=headers
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    
                    if result.get('success') and 'tracked successfully' in result.get('message', '').lower():
                        self.test_results['telegram_click_tracking']['passed'] = True
                        self.test_results['telegram_click_tracking']['details'] = f"✅ Telegram click tracking passed: {result}"
                        print(f"✅ Telegram click tracking passed: {result}")
                    else:
                        self.test_results['telegram_click_tracking']['details'] = f"❌ Unexpected tracking response: {result}"
                        print(f"❌ Unexpected tracking response: {result}")
                else:
                    self.test_results['telegram_click_tracking']['details'] = f"❌ Telegram click tracking failed with status {response.status}"
                    print(f"❌ Telegram click tracking failed with status {response.status}")
        except Exception as e:
            self.test_results['telegram_click_tracking']['details'] = f"❌ Telegram click tracking error: {str(e)}"
            print(f"❌ Telegram click tracking error: {str(e)}")

    async def test_analytics_api(self):
        """Test GET /api/analytics/telegram-clicks - Should return click count"""
        print("🔍 Testing Analytics API...")
        try:
            async with self.session.get(f"{API_BASE_URL}/analytics/telegram-clicks") as response:
                if response.status == 200:
                    analytics = await response.json()
                    
                    if 'total_clicks' in analytics and isinstance(analytics['total_clicks'], int):
                        # Should be at least 1 if the previous test passed
                        expected_min_clicks = 1 if self.test_results['telegram_click_tracking']['passed'] else 0
                        
                        if analytics['total_clicks'] >= expected_min_clicks:
                            self.test_results['analytics_api']['passed'] = True
                            self.test_results['analytics_api']['details'] = f"✅ Analytics API passed: {analytics['total_clicks']} total clicks"
                            print(f"✅ Analytics API passed: {analytics['total_clicks']} total clicks")
                        else:
                            self.test_results['analytics_api']['details'] = f"❌ Expected at least {expected_min_clicks} clicks, got {analytics['total_clicks']}"
                            print(f"❌ Expected at least {expected_min_clicks} clicks, got {analytics['total_clicks']}")
                    else:
                        self.test_results['analytics_api']['details'] = f"❌ Invalid analytics response format: {analytics}"
                        print(f"❌ Invalid analytics response format: {analytics}")
                else:
                    self.test_results['analytics_api']['details'] = f"❌ Analytics API failed with status {response.status}"
                    print(f"❌ Analytics API failed with status {response.status}")
        except Exception as e:
            self.test_results['analytics_api']['details'] = f"❌ Analytics API error: {str(e)}"
            print(f"❌ Analytics API error: {str(e)}")

    async def test_spanish_content_verification(self):
        """Verify Spanish content in products and testimonials"""
        print("🔍 Testing Spanish Content Verification...")
        try:
            spanish_issues = []
            
            # Check products for Spanish names
            if hasattr(self, 'products_data'):
                expected_spanish_words = ['reloj', 'deportivo', 'lujo', 'cronógrafo', 'digital', 'elegante', 'jordan', 'estilo', 'sudadera', 'diseñador', 'chaqueta', 'urbana']
                found_spanish_words = 0
                
                for product in self.products_data:
                    product_name_lower = product['name'].lower()
                    for word in expected_spanish_words:
                        if word in product_name_lower:
                            found_spanish_words += 1
                            break
                
                if found_spanish_words < 6:  # At least 6 products should have Spanish names
                    spanish_issues.append(f"Only {found_spanish_words} products have Spanish names")
            
            # Check testimonials for Spanish content
            if hasattr(self, 'testimonials_data'):
                spanish_testimonial_words = ['thunder', 'services', 'siempre', 'entrega', 'auténticas', 'increíble', 'mejores', 'precios', 'recomendado', 'rápida', 'genuinos', 'favorito', 'exclusivas', 'selección', 'atención', 'cliente']
                spanish_testimonials_count = 0
                
                for testimonial in self.testimonials_data:
                    review_lower = testimonial['review'].lower()
                    has_spanish = any(word in review_lower for word in spanish_testimonial_words)
                    if has_spanish:
                        spanish_testimonials_count += 1
                
                if spanish_testimonials_count < 4:  # All 4 testimonials should be in Spanish
                    spanish_issues.append(f"Only {spanish_testimonials_count} testimonials are in Spanish")
            
            if not spanish_issues:
                self.test_results['spanish_content_verification']['passed'] = True
                self.test_results['spanish_content_verification']['details'] = "✅ Spanish content verification passed"
                print("✅ Spanish content verification passed")
            else:
                self.test_results['spanish_content_verification']['details'] = f"❌ Spanish content issues: {'; '.join(spanish_issues)}"
                print(f"❌ Spanish content issues: {'; '.join(spanish_issues)}")
                
        except Exception as e:
            self.test_results['spanish_content_verification']['details'] = f"❌ Spanish content verification error: {str(e)}"
            print(f"❌ Spanish content verification error: {str(e)}")

    async def test_watch_prioritization(self):
        """Test that watches (relojes) are prioritized and featured correctly"""
        print("🔍 Testing Watch Prioritization...")
        try:
            if not hasattr(self, 'products_data'):
                self.test_results['watch_prioritization']['details'] = "❌ No products data available for watch prioritization test"
                print("❌ No products data available for watch prioritization test")
                return
            
            # Check that first 4 products are watches and featured
            first_four = self.products_data[:4]
            watch_issues = []
            
            for i, product in enumerate(first_four):
                if product['category'] != 'relojes':
                    watch_issues.append(f"Position {i+1}: Expected 'relojes', got '{product['category']}'")
                if not product['featured']:
                    watch_issues.append(f"Position {i+1}: Watch '{product['name']}' is not featured")
            
            # Check that remaining products are not watches or not featured
            remaining_products = self.products_data[4:]
            for i, product in enumerate(remaining_products, 5):
                if product['category'] == 'relojes' and product['featured']:
                    watch_issues.append(f"Position {i}: Found featured watch outside first 4 positions")
            
            if not watch_issues:
                self.test_results['watch_prioritization']['passed'] = True
                self.test_results['watch_prioritization']['details'] = "✅ Watch prioritization passed: First 4 products are featured watches"
                print("✅ Watch prioritization passed: First 4 products are featured watches")
            else:
                self.test_results['watch_prioritization']['details'] = f"❌ Watch prioritization issues: {'; '.join(watch_issues)}"
                print(f"❌ Watch prioritization issues: {'; '.join(watch_issues)}")
                
        except Exception as e:
            self.test_results['watch_prioritization']['details'] = f"❌ Watch prioritization error: {str(e)}"
            print(f"❌ Watch prioritization error: {str(e)}")

    async def test_database_integrity(self):
        """Test overall database integrity and data consistency"""
        print("🔍 Testing Database Integrity...")
        try:
            integrity_issues = []
            
            # Check if we have the expected data structure
            if not hasattr(self, 'products_data') or not hasattr(self, 'testimonials_data'):
                integrity_issues.append("Missing products or testimonials data")
            else:
                # Check product data integrity
                product_ids = [p['id'] for p in self.products_data]
                if len(set(product_ids)) != len(product_ids):
                    integrity_issues.append("Duplicate product IDs found")
                
                if not all(1 <= p['id'] <= 9 for p in self.products_data):
                    integrity_issues.append("Product IDs not in expected range 1-9")
                
                # Check testimonial data integrity
                testimonial_ids = [t['id'] for t in self.testimonials_data]
                if len(set(testimonial_ids)) != len(testimonial_ids):
                    integrity_issues.append("Duplicate testimonial IDs found")
                
                if not all(1 <= t['id'] <= 4 for t in self.testimonials_data):
                    integrity_issues.append("Testimonial IDs not in expected range 1-4")
                
                # Check rating values
                ratings = [t['rating'] for t in self.testimonials_data]
                if not all(1 <= r <= 5 for r in ratings):
                    integrity_issues.append("Invalid rating values found")
            
            if not integrity_issues:
                self.test_results['database_integrity']['passed'] = True
                self.test_results['database_integrity']['details'] = "✅ Database integrity passed: All data consistent"
                print("✅ Database integrity passed: All data consistent")
            else:
                self.test_results['database_integrity']['details'] = f"❌ Database integrity issues: {'; '.join(integrity_issues)}"
                print(f"❌ Database integrity issues: {'; '.join(integrity_issues)}")
                
        except Exception as e:
            self.test_results['database_integrity']['details'] = f"❌ Database integrity error: {str(e)}"
            print(f"❌ Database integrity error: {str(e)}")

    async def run_all_tests(self):
        """Run all backend tests in sequence"""
        print(f"🚀 Starting Backend Tests for Thunder Services")
        print(f"📍 Backend URL: {BACKEND_URL}")
        print(f"📍 API Base URL: {API_BASE_URL}")
        print("=" * 60)
        
        # Run tests in logical order
        await self.test_health_check()
        await self.test_products_api()
        await self.test_testimonials_api()
        await self.test_telegram_click_tracking()
        await self.test_analytics_api()
        await self.test_spanish_content_verification()
        await self.test_watch_prioritization()
        await self.test_database_integrity()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 BACKEND TEST SUMMARY")
        print("=" * 60)
        
        passed_count = sum(1 for result in self.test_results.values() if result['passed'])
        total_count = len(self.test_results)
        
        for test_name, result in self.test_results.items():
            status = "✅ PASSED" if result['passed'] else "❌ FAILED"
            print(f"{test_name.replace('_', ' ').title()}: {status}")
            if not result['passed']:
                print(f"  └─ {result['details']}")
        
        print(f"\n🎯 Overall Result: {passed_count}/{total_count} tests passed")
        
        if passed_count == total_count:
            print("🎉 All backend tests passed successfully!")
        else:
            print(f"⚠️  {total_count - passed_count} test(s) failed - see details above")
        
        return self.test_results

async def main():
    """Main test runner"""
    async with BackendTester() as tester:
        results = await tester.run_all_tests()
        return results

if __name__ == "__main__":
    # Run the tests
    results = asyncio.run(main())
    
    # Exit with appropriate code
    passed_count = sum(1 for result in results.values() if result['passed'])
    total_count = len(results)
    
    if passed_count == total_count:
        exit(0)  # All tests passed
    else:
        exit(1)  # Some tests failed