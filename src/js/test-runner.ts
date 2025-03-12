/**
 * Test Runner for Velora Tech Website
 * Used to verify TypeScript migration functionality
 */

import { runFunctionalTests } from './test-utils';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait for components to be loaded before running tests
  document.addEventListener('components:all-loaded', () => {
    console.log('Running TypeScript migration tests...');
    
    // Run all functional tests
    const testResults = runFunctionalTests();
    
    // Display test results
    console.log('Test Results:');
    console.table(testResults);
    
    // Check if all tests passed
    const allPassed = Object.values(testResults).every(result => result === true);
    
    if (allPassed) {
      console.log('%c All tests passed! TypeScript migration successful.', 'color: green; font-weight: bold;');
    } else {
      console.log('%c Some tests failed. Check the results table for details.', 'color: red; font-weight: bold;');
      
      // Log failed tests
      const failedTests = Object.entries(testResults)
        .filter(([_, result]) => result === false)
        .map(([name]) => name);
      
      console.log('Failed tests:', failedTests);
    }
  });
});
