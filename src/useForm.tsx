import z, { ZodRawShape } from "zod";
import { FormEvent, useState } from "react";
import { getDataFromSubmit } from "./getDataFromSubmit";

export function useForm<T extends ZodRawShape>(
    schema: z.ZodObject<T>,
    onSubmit: (data: z.output<z.ZodObject<T>>) => void | Promise<void>,
) {
    const [errors, setErrors] = useState<{ [key: string]: string } | null>(null);
    const [handlerError, setHandlerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    return {
        onSubmit: async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const parsed = getDataFromSubmit(e.target, schema);

            if (!parsed.success) {
                let newErrors: { [key: string]: string } = {};

                parsed.error.issues.forEach((issue) => {
                    newErrors[issue.path.join(".")] = issue.message;
                });

                setErrors(newErrors);
                return;
            }

            setErrors(null);

            setLoading(true);

            try {
                await onSubmit(parsed.data);
            } catch (e: any) {
                setHandlerError(e?.message);
                setLoading(false);
                return;
            }

            setLoading(false);
            setHandlerError(null);
        },
        loading,
        errors,
        handlerError,
    };
}
