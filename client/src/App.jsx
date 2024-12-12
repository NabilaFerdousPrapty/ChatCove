import { useState } from "react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
     <p>
        You clicked {count} times
     </p>
    </>
  )
}

export default App
