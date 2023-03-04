import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { useState } from 'react'
import { useWallet } from '../../common/hooks/useWallet';



function App() {
  const [count, setCount] = useState(0)
  const { isConnected, balance, connectToWallet, getBalance, mint, getCount, toggleSaleState } = useWallet();

  return (
    <div className="App">

      <Button onClick={connectToWallet}>Connect</Button>
      <div>isConnected: {`${isConnected}`}</div>

      <Button onClick={getBalance}>getBalance</Button>
      <div>balance: {balance}eth</div>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="10vh"
      >
        <Button sx={{ fontWeight: '700' }} onClick={toggleSaleState}>Start sale!</Button>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="10vh"
      >
        <Button sx={{ fontWeight: '700' }} onClick={mint}>Mint</Button>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="10vh"
      >
        {`${count}`}
        <Button sx={{ fontWeight: '700' }} onClick={
          getCount
        }>getCount</Button>
      </Box>
    </div>
  )
}

export default App
