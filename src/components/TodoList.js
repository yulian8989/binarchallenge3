import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";

const TodoList = ({ isRefresh, setRefresh }) => {
	const [todos, setTodos] = useState([]);
	// Untuk filter todo
	const [filter, setFilter] = useState("all");
	// Untuk search todo
	const [query, setQuery] = useState("");
	const [queryResults, setQueryResults] = useState([]);

	// Untuk ambil data todo dari json-server
	useEffect(() => {
		if (isRefresh) {
			fetch("http://localhost:8000/todos")
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					setRefresh(false);
					setTodos(data);
					console.log(data);
				})
				.catch((err) => {
					setRefresh(false);
					if (err.name === "AbortError") {
						console.log("fetch aborted.");
					}
				});
		}
	}, [isRefresh, setRefresh]);

	// Untuk fitur search
	const searchHandler = () => {
		// Cek jika searchnya kosong/tidak, kalau kosong direset
		if (query.length === 0) {
			setQueryResults([]);
			return;
		}

		// Kalau enggak diisi dengan todo yang cocok dengan input
		setQueryResults(
			todos.filter((todo) =>
				todo.task.toLowerCase().includes(query.toLowerCase())
			)
		);
	};

	const results = queryResults.length !== 0 ? queryResults : todos;

	// Untuk filter
	const filteredTodos =
		filter === "all"
			? results
			: filter === "done"
			? results.filter((todo) => todo.complete === true)
			: filter === "todo" &&
			  results.filter((todo) => todo.complete === false);

	console.log(queryResults);

	return (
		<>
			<div class="filter-and-search">
				<h3>Search and Filter</h3>
				<div className="search-box">
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<span className="add-button" onClick={searchHandler}>
						Search
					</span>
				</div>
				<div className="filter">
					<button
						className="filter-button"
						onClick={() => setFilter("all")}
					>
						All
					</button>
					<button
						className="filter-button"
						onClick={() => setFilter("done")}
					>
						Done
					</button>
					<button
						className="filter-button"
						onClick={() => setFilter("todo")}
					>
						Todo
					</button>
				</div>
			</div>
			<ul id="todo-list">
				{filteredTodos.length === 0 ? (
					<h3 className="result-text">Empty</h3>
				) : (
					filteredTodos.map((todo) => (
						<TodoItem
							todo={todo}
							setRefresh={setRefresh}
							key={todo.id}
						/>
					))
				)}
			</ul>
		</>
	);
};

export default TodoList;
