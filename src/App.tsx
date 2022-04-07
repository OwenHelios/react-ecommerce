import { Badge, Drawer, Grid, LinearProgress } from '@material-ui/core'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { StyledButton, Wrapper } from './App.styles'
import Item from './Item/Item'
import { AddShoppingCart } from '@material-ui/icons'
import Cart from './Cart/Cart'

export type CartItemType = {
  id: number
  category: string
  description: string
  image: string
  price: number
  title: string
  amount: number
}

const getProducts = async (): Promise<CartItemType[]> => {
  return await (await fetch('https://fakestoreapi.com/products')).json()
}

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([] as CartItemType[])
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products',
    getProducts
  )
  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((acc: number, item) => (acc += item.amount), 0)
  const handleAddToCart = (addedItem: CartItemType) => {
    setCartItems(prevItems => {
      // const itemIndex = prevItems.findIndex(item => item.id === addedItem.id)
      // if (itemIndex === -1) {
      //
      //   return [...prevItems, { ...addedItem, amount: 1 }]
      // } else {
      //
      //   let item = prevItems[itemIndex]
      //   let newItems = prevItems
      //   newItems[itemIndex] = { ...item, amount: item.amount + 1 }
      //   return newItems
      // }

      const isItemInCart = prevItems.find(item => item.id === addedItem.id)
      if (isItemInCart) {
        //item already in cart
        return prevItems.map(item =>
          item.id === addedItem.id ? { ...item, amount: item.amount + 1 } : item
        )
      }
      //item NOT already in cart
      return [...prevItems, { ...addedItem, amount: 1 }]
    })
  }
  const handleRemoveFromCart = (id: number) => {
    setCartItems(prevItems =>
      prevItems.reduce((acc, item) => {
        if (item.id === id) {
          // only alter the item with matching id
          if (item.amount === 1) return acc // if amount is one, skip item in accumulator
          return [...acc, { ...item, amount: item.amount - 1 }] // otherwise set amount to one less
        } else {
          // pass the item to accumulator without altering
          return [...acc, item]
        }
      }, [] as CartItemType[])
    )
  }

  if (isLoading) return <LinearProgress />
  if (error) return <h2>Something Went Wrong</h2>

  return (
    <Wrapper>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCart />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  )
}

export default App
