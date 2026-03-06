import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    alert("User registered!");
  }

  return (
    <form onSubmit={handleRegister} className="p-4 space-y-2">
      <input className="border p-2 w-full" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 w-full" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white px-4 py-2">Register</button>
    </form>
  );
}
