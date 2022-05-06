import { cleanup, render } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Button from './Button.svelte';

// turns out slots can't be tested easily
// https://github.com/testing-library/svelte-testing-library/issues/48#issuecomment-522029988
describe('Button', () => {
	test('sets disabled and type based on props', () => {
		let wrapper = render(Button, { props: { disabled: true, type: 'custom-type' } });
		let button = wrapper.getByRole('button');
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute('type', 'custom-type');

		cleanup();
		wrapper = render(Button, { props: { disabled: false } });
		button = wrapper.getByRole('button');
		expect(button).not.toBeDisabled();
	});
});
