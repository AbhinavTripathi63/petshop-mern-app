import React, { createContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const incoming = action.payload;
      const found = state.items.find(
        (x) => x.itemType === incoming.itemType && x.itemId === incoming.itemId
      );

      let nextItems;
      if (found) {
        nextItems = state.items.map((x) =>
          x.itemType === incoming.itemType && x.itemId === incoming.itemId
            ? { ...x, qty: x.qty + 1 }
            : x
        );
      } else {
        nextItems = [...state.items, { ...incoming, qty: 1 }];
      }

      return { ...state, items: nextItems };
    }

    case "INC": {
      const { itemType, itemId } = action.payload;
      return {
        ...state,
        items: state.items.map((x) =>
          x.itemType === itemType && x.itemId === itemId ? { ...x, qty: x.qty + 1 } : x
        )
      };
    }

    case "DEC": {
      const { itemType, itemId } = action.payload;
      return {
        ...state,
        items: state.items
          .map((x) =>
            x.itemType === itemType && x.itemId === itemId ? { ...x, qty: x.qty - 1 } : x
          )
          .filter((x) => x.qty > 0)
      };
    }

    case "REMOVE": {
      const { itemType, itemId } = action.payload;
      return {
        ...state,
        items: state.items.filter((x) => !(x.itemType === itemType && x.itemId === itemId))
      };
    }

    case "CLEAR":
      return { items: [] };

    case "SET":
      return action.payload;

    default:
      return state;
  }
}

function calcTotal(items) {
  return items.reduce((sum, it) => sum + it.priceSnapshot * it.qty, 0);
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const raw = localStorage.getItem("petshopCart");
    if (raw) {
      try {
        dispatch({ type: "SET", payload: JSON.parse(raw) });
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("petshopCart", JSON.stringify(state));
  }, [state]);

  const total = useMemo(() => calcTotal(state.items), [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      total,
      addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
      inc: (k) => dispatch({ type: "INC", payload: k }),
      dec: (k) => dispatch({ type: "DEC", payload: k }),
      remove: (k) => dispatch({ type: "REMOVE", payload: k }),
      clear: () => dispatch({ type: "CLEAR" })
    }),
    [state.items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
