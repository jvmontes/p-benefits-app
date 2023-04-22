import { useState } from 'react'

const AddPerson = ({ onAddPerson, actionButtonText }) => {

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');

	const onSubmit = (e) => {
		e.preventDefault();

		if (!firstName) {
			alert('Please add a first name');
			return;
		} else if (!lastName) {
			alert('Please add a last name');
			return;
		}

		onAddPerson({ firstName, lastName });

		setFirstName('');
		setLastName('');
	}

	return (
		<form onSubmit={onSubmit}>
			<div>
				<label>First Name</label>
				<input type='text'
					placeholder='First Name'
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)} ></input>
			</div>
			<div>
				<label>Last Name</label>
				<input type='text'
					placeholder='Last Name'
					value={lastName}
					onChange={(e) => setLastName(e.target.value)} ></input>
			</div>

			<input type='submit' value={actionButtonText}></input>
		</form>
	)
}

export default AddPerson