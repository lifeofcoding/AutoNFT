import { FormEvent, useRef } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAlerts } from "../components/layout/Alerts";
import NextLink from "next/link";
import { useAuth } from "reactfire";
import { useRouter } from "next/router";
import { useForm } from "../hooks/useForm";

function Register() {
  const auth = useAuth();
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const alert = useAlerts();

  const { fields, errors, setField, formInvalid } = useForm([
    {
      name: "email",
      value: "",
      validations: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    },
    {
      name: "password",
      value: "",
      validations: [
        /^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{6,20}$/i,
        /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
      ],
    },
  ]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value!;
    const password = passwordRef.current?.value!;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        router.push("/dashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.warn("Error", { errorCode, errorMessage });
        alert({ type: "error", message: errorMessage });
      });
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="max-w-xs">
        <form
          className="mb-4 rounded bg-white px-8 pt-6 pb-8 shadow-md"
          onSubmit={onSubmit}
        >
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`${
                errors.includes("email") ? "border-red-500" : ""
              } focus:shadow-outline mb-3 w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none`}
              id="email"
              type="text"
              name="email"
              placeholder="Email"
              ref={emailRef}
              value={fields.email?.value}
              onChange={setField}
            />
            {errors.includes("email") && (
              <p className="text-xs italic text-red-500">Email Invalid</p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={`${
                errors.includes("password") ? "border-red-500" : ""
              } focus:shadow-outline mb-3 w-full appearance-none rounded border  py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none`}
              id="password"
              name="password"
              type="password"
              placeholder="******************"
              ref={passwordRef}
              value={fields.password?.value}
              onChange={setField}
            />
            {errors.includes("password") && (
              <p className="text-xs italic text-red-500">
                Password is invalid.
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
              disabled={formInvalid}
            >
              Sign Up
            </button>
            <a
              className="inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
          <div>
            <p className="pt-5 text-center">
              <NextLink href="/login">
                <a className="inline-block text-sm font-bold text-blue-500 hover:text-blue-800">
                  already have an account? Login.
                </a>
              </NextLink>
            </p>
          </div>
        </form>
        <p className="text-center text-xs text-gray-500">
          &copy;2020 Acme Corp. All rights reserved.
        </p>
      </div>
    </main>
  );
}

export default Register;
