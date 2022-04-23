import React, { useEffect, useState } from "react";
import { Container, ListGroup, Form, Alert } from "react-bootstrap";
import { ResetButton } from "./uiComponent";
import axios from "axios";

type TodoItem = {
  id: number;
  title: string;
  checked: boolean;
};

type Props = {
  todoItems: TodoItem[];
};

const TodoList: React.FC<Props> = ({ todoItems }) => {
  const [error, setError] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    const token = document.querySelector(
      "[name=csrf-token]"
    ) as HTMLMetaElement;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
  }, []);

  useEffect(() => {
    let isMounted = true;

    if(isMounted) {
      setTodos(todoItems);
    }
    
    return () => {
      isMounted = false;
    }
  }, [todoItems]);

  const checkBoxOnCheck = async (
    e: React.ChangeEvent<HTMLInputElement>,
    todoItemId: number
  ): Promise<void> => {
    try {
      await axios.post('/todo', {
        id: todoItemId,
        checked: e.target.checked
      });
      setTodos(todos?.map(todo => {
        if(todo?.id === todoItemId) {
          return {
            ...todo,
            checked: !todo?.checked
          }
        }

        return todo;
      }));
    } catch(error) {
      setError(JSON.stringify(error.response.data))
    }
    
  };

  const resetButtonOnClick = async (): Promise<void> => {
    try {
      await axios.post('/reset');
      setTodos(todos?.map(todo => ({
        ...todo,
        checked: false
      })));
    } catch(error) {
      setError(JSON.stringify(error.response.data))
    }
    
  };

  return (
    <Container>
      <h3>2022 Wish List</h3>
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}
      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item key={todo.id}>
            <Form.Check
              type="checkbox"
              label={todo.title}
              checked={todo.checked}
              onChange={(e) => checkBoxOnCheck(e, todo.id)}
            />
          </ListGroup.Item>
        ))}
        <ResetButton onClick={resetButtonOnClick}>Reset</ResetButton>
      </ListGroup>
    </Container>
  );
};

export default TodoList;
