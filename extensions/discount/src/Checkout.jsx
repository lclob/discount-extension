import React, { useEffect } from "react";
import {
  reactExtension,
  useApplyCartLinesChange,
  useDiscountCodes,
  useCartLines
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => <App />);

function App() {
  const applyCartChange = useApplyCartLinesChange();
  const discountCodes = useDiscountCodes();
  const cartLines = useCartLines(); // Obtener los productos en el carrito

  useEffect(() => {
    console.log('Discount codes:', discountCodes); // Depuración: imprime los códigos de descuento

    // Verifica si el descuento específico está aplicado
    const targetDiscountCode = "3C3RS5WHE18T"; // Reemplaza con tu código de descuento
    const isTargetDiscountApplied = discountCodes.some(code => code.code === targetDiscountCode);

    console.log('Is target discount applied?', isTargetDiscountApplied); // Depuración: imprime si el código de descuento objetivo está aplicado

    const productIdToAdd = 'gid://shopify/ProductVariant/45291407409396';

    if (isTargetDiscountApplied) {
      // Agregar el producto al carrito solo si no está ya presente
      const isProductInCart = cartLines.some(line => line.merchandise.id === productIdToAdd);
      if (!isProductInCart) {
        handleAddToCart(productIdToAdd);
      }
    } else {
      // Si el descuento no está aplicado, quitar el producto del carrito si está presente
      const isProductInCart = cartLines.some(line => line.merchandise.id === productIdToAdd);
      if (isProductInCart) {
        console.log('Is target discount applied?', isTargetDiscountApplied); // Depuración: imprime si el código de descuento objetivo está aplicado
        handleRemoveFromCart(productIdToAdd);
      }
    }
  }, [discountCodes, cartLines]); // Dependencias del useEffect

  async function handleAddToCart(variantId) {
    const result = await applyCartChange({
      type: 'addCartLine',
      merchandiseId: variantId,
      quantity: 1,
    });
    if (result.type === 'error') {
      console.error(result.message);
    }
  }

  async function handleRemoveFromCart(variantId) {
    const result = await applyCartChange({
      type: 'removeCartLine',
      merchandiseId: variantId,
    });
    if (result.type === 'error') {
      console.error(result.message);
    }
  }

  return null;
}