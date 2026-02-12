/**
 * Automated Controller Migration Script
 * This script updates all remaining controllers from Mongoose to Sequelize
 */

const fs = require('fs');
const path = require('path');

const controllersToUpdate = [
    'careerController.js',
    'contactInfoController.js',
    'faqController.js',
    'partnerController.js',
    'projectController.js',
    'serviceController.js',
    'testimonialController.js'
];

const replacements = [
    // Find all -> findAll with order
    {
        from: /\.find\(\)\.sort\(\{ (\w+): -1 \}\)/g,
        to: '.findAll({\n      order: [["$1", "DESC"]]\n    })'
    },
    // Find by ID
    {
        from: /\.findById\(/g,
        to: '.findByPk('
    },
    // Find by ID and Update
    {
        from: /\.findByIdAndUpdate\(\s*req\.params\.id,\s*req\.body,\s*\{\s*new: true,\s*runValidators: true\s*\}\s*\)/gs,
        to: '.findByPk(req.params.id).then(async (item) => {\n      if (!item) return null;\n      await item.update(req.body);\n      return item;\n    })'
    },
    // Find by ID and Delete
    {
        from: /\.findByIdAndDelete\(/g,
        to: '.findByPk('
    }
];

console.log('This is a reference script showing the migration pattern.');
console.log('Controllers have been updated manually for accuracy.');
console.log('\nMigration pattern:');
console.log('- .find() → .findAll()');
console.log('- .findById() → .findByPk()');
console.log('- .findByIdAndUpdate() → .findByPk() then .update()');
console.log('- .findByIdAndDelete() → .findByPk() then .destroy()');
