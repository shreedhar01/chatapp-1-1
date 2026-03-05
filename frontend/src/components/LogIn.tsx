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
import { useLogIn } from "@/lib/api/hooks/auth"
import { loginSchema } from "@/schema/auth.schema"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState, type SubmitEventHandler } from "react"
import { useNavigate } from "react-router-dom"

export const LogIn = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [viewPass, setViewPass] = useState(false)
    const [errors, setErrors] = useState<Map<string, string>>(new Map())

    const loginMutation = useLogIn()
    const navigate = useNavigate()

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const validData = await loginSchema.safeParse({ email, password })
        if (!validData.success) {
            const newMap = new Map()
            validData.error.issues.forEach((v) => newMap.set(v.path[0], v.message))
            setErrors(newMap)
            return
        }
        await loginMutation.mutate(validData.data,{
            onSuccess:()=>{
                setEmail("")
                setPassword("")
                navigate("/dashboard")
            }
        })
    }

    return (
        <div className="w-full max-w-md border p-4 rounded-xl">
            <form onSubmit={handleSubmit}>
                <FieldGroup >
                    <FieldSet>
                        <FieldLegend className="text-center w-full" >Log In Your Account</FieldLegend>
                        <FieldGroup>
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
                                        type="button"
                                        onClick={() => setViewPass(!viewPass)}
                                    >
                                        {viewPass ? <EyeIcon /> : <EyeOffIcon />}
                                    </Button>
                                </div>
                                {errors.has("password") ? <FieldError>{errors.get("password")}</FieldError> : ""}
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="vertical">
                        <Button type="submit">Log In</Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}