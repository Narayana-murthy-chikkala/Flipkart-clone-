import { pool } from '../config/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const moreGrocery = [
    // 🥣 Breakfast
    { name: 'Kellogg\'s Corn Flakes (500g)', brand: 'Kellogg\'s', price: 185, category: 'Grocery', rating: 4.6, discount: 5, stock: 100, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/cereal/b/e/l/-original-imagp7y7zfgzztff.jpeg?q=70']) },
    { name: 'Quaker Oats (1kg)', brand: 'Quaker', price: 199, category: 'Grocery', rating: 4.7, discount: 10, stock: 80, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/oats/v/y/k/-original-imagzdyhuzp8hzhz.jpeg?q=70']) },
    
    // 🧼 Cleaning & Household
    { name: 'Vim Dishwash Liquid (750ml)', brand: 'Vim', price: 155, category: 'Grocery', rating: 4.8, discount: 15, stock: 150, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/dishwash-liquid/k/v/w/-original-imagp6mdfgzztvfy.jpeg?q=70']) },
    { name: 'Ariel Matic Front Load Powder (2kg)', brand: 'Ariel', price: 440, category: 'Grocery', rating: 4.9, discount: 20, stock: 60, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/washing-powder/v/y/k/-original-imagzdyhuzp8hzhz.jpeg?q=70']) },
    { name: 'Surf Excel Easy Wash (1kg)', brand: 'Surf Excel', price: 130, category: 'Grocery', rating: 4.7, discount: 10, stock: 200, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/washing-powder/b/e/l/-original-imagp7y7zfgzztff.jpeg?q=70']) },
    { name: 'Colin Glass Cleaner (500ml)', brand: 'Colin', price: 105, category: 'Grocery', rating: 4.5, discount: 5, stock: 120, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/glass-cleaner/k/v/w/-original-imagp6mdfgzztvfy.jpeg?q=70']) },

    // 🦷 Personal Care
    { name: 'Colgate MaxFresh Gel (150g)', brand: 'Colgate', price: 110, category: 'Grocery', rating: 4.5, discount: 10, stock: 300, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/toothpaste/b/e/l/-original-imagp7y7zfgzztff.jpeg?q=70']) },
    { name: 'Pepsodent Cavity Protection (140g)', brand: 'Pepsodent', price: 95, category: 'Grocery', rating: 4.3, discount: 5, stock: 250, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/toothpaste/v/y/k/-original-imagzdyhuzp8hzhz.jpeg?q=70']) },
    { name: 'Dove Cream Beauty Bar (125g Pack of 3)', brand: 'Dove', price: 255, category: 'Grocery', rating: 4.8, discount: 12, stock: 180, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/soap/k/v/w/-original-imagp6mdfgzztvfy.jpeg?q=70']) },
    { name: 'Dettol Original Handwash (750ml Refill)', brand: 'Dettol', price: 145, category: 'Grocery', rating: 4.7, discount: 15, stock: 140, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/handwash-refill/b/e/l/-original-imagp7y7zfgzztff.jpeg?q=70']) },

    // 🧂 Pantry Staples
    { name: 'Maggi Hot & Sweet Chilli Sauce (1kg)', brand: 'Nestle', price: 165, category: 'Grocery', rating: 4.6, discount: 8, stock: 90, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/sauce-ketchup/v/y/k/-original-imagzdyhuzp8hzhz.jpeg?q=70']) },
    { name: 'Kissan Fresh Tomato Ketchup (950g)', brand: 'Kissan', price: 140, category: 'Grocery', rating: 4.5, discount: 10, stock: 110, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/sauce-ketchup/k/v/w/-original-imagp6mdfgzztvfy.jpeg?q=70']) },
    { name: 'Saffola Gold Blended Oil (1L)', brand: 'Saffola', price: 155, category: 'Grocery', rating: 4.6, discount: 25, stock: 130, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/edible-oil/b/e/l/-original-imagp7y7zfgzztff.jpeg?q=70']) },
    { name: 'Everest Tikhalal Chilli Powder (200g)', brand: 'Everest', price: 120, category: 'Grocery', rating: 4.4, discount: 5, stock: 160, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/spice/v/y/k/-original-imagzdyhuzp8hzhz.jpeg?q=70']) },
    { name: 'MTR Sambar Powder (250g)', brand: 'MTR', price: 95, category: 'Grocery', rating: 4.5, discount: 10, stock: 200, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/spice-blend/k/v/w/-original-imagp6mdfgzztvfy.jpeg?q=70']) },

    // 🥤 Beverages & Mixes
    { name: 'Bournvita Health Drink (500g)', brand: 'Cadbury', price: 235, category: 'Grocery', rating: 4.7, discount: 8, stock: 110, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/health-drink/b/e/l/-original-imagp7y7zfgzztff.jpeg?q=70']) },
    { name: 'Horlicks Chocolate Delight (500g)', brand: 'Horlicks', price: 260, category: 'Grocery', rating: 4.6, discount: 10, stock: 100, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/health-drink-refill/v/y/k/-original-imagzdyhuzp8hzhz.jpeg?q=70']) },
    { name: 'Real Fruit Power Orange (1L)', brand: 'Real', price: 110, category: 'Grocery', rating: 4.4, discount: 15, stock: 150, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/fruit-juice/k/v/w/-original-imagp6mdfgzztvfy.jpeg?q=70']) },
    { name: 'Red Bull Energy Drink (250ml)', brand: 'Red Bull', price: 125, category: 'Grocery', rating: 4.8, discount: 0, stock: 300, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/energy-drink/b/e/l/-original-imagp7y7zfgzztff.jpeg?q=70']) },

    // 🍪 Snacks
    { name: 'Parle-G Gold Biscuits (1kg)', brand: 'Parle', price: 120, category: 'Grocery', rating: 4.9, discount: 5, stock: 500, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/biscuit/v/y/k/-original-imagzdyhuzp8hzhz.jpeg?q=70']) },
    { name: 'Sunfeast Dark Fantasy Choco Fills (300g)', brand: 'Sunfeast', price: 150, category: 'Grocery', rating: 4.7, discount: 15, stock: 180, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/cookie-biscuit/k/v/w/-original-imagp6mdfgzztvfy.jpeg?q=70']) },
    { name: 'Haldiram\'s Alu Bhujia (400g)', brand: 'Haldiram\'s', price: 110, category: 'Grocery', rating: 4.8, discount: 10, stock: 220, images: JSON.stringify(['https://rukminim2.flixcart.com/image/280/280/xif0q/snack/b/e/l/-original-imagp7y7zfgzztff.jpeg?q=70']) }
];

const main = async () => {
    try {
        console.log('🚀 Phase 1: Standardizing Product Names (Branding)...');
        // 1. Fetch current products
        const [products] = await pool.query('SELECT id, name, brand FROM products');
        
        for (const p of products) {
            if (p.brand && p.brand !== 'Generic') {
                const brandLower = p.brand.toLowerCase();
                const nameLower = p.name.toLowerCase();
                
                // If the name doesn't start with the brand, prepend it
                if (!nameLower.startsWith(brandLower)) {
                    const newName = `${p.brand} ${p.name}`;
                    await pool.query('UPDATE products SET name = ? WHERE id = ?', [newName, p.id]);
                    console.log(`✅ Renamed: "${p.name}" -> "${newName}"`);
                }
            }
        }

        console.log('\n🚀 Phase 2: Expanding Grocery Section...');
        let addedCount = 0;
        for (const g of moreGrocery) {
            await pool.query(
                `INSERT INTO products (name, description, price, category, brand, rating, discount, stock, images)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [g.name, `Premium quality ${g.name} from ${g.brand}. Highly recommended.`, g.price, g.category, g.brand, g.rating, g.discount, g.stock, g.images]
            );
            addedCount++;
        }
        console.log(`✅ Successfully added ${addedCount} new grocery items!`);
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during catalogue update:', err.message);
        process.exit(1);
    }
};

main();
