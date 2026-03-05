import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useSignup } from "@/lib/api/hooks/auth"
import { signUpSchema } from "@/schema/auth.schema"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState, type ChangeEventHandler, type SubmitEventHandler } from "react"


export const SignUp = () => {
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [viewPass, setViewPass] = useState(false)
    const [viewConfirmPass, setViewConfirmPass] = useState(false)
    const [passMatch, setPassMatch] = useState(true)
    const [errors, setErrors] = useState<Map<string, string>>(new Map())
    const signUpMutation = useSignup();

    const handleConfirmPassword: ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault()
        const value = e.target.value
        setConfirmPassword(value)

        if (password !== value) {
            setPassMatch(false)
        } else {
            setPassMatch(true)
        }
    }

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const validData = await signUpSchema.safeParse({ name, email, password })
        if (!validData.success) {
            const newError = new Map()
            validData.error.issues.forEach((v) => newError.set(v.path[0], v.message))
            setErrors(newError)
            return
        }
        await signUpMutation.mutate(validData.data,{
            onSuccess:()=>{
                setName("")
                setEmail("")
                setPassword("")
                setConfirmPassword("")
            }
        })
    }

    return (
        <div className="w-full max-w-md border p-4 rounded-xl">
            <form onSubmit={handleSubmit}>
                <FieldGroup >
                    <FieldSet>
                        <FieldLegend className="text-center w-full" >Create Account</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    Name
                                </FieldLabel>
                                <Input
                                    id="checkout-7j9-card-name-43j"
                                    placeholder="Ram Magar"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                {errors.has("name") ? <FieldError>{errors.get("name")}</FieldError> : ""}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                    Email
                                </FieldLabel>
                                <Input
                                    id="checkout-7j9-card-number-uw1"
                                    placeholder="ram@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {errors.has("email") ? <FieldError>{errors.get("email")}</FieldError> : ""}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                    Password
                                </FieldLabel>
                                <div className="flex gap-2 w-full justify-center">
                                    <Input
                                        id="checkout-7j9-card-number-uw1"
                                        type={`${viewPass ? "password" : "text"}`}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        onClick={() => setViewPass(!viewPass)}
                                    >
                                        {viewPass ? <EyeIcon /> : <EyeOffIcon />}
                                    </Button>
                                </div>
                                {errors.has("password") ? <FieldError>{errors.get("password")}</FieldError> : ""}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                    Confirm Password
                                </FieldLabel>
                                <div className="flex gap-2 w-full justify-center">
                                    <Input
                                        id="checkout-7j9-card-number-uw1"
                                        type={`${viewConfirmPass ? "password" : "text"}`}
                                        value={confirmPassword}
                                        onChange={handleConfirmPassword}
                                        required
                                    />
                                    <Button
                                        onClick={() => setViewConfirmPass(!viewConfirmPass)}
                                    >
                                        {viewConfirmPass ? <EyeIcon /> : <EyeOffIcon />}
                                    </Button>
                                </div>

                                {passMatch ? "" : <FieldError>Password and Confirm Password Don't Match</FieldError>}
                            </Field>

                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="vertical">
                        <Button type="submit" disabled={!passMatch}>Sign Up</Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}