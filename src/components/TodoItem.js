import { useState } from "react";

const TodoItem = ({ todo, setRefresh }) => {
	// Untuk fitur edit
	const [editText, setEditText] = useState(todo.task);
	// Untuk toggle input
	const [isEditing, setIsEditing] = useState(false);

	// Untuk update status ceklist
	const updateTodo = () => {
		todo.complete = !todo.complete;

		fetch("http://localhost:8000/todos/" + todo.id, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(todo),
		}).then(() => {
			console.log("todo updated.");
			setRefresh(true);
		});
	};

	// Untuk hapus todo
	const deleteTodo = () => {
		console.log("Id dari delete ", todo.id);
		fetch("http://localhost:8000/todos/" + todo.id, {
			method: "DELETE",
		}).then(() => {
			console.log("todo deleted.");
			setRefresh(true);
		});
	};

	// Untuk ganti task dari todo
	const changeTodo = () => {
		// Pakai spread operator (cari referensi dari youtube atau google)
		const editedTodo = { ...todo, task: editText };

		// Sama kyk updateTodo
		fetch("http://localhost:8000/todos/" + todo.id, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			// body nya jadi editedTodo
			body: JSON.stringify(editedTodo),
		}).then(() => {
			console.log("todo updated.");
			// Jadi false biar balik seperti semula
			setIsEditing(false);
			setRefresh(true);
		});
	};

	return (
		<li className={`${todo.complete ? "checked" : ""}`}>
			<div>
				{isEditing ? (
					<div className="task-container">
						<input
							type="text"
							value={editText}
							onChange={(e) => setEditText(e.target.value)}
						/>
						<span className="add-button" onClick={changeTodo}>
							Add
						</span>
					</div>
				) : (
					<div className="task-container">
						<div className="task-item" onClick={updateTodo}>
							{todo.task}
						</div>
						<span className="close" onClick={deleteTodo}>
							x
						</span>
						<span
							className="close"
							onClick={() => setIsEditing(true)}
						>
							i
						</span>
					</div>
				)}
			</div>
		</li>
	);
};

export default TodoItem;
