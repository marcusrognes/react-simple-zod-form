# react-simple-zod-form

Simple `useForm` hook for handling onSubmit with zod validation.


## Getting started
`npm i react-simple-zod-form`


## Usage:

Simple example

```tsx

import { useForm } from 'react-simple-zod-form';
import { z } from 'zod';


const MyFormSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    profile: z.object({
        avatarUrl: z.string()
    }),
});


function MyPage(){
    const { onSubmit, errors, handlerError } = useForm(MyFormSchema, (data) => {
        console.log(data);
        // throw new Error("Submit error!"); -> handlerError
    });

    return <div>
        <form onSubmit={onSubmit}>
            <Input name="name" label="Name" error={errors?.name}/>
            <Input name="email" label="Email" error={errors?.email}/>
            <Input name="profile.avatarUrl" label="Avatar Url" error={errors?.["profile.avatarUrl"]}/>

        </form>
    </div>;
}

function Input({
  name,
  type = "text",
  label,
  error,
}: {
  name: string;
  type?: string;
  label: ReactNode;
  error: string | undefined;
}) {
  return (
    <label>
      {label}
      <br />
      {error && <p className="red">{error}</p>}
      <input name={name} type={type} />
    </label>
  );
}
```


this will validate the form in the onSubmit handler and call your handler method when valid.

You can throw an error to get a handlerError.


