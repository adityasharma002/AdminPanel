import { useState } from "react";
import { Pencil, Trash2, ShoppingCart, Minus, Plus } from "lucide-react";

const ProductCard = ({ product }) => {
  const [showQuantity, setShowQuantity] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    setShowQuantity(true);
  };

  const initials = product.name?.slice(0, 2)?.toUpperCase();

  return (
    <div className="w-48 rounded-2xl shadow-md p-3 border relative">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700">
          {initials}
        </div>
        <div className="text-sm font-medium">{product.name}</div>
      </div>

      <div className="text-sm text-gray-600 mb-1">₹{product.price}</div>

      <div className="flex justify-between items-center mt-3">
        <button onClick={handleAddToCart} className="text-primary">
          <ShoppingCart size={20} />
        </button>

        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-blue-600">
            <Pencil size={18} />
          </button>
          <button className="text-red-500 hover:text-red-700">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {showQuantity && (
        <div className="mt-2 flex items-center gap-2 justify-center">
          <button
            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus size={16} />
          </button>
          <span className="text-sm font-semibold">{quantity}</span>
          <button
            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
