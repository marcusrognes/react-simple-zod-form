import z, { ZodRawShape } from 'zod';
import dot from 'dot-object';

export function getDataFromSubmit<T extends ZodRawShape>(
	form: EventTarget | HTMLFormElement,
	schema: z.ZodObject<T>
) {
	const formData = new FormData(form as HTMLFormElement);
	const flattenedData: { [key: string]: any } = {};

	const keys = Array.from(formData.keys()) as string[];

	keys.forEach(key => {
		const type =
			(form as HTMLFormElement)
				.querySelector(`[name="${key}"]`)
				?.getAttribute('type') || 'unknown';

		if (key.indexOf('[]') > -1) {
			flattenedData[key] = formData.getAll(key);
		} else {
			flattenedData[key] = formData.get(key);
		}

		if (type === 'number') {
			flattenedData[key] =
				flattenedData[key] && Number(flattenedData[key]);
		}

		if (type === 'checkbox') {
			flattenedData[key] = flattenedData[key] === 'on';
		}
	});

	return schema.safeParse(dot.object(flattenedData));
}
