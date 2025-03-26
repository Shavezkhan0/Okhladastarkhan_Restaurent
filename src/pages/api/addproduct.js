import conn_to_mon from "@/features/mongoose";
import Products from "@/models/Products";

export default async function addproducts(req, res) {
  if (req.method === "POST") {
    await conn_to_mon();

    const newProduct = await new Products({
      title: req.body.title,
      shopname: req.body.shopname,
      email: req.body.email,
      description: req.body.description,
      image: req.body.image.image,
      category: req.body.category,
      foodCategory: req.body.foodCategory,
      shopType: req.body.shopType,
      active: req.body.active,
      price: req.body.price,
      availability: req.body.availablety,
    });

    console.log(newProduct);

    await newProduct.save();

    res
      .status(200)
      .json({ success: true, message: "Product added successfully" });
  } else {
    res.status(400).json({ error: "This method is not premitted" });
  }
}
