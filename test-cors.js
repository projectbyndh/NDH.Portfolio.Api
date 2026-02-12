require('dotenv').config();
const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function testCORS() {
  log('\n========================================', 'cyan');
  log('🔒 CORS CONFIGURATION VERIFICATION TEST', 'cyan');
  log('========================================\n', 'cyan');

  const testCases = [
    {
      name: '1. Allowed Origin: https://www.ndhtechnologies.com',
      origin: 'https://www.ndhtechnologies.com',
      method: 'GET',
      shouldPass: true
    },
    {
      name: '2. Allowed Origin: http://localhost:5173',
      origin: 'http://localhost:5173',
      method: 'GET',
      shouldPass: true
    },
    {
      name: '3. Disallowed Origin: https://malicious-site.com',
      origin: 'https://malicious-site.com',
      method: 'GET',
      shouldPass: false
    },
    {
      name: '4. Disallowed Origin: https://example.com',
      origin: 'https://example.com',
      method: 'GET',
      shouldPass: false
    },
    {
      name: '5. No Origin (mobile/curl requests)',
      origin: null,
      method: 'GET',
      shouldPass: true
    },
    {
      name: '6. Preflight (OPTIONS) - Allowed Origin',
      origin: 'https://www.ndhtechnologies.com',
      method: 'OPTIONS',
      shouldPass: true,
      isPreflight: true
    },
    {
      name: '7. Preflight (OPTIONS) - Disallowed Origin',
      origin: 'https://unauthorized.com',
      method: 'OPTIONS',
      shouldPass: false,
      isPreflight: true
    },
    {
      name: '8. POST Request with Credentials - Allowed Origin',
      origin: 'http://localhost:5173',
      method: 'POST',
      shouldPass: true
    }
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const test of testCases) {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (test.origin) {
        headers['Origin'] = test.origin;
      }

      if (test.isPreflight) {
        headers['Access-Control-Request-Method'] = 'POST';
        headers['Access-Control-Request-Headers'] = 'Content-Type,Authorization';
      }

      const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/api/health',
        method: test.method,
        headers
      };

      const response = await makeRequest(options);
      
      log(`\n📋 ${test.name}`, 'blue');
      log(`   Origin: ${test.origin || '(none)'}`, 'yellow');
      log(`   Method: ${test.method}`, 'yellow');
      log(`   Status: ${response.statusCode}`, 'yellow');

      // Check Access-Control-Allow-Origin header
      const allowOrigin = response.headers['access-control-allow-origin'];
      const allowCredentials = response.headers['access-control-allow-credentials'];
      const allowMethods = response.headers['access-control-allow-methods'];
      const allowHeaders = response.headers['access-control-allow-headers'];

      log(`   Access-Control-Allow-Origin: ${allowOrigin || '(not set)'}`, 'yellow');
      log(`   Access-Control-Allow-Credentials: ${allowCredentials || '(not set)'}`, 'yellow');
      
      if (test.isPreflight) {
        log(`   Access-Control-Allow-Methods: ${allowMethods || '(not set)'}`, 'yellow');
        log(`   Access-Control-Allow-Headers: ${allowHeaders || '(not set)'}`, 'yellow');
      }

      // Validation
      let testPassed = true;
      const issues = [];

      if (test.shouldPass) {
        // For allowed origins
        if (test.origin && allowOrigin !== test.origin) {
          issues.push(`Expected Access-Control-Allow-Origin: ${test.origin}, got: ${allowOrigin}`);
          testPassed = false;
        }
        
        if (!test.origin && !allowOrigin) {
          // No origin requests should still work but might not have CORS headers
          testPassed = true;
        }

        if (allowCredentials !== 'true') {
          issues.push(`Expected Access-Control-Allow-Credentials: true, got: ${allowCredentials}`);
          testPassed = false;
        }

        // Check for wildcard with credentials (should NOT be *)
        if (allowOrigin === '*' && allowCredentials === 'true') {
          issues.push('SECURITY ISSUE: Cannot use wildcard (*) origin with credentials');
          testPassed = false;
        }

        if (test.isPreflight) {
          if (!allowMethods) {
            issues.push('Preflight response missing Access-Control-Allow-Methods');
            testPassed = false;
          }
          if (!allowHeaders) {
            issues.push('Preflight response missing Access-Control-Allow-Headers');
            testPassed = false;
          }
        }
      } else {
        // For disallowed origins
        if (allowOrigin === test.origin) {
          issues.push(`Disallowed origin was incorrectly accepted`);
          testPassed = false;
        }
      }

      if (testPassed) {
        log(`   ✅ PASSED`, 'green');
        passedTests++;
      } else {
        log(`   ❌ FAILED`, 'red');
        issues.forEach(issue => log(`      • ${issue}`, 'red'));
        failedTests++;
      }

    } catch (error) {
      log(`\n📋 ${test.name}`, 'blue');
      if (test.shouldPass) {
        log(`   ❌ FAILED - ${error.message}`, 'red');
        failedTests++;
      } else {
        // Expected to fail
        log(`   ✅ PASSED (correctly rejected)`, 'green');
        passedTests++;
      }
    }
  }

  // Summary
  log('\n========================================', 'cyan');
  log('📊 TEST SUMMARY', 'cyan');
  log('========================================', 'cyan');
  log(`Total Tests: ${testCases.length}`, 'yellow');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, 'red');
  
  if (failedTests === 0) {
    log('\n🎉 All CORS tests passed successfully!', 'green');
    log('✅ CORS configuration is secure and working correctly.', 'green');
  } else {
    log('\n⚠️  Some CORS tests failed. Please review the configuration.', 'red');
  }
  
  log('========================================\n', 'cyan');
  
  process.exit(failedTests > 0 ? 1 : 0);
}

// Check if server is running
http.get(BASE_URL, () => {
  log('✓ Server is running', 'green');
  testCORS();
}).on('error', () => {
  log('❌ Server is not running. Please start the server first:', 'red');
  log('   npm start   or   npm run dev\n', 'yellow');
  process.exit(1);
});
