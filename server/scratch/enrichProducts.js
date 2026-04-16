import { pool } from '../config/db.js';

const categoryData = {
  Fashion: {
    highlights: JSON.stringify([
      "Fit: Regular Fit",
      "Fabric: Pure Cotton",
      "Pattern: Solid"
    ]),
    specifications: JSON.stringify({
      "Pack of": "1",
      "Style Code": "SS23-FSH",
      "Neck Type": "Round Neck",
      "Ideal For": "Men/Women",
      "Fabric Care": "Machine wash as per tag"
    }),
    images: '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500"]'
  },
  Electronics: {
    highlights: JSON.stringify([
      "Warranty: 1 Year Manufacturer",
      "Battery Life: Up to 24 Hours",
      "Bluetooth: v5.0"
    ]),
    specifications: JSON.stringify({
      "In The Box": "Device, Charging Cable, User Manual",
      "Model Name": "Pro Series X",
      "Color Options": "Black, Silver, Blue",
      "Connectivity": "Wireless/Bluetooth"
    }),
    images: '["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"]'
  },
  Home: {
    highlights: JSON.stringify([
      "Material: Premium Quality",
      "Dimensions: Standard Size",
      "Easy to Clean: Yes"
    ]),
    specifications: JSON.stringify({
      "Brand": "HomeStyle",
      "Weight": "1.2 kg",
      "Assembly Required": "No"
    }),
    images: '["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"]'
  },
  Lifestyle: {
    highlights: JSON.stringify([
      "Usage: Daily wear/Sport",
      "Comfort: High",
      "Durability: Long-lasting"
    ]),
    specifications: JSON.stringify({
      "Material": "Synthetic/Mesh",
      "Sole Material": "Rubber",
      "Care Instructions": "Wipe with a clean, dry cloth"
    }),
    images: '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"]'
  }
};

const defaultData = {
  highlights: JSON.stringify(["Premium Quality", "Durable Material"]),
  specifications: JSON.stringify({"Generic Info": "Standard sizing"}),
  images: '["https://images.unsplash.com/photo-1602143407151-7e36d85be0bb?w=500"]'
};

const deliveryInfo = JSON.stringify({
  returnPolicy: "10-Day Return",
  cod: true,
  assured: true
});

const sellers = [
  JSON.stringify({ name: "Wizrob Fashion", rating: "4.4", tenure: "6 years" }),
  JSON.stringify({ name: "RetailNet", rating: "4.8", tenure: "8 years" }),
  JSON.stringify({ name: "OmniTech Retail", rating: "4.2", tenure: "3 years" })
];

async function enrichProducts() {
  try {
    const [products] = await pool.query('SELECT id, category FROM products');
    console.log(`Enriching ${products.length} products...`);
    
    let updatedCount = 0;

    for (const product of products) {
      const data = categoryData[product.category] || defaultData;
      const seller = sellers[Math.floor(Math.random() * sellers.length)];
      
      const sql = `
        UPDATE products 
        SET highlights = ?, 
            specifications = ?, 
            delivery_info = ?, 
            seller_info = ?,
            images = ?
        WHERE id = ?
      `;
      
      await pool.query(sql, [
        data.highlights,
        data.specifications,
        deliveryInfo,
        seller,
        data.images,
        product.id
      ]);
      
      updatedCount++;
    }

    console.log(`Successfully updated ${updatedCount} products with rich JSON data and valid images!`);
    process.exit(0);
  } catch (error) {
    console.error('Error enriching products:', error);
    process.exit(1);
  }
}

enrichProducts();
