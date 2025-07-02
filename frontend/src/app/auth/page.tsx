"use client";

import { useEffect, useState } from "react";

export default function Auth() {
  let [login, setLogin] = useState(true);

  return <>{login ? <h1>Login</h1> : <h1>Register</h1>}</>;
}
