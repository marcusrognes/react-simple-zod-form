import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { z } from 'zod';

import { useForm } from '../../src';
import { ReactNode } from 'react';

const Form01Schema = z
	.object({
		test: z.string().min(1),
		test2: z.string(),
		test3: z.string().min(2).max(4),
		email: z.string().email(),
		complex: z.object({
			nested: z.string().min(4),
		}),
	})
	.refine(data => data.test !== data.test2, {
		message: 'Passwords does match',
		path: ['test2'],
	});

function App() {
	const { onSubmit, errors, handlerError } = useForm(Form01Schema, data => {
		if (data.test != 'red') {
			throw new Error('Reuired string (test) is not "red"');
		}

		console.log(data);
	});

	return (
		<>
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img
						src={reactLogo}
						className="logo react"
						alt="React logo"
					/>
				</a>
			</div>
			<h1>React Simple Zod Form</h1>
			<div>
				<form onSubmit={onSubmit}>
					<div className="flex flex-column">
						<Input
							name="test"
							error={errors?.test}
							label="Required string (test)"
						/>

						<Input
							name="test2"
							error={errors?.test2}
							label="Optional string (test2)"
						/>

						<Input
							name="test3"
							error={errors?.test3}
							label="Required string 2 - 4 (test3)"
						/>
						<Input
							name="email"
							type="email"
							error={errors?.email}
							label="Required email (email)"
						/>

						<Input
							name="complex.nested"
							error={errors?.['complex.nested']}
							label="Required complex.nested (complex.nested)"
						/>

						{handlerError && <p className="red">{handlerError}</p>}
						<button type="submit">Submit</button>
					</div>
				</form>
			</div>
		</>
	);
}

function Input({
	name,
	type = 'text',
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

export default App;
