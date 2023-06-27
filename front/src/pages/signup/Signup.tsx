import InputPrimary from "@/components/UI/inputs/primary-input"
import { useState } from "react"

const Signup = (): JSX.Element => {
  const [username, setUsername] = useState('');

  const hadleSetUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value)
  }

  return (
    <div>
      <InputPrimary
        style="big"
        type="text"
        value={username}
        onChange={hadleSetUsername}
        placeholder="Enter your username"
      />
    </div>
  )
}

export default Signup