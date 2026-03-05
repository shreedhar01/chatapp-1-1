import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"

export const LogIn = () => {
    const [viewPass, setViewPass] = useState(false)

    return (
        <div className="w-full max-w-md border p-4 rounded-xl">
            <form>
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
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                    Password
                                </FieldLabel>
                                <div className="flex gap-2 w-full justify-center">
                                    <Input
                                        id="checkout-7j9-card-number-uw1"
                                        type={`${viewPass ? "password" : "text"}`}
                                        required
                                    />
                                    <Button
                                        onClick={() => setViewPass(!viewPass)}
                                    >
                                        {viewPass ? <EyeIcon /> : <EyeOffIcon />}
                                    </Button>
                                </div>
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